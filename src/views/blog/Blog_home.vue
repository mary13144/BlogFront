<script setup lang="ts">

import Blog_banner from "@/components/blog/Blog_banner.vue";
import Blog_tags from "@/components/blog/Blog_tags.vue";
import Blog_video from "@/components/blog/Blog_video.vue";
import Blog_user from "@/components/blog/Blog_user.vue";
import Blog_articlelist from "@/components/blog/Blog_articlelist.vue";
</script>

<template>
  <div class="blog_home">
    <div class="banner_wrapper">
      <Blog_banner :is_article="false" :id="1"></Blog_banner>
    </div>
    <div class="home_main">
      <div class="left">
        <Blog_articlelist/>
      </div>
      <div class="right">
        <div class="right_item">
          <Blog_user :is_article="false"/>
        </div>
        <div class="right_item">
          <Blog_tags/>
        </div>
        <div class="right_item">
          <Blog_video/>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.blog_home {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .banner_wrapper {
    width: 100%;
  }

  .home_main {
    margin-top: 40px;
    width: 70%;
    display: flex;

    .left {
      width: calc(100% - 370px);
      margin-right: 20px;
    }

    .right {
      width: 300px;

      .right_item {
        width: 100%;
        margin-bottom: 20px;
      }
    }
  }

  @include respond-to('notebook') {
    .home_main {
      margin-top: 40px;
      width: 85%;
      display: flex;

      .left {
        width: 70%;
        margin-right: 20px;
      }

      .right {
        width: 30%;

        .right_item {
          width: 100%;
          margin-bottom: 20px;
        }
      }
    }
  }
  @include respond-to('pad') {
    .home_main {
      margin-top: 40px;
      width: 100%;
      display: flex;
      justify-content: center;

      .left {
        width: 90%;
      }

      .right {
        display: none;
      }
    }
  }
  @include respond-to('phone') {
    .home_main {
      margin-top: 40px;
      width: 100%;
      display: flex;
      justify-content: center;

      .left {
        width: 90%;
        margin: 0;
      }

      .right {
        display: none;
      }
    }
  }
}

</style>