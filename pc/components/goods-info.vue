<template>
  <div>
    <div class="form" v-for="(item, index) in formData" :key="index">
      <div class="form-index">
        {{ index }}
      </div>
      <div class="form-value">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
import day from "dayjs";
export default {
  name: "goods-info",
  props: {
    form: {
      type: Object,
    },
  },
  data() {
    return {
      formData: {},
    };
  },
  //   mounted() {
  //     console.log(this.form);
  //     this.getFormData();
  //   },
  watch: {
    form() {
      this.getFormData();
    },
  },
  methods: {
    getFormData() {
      this.formData = {
        商品名称: this.form.name,
        // '商品类型':this.form.type,
        创作者: this.form.author,
        发布时间: this.form.createtime?day.unix(this.form.createtime).format("YYYY-MM-DD"):'暂无',
        // '发布价格':`￥${this.form.price}`,
        // 发布时间: this.$u.timeFormat(this.form.createtime, "yyyy年mm月dd日"),
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.form {
  @include flex(row);
  justify-content: space-between;
  // margin-right: 32rpx;
  .form-index {
    font-size: 14px;
    letter-spacing: -1px;
    color: #666666;
    margin-top: 6px;
  }
  .form-value {
    @extend .form-index;
    color: #fff;
  }
}
</style>