<script setup lang="ts">
const props = defineProps<{
  is_article: boolean
}>()
</script>

<template>
  <div class="blog_user">
    <div class="avatar">
      <el-avatar
          :size="120"
          src="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F179362e0-6104-4a5e-a423-e4bf670f04a9%2F01863-3890217792-analog_style_chromav5_nvinkpunkextremely_detaile.jpg?table=block&id=6f06c286-fb33-4fb7-8c53-25cfdc68503a"/>
    </div>
    <div class="user">
      <div class="name">
        Thomas
      </div>
      <div class="sign">
        计算机硕士在读，乐于探索互联网新技术，前端技术爱好者
      </div>
    </div>
    <div class="link">
      <div class="github">
        <a href="#">
          <i class="iconfont icon-github"/>
        </a>
      </div>
      <div class="qq">
        <a href="#">
          <i class="iconfont icon-QQ"/>
        </a>
      </div>
    </div>
    <div class="other_info">
      <div class="user_info" v-if="!props.is_article">
        <div class="count_data">
          <div class="title">
            文章
          </div>
          <div class="count">
            14
          </div>
        </div>
        <div class="count_data">
          <div class="title">
            分类
          </div>
          <div class="count">
            8
          </div>
        </div>
      </div>
      <div class="article_info" v-else>

      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.blog_user {
  width: 100%;
  height: 400px;
  background-color: var(--bg);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text);

  .avatar {
    display: flex;
    align-items: center;
    height: 35%;
  }

  .user {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 20px;
    height: 35%;
    justify-content: space-evenly;

    .name {
      font-size: 25px;
      font-weight: bold;
    }

    .sign {
      text-align: center;
      line-height: 26px;
    }
  }

  .link {
    width: 100%;
    height: 10%;
    display: flex;
    justify-content: center;
    align-items: center;

    a {
      text-decoration: none;

      i {
        font-size: 30px;
        color: var(--theme);
      }
    }

    .github {
      margin-right: 20px;
    }

  }

  .other_info {
    width: 100%;
    height: 20%;

    .user_info {
      width: 100%;
      height: 100%;
      padding: 0 20px;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .count_data {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        font-weight: bold;

        .title {
          font-size: 20px;

        }

        .count {
          font-size: 18px;
        }
      }

    }
  }
}
</style>