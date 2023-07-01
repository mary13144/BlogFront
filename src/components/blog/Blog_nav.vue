<script setup lang="ts">
import User from "@/components/User.vue";
import Theme from "@/components/Theme.vue";
import {useBlogStore, useLoginStore} from "@/stores";
import {computed, onMounted, ref, watch} from "vue";
import type {fullText, MenuBrief} from "@/types";
import {FullTextSearch, GetMenuBrief} from "@/api/blog";
//@ts-ignore
import {ElMessage} from "element-plus";
import {Search} from '@element-plus/icons-vue'
import {throttle} from "@/utils/throttle";
import Blog_menu from "@/components/blog/Blog_menu.vue";


const props = defineProps<{
  slogan: string
  en_slogan: string
}>()
const loginStore = useLoginStore()
const blogStore = useBlogStore()
const isLogin = computed(() => {
  return loginStore.token.user.role == 0
})
const isShow = ref<boolean>(true)
const SearchShow = ref<boolean>(false)
const key = ref<string>("")
const fulltext = ref<fullText[]>([])
const count = ref<number>(0)
const nav_show = ref<boolean>(false)
const oldScrollTop = ref<number>(0)
const data = ref<MenuBrief[]>([])
const icons = ["icon-shouye", "icon-sousuoleimu"]
const loadingData = async () => {
  let res = await GetMenuBrief()
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  data.value = res.data
}
const searchFulltext = async () => {
  let res = await FullTextSearch(key.value)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  fulltext.value = res.data.list
  count.value = res.data.count
  const parser = new DOMParser();
  for (const text of fulltext.value) {
    text.body = parser.parseFromString(text.body, 'text/html').body.textContent!;
  }
}

const skip = (location: string) => {
  window.open("/article/" + location, '_blank')
}
const scrollHandler = throttle(() => {
  const scrollTop = document.body.scrollTop ||
      document.documentElement.scrollTop;
  nav_show.value = scrollTop >= 600;
  isShow.value = !(nav_show.value && scrollTop > oldScrollTop.value);
  oldScrollTop.value = scrollTop
}, 100)
watch(() => blogStore.is_show, () => {
  nav_show.value = blogStore.is_show
  if (blogStore.is_show) {
    window.removeEventListener("scroll", scrollHandler)
  } else {
    window.addEventListener("scroll", scrollHandler)
  }
})
onMounted(() => {
  loadingData()
  window.addEventListener("scroll", scrollHandler)
})
</script>

<template>
  <Transition
      enterActiveClass="animate__animated animate__slideInDown animate__faster"
      leaveActiveClass="animate__animated animate__slideOutUp animate__faster">
    <div v-show="isShow" :class="{nav_container:true,nav_show:nav_show}">
      <div class="left">
        <div class="slogan_wrapper">
          <router-link to="/home" style="text-decoration: none">
            <div class="slogan">
              {{ props.slogan }}
              <div class="en_slogan">
                {{ props.en_slogan }}
              </div>
            </div>
          </router-link>
        </div>
        <div class="menu_wrapper">
          <Blog_menu/>
        </div>
      </div>
      <div class="right">
        <nav class="right_nav">
          <div class="nav_item" v-for="(item,index) in data">
            <router-link :to="{name:item.path,query:{
              id:item.id
            }}">
              <i :class="'iconfont '+icons[index]"></i>
              {{ item.title }}
            </router-link>
          </div>
          <div class="search">
            <a href="#" @click="SearchShow = !SearchShow">
              <i class="iconfont icon-sousuo" style="font-size: 30px"></i>
            </a>
            <el-dialog
                v-model="SearchShow"
                width="40%"
                :show-close="false"
                style="border-radius: 10px"
                draggable
            >
              <template #header>
              <span style="font-size: 20px;font-weight: bold">
                全文搜索
              </span>
              </template>
              <div class="search_input">
                <el-input
                    v-model="key"
                    size="large"
                    placeholder="Please Input"
                    clearable
                    autosize
                    :suffix-icon="Search"
                    @keydown.enter="searchFulltext"
                />
              </div>
              <div class="search_result">
                <div class="search_item" v-for="item in fulltext" :key="item.id" @click="skip(item.slug)">
                  <div class="search_title">
                    {{ item.title }}
                  </div>
                  <div class="search_text" v-html="item.body">
                  </div>
                </div>
              </div>
              <template #footer v-if="fulltext.length>0">
                <div style="display:flex;align-items: center;justify-content: center">
                  共搜索到{{ count }}条
                </div>
              </template>
            </el-dialog>
          </div>

        </nav>
        <div class="login_wrapper">
          <div class="login" v-if="isLogin">
            <router-link :to="{name:'login',query:{redirect_url:$route.path}}" class="login_link">
              登陆
            </router-link>
          </div>
          <div v-if="!isLogin" class="user_wrapper">
            <User :is-avatar="false" id="user"/>
          </div>
          <div class="theme_wrapper">
            <Theme class="theme"/>
          </div>
        </div>
      </div>

    </div>
  </Transition>
