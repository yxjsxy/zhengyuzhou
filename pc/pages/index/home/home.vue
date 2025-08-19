<template>
  <!-- 只在客户端渲染 -->
  <div class="container">
    <client-only>
      <VueWaterfallEasy
        ref="waterfall"
        :imgsArr="imgs"
        :height="windowHeight"
        @click="onClickGoods"
        :maxCols="8"
        @scrollReachBottom="getMoreData"
      >
        <div slot="waterfall-head">
          <div class="input">
            <el-input placeholder="搜索作品" v-model="searchVal">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
              <el-button slot="append" icon="el-icon-search" type="primary"
                >搜索</el-button
              >
            </el-input>
          </div>
          <el-carousel height="400px" type="card">
            <el-carousel-item
              v-for="(item, index) in swiperData"
              :key="index"
              style="
                display: flex;
                flex-direction: row;
                justify-content: center;
              "
            >
              <img :src="item.image" height="400px" class="swiper-img" />
            </el-carousel-item>
          </el-carousel>
          <el-tabs v-model="currentCategory" type="card">
            <el-tab-pane
              v-for="(item, index) in tabList"
              :key="index"
              :label="item.name"
              :name="item.category_id"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <div class="goods-info" slot-scope="props">
          <p class="goods-title">{{ props.value.name }}</p>
          <p class="goods-price">￥{{ props.value.price }}</p>
        </div>
      </VueWaterfallEasy>
    </client-only>
    <el-dialog
      title="作品详情"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      fullscreen
    >
      <goodsDetail :id="currentGoodsId"></goodsDetail>
    </el-dialog>
  </div>
</template>

<script>
import VueWaterfallEasy from "vue-waterfall-easy";
import { goodsList, goodsCategory, adverts } from "@/api/api";
export default {
  components: {
    VueWaterfallEasy,
  },
  data() {
    return {
      imgs: [],
      swiperData: [],
      windowHeight: 0,
      currentCategory: "1",
      tabList: [],
      dialogVisible: false,
      currentGoodsId: 0,
      searchVal: "",
      currentPage: 1,
    };
  },
  watch: {
    currentCategory(val) {
      this.getGoodsList();
    },
  },
  mounted() {
    this.getTabList();
    this.getSwiperData();
    if (process.client) {
      this.windowHeight = window.innerHeight - 60; // 减去顶部导航栏高度
    }
  },
  methods: {
    getMoreData() {
      // 增加当前页码
      this.currentPage += 1;

      // 调用API获取更多数据
      goodsList({
        id: this.currentCategory || 1,
        page: this.currentPage, // 使用更新后的页码
      })
        .then((res) => {
          this.$refs.waterfall.waterfallOver();
          if (res && res.data.length) {
            // 将新数据追加到imgs数组中
            this.imgs = this.imgs.concat(
              res.data.map((item) => ({
                id: item.id,
                name: item.name,
                src: item.image,
                price: item.price,
              }))
            );
          } else {
            // 可选：如果没有更多数据可加载，可以显示一个提示信息
            console.log("没有更多数据可加载");
          }
        })
        .catch((error) => {
          this.$refs.waterfall.waterfallOver();
          // 处理错误情况，例如网络错误或API返回的错误状态码
          console.error("加载更多数据时出错:", error);
        });
    },
    getSwiperData() {
      adverts().then((res) => {
        console.log(res);
        this.swiperData = res.data.map((item) => ({
          image: item.image,
        }));
      });
    },
    handleClose(done) {
      done();
    },
    getGoodsList() {
      goodsList({
        id: this.currentCategory || 1,
        page: this.currentPage,
      }).then((res) => {
        if (res && res.data.length) {
          this.imgs = res.data.map((item) => ({
            id: item.id,
            name: item.name,
            src: item.image,
            price: item.price,
          }));
        }
      });
    },
    onClickGoods(e, { index, value }) {
      // this.$router.push({path:`/goods/goods?id=${this.imgs[index].id}`})
      this.currentGoodsId = value.id;
      this.dialogVisible = true;
    },
    getTabList() {
      goodsCategory().then((res) => {
        let tabData = res.data.map((item) => {
          // return {category_id:item.id,name:item.name}
          return { category_id: String(item.id), name: item.name };
        });
        this.tabList = tabData;
        this.getGoodsList();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .img-inner-box {
  // border: 2px solid rgb(99, 82, 32);
  // border-radius: 40px;
  cursor: pointer;
}
::v-deep .img-inner-box:hover {
  // border: 2px solid rgb(143, 107, 5);
  transition: all 0.5s ease;
  transform: scale(1.05);
}
.container {
  width: 100%;
  padding: 20px 0;
  display: grid;
  row-gap: 20px;
  // height: calc(100vh - 60px);
  .input {
    width: 70%;
    margin: 0 auto;
  }
  .goods-info {
    padding: 10px;
    background: linear-gradient(#000 0%, rgb(43, 37, 19) 100%);
    .goods-price {
      text-align: end;
      margin-top: 10px;
    }
  }
}
</style>