# 98tang/98堂自动签到系统

## 作者搭建好的（更新时间2023年6月）
http://www.superupup.top

**服务器昂贵，给个star、fork是我维护的动力！！**

![Image text](https://raw.githubusercontent.com/super-upup/98tang/master/readme/login-history.png)
已经稳定运行**10个月**，如果特殊情况，请到到tg反馈 https://t.me/super_upup 。

**邀请码购买**：https://www.aseh.xyz/
## 功能介绍

- 登录成功以后每日自动登录签到、不定期升级到LV6用户组
- 修改密码或密保问题后自动失效

## 待开发
- ~~批量登录~~（需要的话请tg联系）

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

## API接口如下（不限制origin，可自行调用）

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

