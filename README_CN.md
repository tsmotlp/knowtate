<div align="center">
<h1 aligh="center">
<img src="public/favicon.ico" width="30"> Knowtate
<img src="https://img.shields.io/github/license/tsmotlp/knowtate?label=License&style=flat-square&color=blue">
</h1>
</div>

Knowtate是一个数据完全本地化的科研助手应用，提供文献阅读、管理和问答等功能
![](/images/landing-page.png)
![](/images/overview.svg)



## 功能特性

### 文献的管理和阅读：
提供将论文上传到minio对象存储服务（可以本地部署，可以支持AWS S3等提供的对象存储云服务）中集中管理；提供一个PDF阅读器支持论文的在线阅读
![](/images/papers.svg)
![](/images/chat.svg)


### Notion风格的笔记系统：
提供了一个类Notion风格的富文本编辑器，支持`/`（slash语法）选择不同的文本区块样式（目前支持多级标题，表格，有序列表，无序列表，图片等）。笔记同样会自动存储到minio对象存储系统
![](/images/note.svg)



### 论文问答：
提供了一个基于论文内容的智能问答系统，可以对论文的任何内容进行提问，底层使用RAG构建，可以自定义对话模型和向量化模型以及向量数据库，目前支持OpenAI ChatGPT和OpenAI Embeddings.
![](/images/chat.svg)

### 其他功能：
正在开发中...


## 快速开始
### Docker运行
#### 1. 安装docker
Windows：下载Docker Destop，按照[官方教程](https://docs.docker.com/engine/install/)或者自行谷歌安装教程即可

#### 2. 克隆项目到本地
```bash
# 选择一个保存路径，假设是/your/path/
cd /your/path/
git clone https://github.com/tsmotlp/knowtate.git
```

#### 3. 修改环境变量
```bash
cd /your/path/knowtate
cp .env.example .env
```
在项目目录下，修改`.env.example`为`.env`，然后在`.env`中修改以下变量：
```shell
DATABASE_URL="mysql://root:knowtate@mysql:3306/knowtate"    # mysql的配置，保持默认即可

# minio配置，保持默认即可
MINIO_ENDPOINT: "minio"
MINIO_ACCESS_KEY: "knowtate"
MINIO_SECRET_KEY: "knowtate"

OPENAI_API_KEY= # 这里填入自己的OpenAI API Key（仅论文问答模块使用，需要科学上网），申请地址：https://platform.openai.com/api-keys
PROXY_URL=      # 这里填入自己的网络代理地址（仅论文问答模块使用，需要科学上网）
```
> windows下查看自己的网络代理地址：`设置`->`网络和Internet`->`手动设置代理`->`编辑`，将这里代理服务器的信息以http://localhost:10077的格式填入`PROXY_URL`即可
![](/images/proxy-windows.png)

> Linux下查看自己的网络代理地址：
> ```shell
> echo $HTTP_PROXY
> ```


#### 4. 构建镜像
```bash
cd /your/path/knowtate
docker-compose build --no-cache
```

#### 5. 运行
```bash
cd /your/path/knowtate
docker-compose up
```
执行之后就可以通过本地的 http://localhost:3000 访问本地部署的knowtate主页了

#### 6. 停止运行
```bash
cd /your/path/knowtate
docker-compose down
```

### 本地运行
脚本正在开发中...


## 贡献
欢迎贡献代码、报告问题或提出建议。请参阅[贡献指南](CONTRIBUTION).

## 许可证
本项目采用GPL-3.0许可证。详情请参阅[LICENSE](LICENSE)文件。