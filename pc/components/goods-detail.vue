<template>
  <div class="main">
    <div class="content-left">
      <div class="swiper">
        <el-carousel :autoplay="false">
          <el-carousel-item v-for="(item, index) in swiperData" :key="index">
            <!-- <h3 class="small">{{ item }}</h3> -->
            <div class="swiper-item">
              <img :src="item" style="width: 75%; margin: 0 auto;" alt="" srcset="">
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="detail">
        <div class="detail-item">
          <div class="detail-content">
            <goodsTitle>{{ goodsDetailData.name }}</goodsTitle>
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-content">
            <div class="author">
              <div class="author-info">
                <img
                  :src="goodsDetailData.user?.avatar"
                  style="width: 26px; height: 26px; border-radius: 50%"
                />
                <div class="author-info-name">
                  {{ goodsDetailData.author || "暂无" }}
                </div>
              </div>
              <div class="author-identify">创作者</div>
            </div>
          </div>
        </div>
        <div class="detail-item">
          <div>
            <LineTitle>作品详情</LineTitle>
            <div>
              <img v-for="(item, index) in goodsDetailData.images" :key="index" :src="item" style="width: 100%; height: auto;">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-right">
      <div class="detail-item">
        <div class="notice-title">
          <lineTitle color="#fff" width="125">权利归属及使用规则</lineTitle>
        </div>
        <div class="notice-content">
          {{
            `1.《${goodsDetailData.name}》作品系【${goodsDetailData.author}】创作完成已经独家使用正宇宙文化科技成都有限公司专有的IoC技术登记保护，作品的商品所有权生成了一个唯一编码的商品所有权凭证(Proofof Copyright Ownership，PCO)，商品的每一个许可使用权获分配一个唯一编码的许可权凭证(ProofofLicense Right，PLR)，每个行使许可使用权生产的限量款授权产品获分配一个唯一编码的限量款授权产品所有权凭证(Proofof Property Right，PPR)。每个凭证记录了当前和历史的权利人信息、每一笔交易记录及参与交易的任何代理人、经纪人信息，凭证信息生成后不可被删改。IoC技术还会将每个作品下生成的所有PCO、PLR、PPR以及每个凭证相应的权利持有人进行关联。`
          }}<br />
          {{
            `2.《${goodsDetailData.name}》作品的商品所有权PCO凭证记录的持有人为【${goodsDetailData.author}】，该凭证可用于识别商品所有权PCO凭证的持有人是商品所有权的归属人。商品所有权的交易单位是PCO，即Proofof Copyright Ownership，买一个商品所有权简称为PCO，一个PCO对应一个唯一编码，如该作品包各原作，则交易价格中会注明(包含原作)。`
          }}
        </div>
      </div>
      <div class="detail-item">
        <LineTitle>作品简介</LineTitle>
        <div>
          {{ goodsDetailData.detail || "暂无简介" }}
        </div>
      </div>
      <div class="detail-item">
        <LineTitle>认证信息</LineTitle>
        <goodsInfo :form="goodsDetailData"></goodsInfo>
      </div>
      <el-button-group>
        <el-button type="warning">加入购物车</el-button>
        <el-button type="danger" @click="onPay">立即购买</el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
import {
  goodsDetail,
  qrCodePay
} from "@/api/api.js";
export default {
  props: {
    id: {
      type: Number,
    },
  },
  data() {
    return {
      goodsDetailData: {},
      swiperData: [],
      
    };
  },
  watch:{
    id(val){
      this.getGoodsDetail();
    }
  },
  created() {
    this.getGoodsDetail();
  },
  methods: {
    getGoodsDetail() {
      goodsDetail({
        id: this.id,
      }).then((res) => {
        this.goodsDetailData = res.data;
        this.swiperData = [res.data.image, ...res.data.images];
      });
    },
    onPay(){
      qrCodePay({
        goods_id: this.id
      }).then(res=>{
        console.log(res);
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.main {
  @include flex(row);
  justify-content: center;
  gap: 50px;
  .detail-item {
    max-width: 400px;
    display: grid;
    row-gap: 10px;
    // position: relative;
    margin: 0 auto 10px;
    padding: 15px 10px;
    width: 90%;
    border-radius: 8rpx;
    backdrop-filter: blur(10px);
    background: rgba(53, 56, 74, 0.5);
  }
}
.content-right {
  @include flex(column);
  justify-content: flex-end;
  align-items: center;
}
.content-left {
  background: {
    repeat: no-repeat;
    image: url("/show.png");
    attachment: local;
    // size: cover;
    size: contain;
  }
  background-color: rgb(22, 23, 36);
  overflow-y: scroll;
  // width: 23%;
  width: 410px;
  height: 800px;
  margin-top: 10px;
  // position: relative;
  // margin: 10px auto 0;
  // padding-bottom: 40px;
  ::-webkit-scrollbar {
    display: none;
  }
  .swiper{
    // position: absolute;
    // top: 40px;
    // right: 0;
    margin-top: 100px;
    .swiper-item{
      height: 100%;
      @include flex();
      align-items: center;
      justify-content: center;
    }
  }
  .detail {
    // padding: 500px 0 100px;
    padding: 150px 0 0;
    // @include flex(row);
    .detail-item {
      position: relative;
      margin: 0 auto 10px;
      padding: 15px 0;
      width: 90%;
      border-radius: 8rpx;
      backdrop-filter: blur(10px);
      background: rgba(53, 56, 74, 0.5);
      > div {
        margin: 0 auto;
        width: 95%;
        @include flex(column);
        gap: 10px;
      }
      .author {
        width: 100%;
        @include flex(row);
        align-items: center;
        justify-content: space-between;
        .author-info {
          @include flex(row);
          align-items: center;
          // margin-left: 12px;

          .author-info-name {
            font-size: 14px;
            color: #ffffff;
            margin-left: 8px;
          }
        }
      }
      .author-identify {
        // margin-right: 12px;
        width: 55px;
        height: 24px;
        border-radius: 2px;
        background: linear-gradient(to right, #e5c07b, #d1913c);
        @include flex();
        justify-content: center;
        align-items: center;
        font-size: 10px;
        color: #fff;
      }
      .footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        .footer-content {
          float: right;
          margin: 10px;
        }
      }
    }
  }
}
</style>