<script setup lang="ts">
import Admin_table from "@/components/admin/Admin_table.vue";
import type {News, TableColumn, UserMessage} from "@/types";
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import {NewsHistory, NewsQuery, SendNews} from "@/api/user";
//固定参数---------------------------------------------------------------------
const columns: TableColumn[] = [
  {
    title: "昵称",
    prop: "nick_name",
  },
  {
    title: "头像",
    prop: "avatar",
    avatar: true
  },
  {
    title: "消息内容",
    prop: "content",
  },
  {
    title: "消息总数",
    prop: "message_count",
  },
  {
    title: "最新消息时间",
    prop: "date",
  },
  {
    title: "操作",
    prop: "answer",
  },
]
//响应式变量-------------------------------------------------------------------
const newsData = ref<UserMessage[]>([])
const total = ref<number>(0)
const isLoading = ref<boolean>(false)
const isShow = ref<boolean>(false)
const title = ref<string>("")
const newsHistory = ref<News[]>([])
const revID = ref<number>(0)
const content = ref<string>("")
//函数------------------------------------------------------------------------
//加载信息
const loadingData = async () => {
  let res = await NewsQuery()
  console.log(res)
  console.log(res.data)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  newsData.value = res.data
}

//控制是否显示加载动画
const changeIsLoading = () => {
  isLoading.value = !isLoading.value
}
const getHistory = async (id: number) => {
  let res = await NewsHistory(id)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  newsHistory.value = res.data
  for (const news of newsHistory.value) {
    news.is_me = news.send_user_id != id;
  }
}
const replyDisplay = async (data: UserMessage) => {
  title.value = `与${data.nick_name}的对话`
  isShow.value = true
  revID.value = data.user_id
  await getHistory(data.user_id)
}

const sendMessage = async () => {
  if (content.value == "") {
    ElMessage.warning("消息不可为空")
    return
  }
  let res = await SendNews(revID.value, content.value)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  content.value = ""
  await getHistory(revID.value)
  await loadingData()
}

//生命周期钩子函数---------------------------------------------------------------
onMounted(() => {
  loadingData()
})
</script>

<template>
  <div class="bg">
    <div class="reply_wrapper">
      <el-dialog
          v-model="isShow"
          :title="title"
          width="35%"
          draggable
          style="border-radius: 5px"
          class="reply"
      >
        <el-divider border-style="dashed" style="margin: 0 0 10px 0;"/>
        <div class="chat_body">
          <div class="message">
            <div :class="item.is_me?'me':'you'" v-for="(item,index) in newsHistory" :key="index">
              <div class="avatar">
                <el-avatar size="default" :src="item.send_user_avatar"/>
              </div>
              <div class="message_main">
                <div class="message_nickname">
                  {{ item.send_user_nick_name }}
                </div>
                <div class="message_content">
                  <div class="text_message">
                    {{ item.content }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="chat_footer">
            <el-input @keydown.ctrl.enter="sendMessage" v-model.trim="content" autofocus resize="none" type="textarea"
                      rows="5" size="large"/>
            <div class="button">
              <el-button type="danger" size="default" @click="isShow = false">关闭</el-button>
              <el-button type="primary" size="default" @click="sendMessage">发送</el-button>
            </div>
          </div>
        </template>
      </el-dialog>
    </div>
    <div class="table_wrapper">
      <Admin_table
          :columns="columns"
          :data="newsData"
          :is-loading="isLoading"
          @updateShow="replyDisplay"
      >
      </Admin_table>
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
  position: relative;
  overflow-y: auto;

  .table_wrapper {
    margin: 20px 0;
  }

  .reply_wrapper {
    .reply {
      .chat_body {
        padding: 20px;
        height: 500px;
        overflow-y: auto;

        .message {
          & > div {
            display: flex;
            margin-bottom: 20px;

            .message_main {

              .message_nickname {
                font-weight: bold;
              }

              .message_content {
                margin-top: 10px;

                .text_message {
                  color: #202121;
                  background-color: var(--text_bg);
                  padding: 10px;
                  position: relative;
                  width: fit-content;
                  min-width: 41px;
                  white-space: pre;
                  border-radius: 5px;
                }

                .text_message::before {
                  content: "";
                  display: block;
                  position: absolute;
                  left: -22px;
                  top: 6px;
                  border-width: 8px 14px;
                  border-style: solid;
                  border-color: transparent var(--text_bg) transparent transparent;
                }
              }

            }
          }

          .me {
            flex-direction: row-reverse;
            justify-content: right;

            .message_main {
              margin-right: 20px;
              display: flex;
              flex-direction: column;
              align-items: end;

              .message_nickname {
                align-content: end;
              }

              .message_content {
                .text_message::before {
                  right: -22px;
                  left: inherit;
                  top: 6px;
                  border-width: 8px 14px;
                  border-style: solid;
                  border-color: transparent transparent transparent var(--text_bg);
                }
              }
            }
          }

          .you {
            .message_main {
              margin-left: 20px;
            }
          }
        }
      }

      .chat_footer {
        position: relative;

        .button {
          position: absolute;
          right: 20px;
          bottom: 10px;
        }
      }
    }

    :deep(.el-dialog__body) {
      padding: 0;
    }

    :deep(.el-dialog__footer) {
      padding: 10px;
    }

  }
}
</style>