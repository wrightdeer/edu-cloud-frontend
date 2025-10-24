# Edu-Cloud 教育云平台

> 一个基于Vue.js的在线学习资料管理系统

Edu-Cloud 是一个现代化的教育云平台前端项目，提供完整的在线学习资料管理功能。用户可以创建学习空间、按科目分类内容、上传和管理文件，并支持文件在线预览功能。

## 技术栈

- Vue.js 2.6
- Vue Router 3.5
- Vuex 3.6
- Element UI 2.15
- Axios 1.8
- Moment.js 2.30

## 功能特性

- 📚 学习资料管理：创建和管理学习空间
- 🏷️ 标签系统：支持多种技术标签分类
- 📁 文件管理：完整的文件夹和文件操作
- 👤 用户认证：验证码和密码登录
- 🔐 权限控制：细粒度的操作权限管理
- 📖 文件预览：支持图片和文本文件在线预览

## 项目结构

```
src/
├── assets/           # 静态资源文件
├── components/       # 公共组件
├── plugins/          # 插件配置
├── router/           # 路由配置
├── store/            # 状态管理
├── utils/            # 工具函数
├── views/            # 页面视图
└── App.vue          # 根组件
```

## 核心页面

- 登录页面：支持验证码和密码登录
- 学习资料页面：资料浏览和筛选
- 科目分类页面：科目管理
- 个人空间页面：个人信息和创建的内容
- 空间详情页面：具体学习空间的文件管理

## 核心组件

- SpaceCard：学习资料空间卡片组件
- SubjectCard：科目卡片组件

## 安装与运行

```bash
# 克隆项目
git clone <项目地址>

# 进入项目目录
cd edu-cloud

# 安装依赖
npm install

# 启动开发服务器
npm run serve

# 构建生产环境
npm run build
```

## 开发配置

项目使用 Vue CLI 5.0 构建，配置了以下功能：

- Babel 转译
- ESLint 代码检查
- Element UI 按需引入
- Axios HTTP 客户端
- Vue Router 路由管理
- Vuex 状态管理

## 代理配置

开发环境下配置了以下代理：

- `/api` 代理到后端服务
- `/oss` 代理到阿里云 OSS

## 许可证

[MIT](./LICENSE)

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目。