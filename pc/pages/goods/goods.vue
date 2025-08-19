<template>
  <div>home</div>
</template>

<script>
import {
  goodsDetail
} from "@/api/api.js";
export default {
  data() {
    return {};
  },
  mounted() {
    console.log('作品id',this.$route.query.id);
    this.getGoodsDetail(this.$route.query.id);
  },
  methods: {
    getGoodsDetail(id) {
      goodsDetail(id).then((res) => {
        console.log(res);
      });
    }
  },
}
</script>

<style>

</style>