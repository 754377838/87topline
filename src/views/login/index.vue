<template>
  <div class="login-container">
    <div class="login-box">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <img src="./logo_index.png" alt />
        <!-- prop 使校验规则与当前项目联系起来，属性值必须为表单成员名称 -->
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号码">
            <i slot="prefix" class="iconfont icon-shouji"></i>
          </el-input>

        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code" placeholder="请输入验证码">
            <i slot="prefix" class="iconfont icon-yanzhengma"></i>
          </el-input>

        </el-form-item>
        <el-form-item prop="xieyi" style="text-align:left;">
          <el-checkbox v-model="loginForm.xieyi" style="margin-right:10px"></el-checkbox>
          <span>我已阅读并同意用户协议和隐私条款</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="isActive" :disabled="isActive" style="width:100%;" @click="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 引入极验的gt.js文件,因为其内部没有相关导出操作，所以无需写名称
import '@/assets/js/gt.js'

// 引入icon文件
import '@/assets/iconfont/iconfont.css'

export default {
  data () {
    // 自定义校验协议的方法
    var xieyiTest = (rule, value, callback) => {
      value ? callback() : callback(new Error('请无条件遵守规矩'))
    }
    return {
      isActive: false, // 登录按钮禁用、等待
      ctaObj: null, // 极验窗口对象
      loginForm: {
        mobile: '18233337777', // 手机号码
        code: '246810', // 验证码
        xieyi: true // 协议 true表示选中
      },
      loginFormRules: {
        mobile: [
          { required: true, message: '手机号码必填' },
          { pattern: /^1[35789]\d{9}$/, message: '请正确填写' }
        ],
        code: [
          { required: true, message: '验证码必填' }
        ],
        xieyi: [
          { validator: xieyiTest }
        ]
      }
    }
  },
  methods: {
    // 登录系统
    login () {
      // 全部表单域项目校验
      // form组件.validate()
      // 获得form组件的语句：this.$refs.loginFormRef
      this.$refs.loginFormRef.validate((valid) => {
        // 表单校验成功
        if (valid) {
          // 判断cpaObj的值
          if (this.ctaObj !== null) {
            return this.ctaObj.verify() // 显示验证窗口
          }

          // 登录按钮状态
          this.isActive = true

          // 人机交互验证
          // 获得人机交互验证的秘钥信息
          let pro = this.$http.get(`/captchas/${this.loginForm.mobile}`)
          pro
            .then(result => {
              // console.log(result)
              // 对象的解构赋值
              let { data } = result.data
              // 生成极验窗口
              // 请检测data的数据结构， 保证data.gt, data.challenge, data.success有值
              window.initGeetest({
                // 以下配置参数来自服务端 SDK
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success,
                new_captcha: true,
                product: 'bind' // 隐藏按钮
              }, captchaObj => {
                // 这里可以调用验证实例 captchaObj 的实例方法
                captchaObj.onReady(() => {
                  // 验证码ready之后才能调用verify方法显示验证码
                  captchaObj.verify()
                  // 把窗口对象赋予给ctaObj对象
                  this.ctaObj = captchaObj
                  // 登录按钮状态
                  this.isActive = false
                }).onSuccess(() => {
                  // 行为正确，登录后台页面
                  // axios发送请求进行真实性校验
                  this.loginAct()
                }).onError(() => {})
              })
            })
            .catch(err => {
              return this.$message.error('获得人机秘钥信息失败' + err)
            })
        }
      })
    },
    // 账号真实校验，登录后台页面
    loginAct () {
      let pro = this.$http.post('/authorizations', this.loginForm)
      pro
        .then(result => {
          // 判断信息若为ok，设置sessionStorage，再进入后台页面
          if (result.data.message === 'OK') {
            // 把服务器端返回的信息(id/name/token/refresh_token/photo)都存储给sessionStorage的userinfo
            // 其中的token是判断用户是否处于登录状态之用的
            window.sessionStorage.setItem('userinfo', JSON.stringify(result.data.data))
            // 进入后台页面
            // this.$router.push('/home')
            this.$router.push({ name: 'home' })
          }
        })
        .catch(err => {
          // 用户名或密码错误
          // return this.$message.error('用户名或密码错误' + err)
          // duration 显示时长，毫秒单位
          return this.$message({ type: 'error', message: '用户名或密码错误' + err, duration: 2000 })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background-color: gray;
  background-image: url("./login_bg.jpg");
  background-size: cover;
  display: flex;
  // 水平居中
  justify-content: center;
  // 垂直居中
  align-items: center;
  .login-box {
    width: 410px;
    height: 345px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    img {
      width: 55%;
      margin: 20px auto;
    }
    .el-form {
      width: 75%;
    }
  }
}
</style>
