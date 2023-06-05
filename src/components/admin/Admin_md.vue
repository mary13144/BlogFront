<script setup lang="ts">
import {MdEditor} from "md-editor-v3";
import 'md-editor-v3/lib/style.css';
import {useDark} from "@vueuse/core";
import axiosRequest from "@/service/axiosRequest";
import {onMounted, ref, watch} from "vue";

const isDark = useDark()
const props = defineProps<{
  mdContent: string,
}>()
const emits = defineEmits(['onSave', 'update:mdContent'])
const content = ref<string>("")
const editorRef = ref()
const onUploadImg = async (files, callback) => {
  const res = await Promise.all(
      files.map((file) => {
        return new Promise((rev, rej) => {
          const form = new FormData();
          form.append('image', file);
          axiosRequest
              .post<string>('/images/file', form, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
              .then((res) => rev(res))
              .catch((error) => rej(error));
        });
      })
  );
  callback(res.map((item) => item.data));
};
const onChange = (value: string) => {
  emits('update:mdContent', value)
}

watch(() => props.mdContent, () => {
  content.value = props.mdContent
})
onMounted(() => {
  editorRef.value?.focus()
})
</script>

<template>
  <div class="md_wrapper">
    <MdEditor
        class="md"
        v-model="content"
        ref="editorRef"
        :theme="isDark ? 'dark' : 'light'"
        @onUploadImg="onUploadImg"
        @onSave="emits('onSave')"
        @onChange="onChange"
    />
  </div>
</template>

<style scoped lang="scss">
.md_wrapper {
  width: 100%;
  height: 100%;

  .md {
    width: 100%;
    height: 100%;
    padding: 30px;
    border-radius: 15px;

  }

  .md-editor-dark {
    --md-color: #999;
    --md-hover-color: #bbb;
    --md-bk-color: #1D1E1F;
    --md-bk-color-outstand: #111;
    --md-bk-hover-color: #1b1a1a;
    --md-border-color: #2d2d2d;
    --md-border-hover-color: #636262;
    --md-border-active-color: #777;
    --md-modal-mask: #00000073;
    --md-scrollbar-bg-color: #0f0f0f;
    --md-scrollbar-thumb-color: #2d2d2d;
    --md-scrollbar-thumb-hover-color: #3a3a3a;
    --md-scrollbar-thumb-active-color: #3a3a3a;
  }
}
</style>