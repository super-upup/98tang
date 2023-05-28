<template>
  <div class="menu">
    <a
      >自动升级状态：
      <el-button
        @click="changeUpgrade"
        size="small"
        :disabled="auto_upgrade_disable"
        :type="auto_upgrade ? 'primary' : 'danger'"
        >{{ auto_upgrade ? "开启" : "关闭" }}</el-button
      >
    </a>
    <!-- <el-button type="success" :icon="Check" circle /> -->
  </div>
  <el-table v-loading="loading" :data="sign_history" stripe style="width: 100%">
    <el-table-column prop="sign_time" label="签到日期" />
    <el-table-column prop="status" label="签到状态" />
  </el-table>
</template>

<script>
import request from "@/utils/request";
import scroll from "@/utils/scroll";
import config from "@/config/config";
export default {
  data() {
    return {
      sign_history: [],
      loading: false,
      count: 50,
      user: {},
      auto_upgrade: true,
      auto_upgrade_disable: false,
    };
  },

  mounted() {
    this.user = JSON.parse(window.localStorage.getItem("user"));
    this.getSignLi();
    scroll.start(this.getSignLi);
  },

  methods: {
    changeUpgrade() {
      this.auto_upgrade_disable = true;
      this.loading = true;
      let data = new FormData();
      data.append("username", this.user.username);
      data.append("pwd", this.user.pwd);
      data.append("auto_upgrade", !this.auto_upgrade);
      request
        .post(`${config.baseUrl}/98t/changeUpgrade`, data)
        .then((res) => {
          this.auto_upgrade = res.auto_upgrade;
        })
        .finally(() => {
          this.loading = false;
          this.auto_upgrade_disable = false;
        });
    },

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
        .post(`${config.baseUrl}/98t/checkStatus`, data)
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
          this.auto_upgrade = res.auto_upgrade
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style>
.menu {
  border: 1px solid var(--el-border-color);
  margin: 10px;
  padding: 5px 10px;
  text-align: left;
}
</style>