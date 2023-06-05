<script setup lang="ts">
import type {FormRules} from 'element-plus'
import {ElMessage} from "element-plus";
import {onMounted, reactive, ref} from "vue";
import {QiNiu} from "@/types";
import {SetupQuery, SetupUpdate} from "@/api/system";
//form表单验证规则
const rules_qiniu = reactive<FormRules>({
  access_key: [
    {required: true, message: 'Please input access_key', trigger: 'change'},
  ],
  bucket: [
    {required: true, message: 'Please input bucket', trigger: 'change'},
  ],
  cdn: [
    {required: true, message: 'Please input cdn', trigger: 'change'},
  ],
  prefix: [
    {required: true, message: 'Please input prefix', trigger: 'change'},
  ],
  secret_key: [
    {required: true, message: 'Please input secret_key', trigger: 'change'},
  ],
  size: [
    {required: true, message: 'Please input size', trigger: 'change'},
  ],
  zone: [
    {required: true, message: 'Please input zone', trigger: 'change'},
  ],
})

//响应式变量--------------------------------------------------------------------
const qiniuData = ref<QiNiu>({
  access_key: "",
  bucket: "",
  cdn: "",
  enable: false,
  prefix: "",
  secret_key: "",
  size: 0,
  zone: ""
})

//函数-------------------------------------------------------------------------
//加载
const loadingData = async () => {
  let res = await SetupQuery<QiNiu>("qiniu")
  if (res.code) {
    ElMessage.error(res.msg)
  }
  qiniuData.value = res.data
}
//更新
const updateData = async () => {
  let res = await SetupUpdate<QiNiu>("qiniu", qiniuData.value)
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
        上传设置
      </div>
      <el-form :rules="rules_qiniu" :model="qiniuData" key="qiniu" status-icon label-width="160px" size="default"
               style="font-weight: bold">
        <div class="qiniu_setting">
          <div class="subTitle">
            七牛云上传配置
          </div>
          <el-divider border-style="dashed" style="margin: 10px 0 10px 0"/>
          <el-form-item label="是否启用七牛云：">
            <el-switch v-model="qiniuData.enable"></el-switch>
          </el-form-item>
          <el-form-item label="AccessKey：" prop="access_key">
            <el-input v-model="qiniuData.access_key" placeholder="请输入AccessKey"/>
          </el-form-item>
          <el-form-item label="SecretKey：" prop="secret_key">
            <el-input v-model="qiniuData.secret_key" placeholder="请输入SecretKey"/>
          </el-form-item>
          <el-form-item label="存储桶的名字：" prop="bucket">
            <el-input v-model="qiniuData.bucket" placeholder="请输入存储桶的名字"/>
          </el-form-item>
          <el-form-item label="CDN：" prop="cdn">
            <el-input v-model="qiniuData.cdn" placeholder="请输入CDN"/>
          </el-form-item>
          <el-form-item label="存储的地区：" prop="zone">
            <el-input v-model="qiniuData.zone" placeholder="请输入存储的地区"></el-input>
          </el-form-item>
          <el-form-item label="图片前缀：" prop="prefix">
            <el-input v-model="qiniuData.prefix" placeholder="请输入图片前缀"></el-input>
          </el-form-item>
          <el-form-item label="图片大小限制(MB)：" prop="size">
            <el-input-number v-model="qiniuData.size"></el-input-number>
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

    .qiniu_setting {
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