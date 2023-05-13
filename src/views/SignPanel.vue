<template>
  <el-table v-loading="loading" :data="sign_history" stripe style="width: 100%">
    <el-table-column prop="sign_time" label="签到日期" />
    <el-table-column prop="status" label="签到状态" />
  </el-table>
</template>

<script>
import request from "@/utils/request";
import scroll from "@/utils/scroll";
export default {
  data() {
    return { sign_history: [], loading: false, count: 50, user: {} };
  },

  mounted() {
    this.user = JSON.parse(window.localStorage.getItem("user"));
    this.getSignLi();
    scroll.start(this.getSignLi);
  },

  methods: {
    getSignLi() {
      console.log("获取新数据");
      this.loading = true;
      // const params = this.$route.params;
      // console.log(this.$route.params);

      let data = new FormData();
      data.append("username", this.user.username);
      data.append("pwd", this.user.pwd);
      data.append("skip", this.sign_history.length);
      data.append("limit", this.count);
      request
        .post("http://superupup.top/98t/checkStatus", data)
        .then((res) => {
          const sign_history = res.sign_history;
          for (let i = 0, len = sign_history.length; i < len; i++) {
            const date = new Date(sign_history[i].sign_time * 1000);
            const year = date.getFullYear();
            const month = ("0" + (date.getMonth() + 1)).slice(-2);
            const day = ("0" + date.getDate()).slice(-2);
            const hour = ("0" + date.getHours()).slice(-2);
            const min = ("0" + date.getMinutes()).slice(-2);
            sign_history[
              i
            ].sign_time = `${year}年${month}月${day}日 ${hour}:${min}`;
          }
          if (sign_history.length < this.count) scroll.end();
          this.sign_history = this.sign_history.concat(sign_history);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style>
</style>