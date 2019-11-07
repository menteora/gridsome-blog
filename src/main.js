// Import main css
import '~/assets/style/index.scss'

// Import default layout so we don't need to import it to every page
import DefaultLayout from '~/layouts/Default.vue'

// Import Vuetify
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
// Translation provided by Vuetify (javascript)
import it from 'vuetify/es5/locale/it'
import en from 'vuetify/es5/locale/en'

// Import VueI18n
import VueI18n from 'vue-i18n'
import messages from '~/locale'

import CountryFlag from 'vue-country-flag'

import VueMoment from 'vue-moment'

import VuetifyExtra from '@menteora/vuetify-extra'

// The Client API can be used here. Learn more: gridsome.org/docs/client-api
export default function (Vue, { router, head, appOptions, isClient }) {

  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout)
  Vue.component('country-flag', CountryFlag)
  
  Vue.use(Vuetify)
  Vue.use(VuetifyExtra)
  Vue.use(VueI18n)
  Vue.use(VueMoment);

  var browser_language;

  if (isClient) {
    browser_language = window.navigator.language.split('-')[0]
    console.log(browser_language)
  }
  var languages = ["it", "en"];
  var selected_language = languages.includes(browser_language) ? browser_language : "en"
  // Create VueI18n instance with options
  appOptions.i18n = new VueI18n({
    locale: selected_language,
    //fallbackLocale: 'en',
    messages, // set locale messages
  })

  //console.log(browser_language)
  //console.log(appOptions.i18n.locale)
  /*
  appOptions.vuetify = new Vuetify({
    lang: {
      t: (key, ...params) => i18n.t(key, params),
      current: navigator.language.split('-')[0]
    },
  })
*/
  appOptions.vuetify = new Vuetify({
    lang: {
      locales: { it, en },
      current: selected_language,
    },
  })

}