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
const onUploadImg = async (files: File[], callback: Function) => {
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
  callback(res.map((item: any) => item.data));
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
        show-code-row-number
        preview-theme="vuepress"
        code-theme="github"
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

}
</style>