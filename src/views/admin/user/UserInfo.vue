<script setup lang="ts">
import type {FormRules} from 'element-plus'
import {ElMessage, ElMessageBox} from "element-plus";
import {onMounted, reactive, ref} from "vue";
import type {EmailUpdate, PwdUpdate, Result, UserPersonalInfo} from "@/types";
import {UserEmail, UserPwd, UserQuery, UserUpdate} from "@/api/user";
import {Plus} from "@element-plus/icons-vue";
import {ParesToken} from "@/utils/token";
import {useAdminStore, useLoginStore} from "@/stores";
import {useRouter} from "vue-router";
import {Logout} from "@/api/login";
//form表单验证规则
const checkEmail = (rule: any, value: any, callback: any) => {//邮箱校验
  const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  if (!value) {
    return callback(new Error('邮箱不能为空'))
  }
  setTimeout(() => {
    if (mailReg.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的邮箱格式'))
    }
  }, 100)
}
const checkPwd = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('确认密码不能为空'))
  }
  setTimeout(() => {
    if (pwd.value.new_pwd == value) {
      callback()
    } else {
      callback(new Error('两次密码输入不一致，请重新输入'))
    }
  }, 100)
}
const rules = reactive<FormRules>({
  nick_name: [
    {required: true, message: 'Please input nick_name', trigger: 'blur'},
    {min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur'},
  ],
  new_email: [
    {validator: checkEmail, trigger: 'blur'},
  ],
  confirm_email: [
    {validator: checkEmail, trigger: 'blur'},
  ],
  old_pwd: [
    {required: true, message: 'Please input oldPassword', trigger: 'blur'},
  ],
  new_pwd: [
    {required: true, message: 'Please input newPassword', trigger: 'blur'},
  ],
  confirm_pwd: [
    {validator: checkPwd, trigger: 'blur'},
  ],
})
//响应式变量--------------------------------------------------------------------
const PersonalInfo = ref<UserPersonalInfo>({
  addr: "",
  avatar: "",
  email: "",
  link: "",
  nick_name: "",
  role: "",
  sign: "",
  sign_status: ""
})
const EmailShow = ref<boolean>(false)
const PasswordShow = ref<boolean>(false)
const token = localStorage.getItem("token")
const email = ref<EmailUpdate>({
  code: "",
  confirm_email: "",
  new_email: "",
  old_email: ""
})
const pwd = ref<PwdUpdate>({
  confirm_pwd: "",
  new_pwd: "",
  old_pwd: ""
})
//发送验证码
const isDisable = ref<boolean>(false)
const buttonInner = ref<string>("发送")
const loginStore = useLoginStore()
const router = useRouter()
const adminStore = useAdminStore()

//函数-------------------------------------------------------------------------
//加载setInfo
const loadingData = async () => {
  let res = await UserQuery()
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  PersonalInfo.value = res.data
}
//更新setInfo
const updateData = async () => {
  if (PersonalInfo.value.nick_name == "" || PersonalInfo.value.nick_name.length < 3) {
    ElMessage.error("昵称不能为空或长度小于3")
    return
  }
  let res = await UserUpdate({
    nick_name: PersonalInfo.value.nick_name,
    sign: PersonalInfo.value.sign,
    link: PersonalInfo.value.link
  })
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  //持久化
  localStorage.setItem("token", res.data)
  let token = ParesToken(res.data)
  token.exp *= 1000
  loginStore.setting(token)
  await loadingData()
}
//头像上传成功
const handlerSuccess = async (response: Result<{ token: string, path: string }>) => {
  PersonalInfo.value.avatar = response.data.path
  ElMessage.success("更新成功")

  //持久化
  localStorage.setItem("token", response.data.token)
  let token = ParesToken(response.data.token)
  token.exp *= 1000
  loginStore.setting(token)
  await loadingData()
}
//头像上传失败
const handlerError = (error: Error) => {
  ElMessage.error(error.message)
}
//绑定邮箱
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
const handlerEmail = async (flag: boolean) => {
  if (flag) {
    const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
    if (!mailReg.test(email.value.new_email) || !mailReg.test(email.value.confirm_email)) {
      ElMessage.error("请输入正确的邮箱格式")
      return
    }
    if (email.value.new_email != email.value.confirm_email) {
      ElMessage.error("两次邮箱输入不一致")
      return
    }
    if (email.value.code == "") {
      ElMessage.error("请输入验证码")
      return
    }
  } else {
    email.value.old_email = PersonalInfo.value.email
  }
  let res = await UserEmail(email.value, flag)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  if (!flag) {
    timeDisplay()
  } else {
    await loadingData()
    email.value = {
      code: "",
      confirm_email: "",
      new_email: "",
      old_email: ""
    }
    EmailShow.value = false
  }
}

const handlerPwd = async () => {
  if (pwd.value.new_pwd != pwd.value.confirm_pwd) {
    ElMessage.error("两次密码输入不一致，请重新输入")
    return
  }
  //密码为八位及以上并且大小写字母数字特殊字符三项都包括
  let strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
  if (!strongRegex.test(pwd.value.new_pwd)) {
    ElMessage.warning("请至少使用大小写字母、数字、符号两种类型组合的密码，长度至少为8位")
    return
  }
  let res = await UserPwd(pwd.value)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  await router.push({
    name: "login"
  })
}

const handlerLogout = () => {
  ElMessageBox.confirm(
      '你确定要注销登录吗？',
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        draggable: true,
        buttonSize: "default"
      })
      .then(async () => {
        let res = await Logout()
        if (res.code) {
          ElMessage.error(res.msg)
          return
        }
        ElMessage.success(res.msg)
        loginStore.clear()
        await router.push({
          name: "login"
        })
      })
      .catch(() => {
      })
}
//生命周期钩子函数
onMounted(() => {
  loadingData()
})
</script>

