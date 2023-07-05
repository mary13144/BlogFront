<script setup lang="ts">
import Admin_table from "@/components/admin/Admin_table.vue";
import type {News, TableColumn, UserMessage} from "@/types";
import {onMounted, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {NewsHistory, NewsQuery} from "@/api/user";
import {useLoginStore} from "@/stores";
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
    title: "最新消息内容",
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
const content = ref<string>("")
const loginStore = useLoginStore()
const recUser = ref<{
  id: number
  avatar: string
  nickname: string
}>({
  avatar: "",
  id: 0,
  nickname: ""
})

let socket: WebSocket
//函数------------------------------------------------------------------------
//加载信息
const loadingData = async () => {
  let res = await NewsQuery()
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
  //获取聊天历史
  await getHistory(data.user_id)
  //获取对方信息
  recUser.value.id = data.user_id
  recUser.value.avatar = data.avatar
  recUser.value.nickname = data.nick_name
  //建立链接
  websocketConn()
}

const beforeClose = (done: Function) => {
  ElMessageBox.confirm(
      '你确定要关闭吗?',
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        draggable: true,
        buttonSize: "default"
      })
      .then(() => {
        done()
        socket.close()
      })
      .catch(() => {
      })
}
const websocketConn = () => {
  socket = new WebSocket(`wss://${location.host}/api/messages/link?rec_id=${recUser.value.id}&send_id=${loginStore.token.user.user_id}`)
  let ele = document.getElementById("chat")!
  socket.onopen = function () {
    console.log("连接成功")
    setTimeout(() => {
      ele.scrollTop = ele.scrollHeight
    }, 100)
  }
  socket.onmessage = function (ev) {
    let content = ev.data
    newsHistory.value.push({
      content: content,
      rev_user_avatar: loginStore.token.user.avatar,
      rev_user_id: loginStore.token.user.user_id,
      rev_user_nick_name: loginStore.token.user.nick_name,
      send_user_avatar: recUser.value.avatar,
      send_user_id: recUser.value.id,
      send_user_nick_name: recUser.value.nickname,
      is_me: false,
    })
    setTimeout(() => {
      ele.scrollTop = ele.scrollHeight
    }, 100)
  }
  socket.onerror = function () {

  }
  socket.onclose = function () {
    console.log("关闭连接")
  }
}

const sendMessage = () => {
  socket.send(content.value)
  newsHistory.value.push({
    content: content.value,
    rev_user_avatar: recUser.value.avatar,
    rev_user_id: recUser.value.id,
    rev_user_nick_name: recUser.value.nickname,
    send_user_avatar: loginStore.token.user.avatar,
    send_user_id: loginStore.token.user.user_id,
    send_user_nick_name: loginStore.token.user.nick_name,
    is_me: true
  })
  content.value = ""
  let ele = document.getElementById("chat")!
  setTimeout(() => {
    ele.scrollTop = ele.scrollHeight
  }, 100)
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
          :before-close="beforeClose"
          draggable
          style="border-radius: 5px"
          class="reply"
      >
        <el-divider border-style="dashed" style="margin: 0 0 10px 0;"/>
        <div class="chat_body" id="chat">
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
        scroll-behavior: smooth;

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