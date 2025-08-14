<template>
  <div class="login-wrapper">
    <div class="login-container">
      <!-- 左侧装饰区域 -->
      <div class="login-left">
        <div class="brand">
          <h1 class="brand-title">98堂</h1>
          <p class="brand-subtitle">自动签到系统</p>
        </div>
        <div class="decoration">
          <img src="@/assets/decorate.png" alt="装饰图" />
        </div>
      </div>

      <!-- 右侧登录区域 -->
      <div class="login-right">
        <div class="login-header">
          <h2 class="welcome-text">欢迎回来</h2>
          <p class="login-desc">请登录您的账户继续使用自动签到服务</p>
        </div>

        <div class="login-form-container">
          <el-tabs v-model="activeName" class="login-tabs">
            <!-- 常规登录 -->
            <el-tab-pane label="账号密码登录" name="commonLogin">
              <div class="login-form">
                <el-input 
                  v-model="form.name" 
                  placeholder="请输入用户名"
                >
                  <template #prefix>
                    <el-icon><User /></el-icon>
                  </template>
                </el-input>
                <el-input 
                  v-model="form.pwd" 
                  type="password" 
                  placeholder="请输入密码" 
                  show-password
                >
                  <template #prefix>
                    <el-icon><Lock /></el-icon>
                  </template>
                </el-input>
                <div class="security-question">
                  <el-select v-model="form.questionId" placeholder="密保问题(选填)">
                    <el-option label="母亲的名字" value="1" />
                    <el-option label="爷爷的名字" value="2" />
                    <el-option label="父亲出生的城市" value="3" />
                    <el-option label="您其中一位老师的名字" value="4" />
                    <el-option label="您个人计算机的型号" value="5" />
                    <el-option label="您最喜欢的餐馆名称" value="6" />
                    <el-option label="驾驶执照最后四位数字" value="7" />
                  </el-select>
                  <el-input 
                    v-model="form.answer" 
                    placeholder="密保答案" 
                    class="security-answer"
                  />
                </div>
                <el-button 
                  :loading="loading" 
                  @click="onSubmit" 
                  class="login-btn" 
                  type="primary"
                >
                  登录
                </el-button>
                <!-- 登录等待提示 -->
                <div v-if="loading" class="loading-tip">
                  <el-icon class="loading-icon"><Loading /></el-icon>
                  <span>正在登录中，请耐心等待，最多可能需要2分钟...</span>
                </div>
              </div>
            </el-tab-pane>

            <!-- cookies批量登录 -->
            <el-tab-pane label="Cookies批量登录" name="cookiesLogin">
              <div class="login-form">
                <el-input 
                  type="textarea" 
                  v-model="cookiesStr" 
                  placeholder="请输入cookies信息，格式请参考GitHub说明" 
                  :rows="5"
                />
                <el-button 
                  :loading="loading" 
                  class="login-btn" 
                  type="primary" 
                  @click="onCookiesLogin"
                >
                  提交
                </el-button>
                <!-- Cookies登录等待提示 -->
                <div v-if="loading" class="loading-tip">
                  <el-icon class="loading-icon"><Loading /></el-icon>
                  <span>正在登录中，请耐心等待，最多可能需要2分钟...</span>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="login-footer">
          <div class="footer-links">
            <div class="link-item github-link" @click="goGithub">
              <img src="@/assets/github.svg" alt="GitHub" />
              <span>查看源码和使用说明</span>
            </div>
            <div class="link-item telegram-link" @click="goTelegram">
              <img src="@/assets/telegram.svg" alt="Telegram" />
              <span>加入交流群</span>
            </div>
            <div class="link-item service-link">
              <router-link to="/xlist">
                <el-button type="text" @click="jumpWeb">人工找片服务</el-button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { ElMessageBox } from "element-plus";
import { User, Lock, Loading } from '@element-plus/icons-vue';

export default {
  components: {
    User,
    Lock,
    Loading
  },
  metaInfo: {
    title: "98堂签到",
    meta: [
      {
        name: "description",
        content: "提供免费98堂签到、女优识别、找番号服务。",
      },
      {
        name: "keywords",
        content: "女优识别,98堂签到",
      },
    ],
  },
  name: "LoginPanel",
  props: {
    msg: String,
  },
  data() {
    return {
      loading: false,
      activeName: "commonLogin",
      cookiesStr: "",
      form: {
        name: "",
        pwd: "",
        questionId: "",
        answer: "",
      },
    };
  },

  methods: {
    onCookiesLogin() {
      this.loading = true;
      let data = new FormData();
      data.append("cookies", this.cookiesStr);
      request
        .post(`/98t/cookiesLogin`, data)
        .then((res) => {
          ElMessageBox.alert(res.msg, res.title, {
            confirmButtonText: "确定",
            "show-close": false,
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },

    jumpWeb() {
      window.open("https://avhelper.com");
    },

    goGithub() {
      if (this.activeName == "commonLogin")
        window.open("https://github.com/super-upup/98tang");
      else if (this.activeName == "cookiesLogin")
        window.open("https://github.com/super-upup/98tang#cookies批量登录");
    },

    goTelegram() {
      window.open("https://t.me/+PiZnd8NIZSwwMDk5");
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
        .post(`/98t/commit`, data)
        .then((res) => {
          this.$router.push({
            name: "SignPanel",
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.login-wrapper {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  padding: 20px;
}

.login-container {
  display: flex;
  width: 900px;
  max-width: 100%;
  min-height: 550px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* 左侧样式 */
.login-left {
  width: 45%;
  background: linear-gradient(135deg, #5e72e4 0%, #825ee4 100%);
  padding: 40px;
  color: white;
  display: flex;
  flex-direction: column;
  position: relative;
}

.brand-title {
  font-size: 36px;
  margin: 0;
  font-weight: 700;
}

.brand-subtitle {
  font-size: 16px;
  margin-top: 8px;
  opacity: 0.9;
}

.decoration {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  opacity: 0.7;
}

.decoration img {
  width: 100%;
}

/* 右侧样式 */
.login-right {
  width: 55%;
  background-color: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.login-header {
  margin-bottom: 30px;
}

.welcome-text {
  font-size: 24px;
  color: #333;
  margin: 0 0 8px 0;
}

.login-desc {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.login-form-container {
  flex: 1;
}

.login-tabs {
  width: 100%;
}

.login-form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.security-question {
  display: flex;
  gap: 12px;
}

.el-select {
  width: 40%;
}

.security-answer {
  width: 60%;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  margin-top: 16px;
  background: linear-gradient(135deg, #5e72e4 0%, #825ee4 100%);
  border: none;
}

.loading-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  padding: 12px;
  background-color: #f0f9ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  color: #1e40af;
  font-size: 14px;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.login-footer {
  margin-top: 40px;
}

.footer-links {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  font-size: 14px;
}

.link-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
  color: #666;
}

.github-link img, .telegram-link img {
  width: 20px;
  height: 20px;
}

.github-link:hover, .telegram-link:hover {
  color: #5e72e4;
}

.service-link a {
  color: #5e72e4;
  text-decoration: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    width: 100%;
  }
  
  .login-left, .login-right {
    width: 100%;
  }
  
  .login-left {
    padding: 30px;
    min-height: 200px;
  }
  
  .decoration {
    display: none;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
}

/* 删除统计相关样式 */
.stats, .stat-item, .stat-value, .stat-label {
  display: none;
}
</style>
