---
title: "Port Forward in Synology NAS"
date: 2020-01-24
lang: it
author: gabrieletassoni
published: true
tags: ['Hacking', 'IT', 'Shell', 'Bash', 'Synology', "NAS", "HOWTO", "iptables", "Home Automation", "Domotica", "Supervision"]
series: false
cover_image: ./images/home-automation.jpg
canonical_url: false
description: Un articoletto defaticante su una cosina base base e molto specifica.
---
# HOWTO
Il nostro NAS Synology riserva la porta 80 per il proprio nginx interno e non permette, a meno di smanettare con i file di confgurazione di nginx o le controparti [mustache](http://mustache.github.io/), di usarla per nessun'altro [demone](https://it.wikipedia.org/wiki/Demone_%28informatica%29).
Il dubbio che a un aggiornamento del sistema le modifiche non permangano resta, quindi... Come facciamo a prendere possesso della porta in una maniera persistente?

Si, sicuramente non usando la GUI DSM, quindi... Sfoggiamo un po' del nostro miglior **shell-fu**, come il caro Capt. Picard è pronto a mostrarci. ;-)

![Shell-fu at it's best](./images/picard.gif)

Prima di tutto, installate [Nano](https://synocommunity.com/package/nano)... Ok, va bene lo **shell-fu**, ma proprio far fatica usando vi, per queste cosine minime non ci sta... [Nano](https://synocommunity.com/package/nano) è presente nel [package manager](https://www.synology.com/en-global/knowledgebase/DSM/help/DSM/PkgManApp/PackageCenter_desc) del vostro Synology.

Certamente dovrete [attivare SSH](https://www.synology.com/it-it/knowledgebase/DSM/tutorial/General_Setup/How_to_login_to_DSM_with_root_permission_via_SSH_Telnet) e raggiungere la shell del vostro Synology con un comando tipo: 
```bash
ssh superuser@192.168.143.34
``` 
quindi, per aggiungere il file necessario:
```bash
sudo nano /usr/syno/etc/rc.sysv/Galaxy_NAT.sh
```
e dentro potete incollare [questo script](https://forum.synology.com/enu/viewtopic.php?t=116126):
```nginx
#!/bin/bash
#
# Change this variable to match your private network.
PRIVATE_NETWORK="192.168.143.0/24"
IP_DESTINATION="192.168.143.34"
#
# Change this variable to match your public interface - either eth0 or eth1
PUBLIC_INTERFACE="eth0"

# Set PATH to find iptables
PATH=/sbin:/bin:/usr/sbin:/usr/bin:/usr/syno/sbin:/usr/syno/bin

# Module list where KERNEL_MODULES_NAT are defined.
IPTABLES_MODULE_LIST="/usr/syno/etc/iptables_modules_list"
source "${IPTABLES_MODULE_LIST}"

# Tool to load kernel modules (modprobe does not work for me)
BIN_SYNOMODULETOOL="/usr/syno/bin/synomoduletool"

# My service name - let's make sure we don't conflict with synology
SERVICE="Galaxy_NAT"

# iptable binary
IPTABLES="iptables"

start() {
    # Log execution time
    date

    # Make sure packet forwarding is enabled.
    # 'sysctl -w net.ipv4.ip_forward=1' does not work for me
    echo 1 > /proc/sys/net/ipv4/ip_forward

    # Count the number of modules so that we can verify if the module
    # insertion was successful. We replace whitespaces with newlines
    # and count lines.
    MODULE_COUNT=$(
        echo "${KERNEL_MODULES_NAT}" |
            gawk '{ print gensub(/\s+/, "\n", "g") }' |
            wc -l
    )

    # Load the kernel modules necessary for NAT
    "${BIN_SYNOMODULETOOL}" --insmod "${SERVICE}" ${KERNEL_MODULES_NAT}
    RV=$?

    # $BIN_SYNOMODULETOOL returns the number of loaded modules as return  value
    [[ "${RV}" == "${MODULE_COUNT}" ]] || {
            echo >&2 "Error: Modules were not loaded. The following command failed:"
            echo >&2 "${BIN_SYNOMODULETOOL}" --insmod "${SERVICE}" ${KERNEL_MODULES_NAT}
            exit 1
        }

    # Turn on NAT.
    "${IPTABLES}" -t nat -A POSTROUTING -s "${PRIVATE_NETWORK}" -j MASQUERADE -o "${PUBLIC_INTERFACE}"
    RV=$?
    [[ "${RV}" == "0" ]] || {
            echo >&2 "Error: MASQUERADE rules could not be added. The following command failed:"
            echo >&2 "${IPTABLES}" -t nat -A POSTROUTING -s "${PRIVATE_NETWORK}" -j MASQUERADE -o "${PUBLIC_INTERFACE}"
            exit 1
        }
        
    "${IPTABLES}" -A PREROUTING -t nat -p tcp --dport 80 -j DNAT --to "${IP_DESTINATION}:8080"
    "${IPTABLES}" -A FORWARD -p tcp -d "${IP_DESTINATION}" --dport 8080 -j ACCEPT
    # Log current nat table
    iptables -L -v -t nat
}

case "$1" in
        start)
                start
                exit
                ;;
        *)
                # Help message.
                echo "Usage: $0 start"
                exit 1
                ;;
esac
```
Per salvare e uscire un bel ```CTRL+x``` farà al caso vostro, rispondete *y* alla richiesta salvare il file. 
Rendiamolo eseguibile:
```bash
sudo chmod +x /usr/syno/etc/rc.sysv/Galaxy_NAT.sh
```
A questo punto, facciamo in modo, sfruttando il sistema di avviamento dei servizi al boot, di avere questa configurazione sempre applicata al riavvio:
```bash
sudo nano /etc/init/Galaxy_NAT.conf
```
In cui potete copiare queste istruzioni:
```nginx
description "NAT with iptables"
author "Galaxy"
start on syno.network.ready
console log
script
	/usr/syno/etc/rc.sysv/Galaxy_NAT.sh start
end script
# vim:ft=upstart
```

Ora potete riavviare il NAS con il classico:
```bash
sudo reboot
``` 
oppure applicare direttamente lo script creato in precedenza:
```bash
/usr/syno/etc/rc.sysv/Galaxy_NAT.sh start
```
**Ottimo!** Ora la porta 80, normalmente occupata da nginx, viene rediretta dal firewall direttamente alla porta in cui gira il nostro servizio (simulando quindi il fatto che il sito, presente sulla porta 8080, venga servito dalla porta 80).

# The Story so far...
I [NAS Synology](https://www.synology.com/it-it) sono un incredibile compendio di servizi e funzionalità, un modo fantastico per portare in casa il cloud, tenendo però pulito il www da connessioni e **traffico** inutili.
Gli [Echo di Amazon](https://it.wikipedia.org/wiki/Amazon_Echo) sono un buon sistema per impartire ordini ai propri dispositivi intelligenti o domotici, ma anche questo mondo sembra privilegiare il flooding del www verso server in cloud gestiti dalle aziende produttrici dei dispositivi, ***senza tenere in conto dell'eventualità che una tecnologia possa essere resa inaccessibile in caso di fallimento o semplice disinteresse del produttore***, lasciandovi quindi con sistemi non più funzionanti.
Ovviamente, la parte di riconoscimento vocale si appoggia al servizio Amazon Alexa, cloud e su questo, per il momento, si può far poco, *ma aprire una tapparella o accendere una luce, non dovrebbe implicare l'uscita del comando dalla mia LAN casalinga*.
Ammetto di soffrire, evidentemente, di un [D.O.C.](https://it.wikipedia.org/wiki/Disturbo_ossessivo-compulsivo), non amo particolarmente il fatto di avere i miei dati sul computer di qualcun altro e tendo sempre a tenere, più che posso, i servizi di casa mia dentro a casa mia.
"**I have a dream**": un mondo distribuito, fatto di miliardi di micro servizi personali, serviti direttamente dalle case di ognuno di noi e non accentrati sul cloud [A.K.A.](https://it.wikipedia.org/wiki/Espressioni_del_gergo_di_Internet) il computer di un'altro.
## Supervisor
Per supervisionare la domotica di casa mia, ho iniziato a utilizzare OpenHAB, che può esporre luci e tapparelle come dispositivi HUE direttamente da dentro la LAN, senza la necessità di un collegamento esterno, simulando un Bridge HUE.
## Putting it all together
Ma come si collegano tutte queste cose? OpenHAB può essere utilizzato usando un Raspberry Pi, ma avendo a disposizione un NAS con i dischi ridondati, perchè non sfruttare questo livello di sicurezza in più? Così ho installato OpenHAB nel mio DS218, funziona molto bene, servendo l'interfaccia web di configurazione/supervisione dalle porte 8080 e 8443, peccato che il servizio di advertising del Bridge HUE da emulare si aspetti di avere la porta 80 aperta e Alexa non riesce a acquisire i dispositivi HUE emulati, ***ecco il perchè della prima parte di questa guida***. 
In un prossimo post descriverò anche come portare OpenHAB da RaspberryPI  a DiskStation per **aumentare la resistenza** del supervisore.
# The great alternative
I miei fratelli mi hanno regalato [ESP_KNXGATE](http://guidopic.altervista.org/alter/index.html)  creato dall'ottimo [Guido](http://guidopic.altervista.org/alter/chisiamo.html), è un progetto nato dalla passione per l'elettronica e l'informatica e funziona molto bene per esporre, sempre rimanendo dentro alla vostra LAN, luci e tapparelle proprio come per l'emulazione HUE di OpenHAB (Anzi, meglio, perchè supporta anche le tapparelle). In un prossimo articolo descriverò come aggiungere le Tapparelle al nostro sistema Alexa attraverso questo piccolo dispositivo che si alimenta direttamente dal bus [KNX](https://it.wikipedia.org/wiki/KNX_%28standard%29). 

Stay KISS&DRY

N.B. Article image courtesy of [VPN's R US](https://www.vpnsrus.com/)