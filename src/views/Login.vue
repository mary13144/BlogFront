<template>
  <div class="login_wrapper">
    <div class="loginAndRegister">
      <div class="login">
        <Transition
            enter-active-class="animate__animated animate__slideInDown"
            leave-active-class="animate__animated animate__zoomOut"
            appear
        >
          <div v-show="isShow" class="title">
            Login
          </div>
        </Transition>
        <Transition
            enter-active-class="animate__animated animate__slideInUp"
            leave-active-class="animate__animated animate__zoomOut"
            appear
        >
          <form v-show="isShow" class="login_form">
            <div class="inputItem">
              <el-input v-model="loginInfo.user_name" placeholder="请输入用户名">
                <template #prefix>
                  <el-icon size="20px">
                    <User/>
                  </el-icon>
                </template>
              </el-input>
            </div>
            <div class="inputItem">
              <el-input v-model="loginInfo.pass_word" placeholder="请输入密码" show-password>
                <template #prefix>
                  <el-icon size="20px">
                    <Lock/>
                  </el-icon>
                </template>
              </el-input>
            </div>
            <div class="inputCode">
              <el-input v-model="loginInfo.captcha" placeholder="请输入验证码" style="width: 126px">
                <template #prefix>
                  <el-icon size="20px">
                    <Checked/>
                  </el-icon>
                </template>
              </el-input>
              <div class="code" @click="loading">
                <img :src="code" alt="code">
              </div>
            </div>
            <div class="buttonItem">
              <el-button @click="loginHandler" type="success" size="large"
                         style="border-radius: 10px;font-weight: bold">登陆
              </el-button>
              <i class="iconfont icon-qq"></i>
            </div>
          </form>
        </Transition>

      </div>
      <div class="register">
        <Transition
            enter-active-class="animate__animated animate__slideInDown"
            leave-active-class="animate__animated animate__zoomOut"
            appear
        >
          <div v-show="!isShow" class="title">
            Register
          </div>
        </Transition>
        <Transition
            enter-active-class="animate__animated animate__slideInUp"
            leave-active-class="animate__animated animate__zoomOut"
            appear
        >
          <form v-show="!isShow" class="register_form">
            <div class="inputItem">
              <el-input v-model="registerInfo.username" placeholder="请输入用户名">
                <template #prefix>
                  <el-icon size="20px">
                    <User/>
                  </el-icon>
                </template>
              </el-input>
            </div>
            <div class="inputItem">
              <el-input v-model="registerInfo.email" placeholder="请输入邮箱">
                <template #prefix>
                  <el-icon size="20px">
                    <el-icon>
                      <Message/>
                    </el-icon>
                  </el-icon>
                </template>
              </el-input>
            </div>
            <div class="inputItem">
              <el-input v-model="registerInfo.password" placeholder="请输入密码" show-password>
                <template #prefix>
                  <el-icon size="20px">
                    <Lock/>
                  </el-icon>
                </template>
              </el-input>
            </div>
            <div class="inputItem">
              <el-input v-model="registerInfo.confirm_password" placeholder="请确认密码" show-password>
                <template #prefix>
                  <el-icon size="20px">
                    <Lock/>
                  </el-icon>
                </template>
              </el-input>
            </div>
            <div class="inputCode">
              <el-input v-model="registerInfo.code" placeholder="验证码" style="width: 129px">
                <template #prefix>
                  <el-icon size="20px">
                    <Checked/>
                  </el-icon>
                </template>
              </el-input>
              <el-button @click="sendCode" :disabled="isDisable" type="primary"
                         style="margin-left: 30px;margin-right: 10px;font-weight: bold;width: 48px;height: 70%">
                {{ buttonInner }}
              </el-button>
            </div>
            <div class="buttonItem">
              <el-button @click="registerHandler" type="success" size="large"
                         style="border-radius: 10px;font-weight: bold">注册
              </el-button>
            </div>
          </form>
        </Transition>

      </div>
      <div class="switchDisplay">
        <div v-show="isShow" class="switch">
          <div class="title">
            欢迎进入MwxBlog后台
          </div>
          <div class="button">
            <el-button size="large" type="primary" round style="font-weight: bold" @click="showRegister">
              还没有账号？点击注册
            </el-button>
          </div>
        </div>
        <div v-show="!isShow" class="switch">
          <div class="title">
            欢迎注册使用MwxBlog
          </div>
          <div class="button">
            <el-button size="large" type="primary" round style="font-weight: bold" @click="showLogin">
              已有账户？立即登录
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {Checked, Lock, Message, User} from "@element-plus/icons-vue";
import {LoadingCode, Register, RegisterCode, UserLogin} from "@/api/login";
import {ElMessage} from "element-plus";
import type {LoginUser, RegisterInfo} from "@/types";
import {ParesToken} from "@/utils/token";
import {useLoginStore} from "@/stores";
import {useRoute, useRouter} from "vue-router";
//动效-------------------------------------------------------------------------------------
const isShow = ref<boolean>(true)
const borderTopRightRadius = ref<string>('15px')
const borderBottomRightRadius = ref<string>('15px')
const borderTopLeftRadius = ref<string>('0px')
const borderBottomLeftRadius = ref<string>('0px')
const rightDis = ref<string>('0px')
const showRegister = () => {
  borderTopLeftRadius.value = "15px"
  borderBottomLeftRadius.value = "15px"
  borderTopRightRadius.value = '0px'
  borderBottomRightRadius.value = '0px'
  rightDis.value = "50%"
  isShow.value = !isShow.value
}

