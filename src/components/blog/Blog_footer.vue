<script setup lang="ts">

</script>

<template>
  <div class="blog_footer">
    <div class="left">
      <div class="thank">
        <div class="title">
          Thank For
        </div>
        <div class="icons">
          <div class="icon">
            <el-image src="/resources/footer/tencent.png" style="width: 25px" loading="lazy" fit="fill"/>
            腾讯云服务器
          </div>
          <div class="icon">
            <el-image src="/resources/footer/tencent.png" style="width: 25px" loading="lazy" fit="fill"/>
            腾讯云SSL证书
          </div>
          <div class="icon">
            <el-image src="/resources/footer/qiniu.png" style="width: 25px" loading="lazy" fit="fill"/>
            七牛云存储
          </div>
        </div>
      </div>
      <div class="bei_an">
        <el-image src="/resources/footer/badges.png" style="height: 25px" loading="lazy" fit="fill"/>
        <p>湘ICP备2021010654号-3</p>
      </div>
    </div>
    <div class="right">
      <div class="contact">
        <div class="QQ">
          <el-image class="show_img" src="/resources/footer/qq_show.JPG" loading="lazy" fit="fill"/>
          <el-image src="/resources/footer/qq_icon.svg" style="width: 30px" loading="lazy" fit="fill"/>
        </div>
        <div class="wechat">
          <el-image class="show_img" src="/resources/footer/wechat_show.JPG" loading="lazy"
                    fit="fill"/>
          <el-image src="/resources/footer/wexin_icon.svg" style="width: 30px" loading="lazy" fit="fill"/>
        </div>
        <div class="github">
          <a href="#">
            <el-image src="/resources/footer/github_icon.svg" style="width: 30px" loading="lazy" fit="fill"/>
          </a>
        </div>
      </div>
      <div class="copyright">
        <p>Copyright © Since 2023 MWX</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.blog_footer {
  width: 100%;
  height: 200px;
  background-color: var(--bg);
  display: flex;
  align-items: center;

  .left {
    width: 50%;
    height: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text);

    .el-image {
      margin-right: 5px;
    }

    .thank {
      height: 70%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      .title {
        font-size: 25px;
        font-weight: bold;
        text-align: center;
      }

      .icons {
        display: flex;

        .icon {
          display: flex;
          align-items: center;
          margin-right: 20px;

          &:last-of-type {
            margin-right: 0;
          }
        }
      }
    }

    .bei_an {
      height: 30%;
      display: flex;
      align-items: center;

      p {
        margin: 0;
      }
    }
  }

  .right {
    width: 50%;
    height: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text);

    .contact {
      display: flex;

      & > div {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        cursor: pointer;
      }

      .QQ, .wechat {
        .show_img {
          position: absolute;
          opacity: 0;
          width: 80px;
          border: 1px #f0eeee solid;
          left: -10px;
          top: 0;
          transition: all 0.6s;
        }

        &:hover {
          .show_img {
            opacity: 1;
            top: -70px;
          }
        }
      }
    }

    .copyright {
      font-weight: bold;
    }
  }

}
</style>