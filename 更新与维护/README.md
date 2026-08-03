# 网站更新与维护

本文件夹是个人学术网站的中文维护手册。网站源代码位于上一级目录，线上地址为 [https://hlsun.org](https://hlsun.org)。默认英文，中文首页位于 `/zh/`。

## 第一次在 VS Code 中打开

1. 打开 VS Code，选择“文件 → 打开文件夹”。
2. 选择 `E:\BaiduSyncdisk\个人网站`，不要只打开本手册文件夹。
3. 当 VS Code 提示推荐扩展时，安装 **Astro**；Markdownlint 和 GitLens 可按需安装。
4. 选择“终端 → 新建终端”，确认提示符位于项目根目录。
5. 首次使用或依赖有变化时运行 `corepack pnpm install`。
6. 按 `Ctrl+Shift+P`，输入“运行任务”，即可使用预设的网站任务。

## 每次更新的标准流程

```powershell
Set-Location "E:\BaiduSyncdisk\个人网站"
git pull --ff-only origin main
corepack pnpm install
npm run dev
```

浏览器打开终端显示的地址，通常是 `http://localhost:4321/`。修改并保存文件后，页面会自动刷新。

完成编辑后停止开发服务器（终端中按 `Ctrl+C`），再运行：

```powershell
npm run check
npm run build
git status
git add .
git commit -m "简要说明本次更新"
git push origin main
```

推送后 GitHub Actions 会自动部署。通常等待 1–3 分钟，再检查英文首页、中文首页和本次修改的页面。

## VS Code 快捷任务

- `Ctrl+Shift+B`：执行正式构建。
- `Ctrl+Shift+P` → “任务: 运行任务”：可选择启动本地预览、内容与类型检查、正式构建或查看正式构建。
- `Ctrl+Shift+G`：打开 VS Code 源代码管理界面，查看修改、提交和同步。

## 维护文档

- [内容更新指南](内容更新指南.md)：个人资料、研究项目、论文、Notes、照片和CV。
- [发布流程](发布流程.md)：Git提交、GitHub Pages部署及线上检查。
- [故障排查](故障排查.md)：Node、端口、构建、Git和部署常见问题。

## 安全原则

- 不要把身份证号、家庭住址、账号密码、访问令牌或未公开论文放入 `public/`、`src/` 或 Git 历史。
- `Private notes` 页面不等于加密空间。GitHub Pages 上的所有构建文件都可能被公众访问。
- 发布CV前先制作公开版，并移除不希望公开的电话、地址及其他敏感信息。
- 不直接编辑 `dist/`、`.astro/` 或 `node_modules/`；它们由工具自动生成。