<template>
  <div class="bg">
    <div class="info">
      <div class="title">
        个人信息
      </div>
      <el-form :rules="rules" :model="PersonalInfo" status-icon label-width="140px" size="default"
               style="font-weight: bold">
        <div class="user_info">
          <div class="subTitle">
            个人信息
          </div>
          <el-divider border-style="dashed" style="margin: 10px 0 10px 0"/>
          <el-form-item label="头像：">
            <el-upload
                action="/api/users/avatar"
                method="put"
                name="image"
                :show-file-list="false"
                :headers="{Authorization:'Bearer ' + token}"
                :on-success="handlerSuccess"
                :on-error="handlerError"
                auto-upload
                class="upload">
              <el-avatar class="upload-img" v-if="PersonalInfo.avatar" :src="PersonalInfo.avatar"/>
              <el-icon v-else class="uploader-icon">
                <Plus/>
              </el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="昵称：" prop="nick_name">
            <el-input @blur="updateData" v-model.trim="PersonalInfo.nick_name" placeholder="请输入昵称"/>
          </el-form-item>
          <el-form-item label="我的签名：">
            <el-input @blur="updateData" type="textarea" v-model.trim="PersonalInfo.sign" placeholder="请输入你的签名"/>
          </el-form-item>
          <el-form-item label="Github链接：">
            <el-input @blur="updateData" v-model.trim="PersonalInfo.link" placeholder="请输入Github链接"/>
          </el-form-item>
          <el-form-item label="我的邮箱：">
            <el-text type="info">{{ PersonalInfo.email }}</el-text>
          </el-form-item>
          <el-form-item label="我的地址：">
            <el-text type="info">{{ PersonalInfo.addr }}</el-text>
          </el-form-item>
          <el-form-item label="角色权限：">
            <el-text type="info">{{ PersonalInfo.role }}</el-text>
          </el-form-item>
          <el-form-item label="注册来源：">
            <el-text type="info">{{ PersonalInfo.sign_status }}</el-text>
          </el-form-item>
        </div>
      </el-form>
      <div class="button_wrapper">
        <div class="subTitle">
          操作
        </div>
        <el-button type="primary" size="default" @click="EmailShow = true">绑定邮箱</el-button>
        <el-button type="primary" size="default" @click="PasswordShow = true">更改密码</el-button>
        <el-button type="danger" size="default" @click="handlerLogout">注销登陆</el-button>
      </div>
    </div>
    <div class="email">
      <el-dialog
          v-model="EmailShow"
          title="绑定邮箱"
          width="25%"
          draggable
          align-center
      >
        <el-divider border-style="dashed" style="margin: 0 0 10px 0"/>
        <div class="email_main">
          <el-form
              size="default"
              label-width="120px"
              :model="email"
              :rules="rules"
              status-icon
          >
            <el-form-item label="邮箱：">
              <el-text type="primary" size="large">{{ PersonalInfo.email }}</el-text>
            </el-form-item>

            <el-form-item label="新邮箱：" prop="new_email">
              <el-input
                  v-model.trim="email.new_email"
                  clearable
                  placeholder="请输入新邮箱"
              />
            </el-form-item>
            <el-form-item label="确认新邮箱：" prop="confirm_email">
              <el-input
                  v-model.trim="email.confirm_email"
                  clearable
                  placeholder="请再次输入新邮箱"
              />
            </el-form-item>
            <el-form-item label="验证码：" class="email_button">
              <el-input
                  v-model.trim="email.code"
                  clearable
                  placeholder="请输入验证码"
                  style="width: 60%"
              />
              <el-button
                  @click="handlerEmail(false)"
                  :disabled="isDisable"
                  type="primary">
                {{ buttonInner }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-divider border-style="dashed" style="margin: 0 0 10px 0"/>
        <template #footer>
              <span class="dialog-footer">
                <el-button @click="EmailShow = false" size="default">Cancel</el-button>
                <el-button type="primary" @click="handlerEmail(true)" size="default">
                  OK
                </el-button>
              </span>
        </template>
      </el-dialog>
    </div>
    <div class="password">
      <el-dialog
          v-model="PasswordShow"
          title="修改密码"
          width="25%"
          draggable
          align-center
      >
        <el-divider border-style="dashed" style="margin: 0 0 10px 0"/>
        <div class="password_main">
          <el-form
              size="default"
              label-width="120px"
              :model="pwd"
              :rules="rules"
              status-icon
          >
            <el-form-item label="原密码：" prop="old_pwd">
              <el-input
                  v-model.trim="pwd.old_pwd"
                  clearable
                  placeholder="请输入原密码"
              />
            </el-form-item>

            <el-form-item label="新密码：" prop="new_pwd">
              <el-input
                  v-model.trim="pwd.new_pwd"
                  clearable
                  show-password
                  placeholder="请输入新密码"
              />
            </el-form-item>
            <el-form-item label="确认新密码：" prop="confirm_pwd">
              <el-input
                  v-model.trim="pwd.confirm_pwd"
                  clearable
                  show-password
                  placeholder="请确认新密码"
              />
            </el-form-item>
          </el-form>
        </div>
        <el-divider border-style="dashed" style="margin: 0 0 10px 0"/>
        <template #footer>
              <span class="dialog-footer">
                <el-button @click="PasswordShow = false" size="default">Cancel</el-button>
                <el-button type="primary" @click="handlerPwd" size="default">
                  OK
                </el-button>
              </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bg {
  width: 100%;
  height: 100%;
  background-color: var(--bg);
  padding: 30px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  overflow-y: auto;

  .info {
    width: 1000px;


    .title {
      text-align: center;
      font-size: 25px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .user_info, .button_wrapper {
      padding-bottom: 40px;

      .subTitle {
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;

        &::before {
          display: inline-block;
          content: "";
          width: 3px;
          height: 1.5rem;
          background-color: var(--active);
          margin-right: 5px;
        }

      }

      .upload {
        margin: 10px 0 0 10px;
        display: flex;
        width: 80px;
        height: 80px;
        padding: 5px;
        border-radius: 50%;
        border: 1px dashed #424243;
        align-items: center;
        justify-content: center;

        :deep(.el-upload) {
          width: 100%;
          height: 100%;
        }

        .upload-img {
          width: 100%;
          height: 100%;
        }

        .uploader-icon {
          font-size: 20px;
          color: #424243;
        }
      }
    }

  }

  .email {
    :deep(.el-dialog__body) {
      padding: 0;
    }

    .email_main {
      padding: 10px 40px;

      .email_button {
        :deep(.el-form-item__content) {
          display: flex;
          justify-content: space-between;

        }
      }

      :deep(.el-button) {
        width: 60px;
        margin-right: 20px;
      }
    }
  }

  .password {
    :deep(.el-dialog__body) {
      padding: 0;
    }

    .password_main {
      padding: 10px 40px;
    }
  }

}
</style>