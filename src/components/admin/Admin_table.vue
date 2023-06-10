<script setup lang="ts">
import {TableColumn} from "@/types";
import {getFormatDateTime} from "@/utils/date";
import {ref} from "vue";
import {useDark} from "@vueuse/core";
//响应式变量------------------------------------------------------------------
const isDark = useDark()
const index = ref<number>(1)
//接收父组件传递的数据----------------------------------------------------------
const props = defineProps<{
  columns: TableColumn[],
  data: any[],
  isLoading: boolean,
  srcList?: string[],
  mutiDelete?: boolean,
}>()
const emits = defineEmits(["deleteData", "updateShow", "mutiDeleteShow", "mutiChangeData", "editorArticle"])
//函数------------------------------------------------------------------------
//编辑
const changeData = (data) => {
  emits("updateShow", data)
}
//文章编辑
const editorArticle = (id: string) => {
  emits('editorArticle', id)
}
//删除
const deleteItem = async (id: number) => {
  emits("deleteData", id)
}
//多选
const handleSelectionChange = (selection: any[]) => {
  if (selection.length > 0 && !props.mutiDelete) {
    emits("mutiDeleteShow")
  } else if (selection.length == 0) {
    emits("mutiDeleteShow")
  }
  emits("mutiChangeData", selection)
}
const className = function () {
  return 'tableHead'
}

const preview = (start: number) => {
  index.value = start
}

//列宽计算
const width = (item: TableColumn) => {
  if (item.prop == 'href') {
    return '400px'
  }
  if (item.prop == 'id') {
    return '50px'
  }
  if (item.prop == 'sort') {
    return '60px'
  }
  if (item.prop == 'banners') {
    return '280px'
  }
  if (item.prop == 'action') {
    return '165px'
  }
  if (item.prop == 'art_action') {
    return '240px'
  }
  if (item.prop == 'data') {
    return '200px'
  }
  if (item.prop == 'category') {
    return '100px'
  }
  if (item.prop == 'user_nick_name') {
    return '100px'
  }
  return 'auto'
}
</script>

