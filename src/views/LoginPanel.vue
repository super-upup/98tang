<template>
  <img class="bgone" src="@/assets/bg.jpg" />

  <div class="login-container">
    <div class="title">
      <div class="name1">98tang自动签到系统</div>
      <div class="name2">98tang auto sign system</div>
    </div>

    <div class="login-panel">
      <div @click="goGithub" class="github">
        <div style="font-size: 12px; color: grey; margin-right: 20px">
          到github上Fork和Star就是我维护的动力
        </div>
        <div>
          <img
            style="height: 35px; width: 35px"
            alt="github"
            src="@/assets/github.svg"
          />
          <div style="white-space: nowrap; font-size: 14px; margin-top: 3px">
            源码
          </div>
        </div>
      </div>

      <el-image
        style="width: 320px; height: 320px"
        :src="require('@/assets/decorate.png')"
        fit="cover"
      ></el-image>

      <div class="form" :model="form">
        <el-input v-model="form.name" placeholder="用户名" />
        <el-input
          v-model="form.pwd"
          type="password"
          placeholder="密码"
          show-password
        />
        <div class="mt-4">
          <el-input
            v-model="form.answer"
            placeholder="选填"
            class="input-with-select"
          >
            <template #prepend>
              <el-select
                v-model="form.questionId"
                placeholder="密保问题"
                style="width: 115px"
              >
                <el-option label="母亲的名字" value="1" />
                <el-option label="爷爷的名字" value="2" />
                <el-option label="父亲出生的城市" value="3" />
                <el-option label="您其中一位老师的名字" value="4" />
                <el-option label="您个人计算机的型号" value="5" />
                <el-option label="您最喜欢的餐馆名称" value="6" />
                <el-option label="驾驶执照最后四位数字" value="7" />
              </el-select>
            </template>
          </el-input>
        </div>
        <el-button
          :loading="loading"
          @click="onSubmit"
          class="login-btn"
          type="primary"
          >登录</el-button
        >
      </div>
      <el-badge :max="999999" class="sign-count" :value="signCount">
        <el-button>昨日签到用户数</el-button>
      </el-badge>
    </div>
  </div>

  <!-- vue -->
</template>


<script>
import request from "@/utils/request";
// import { useStore } from "vuex";
export default {
  name: "LoginPanel",
  props: {
    msg: String,
  },
  data() {
    return {
      loading: false,
      signCount: "",
      form: {
        name: "",
        pwd: "",
        questionId: "",
        answer: "",
      },
    };
  },

  mounted() {
    // const store = useStore();
    // console.log(store);
    // store.commit('user/updateUname', 'Tom')
    // console.log(store);

    request
      .get("http://superupup.top/98t/usersCount")
      .then((res) => {
        this.signCount = res.count;
      })
      .finally(() => {});
  },

  methods: {
    goGithub() {
      // 跳转到github
      window.location.href = "https://github.com/super-upup/98tang";
    },

    onSubmit() {
      let data = new FormData();
      data.append("username", this.form.name);
      data.append("pwd", this.form.pwd);
      if (this.form.answer) {
        data.append("questionid", this.form.questionId);
        data.append("answer", this.form.answer);
      }

      this.loading = true;
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          username: this.form.name,
          pwd: this.form.pwd,
        })
      );
      request
        .post("http://superupup.top/98t/commit", data)
        .then((res) => {
          // console.log(res);
          this.$router.push({
            name: "SignPanel",
            // params: { username: this.form.name, pwd: this.form.pwd },
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sign-count {
  position: absolute;
  right: 40px;
  bottom: 20px;
}

.github {
  position: absolute;
  right: 23px;
  top: 23px;
  /* width: 37px;
  height: 37px; */
  /* border-radius: 50%; */
  display: flex;
  /* flex-direction: column;
  justify-content: center; */
  align-items: center;
}

.login-btn {
  margin-top: 20px;
}

.el-input {
  margin-top: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 100px;
}

.login-panel {
  position: relative;
  display: flex;
  background-color: #fff;
  padding: 50px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
}

.title {
  position: absolute;
  top: -15vh;
  color: #fff;
}

.name1 {
  font-size: 34px;
}
.name2 {
  margin-top: 5px;
  font-size: 14px;
}

.login-container {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 35vh;
  position: relative;
}

.bgone {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: -1;
}
</style>
