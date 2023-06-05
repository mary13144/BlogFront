<script setup lang="ts">
import type {FormRules} from 'element-plus'
import {onMounted, reactive, ref} from "vue";
import {JWT, QQ} from "@/types";
import {SetupQuery, SetupUpdate} from "@/api/system";
import {useRouter} from "vue-router";
//form表单验证规则
const rules_qq = reactive<FormRules>({
  app_id: [
    {required: true, message: 'Please input app_id', trigger: 'change'},
  ],
  key: [
    {required: true, message: 'Please input key', trigger: 'change'},
  ],
  redirect: [
    {required: true, message: 'Please input redirect', trigger: 'change'},
  ],
})
const rules_jwt = reactive<FormRules>({
  expires: [
    {required: true, message: 'Please input expires', trigger: 'change'},
  ],
  issuer: [
    {required: true, message: 'Please input issuer', trigger: 'change'},
  ],
  secret: [
    {required: true, message: 'Please input secret', trigger: 'change'},
  ],
})
//响应式变量--------------------------------------------------------------------
const qqData = ref<QQ>({
  app_id: "",
  key: "",
  redirect: ""
})
const jwtData = ref<JWT>({
  expires: "",
  issuer: "",
  secret: ""
})
const router = useRouter()
//函数-------------------------------------------------------------------------
//加载
const loadingData = async () => {
  let res = await Promise.all([SetupQuery<QQ>("qq"), SetupQuery<JWT>("jwt")])
  if (res[0].code | res[1].code) {
    ElMessage.error(res[0].code ? res[0].msg : res[1].msg)
    return
  }
  qqData.value = res[0].data as QQ
  jwtData.value = res[1].data as JWT
}
//更新
const updateData = async () => {
  let res = await Promise.all([SetupUpdate<QQ>("qq", qqData.value), SetupUpdate<JWT>("jwt", jwtData.value)])
  if (res[0].code | res[1].code) {
    ElMessage.error(res[0].code ? res[0].msg : res[1].msg)
    return
  }
  ElMessage.success("更新成功,请重新登陆")
  setTimeout(() => {
    router.push({
      name: "login"
    })
  }, 1000)
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
        其他配置
      </div>
      <el-form :rules="rules_qq" :model="qqData" status-icon label-width="160px" size="default"
               style="font-weight: bold">
        <div class="qq_setting">
          <div class="subTitle">
            qq登陆配置
          </div>
          <el-divider border-style="dashed" style="margin: 10px 0 10px 0"/>
          <el-form-item label="APPID：" prop="app_id">
            <el-input v-model="qqData.app_id" placeholder="请输入APPID"/>
          </el-form-item>
          <el-form-item label="Key：" prop="key">
            <el-input v-model="qqData.key" placeholder="请输入Key"/>
          </el-form-item>
          <el-form-item label="回调地址：" prop="redirect">
            <el-input v-model="qqData.redirect" placeholder="请输入回调地址"/>
          </el-form-item>
        </div>
      </el-form>
      <el-form :rules="rules_jwt" :model="jwtData" status-icon label-width="160px" size="default"
               style="font-weight: bold">
        <div class="jwt_setting">
          <div class="subTitle">
            JWT配置
          </div>
          <el-divider border-style="dashed" style="margin: 10px 0 10px 0"/>
          <el-form-item label="Secret：" prop="secret">
            <el-input v-model="jwtData.secret" placeholder="请输入Secret"/>
          </el-form-item>
          <el-form-item label="过期时间（hour）：" prop="expires">
            <el-input-number v-model="jwtData.expires"/>
          </el-form-item>
          <el-form-item label="签发人昵称：" prop="issuer">
            <el-input v-model="jwtData.issuer" placeholder="请输入签发人昵称"/>
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

    .qq_setting, .jwt_setting {
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