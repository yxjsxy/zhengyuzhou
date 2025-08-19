<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
        <img src="/icon.png" width="40px" class="icon">
        <el-menu-item v-for="item in menuItemsWithoutSub" :key="item.index" :index="item.path">
          {{ item.name }}
        </el-menu-item>
        <el-submenu v-for="it in menuItemsWithSub" :key="it.index" :index="it.path">
          <template slot="title">{{ it.name }}</template>
          <el-menu-item
            v-for="subItem in it.subMenu"
            :key="subItem.index"
            :index="subItem.path"
            >{{ subItem.name }}</el-menu-item
          >
        </el-submenu>
        <div class="login">
          <el-button type="text" @click="showLogin = true" v-if="!user">登录</el-button>
          <div class="user-info" v-else>
            <img :src="user.avatar" width="30px">
            <span>{{ user.name }}</span>
          </div>
        </div>
    </el-menu>
    <el-dialog title="登录" :visible.sync="showLogin" width="500px">
      <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" label-position="top">
        <el-form-item label="手机号" prop="phone">
          <el-input placeholder="请输入手机号" v-model="loginForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="smsCode">
          <el-input placeholder="请输入验证码" v-model="loginForm.smsCode">
            <template slot="suffix">
              <div style="height: 100%; display: flex; align-items: center">
                <el-button style="margin: auto 0;" type="primary" size="mini" :disabled="!isSendSms" @click="sendSms">{{ getBtnText }}</el-button>
              </div>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="tips">未注册的手机号将自动注册</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">立即登录</el-button>
      </span>我已阅读并同意<a href="#">《用户协议》</a>
    </el-dialog>
  </div>
</template>

<script>
import {
  sendSms,
  verifyCode,
  loginByPhone
} from '@/api/api';
import {
  mapState
} from 'vuex';
export default {
  data() {
    return {
      showLogin: false,
      isSendSms: false,
      smsCount: 60,
      rules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { 
            validator: (rule, value, callback) => {
              const phoneReg = /^1[3456789]\d{9}$/; // 这是一个简单的中国大陆手机号码验证正则表达式
              if (!value) {
                return callback(new Error('请输入手机号'));
              }
              if (!phoneReg.test(value)) {
                return callback(new Error('请输入正确的手机号'));
              }
              callback();
            }, 
            trigger: 'blur' 
          }
        ],
        smsCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
        ],
      },
      loginForm: {
        phone: "",
        smsCode: ""
      },
      menuList: [
        { name: "首页", index: "1", path: "/home/home", hasSub: false },
        { name: "资源下载", index: "2", path: "/download/download", hasSub: false },
        {
          name: "创作活动",
          index: "3",
          path: "/activity",
          hasSub: true,
          subMenu: [
            {
              name: "主题展",
              index: "3-1",
              path: "/activity/activity"
            },
            {
              name: "征集投稿",
              index: "3-2",
              path: "/activity/collect",
            }
          ]
        },
        {
          name: "上传资源",
          index: "4",
          path: "/upload",
          hasSub: true,
          subMenu: [
            {
              name: "定制资源上传/工厂端上传",
              index: "4-1",
              path: "/upload/factory",
            },
            {
              name: "创作者上传",
              index: "4-2",
              path: "/upload/creator",
            },
          ],
        },
      ],
      activeIndex: "/home/home",
    };
  },
  computed: {
    ...mapState(["user"]),
    menuItemsWithoutSub() {
      return this.menuList.filter(item => !item.hasSub);
    },
    menuItemsWithSub() {
      return this.menuList.filter(item => item.hasSub);
    },
    getBtnText() {
      return this.isSendSms ? `${this.smsCount}s后重新发送` : "发送验证码";
    },
    isSendSmsBtnDisabled() {
      return false
    }
  },
  created() {
    this.activeIndex = this.$route.path;
  },
  mounted() {},
  methods: {
    sendSms(){
      // console.log(this.$refs.loginForm);
      this.$refs.loginForm.validateField("phone", valid => {
        if(valid) return;
        sendSms({
          phone: this.loginForm.phone
        }).then((res) => {
          console.log("发送验证码", res);
          if(res.code==0){
            this.$message({
              message: '验证码发送成功！',
              type: 'success'
            });
            this.isSendSms = true;
            let count = this.smsCount;
            const timer = setInterval(() => {
              count--;
              this.smsCount = count;
              if(count === 0){
                clearInterval(timer);
                this.isSendSms = false;
                this.smsCount = 60;
              }
            }, 1000);
          }
        });
      });
    },
    onSubmit(){
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // console.log("submit!");
          // this.showLogin = false;
          // this.$router.push("/home/home");
          verifyCode({
            phone: this.loginForm.phone,
            code: this.loginForm.smsCode
          }).then(res=>{
            console.log(res);
            if(res.code==0){
              loginByPhone({
                phone: this.loginForm.phone
              }).then(response=>{
                this.$message({
                  type: 'success',
                  message: response.msg
                });
                this.showLogin = false;
                window.localStorage.setItem("user", JSON.stringify(response.data));
              })
            }
          })
        } else {
          console.log("error submit!!",valid);
          return false;
        }
      });
    }
  },
};
</script>
<style lang="scss" scoped>
.el-menu-demo{
  height: 60px;
  @include flex(row);
  align-items: center;
  position: relative;
  .icon{
    margin: 0 30px;
  }
  .login{
    position: absolute;
    right: 30px;
    .user-info{
      @include flex(row);
      align-items: center;
      gap: 10px;
      font-size: 13px;
      img{
        border-radius: 50%;
      }
    }
  }
}
.tips{
  margin-top: 5px;
  color: #909399;
  // float: right;
  font-size: 12px;
}
::v-deep .el-menu.el-menu--horizontal {
  border-bottom: 0 !important;
}
</style>
