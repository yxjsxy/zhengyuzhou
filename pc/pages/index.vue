<template>
  <div class="container">
    <navBar />
    <nuxt-child />
  </div>
</template>

<script>
import navBar from '@/components/nav-bar';
export default {
  components: {
    navBar
  },
  data() {
    return {

    }
  },
  created() {
    this.$store.dispatch('initUser');
  },
  methods: {

  },
}
</script>

<style lang="scss" scoped>
.container {
  // width: 100vw;
  // height: 100vh;
  // background-color: rgb(30,30,30);
  .input-box {
    padding: 100px;
    border: 1px solid #ccc;
    border-radius: 20px;
  }
}
</style>
