---
title: 环境变量说明
sidebar_position: 9
---

可以通过环境变量对系统各项参数进行控制， 复制 `env.example` 为 `.env` 并修改其中的参数即可。

部分参数说明如下：

| 环境变量          | 说明                                                                                                        |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| API_BASE_URL      | API 服务地址（需修改）                                                                                      |
| WEB_PORT          | 网站端口号                                                                                                  |
| INSTALLATION_MODE | 安装模式(`standalone`: 标准模式； `with-doris`: 集成 Doris 的模式; `with-starrocks`: 集成 Starrocks 的模式) |
| DB_NAME           | 数据库名称                                                                                                  |
| DB_USER           | 数据库用户名                                                                                                |
| DB_PASS           | 数据库密码                                                                                                  |
| DB_PORT           | 数据库端口                                                                                                  |
| DB_HOST           | 数据库地址                                                                                                  |
| REDIS_PASSWORD    | 缓存服务密码                                                                                                |
| WEBAPP_PORT       | WEB UI 服务端口                                                                                             |
| NODE_ENV          | 运行环境: `development` or `production`                                                                     |
| LOGGER_LEVEL      | 日志级别                                                                                                    |
| DEFAULT_LATITUDE  | 默认纬度                                                                                                    |
| DEFAULT_LONGITUDE | 默认经度                                                                                                    |
| DEFAULT_CURRENCY  | 默认货币                                                                                                    |
| DEMO              | 演示系统                                                                                                    |


## 邮件相关配置
自定义 smtp 邮件服务器配置， 需要配置以下环境变量：

| 环境变量          | 说明           |
| ----------------- | -------------- |
| MAIL_FROM_ADDRESS | 发件人邮件地址 |
| MAIL_HOST         | 邮箱服务主机   |
| MAIL_PORT         | 邮箱服务端口号 |
| MAIL_USERNAME     | 邮箱账号       |
| MAIL_PASSWORD     | 邮箱密码       |

## 文件存储

自定义文件存储提供商

| 环境变量                 | 说明                                 |
| ------------------------ | ------------------------------------ |
| FILE_PROVIDER            | 文件存储提供商（LOCAL \| S3 \| OSS） |
| ALIYUN_ACCESS_KEY_ID     | 阿里云 Access Key ID                 |
| ALIYUN_ACCESS_KEY_SECRET | 阿里云 Access Key Secret             |
| ALIYUN_REGION            | 阿里云地区                           |
| ALIYUN_OSS_ENDPOINT      | 阿里云 OSS Endpoint                  |
| ALIYUN_OSS_BUCKET        | 阿里云 OSS Bucket                    |
| AWS_ACCESS_KEY_ID        | 亚马逊云 Access Key ID               |
| AWS_SECRET_ACCESS_KEY    | 亚马逊云 Secret Access Key           |
| AWS_REGION               | 亚马逊云地区                         |
| AWS_S3_BUCKET            | 亚马逊云 S3 Bucket                   |