const showLogin = () => {
  borderTopLeftRadius.value = '0px'
  borderBottomLeftRadius.value = '0px'
  borderTopRightRadius.value = "15px"
  borderBottomRightRadius.value = "15px"
  rightDis.value = "0px"
  isShow.value = !isShow.value
}
//-----------------------------------------------------------------------------------
//加载验证码
const code = ref<string>("")
const loading = async () => {
  let res = await LoadingCode()
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  loginInfo.captcha_id = res.data.id
  code.value = res.data.captcha
}
onMounted(() => {
  loading()
})
//登陆-------------------------------------------------------------------------------------
const loginInfo = reactive<LoginUser>({captcha: "", captcha_id: "", pass_word: "", user_name: ""})
const loginStore = useLoginStore()
const router = useRouter()
const route = useRoute()
const loginHandler = async () => {
  let res = await UserLogin(loginInfo)
  if (res.code) {
    ElMessage.error(res.msg)
    await loading()
    return
  }
  let token = ParesToken(res.data)
  if (token.user.role == 4) {
    ElMessage.warning("该用户已被禁止登录")
    return
  }
  //持久化
  localStorage.setItem("token", res.data)
  token.exp *= 1000
  loginStore.setting(token)
  //登陆完成跳转
  let form = route.query.redirect_url
  if (form == null) {
    setTimeout(() => {
      router.push({
        name: "home"
      })
    }, 1000)
  } else {
    setTimeout(() => {
      router.push({
        path: form as string
      })
    }, 1000)
  }

}
//注册-------------------------------------------------------------------------------------
const registerInfo = reactive<RegisterInfo>({code: "", confirm_password: "", email: "", password: "", username: ""})
const registerHandler = async () => {
  //密码为八位及以上并且大小写字母数字特殊字符三项都包括
  let strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
  if (!strongRegex.test(registerInfo.password)) {
    ElMessage.warning("请使用大小写字母、数字、符号三种类型组合的密码，长度至少为8位")
    return
  }
  if (registerInfo.password != registerInfo.confirm_password) {
    ElMessage.warning("两次密码输入不一致，请重新输入")
    return
  }
  let res = await Register(registerInfo)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  showLogin()
}
//发送验证码
const isDisable = ref<boolean>(false)
const buttonInner = ref<string>("发送")
let time = 60
const timeDisplay = () => {
  if (time == 0) {
    isDisable.value = false
    buttonInner.value = "发送"
    time = 60
  } else {
    isDisable.value = true
    buttonInner.value = time + ""
    time--
    setTimeout(() => {
      timeDisplay()
    }, 1000)
  }
}
const sendCode = async () => {
  if (registerInfo.email == "") {
    ElMessage.warning("请输入邮箱")
    return
  }
  const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  if (!mailReg.test(registerInfo.email)) {
    ElMessage.warning("请输入正确的邮箱格式")
    return
  }

  let res = await RegisterCode(registerInfo.email)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  timeDisplay()
}
</script>

