<script setup lang="ts">
import {Plus} from "@element-plus/icons-vue";
import {onMounted, reactive, ref} from "vue";
import type {Result, SetInfo} from "@/types";
import type {FormRules} from 'element-plus'
import {ElMessage} from "element-plus";
import {SetupQuery, SetupUpdate} from "@/api/system";
//form表单验证规则
const rules = reactive<FormRules>({
  bei_an: [
    {required: true, message: 'Please input bei_an', trigger: 'change'},
  ],
  github_url: [
    {required: true, message: 'Please input github_url', trigger: 'change'},
  ],
  qq_image: [
    {required: true, message: 'Please input qq_image', trigger: 'change'},
  ],
  slogan: [
    {required: true, message: 'Please input slogan', trigger: 'change'},
  ],
  slogan_en: [
    {required: true, message: 'Please input slogan_en', trigger: 'change'},
  ],
  wechat_image: [
    {required: true, message: 'Please input wechat_image', trigger: 'change'},
  ],
})
//响应式变量-------------------------------------------------------------
const token = localStorage.getItem("token")
const setData = ref<SetInfo>({
  bei_an: "",
  github_url: "",
  qq_image: "",
  slogan: "",
  slogan_en: "",
  wechat_image: ""
})
//函数-------------------------------------------------------------------
//加载setInfo
const loadingData = async () => {
  let res = await SetupQuery<SetInfo>("setinfo")
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  setData.value = res.data
}
//更新setInfo
const updateData = async () => {
  let res = await SetupUpdate<SetInfo>("setinfo", setData.value)
  console.log(res)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
}
//qq_image上传成功
const handlerSuccess_qq = async (response: Result<string>) => {
  console.log(response)
  setData.value.qq_image = response.data
  ElMessage.success("上传成功")
}
//qq_image上传失败
const handlerError_qq = (error: Error) => {
  ElMessage.error(error.message)
}
//wechat上传成功
const handlerSuccess_wechat = async (response: Result<string>) => {
  setData.value.wechat_image = response.data
  ElMessage.success("上传成功")
}
//wechat上传失败
const handlerError_wechat = (error: Error) => {
  ElMessage.error(error.message)
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
        项目配置
      </div>
      <el-form :rules="rules" :model="setData" status-icon label-width="120px" size="default"
               style="font-weight: bold">
        <div class="web_setting">
          <div class="subTitle">
            网站设置
          </div>
          <el-divider border-style="dashed" style="margin: 10px 0 10px 0"/>
          <el-form-item label="Slogan：" prop="slogan">
            <el-input v-model="setData.slogan" placeholder="请输入Slogan"/>
          </el-form-item>
          <el-form-item label="EngSlogan：" prop="slogan_en">
            <el-input v-model="setData.slogan_en" placeholder="请输入EngSlogan"/>
          </el-form-item>
          <el-form-item label="备案：" prop="bei_an">
            <el-input v-model="setData.bei_an" placeholder="请输入备案"/>
          </el-form-item>
        </div>
        <div class="user_info">
          <div class="subTitle">
            个人信息
          </div>
          <el-divider border-style="dashed" style="margin: 10px 0 10px 0"/>
          <el-form-item label="QQ：" prop="qq_image">
            <el-input v-model="setData.qq_image" placeholder="请上传QQ二维码"/>
            <el-upload
                action="/api/images/file"
                name="image"
                :show-file-list="false"
                :headers="{Authorization:'Bearer ' + token}"
                :on-success="handlerSuccess_qq"
                :on-error="handlerError_qq"
                auto-upload
                class="upload">
              <img v-if="setData.qq_image" :src="setData.qq_image" class="upload-img" alt="QQ"/>
              <el-icon v-else class="uploader-icon">
                <Plus/>
              </el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="微信：" prop="wechat_image">
            <el-input v-model="setData.wechat_image" placeholder="请上传微信二维码"/>
            <el-upload
                action="/api/images/file"
                name="image"
                :show-file-list="false"
                :headers="{Authorization:'Bearer ' + token}"
                :on-success="handlerSuccess_wechat"
                :on-error="handlerError_wechat"
                auto-upload
                class="upload">
              <img v-if="setData.wechat_image" :src="setData.wechat_image" class="upload-img" alt="WeChat"/>
              <el-icon v-else class="uploader-icon">
                <Plus/>
              </el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="Github：" prop="github_url">
            <el-input v-model="setData.github_url" placeholder="请输入Github地址"/>
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

    .web_setting, .user_info, .link_info {
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

      .upload {
        margin: 10px 0 0 10px;
        display: flex;
        width: 120px;
        height: 120px;
        padding: 5px;
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

    .button_wrapper {
      display: flex;
      justify-content: right;
    }
  }


}
</style>