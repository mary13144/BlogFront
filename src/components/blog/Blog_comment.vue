<script setup lang="ts">
import {computed, inject, ref} from "vue";
import type {CommentItem, News} from "@/types";
import {getFormatDate} from "@/utils/date";
import {useBlogStore, useLoginStore} from "@/stores";
//@ts-ignore
import {ElMessage, ElMessageBox} from "element-plus";
import {CommentDelete, CommentsDigg} from "@/api/blog";
import {NewsHistory} from "@/api/user";

const props = defineProps<{
  is_sub?: boolean,
  to_name?: string,
  comment: CommentItem
}>()
const emits = defineEmits(['commentChange', 'diggChange', "loadingHandler"])
const loginStore = useLoginStore()
const blogStore = useBlogStore()
const isShow = computed(() => {
  return loginStore.token.user.role == 1 || loginStore.token.user.user_id == props.comment.user_id
})
const messageShow = ref<boolean>(false)
const title = ref<string>("")
const newsHistory = ref<News[]>([])
const content = ref<string>("")
const recUser = ref<{
  id: number
  avatar: string
  nickname: string
}>({
  avatar: "",
  id: 0,
  nickname: ""
})


const avatar_size = computed(() => {
  return props.is_sub ? 40 : 'large'
})
const name_size = computed(() => {
  return props.is_sub ? '1rem' : '1.5rem'
})
const sign_size = computed(() => {
  return props.is_sub ? '0.75rem' : '0.875rem'
})

const comment_number = inject("comment") as Function
const replyHandler = () => {
  emits('commentChange', props.comment.id, props.comment.article_id)
}

const diggHandler = async () => {
  let is_digg = !blogStore.comment_digg.includes(props.comment.id);
  let res = await CommentsDigg(props.comment.id, is_digg)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  if (is_digg) {
    blogStore.comment_digg.push(props.comment.id)
    emits('diggChange', props.comment, true)
  } else {
    blogStore.comment_digg.splice(blogStore.comment_digg.indexOf(props.comment.id), 1)
    emits('diggChange', props.comment, false)
  }
}

const deleteHandler = async () => {
  let res = await CommentDelete(props.comment.id)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  emits('loadingHandler')
  if (!props.is_sub) {
    comment_number(false)
  }
  emits("commentChange", undefined, props.comment.article_id)
}

let socket: WebSocket
//函数------------------------------------------------------------------------
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
const replyDisplay = async () => {
  if (props.comment.user_id == loginStore.token.user.user_id) {
    return
  }
  title.value = `与${props.comment.user.nick_name}的对话`
  messageShow.value = true
  //获取聊天历史
  await getHistory(props.comment.user_id)
  //获取对方信息
  recUser.value.id = props.comment.user_id
  recUser.value.avatar = props.comment.user.avatar
  recUser.value.nickname = props.comment.user.nick_name
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
  socket = new WebSocket(`wss://${location.host}/ws/api/messages/link?rec_id=${recUser.value.id}&send_id=${loginStore.token.user.user_id}`)
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
</script>

<template>
  <div class="blog_comment">
    <div class="left">
      <el-avatar :size="avatar_size" :src="props.comment.user.avatar" @click="replyDisplay"/>
      <div class="reply_wrapper">
        <el-dialog
            v-model="messageShow"
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
                <el-button type="danger" size="default" @click="messageShow = false">关闭</el-button>
                <el-button type="primary" size="default" @click="sendMessage">发送</el-button>
              </div>
            </div>
          </template>
        </el-dialog>
      </div>
    </div>
    <div class="right">
      <div class="info">
        <div class="user">
          <div class="name">
            <span>{{ props.comment.user.nick_name }}</span>
            <template v-if="props.is_sub">
              <em>to</em>
              <span>{{ props.to_name }}</span>
            </template>
          </div>
          <div class="like" @click="diggHandler">
            <i :class="{'iconfont':true,'icon-xihuan1':true,'active':blogStore.comment_digg.includes(props.comment.id)}"></i>
            <span>{{ props.comment.digg_count }}</span>
          </div>
        </div>
        <div class="sign">
          {{ props.comment.user.sign }}
        </div>
      </div>
      <div class="content">
        {{ props.comment.content }}
      </div>
      <div class="action">
        <div class="time">
          {{ getFormatDate(props.comment.created_at) }}
        </div>
        <span @click="replyHandler">回复</span>
        <span v-if="isShow" @click="deleteHandler">删除</span>
      </div>
      <div class="sub_comment">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.blog_comment {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 15px;

  .left {
    .el-avatar {
      cursor: pointer;
      border: 2px solid var(--bg);

      &:hover {
        border: 2px solid var(--theme);
      }
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

  .right {
    width: 100%;
    margin-left: 10px;
    display: flex;
    flex-direction: column;

    .info {
      width: 100%;
      margin-bottom: 20px;

      .user {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;

        .name {
          display: flex;
          align-items: center;
          color: var(--theme);
          font-size: v-bind(name_size);
          font-weight: bold;

          em {
            margin: 0 5px;
            font-size: 0.5rem;
          }
        }

        .like {
          display: flex;
          width: 40px;
          justify-content: space-between;
          align-items: center;
          line-height: 20px;
          font-size: 20px;

          i {
            font-size: 20px;
            margin-right: 5px;
            cursor: pointer;

            &.active {
              color: red;
            }
          }
        }

      }

      .sign {
        font-size: v-bind(sign_size);
      }
    }

    .content {
      color: var(--text_light);
      font-weight: bold;
      margin-bottom: 10px;
    }

    .action {
      color: var(--text_light);
      display: flex;
      align-items: center;
      font-size: 0.875rem;

      .time {
        margin-right: 15px;
      }

      span {
        cursor: pointer;
        margin-right: 5px;

        &:last-of-type {
          margin-right: 0;
        }
      }
    }

    .sub_comment {
      width: 100%;
    }
  }
}
</style>