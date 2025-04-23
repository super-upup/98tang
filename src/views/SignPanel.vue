<template>
  <div class="sign-panel">
    <el-card class="header-card">
      <div class="panel-header">
        <h2 class="panel-title">签到中心</h2>
        <div class="auto-upgrade-wrapper">
          <span class="upgrade-label">自动升级</span>
          <el-switch
            v-model="auto_upgrade"
            :loading="auto_upgrade_disable"
            :disabled="auto_upgrade_disable"
            @change="changeUpgrade"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </div>
      </div>
      
      <div class="stats-container">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="8" :span="8">
            <div class="stat-card">
              <div class="stat-icon">
                <el-icon><Calendar /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-label">总签到次数</div>
                <div class="stat-value">{{ totalSignCount }}</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8" :span="8">
            <div class="stat-card">
              <div class="stat-icon success-icon">
                <el-icon><Check /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-label">成功天数</div>
                <div class="stat-value">{{ successCount }}</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8" :span="8">
            <div class="stat-card">
              <div class="stat-icon warn-icon">
                <el-icon><Warning /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-label">未签到天数</div>
                <div class="stat-value">{{ failCount }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="history-card">
      <template #header>
        <div class="history-header">
          <h3>签到历史记录</h3>
        </div>
      </template>
      
      <el-table 
        v-loading="loading" 
        :data="sign_history" 
        stripe 
        style="width: 100%"
        :empty-text="'暂无签到记录'"
      >
        <el-table-column prop="sign_time" label="签到日期" width="180" />
        <el-table-column label="签到状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === '签到成功' ? 'success' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="详情">
          <template #default="scope">
            <div class="status-detail">{{ scope.row.detail || '无详细信息' }}</div>
          </template>
        </el-table-column>
      </el-table>
      
      <div v-if="sign_history.length > 0" class="load-more">
        <el-button 
          type="primary" 
          plain 
          size="small" 
          @click="loadMore" 
          :loading="loading"
          :disabled="noMoreData"
        >
          {{ noMoreData ? '没有更多数据' : '加载更多' }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";
import scroll from "@/utils/scroll";
import config from "@/config/config";
import { Calendar, Check, Warning } from '@element-plus/icons-vue'

export default {
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
  components: {
    Calendar,
    Check,
    Warning
  },
  data() {
    return {
      sign_history: [],
      loading: false,
      count: 20,
      user: {},
      auto_upgrade: true,
      auto_upgrade_disable: false,
      totalSignCount: 0,
      successCount: 0,
      failCount: 0,
      noMoreData: false
    };
  },

  mounted() {
    this.user = JSON.parse(window.localStorage.getItem("user"));
    this.getSignLi();
  },

  methods: {
    loadMore() {
      this.getSignLi();
    },
    
    changeUpgrade() {
      this.auto_upgrade_disable = true;
      let data = new FormData();
      data.append("username", this.user.username);
      data.append("pwd", this.user.pwd);
      data.append("auto_upgrade", this.auto_upgrade);
      
      request
        .post(`/98t/changeUpgrade`, data)
        .then((res) => {
          this.auto_upgrade = res.auto_upgrade;
          this.$notify({
            title: '成功',
            message: `自动升级已${this.auto_upgrade ? '开启' : '关闭'}`,
            type: 'success'
          });
        })
        .catch(() => {
          this.auto_upgrade = !this.auto_upgrade; // 恢复状态
          this.$notify.error({
            title: '错误',
            message: '设置失败，请稍后重试'
          });
        })
        .finally(() => {
          this.auto_upgrade_disable = false;
        });
    },

    getSignLi() {
      this.loading = true;
      let data = new FormData();
      data.append("username", this.user.username);
      data.append("pwd", this.user.pwd);
      data.append("skip", this.sign_history.length);
      data.append("limit", this.count);
      
      request
        .post(`/98t/checkStatus`, data)
        .then((res) => {
          const sign_history = res.sign_history || [];
          
          // 更新统计数据
          this.totalSignCount = res.total_count || this.sign_history.length + sign_history.length;
          
          // 如果服务器返回了统计数据，则直接使用
          if (res.success_count !== undefined && res.fail_count !== undefined) {
            this.successCount = res.success_count;
            this.failCount = res.fail_count;
          } else {
            // 需要手动计算，并且包含所有已加载的历史记录
            // 合并现有历史记录和新加载的记录进行统计
            const allRecords = [...this.sign_history];
            for (const record of sign_history) {
              // 为新记录创建副本，因为我们需要原始时间戳进行日期计算
              allRecords.push({...record});
            }
            
            // 先收集所有日期的签到状态
            const dateStatusMap = new Map();
            
            // 遍历所有记录，记录每天的签到状态
            allRecords.forEach(item => {
              // 获取时间戳（如果是已处理的记录则转换回时间戳）
              let timestamp = item.sign_time;
              if (typeof timestamp === 'string' && timestamp.includes('年')) {
                // 已格式化的日期，需要提取日期部分
                const dateParts = timestamp.split(' ')[0].match(/(\d+)年(\d+)月(\d+)日/);
                if (dateParts) {
                  const date = new Date(
                    parseInt(dateParts[1]), 
                    parseInt(dateParts[2]) - 1, 
                    parseInt(dateParts[3])
                  );
                  timestamp = date.getTime() / 1000;
                }
              }
              
              const date = new Date(timestamp * 1000);
              const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
              
              // 如果当天有成功记录，标记为成功
              if (item.status === '签到成功') {
                dateStatusMap.set(dateStr, 'success');
              } 
              // 如果当天没有记录过状态或之前记录为失败，且当前为失败，标记为失败
              else if (item.status.includes('签到失败') || item.status === '签到异常') {
                if (!dateStatusMap.has(dateStr) || dateStatusMap.get(dateStr) !== 'success') {
                  dateStatusMap.set(dateStr, 'fail');
                }
              }
            });
            
            // 找出最早和最晚的日期
            let earliestDate = new Date();
            let latestDate = new Date(0);
            
            allRecords.forEach(item => {
              let timestamp = item.sign_time;
              if (typeof timestamp === 'string' && timestamp.includes('年')) {
                const dateParts = timestamp.split(' ')[0].match(/(\d+)年(\d+)月(\d+)日/);
                if (dateParts) {
                  const date = new Date(
                    parseInt(dateParts[1]), 
                    parseInt(dateParts[2]) - 1, 
                    parseInt(dateParts[3])
                  );
                  timestamp = date.getTime() / 1000;
                }
              }
              
              const date = new Date(timestamp * 1000);
              if (date < earliestDate) earliestDate = new Date(date);
              if (date > latestDate) latestDate = new Date(date);
            });
            
            // 重置时间为当天开始
            earliestDate.setHours(0, 0, 0, 0);
            latestDate.setHours(0, 0, 0, 0);
            
            // 计算日期范围内的所有天数
            const totalDays = Math.floor((latestDate - earliestDate) / (24 * 60 * 60 * 1000)) + 1;
            
            // 遍历日期范围内的每一天，检查是否有签到记录
            let currentDate = new Date(earliestDate);
            for (let i = 0; i < totalDays; i++) {
              const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
              
              // 如果该日期没有记录，标记为未签到
              if (!dateStatusMap.has(dateStr)) {
                dateStatusMap.set(dateStr, 'missing');
              }
              
              // 前进到下一天
              currentDate.setDate(currentDate.getDate() + 1);
            }
            
            // 计算成功天数
            let successDays = 0;
            // 计算未签到天数（失败 + 缺失）
            let missedDays = 0;
            
            dateStatusMap.forEach(status => {
              if (status === 'success') {
                successDays++;
              } else if (status === 'fail' || status === 'missing') {
                missedDays++;
              }
            });
            
            this.successCount = successDays;
            this.failCount = missedDays;
          }
          
          // 处理新加载的记录时间格式
          for (let i = 0, len = sign_history.length; i < len; i++) {
            const date = new Date(sign_history[i].sign_time * 1000);
            const year = date.getFullYear();
            const month = ("0" + (date.getMonth() + 1)).slice(-2);
            const day = ("0" + date.getDate()).slice(-2);
            const hour = ("0" + date.getHours()).slice(-2);
            const min = ("0" + date.getMinutes()).slice(-2);
            sign_history[i].sign_time = `${year}年${month}月${day}日 ${hour}:${min}`;
          }
          
          if (sign_history.length < this.count) {
            this.noMoreData = true;
          }
          
          this.sign_history = this.sign_history.concat(sign_history);
          this.auto_upgrade = res.auto_upgrade;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style>
.sign-panel {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-title {
  margin: 0;
  color: var(--el-color-primary);
  font-size: 22px;
}

.auto-upgrade-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.upgrade-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.header-card {
  margin-bottom: 20px;
}

.stats-container {
  margin-top: 20px;
}

.stat-card {
  background: var(--el-fill-color-light);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 10px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--el-color-primary-light-8);
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 20px;
}

.success-icon {
  background-color: var(--el-color-success-light-8);
  color: var(--el-color-success);
}

.warn-icon {
  background-color: var(--el-color-danger-light-8);
  color: var(--el-color-danger);
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--el-text-color-primary);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.status-detail {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.load-more {
  text-align: center;
  margin-top: 20px;
}
</style>