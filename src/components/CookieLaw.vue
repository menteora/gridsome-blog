<template>
  <ClientOnly>
    <cookie-law theme="dark-lime" :buttonText="$t('site.cookie.button')">
      <div slot="message">
        {{ $t('site.cookie.message') }}
        <g-link :to="$t('site.cookie.path')">{{ $t('site.cookie.policy') }}</g-link>
      </div>
    </cookie-law>
  </ClientOnly>
</template>

<script>
import CookieLaw from "vue-cookie-law";
export default {
  components: { CookieLaw }
};
</script>