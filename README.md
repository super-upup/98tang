# 98tang/98堂自动签到系统
<font color="red">近期作者比較繁忙，論壇又更新頻繁，大家有好的辦法可以自動通過cloudfare5秒盾或想參與項目開發請聯繫https://t.me/script_xxx</font>


## 作者搭建好的（更新时间2024年5月）
http://www.superupup.top

**开发不易，给个star、fork是我维护的动力！！**

![Image text](https://raw.githubusercontent.com/super-upup/98tang/master/readme/login-history.png)

## 功能介绍

- 登录成功以后每日自动登录签到，随机回复一条帖子领金币，可用于购买站内资源
- ~~不定期升级到LV6用户组，LV6可获邀请码（已停用此功能）~~
- 修改密码或密保问题后自动失效
- 安全可靠，首次登录成功，**次日开始使用代理ip登录**


## 注意事项

- 请勿设置双重验证，因为双重验证每次登录码不一样，无法完成自动签到
- 没有设置密保问题对应选项应留空

## 运行项目
```shell
# 克隆项目
git clone https://github.com/super-upup/98tang
# 切换到目录
cd 98tang
# 安装依赖
npm i
# 运行项目
npm run serve
```

```shell
# 编译
npm run build
```

## cookies批量登录
**比较复杂，耐心看完**
### 1. 获取cookies
<img src="https://github.com/super-upup/98tang/blob/master/readme/cookie_login_step1.png" alt="Example Image" height="300px">

### 2. 提交登录
<img src="https://github.com/super-upup/98tang/blob/master/readme/cookie_login_step2.png" alt="Example Image" height="300px">

### 3. 提交须知
- 仅支持10~15个不同的号同时批量登录，如果最后一批不足10个号，可使用以前提交过的cookie。
- cookie有效期为1个月，一个月后需重新提交。
- 次日开始使用**ip代理签到**，比手工签到更可靠。


## API接口如下

### 提交每日签到任务

| URL          | http://www.superupup.top/98t/commit                                |
| ------------ | ------------------------------------------------------------ |
| method       | POST                                                         |
| Content-Type | application/x-www-form-urlencoded                            |
| data         | username=用户名&pwd=密码&questionid=母亲的名字填1，爷爷的名字填2（以此类推）&answer=密保答案 |

### 更改自动升级状态

| url          | http://www.superupup.top/98t/changeUpgrade                   |
| ------------ | ------------------------------------------------------------ |
| method       | POST                                                         |
| Content-Type | application/x-www-form-urlencoded                            |
| data         | username=用户名&pwd=密码&auto_upgrade=是否自动升级（填true或false） |

### 查看自动签到历史

| URL          | http://www.superupup.top/98t/checkStatus                          |
| ------------ | ----------------------------------------------------------- |
| method       | POST                                                        |
| Content-Type | application/x-www-form-urlencoded                           |
| data         | username=用户名&pwd=密码&skip=跳过条数&limit=一次获取条数 |

返回10位时间戳请自行转化为可读性日期

