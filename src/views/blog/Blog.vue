<script setup lang="ts">
import Blog_nav from "@/components/blog/Blog_nav.vue";
import Blog_footer from "@/components/blog/Blog_footer.vue";
</script>

<template>
  <div class="blog">
    <div class="nav_wrapper">
      <Blog_nav></Blog_nav>
    </div>
    <div class="main_wrapper">
      <router-view></router-view>
    </div>
    <div class="footer_wrapper">
      <Blog_footer/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.blog {
  width: 100%;
  height: 100%;
  background-color: var(--main_bg);

  .nav_wrapper {
    width: 100%;
  }

  .main_wrapper {
    width: 100%;
    height: 100%;
    min-height: 800px;
  }

  .footer_wrapper {
    width: 100%;
  }
}

</style>