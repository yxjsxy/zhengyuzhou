<template>
  <div class="title" :style="[styleVal]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "line-title",
  props: {
    color: {
      type: String,
      default: "#fff",
    },
    bgColor: {
      type: String,
      // default:'linear-gradient(270deg, rgba(58, 244, 186, 0) 0%, #3AF4BA 100%)'
      default:
        "linear-gradient(270deg, rgba(58, 244, 186, 0) 0%, #ffff00 100%)",
    },
    width: {
      // type: Number,
      default: 56,
    },
  },
  data() {
    return {};
  },
  computed: {
    styleVal() {
      return {
        "--bottom-width": this.width + "px",
        "--bottom-color": this.bgColor,
        "--color": this.color,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  // margin: 32rpx;
  font-size: 14px;
  line-height: 14px;
  letter-spacing: -1px;
  // color: #141414;
  color: var(--color);
  // background: linear-gradient(270deg, rgba(58, 244, 186, 0) 0%, #3AF4BA 100%);
  background: var(--bottom-color);

  background: {
    repeat: no-repeat;
    // size: 112rpx 8rpx;
    size: var(--bottom-width) 4px;
    position-y: bottom;
  }
}
</style>