<template>
  <div class="table_wrapper">
    <el-table v-loading="isLoading"
              element-loading-text="Loading"
              :data="props.data"
              style="width: 100%"
              size="large"
              :header-cell-class-name="className"
              @selection-change="handleSelectionChange"
              max-height="550">
      <slot name="select"></slot>
      <template #empty>
        <el-empty/>
      </template>
      <el-table-column v-for="item in props.columns" :width="width(item)" :label="item.title"
                       :prop="item.prop" align="center">
        <template #default="scope" v-if="item.avatar == true ">
          <div style="display: flex; align-items: center; justify-content: center">
            <el-avatar size="large" :src="scope.row?.avatar" v-if="item.prop == 'avatar'"/>
            <el-avatar size="large" :src="scope.row?.send_user_avatar" v-if="item.prop == 'send_user_avatar'"/>
            <el-avatar size="large" :src="scope.row?.rev_user_avatar" v-if="item.prop == 'rev_user_avatar'"/>
          </div>
        </template>
        <template #default="scope" v-if="item.prop == 'title' ">
          <div style="display: flex; align-items: center; justify-content: center">
            <span v-html="scope.row.title"></span>
          </div>
        </template>
        <template #default="scope" v-if="item.prop == 'img' ">
          <div style="display: flex; align-items: center; justify-content: center">
            <el-image
                v-if="scope.row?.path"
                @click.self="preview(scope.$index)"
                :initial-index="index"
                style="width: 110px; height: 65px;border-radius: 8px"
                :src="scope.row.path"
                fit="cover"
                loading="lazy"
                lazy
                :preview-src-list="props.srcList!"
                preview-teleported
            />
          </div>
          <div style="display: flex; align-items: center; justify-content: center">
            <el-image
                v-if="scope.row?.banner_url"
                @click.self="preview(scope.$index)"
                :initial-index="index"
                style="width: 110px; height: 65px;border-radius: 8px"
                :src="scope.row.banner_url"
                fit="cover"
                loading="lazy"
                lazy
                :preview-src-list="props.srcList!"
                preview-teleported
            />
          </div>
        </template>
        <template #default="scope" v-if="item.prop == 'banners' ">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px;">
            <el-image
                v-for="banner in scope.row.banners"
                style="height: 40px;border-radius: 8px"
                :src="banner.path"
                :key="banner.banner_id"
                fit="fill"
                loading="lazy"
                lazy
            />
          </div>
        </template>
        <template #default="scope" v-if="item.prop == 'date'">
          <div style="display: flex; align-items: center; justify-content: center">
            <el-tag :effect="isDark?'light':'dark'" size="large">{{
                getFormatDateTime(scope.row.created_at)
              }}
            </el-tag>
          </div>
        </template>
        <template #default="scope" v-if="item.prop == 'is_show'">
          <div style="display: flex; align-items: center; justify-content: center">
            <el-tag :effect="isDark?'light':'dark'" :type="scope.row.is_show ?'success':'info'" size="large">{{
                scope.row.is_show ? "显示" : "不显示"
              }}
            </el-tag>
          </div>
        </template>
        <template #default="scope" v-if="item.prop == 'is_read'">
          <div style="display: flex; align-items: center; justify-content: center">
            <el-tag :effect="isDark?'light':'dark'" :type="scope.row.is_read ?'success':'warning'" size="large">{{
                scope.row.is_show ? "已读" : "未读"
              }}
            </el-tag>
          </div>
        </template>
        <template #default="scope" v-if="item.prop == 'level'">
          <div style="display: flex; align-items: center; justify-content: center">
            <el-tag :effect="isDark?'light':'dark'" :type="scope.row.level=='info'?'info':'warning'" size="large">{{
                scope.row.level
              }}
            </el-tag>
          </div>
        </template>
        <template #default="scope" v-if="item.prop == 'href'">
          <div style="display: flex; align-items: center; justify-content: center">
            <el-link :href="scope.row.href" :underline="false" target="_blank">
              {{ scope.row.href.substring(0, 30) }}
            </el-link>
          </div>
        </template>
        <template #default="scope" v-if="item.prop == 'abstract'">
          <div style="display: flex; align-items: center; justify-content: center">
            <el-text>
              {{ scope.row.abstract.substring(0, 30) }}
            </el-text>
          </div>
        </template>
        <template #default="scope" v-if="item.prop == 'strings'">
          <div style="display: flex;flex-direction: column; align-items: center; justify-content: center">
            <el-text type="primary" v-for="subitem in scope.row.articles" v-if="scope.row?.articles">
              {{ subitem }}
            </el-text>
            <el-text type="primary" v-for="subitem in scope.row.abstract" v-if="scope.row?.abstract">
              {{ subitem }}
            </el-text>
          </div>
        </template>
        <template #default="scope" v-if="item.prop == 'data'">
          <div style="display: flex; align-items: center; justify-content: space-between">
            <div>
              <i class="iconfont icon-yueduliang" style="margin-right: 5px"/>
              <span>{{ scope.row.look_count }}</span>
            </div>
            <div>
              <i class="iconfont icon-dianzan" style="margin-right: 5px"/>
              <span>{{ scope.row.digg_count }}</span>
            </div>
            <div>
              <i class="iconfont icon-pinglun" style="margin-right: 5px"/>
              <span>{{ scope.row.comment_count }}</span>
            </div>
            <div>
              <i class="iconfont icon-shoucang" style="margin-right: 5px"/>
              <span>{{ scope.row.collects_count }}</span>
            </div>
          </div>
        </template>
        <template #default="scope" v-if="item.prop == 'tags'">
          <div style="display: grid;grid-template-columns: repeat(3,1fr);grid-column-gap: 5px;grid-row-gap: 5px">
            <el-tag :effect="isDark?'light':'dark'" v-for="(tag,index) in scope.row.tags"
                    :type="index%2==0?'success':'info'">
              {{ tag }}
            </el-tag>
          </div>
        </template>
        <template #default="scope" v-if="item.prop == 'message_count'">
          <div style="display: flex; align-items: center; justify-content: center">
            <el-tag :effect="isDark?'light':'dark'" type="success" size="large">
              {{ scope.row.message_count + " 条" }}
            </el-tag>
          </div>
        </template>
        <template #default="scope" v-if="item.prop == 'action' ">
          <div style="display: flex; align-items: center; justify-content: center">
            <el-button @click="changeData(scope.row)" type="primary" :plain="!!isDark" size="default">编辑</el-button>
            <el-button @click="deleteItem(scope.row.id)" type="danger" :plain="!!isDark" size="default">删除
            </el-button>
          </div>
        </template>
        <template #default="scope" v-if="item.prop == 'delete' ">
          <div style="display: flex; align-items: center; justify-content: center">
            <el-button @click="deleteItem(scope.row.id)" type="danger" :plain="!!isDark" size="default">删除
            </el-button>
          </div>
        </template>
        <template #default="scope" v-if="item.prop == 'art_action' ">
          <div style="display: flex; align-items: center; justify-content: center">
            <el-button @click="changeData(scope.row)" type="primary" :plain="!!isDark">编辑</el-button>
            <el-button @click="editorArticle(scope.row.id)" type="primary" :plain="!!isDark">正文编辑
            </el-button>
            <el-button @click="deleteItem(scope.row.id)" type="danger" :plain="!!isDark">删除</el-button>
          </div>
        </template>
        <template #default="scope" v-if="item.prop == 'answer' ">
          <div style="display: flex; align-items: center; justify-content: center">
            <el-button @click="changeData(scope.row)" type="primary" :plain="!!isDark" size="default">回复</el-button>
          </div>
        </template>
      </el-table-column>


    </el-table>
    <slot></slot>
  </div>
</template>

<style lang="scss">
.tableHead {
  background-color: var(--tableheader) !important;
  color: #1D1D1D;
}

em {
  font-size: 18px;
  font-weight: bold;
  color: red;
}
</style>