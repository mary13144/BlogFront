<script setup lang="ts">
import type {FormRules} from 'element-plus'
import {ElMessage} from "element-plus";
import {onMounted, reactive, ref} from "vue";
import type {Email} from "@/types";
import {SetupQuery, SetupUpdate} from "@/api/system";
//form表单验证规则
const rules = reactive<FormRules>({
  host: [
    {required: true, message: 'Please input host', trigger: 'change'},
  ],
  port: [
    {required: true, message: 'Please input port', trigger: 'change'},
  ],
  user: [
    {required: true, message: 'Please input user', trigger: 'change'},
  ],
  password: [
    {required: true, message: 'Please input password', trigger: 'change'},
  ],
  default_from_email: [
    {required: true, message: 'Please input default_from_email', trigger: 'change'},
  ],
})
//响应式变量--------------------------------------------------------------------
const setData = ref<Email>({
  default_from_email: "",
  host: "",
  password: "",
  port: 0,
  use_ssl: false,
  user: "",
  user_tls: false
})
//函数-------------------------------------------------------------------------
//加载setInfo
const loadingData = async () => {
  let res = await SetupQuery<Email>("email")
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  setData.value = res.data
}
//更新setInfo
const updateData = async () => {
  let res = await SetupUpdate<Email>("email", setData.value)
  console.log(res)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
}
//生命周期钩子函数
onMounted(() => {
  loadingData()
})
</script>

<template>
  <div class="bg">
    <div class="setting">
      <div class="title">
        邮件设置
      </div>
      <el-form :rules="rules" :model="setData" status-icon label-width="140px" size="default"
               style="font-weight: bold">
        <div class="email_setting">
          <div class="subTitle">
            验证码邮箱设置
          </div>
          <el-divider border-style="dashed" style="margin: 10px 0 10px 0"/>
          <el-form-item label="邮箱地址：" prop="host">
            <el-input v-model="setData.host" placeholder="请输入邮箱地址"/>
          </el-form-item>
          <el-form-item label="邮箱端口：" prop="port">
            <el-input v-model="setData.port" placeholder="请输入邮箱端口"/>
          </el-form-item>
          <el-form-item label="邮箱账号：" prop="user">
            <el-input v-model="setData.user" placeholder="请输入邮箱账号"/>
          </el-form-item>
          <el-form-item label="邮箱密码：" prop="password">
            <el-input v-model="setData.password" placeholder="请输入邮箱密码"/>
          </el-form-item>
          <el-form-item label="默认发件人名称：" prop="default_from_email">
            <el-input v-model="setData.default_from_email" placeholder="请输入默认发件人名称"/>
          </el-form-item>
          <el-form-item label="是否使用SSL：">
            <el-switch v-model="setData.use_ssl"></el-switch>
          </el-form-item>
          <el-form-item label="是否使用TLS：">
            <el-switch v-model="setData.user_tls"></el-switch>
          </el-form-item>
        </div>
      </el-form>
      <div class="button_wrapper" style="padding-bottom: 100px">
        <el-button type="primary" size="default" @click="updateData">更新设置</el-button>
      </div>
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

  .setting {
    width: 1000px;

    .title {
      text-align: center;
      font-size: 25px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .email_setting {
      margin-bottom: 40px;

      .subTitle {
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: bold;

        &::before {
          display: inline-block;
          content: "";
          width: 3px;
          height: 1.5rem;
          background-color: var(--active);
          margin-right: 5px;
        }
      }

    }

    .button_wrapper {
      display: flex;
      justify-content: right;
    }
  }


}
</style>