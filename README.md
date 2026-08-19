# Commercial Seedance Director

一个面向商业广告、产品宣传片、企业形象片和文旅宣传片的 Seedance 视频导演 Skill。

它把自然语言简报按三阶段交互流程转换为可执行的商业视频方案：

1. **Card 1：方向确认**：识别品类，确认风格、画幅、时长和交付渠道。
2. **Card 2：分镜确认**：生成完整 Shot-by-Shot 分镜、连续性锁和 Seedance 四段式提示词。
3. **Card 3：渲染进度**：在真实渲染服务可用时提交任务并轮询状态；未配置 provider 时不会伪造视频完成结果。

## 内容

- `SKILL.md`：Codex 入口和商业导演工作流
- `skills/`：28 个 Seedance 专业子技能
- `references/`：摄影、动作、灯光、声音、连续性、平台、交付和故障处理资料
- `schemas/`、`examples/`、`data/`、`validation/`、`evals/`、`docs/`、`assets/`、`tests/`
- `scripts/workflow.ts`：三阶段卡片状态机
- `mcp_server.ts`：stdio MCP 入口
- `seedance-os-scripts/`：参考工程的辅助脚本镜像
- `upstream-agents/`、`upstream-github/`、`upstream-os-root/`：参考工程配置和根级资料镜像

## 本地开发

```bash
pnpm install
pnpm run build
pnpm test
```

设置 `SEEDANCE_RENDER_ENDPOINT` 后，Card 3 才会向真实供应商提交渲染请求。不要把 API key、账号 cookie 或私有素材提交到仓库。

## 许可证

商业状态机和本仓库新增编排代码按 MIT 许可证发布。参考 Seedance OS 内容及其许可证保存在 [THIRD_PARTY_LICENSE_SEEDANCE_OS.txt](THIRD_PARTY_LICENSE_SEEDANCE_OS.txt)；相关上游文件的原始许可证和说明保存在 `upstream-os-root/`。