</template>

<style scoped lang="scss">
.nav_container {
  position: fixed;
  z-index: 999;
  top: 0;
  width: 100%;
  height: 60px;
  padding: 0 80px;
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #FFFFFF;

  a {
    color: #FFFFFF;

    &:hover {
      color: var(--theme);
    }

    &.router-link-active {
      color: var(--theme);
    }
  }

  .left {
    .slogan_wrapper {
      padding: 5px;
      cursor: pointer;
      transition-duration: .2s;

      .slogan {
        line-height: 18px;
        font-size: 18px;
        font-weight: bold;
        display: flex;
        flex-direction: column;
        align-items: center;

        .en_slogan {
          font-size: 12px;
        }
      }

      &:hover {
        transform: scale(1.1);
      }
    }

    .menu_wrapper {
      display: none;
    }
  }

  .right {
    justify-items: flex-end;
    display: flex;

    .right_nav {
      display: flex;
      align-items: center;
      margin-right: 40px;

      .nav_item {
        font-weight: bold;
        letter-spacing: 0.05rem;
        padding: 0.25rem 1rem 0.25rem 0.5rem;
        position: relative;

        &:after {
          content: "";
          position: absolute;
          border-bottom: 2px solid var(--theme);
          left: 51%;
          right: 51%;
          bottom: 0;
          transition: all .2s;
        }

        &:hover:after {
          left: 0;
          right: 0;
        }
      }

      a {
        display: flex;
        align-items: center;
        text-decoration: none;

        i {
          font-size: 20px;
          margin-right: 5px;
        }
      }

      .search {
        :deep(.el-icon) {
          font-size: 18px;
        }

        .search_result {
          margin-top: 10px;
          max-height: 50vh;
          overflow-y: auto;

          .search_item {
            cursor: pointer;
            padding: 10px 20px;

            &:hover {
              background-color: var(--main_bg);
            }

            .search_title {
              font-weight: bold;
              font-size: 18px;
            }

            .search_text {
              margin-top: 8px;
              color: var(--text);
              display: -webkit-box; /* 使用弹性盒子布局 */
              -webkit-box-orient: vertical; /* 垂直方向排列 */
              -webkit-line-clamp: 2; /* 限制内容显示的行数 */
              overflow: hidden; /* 隐藏溢出部分 */
              text-overflow: ellipsis; /* 使用省略号表示溢出内容 */
            }
          }
        }
      }
    }

    .min_right {
      display: none;
    }

    .login_wrapper {
      display: flex;
      align-items: center;
      font-weight: bold;

      .login {
        margin-right: 1rem;

        a {
          text-decoration: none;
        }
      }

      .user_wrapper {
        margin-right: 1rem;

        :deep(.el-dropdown-link) {
          color: #FFFFFF;
        }
      }

      .theme_wrapper {
        .theme {
          font-size: 25px;
        }
      }
    }

  }

}

@include respond-to('pad') {
  .nav_container {
    padding: 0 20px;

    .left {
      .slogan_wrapper {
        display: none;
      }

      .menu_wrapper {
        display: block;
      }
    }

    .right {
      .right_nav {
        display: none;
      }
    }
  }
}

@include respond-to('phone') {
  .nav_container {
    padding: 0 20px;

    .left {
      .slogan_wrapper {
        display: none;
      }

      .menu_wrapper {
        display: block;
      }
    }

    .right {
      .right_nav {
        display: none;
      }
    }
  }
}

.nav_show {
  background-color: var(--bg);
  box-shadow: 0 2px 2px rgba(0, 0, 0, .1);
  color: var(--text);

  a {
    color: var(--text);
  }

  #user {
    :deep(.el-dropdown-link) {
      color: var(--text);
    }
  }
}
</style>