<style scoped lang="scss">
.login_wrapper {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("https://img.mwxblog.com/bg/loginBackground.jpg");
  background-size: 100%;

  :deep(.el-input__inner) {
    --el-input-text-color: black;
  }

  .loginAndRegister {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    .login {
      background-color: rgba(255, 255, 255, 0.7);
      border-top-left-radius: 15px;
      border-bottom-left-radius: 15px;
      height: 400px;
      width: 350px;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 1;
      padding: 20px;

      .title {
        width: 70%;
        flex-grow: 1;
        color: #257B5E;
        font-weight: bold;
        font-size: 24px;
        border-bottom: 1px solid #257B5E;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
      }

      .login_form {
        width: 100%;
        flex-grow: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;

        .inputItem {
          width: 70%;
        }

        .inputCode {
          width: 70%;
          display: flex;

          .code {
            width: 80px;
            height: 40px;
            margin-left: 10px;
            box-sizing: border-box;
            border: 1px solid #a6a9ad;
            border-radius: 10px;
            overflow: hidden;
            cursor: pointer;

            img {
              height: 100%;
            }
          }
        }

        .buttonItem {
          width: 70%;
          display: flex;
          align-items: center;
          justify-content: space-around;

          i {
            font-size: 30px;
            cursor: pointer;
            color: #66b1ff;

            &:hover {
              color: #3375b9;
            }
          }
        }

        :deep(.el-input__wrapper) {
          height: 40px;
          border-radius: 15px;
        }

      }
    }

    .register {
      background-color: rgba(255, 255, 255, 0.7);
      border-top-right-radius: 15px;
      border-bottom-right-radius: 15px;
      height: 400px;
      width: 350px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1;

      .title {
        width: 70%;
        flex-grow: 1;
        color: #257B5E;
        font-weight: bold;
        font-size: 24px;
        border-bottom: 1px solid #257B5E;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
      }

      .register_form {
        width: 100%;
        flex-grow: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        .inputItem {
          width: 70%;
        }

        .inputCode {
          width: 70%;
          display: flex;
          align-items: center;
          justify-content: space-between;

        }

        .buttonItem {
          width: 70%;
          display: flex;
          align-items: center;
          justify-content: space-around;

          i {
            font-size: 30px;
            cursor: pointer;
            color: #66b1ff;

            &:hover {
              color: #3375b9;
            }
          }
        }

        :deep(.el-input__wrapper) {
          height: 35px;
          border-radius: 15px;
        }

        :deep(.el-input__inner) {
          padding: 0 10px;
        }

      }
    }

    .switchDisplay {
      border-radius: v-bind(borderTopLeftRadius) v-bind(borderTopRightRadius) v-bind(borderBottomRightRadius) v-bind(borderBottomLeftRadius);
      position: absolute;
      z-index: 2;
      top: 0;
      right: v-bind(rightDis);
      height: 400px;
      width: 350px;
      padding: 20px;
      background-image: url("https://img.mwxblog.com/bg/blog.jpg");
      background-size: 105%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: all .7s ease-in-out;

      &:hover {
        background-size: 100%;
      }

      .switch {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;

        .title {
          font-size: 25px;
          color: #E5EAF3;
          font-weight: bold;
        }
      }

    }

    @include respond-to('phone') {
      .login {
        border-radius: 15px;
      }
      .register {
        display: none;
      }
      .switchDisplay {
        display: none;
      }
    }
  }
}
</style>
