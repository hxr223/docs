---
title: Environment Variable Explanation
sidebar_position: 9
---

System parameters can be controlled through environment variables. Copy `env.tmpl` to `.env` and modify the parameters in it.

Some parameter explanations are as follows:

| Environment Variable | Description |
| --------------------- | ----------- |
| API_BASE_URL         | API service address (needs modification) |
| WEB_PORT          | Port of website     |
| INSTALLATION_MODE    | Installation mode (`standalone`: standard mode; `with-doris`: Doris integrated mode; `with-starrocks`: Starrocks integrated mode) |
| DB_NAME              | Database name |
| DB_USER              | Database username |
| DB_PASS              | Database password |
| DB_PORT              | Database port |
| DB_HOST              | Database address |
| REDIS_PASSWORD       | Cache service password |
| WEBAPP_PORT          | WEB UI service port |
| NODE_ENV             | Operating environment: `development` or `production` |
| LOGGER_LEVEL         | Log level |
| DEFAULT_LATITUDE     | Default latitude |
| DEFAULT_LONGITUDE    | Default longitude |
| DEFAULT_CURRENCY     | Default currency |
| DEMO                 | Demo system |

## Email related configuration
To customize the SMTP mail server configuration, you need to configure the following environment variables:

| Environment variable | Description |
| ----------------- | --------------- |
| MAIL_FROM_ADDRESS | Sender's email address |
| MAIL_HOST | Mail service host |
| MAIL_PORT | Mail service port number |
| MAIL_USERNAME | Mail account |
| MAIL_PASSWORD | Mail password |

## File Storage

Custom File Storage Providers

| Environment Variable      | Description                                  |
|---------------------------|----------------------------------------------|
| FILE_PROVIDER            | File storage provider (LOCAL \| S3 \| OSS)   |
| ALIYUN_ACCESS_KEY_ID     | Alibaba Cloud Access Key ID                  |
| ALIYUN_ACCESS_KEY_SECRET | Alibaba Cloud Access Key Secret              |
| ALIYUN_REGION            | Alibaba Cloud Region                         |
| ALIYUN_OSS_ENDPOINT      | Alibaba Cloud OSS Endpoint                   |
| ALIYUN_OSS_BUCKET        | Alibaba Cloud OSS Bucket                     |
| AWS_ACCESS_KEY_ID        | Amazon Cloud Access Key ID                   |
| AWS_SECRET_ACCESS_KEY    | Amazon Cloud Secret Access Key               |
| AWS_REGION               | Amazon Cloud Region                          |
| AWS_S3_BUCKET            | Amazon Cloud S3 Bucket                       |