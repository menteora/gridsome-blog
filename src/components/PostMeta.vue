<template>
  <div class="post-meta">
    {{ $t('post.posted', [formattedDate]) }}.
    <template v-if="post.timeToRead">
      <strong>{{ $t('post.minread', [post.timeToRead]) }}.</strong>
    </template>
  </div>
</template>

<script>
export default {
  props: ["post"],
  computed: {
    formattedDate: function () {
      var date
      if (this.$root.$i18n.locale == 'it') {
        date = this.$moment(this.post.date).format("DD/MM/YYYY")
      }else{
        date = this.$moment(this.post.date).format("MM/DD/YYYY")
      }
      return date
    }
  }/*,
  mounted: function(){
    console.log(this.post.date)
    console.log(this.$moment(this.post.date).format("DD/MM/YYYY"))
  }*/
};
</script>

<style lang="scss">
.post-meta {
  font-size: 0.8em;
  opacity: 0.8;
}
</style>