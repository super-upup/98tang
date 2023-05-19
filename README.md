# 98tang/98堂自动签到系统

## 作者搭建好的——服务器昂贵，给个star、fork是我维护的动力！！（更新时间2023年5月）
http://www.superupup.top

![Image text](https://raw.githubusercontent.com/super-upup/98tang/master/readme/login-history.png)
5月测试是稳定的，如果特殊情况没有每日签到的话，请到Issue提问。

## 功能介绍

- 登录成功以后每日自动登录签到
- 修改密码或密保问题后自动失效

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

## API接口如下

### 提交每日签到任务

| URL          | http://www.superupup.top/98t/commit                                |
| ------------ | ------------------------------------------------------------ |
| method       | POST                                                         |
| Content-Type | application/x-www-form-urlencoded                            |
| data         | username=用户名&pwd=密码&questionid=母亲的名字填1，爷爷的名字填2（以此类推）&answer=密保答案 |

### 查看自动签到历史

| URL          | http://www.superupup.top/98t/checkStatus                          |
| ------------ | ----------------------------------------------------------- |
| method       | POST                                                        |
| Content-Type | application/x-www-form-urlencoded                           |
| data         | username=用户名&pwd=密码&skip=跳过条数&limit=一次获取条数 |

返回10位时间戳请自行转化为可读性日期

