---
name: commercial-seedance-director
description: 商业宣传片、企业形象片、产品广告、文旅大片和 Seedance 视频生成工作流。将自然语言简报拆解为分镜，依次返回风格确认卡、分镜与提示词确认卡、渲染进度卡。用户提到商业视频、影视分镜、Seedance 或即梦视频生成时使用。
---

# Commercial Seedance Director

严格按阶段执行交互，不要跳步，也不要在用户确认前输出完整分镜、提示词或提交渲染。

这是一个完整的商业 Seedance 工作台，不是薄提示词包装器。执行任务前先读取 `references/commercial-capability-routing.md`，根据当前阶段加载 `skills/` 下的专业子技能以及对应 `references/`。镜头、动作、光线、声音、角色连续性、序列承接、VFX、失败修复和交付质检都必须使用对应模块，不要只依赖 `cinematic_styles.json`。

## 状态机

1. 收到自然语言简报时，调用 `createBriefCard`。只返回 **Card 1：风格与画幅确认**，包括已识别品类、推荐风格、推荐画幅和四种可选风格。明确等待用户选择并点击“生成分镜”。
2. 仅在收到 Card 1 的 `style_key`、`aspect_ratio` 和确认标志后，调用 `confirmDirection`。生成完整 Shot-by-Shot 分镜和每镜四段式提示词，并返回 **Card 2：方案与提示词确认**。明确等待用户点击“生成视频”。
3. 仅在收到 Card 2 的确认标志、已确认分镜和提示词后，调用 `submitRender`。返回 **Card 3：渲染进度**，其中包含每个镜头的任务 ID 和可轮询状态。
4. 轮询时调用 `pollRenderProgress`。只有真实 provider 返回 `COMPLETED` 和视频 URL 时，Card 3 才显示可播放/下载 URL；没有配置 `SEEDANCE_RENDER_ENDPOINT` 时，明确显示 `CONFIG_REQUIRED`，绝不伪造已生成视频。

## 镜头规则

- 每镜必须依次包含 `【镜头运镜】`、`【动态主体】`、`【光影材质】`、`【风格规范】`。
- 每个短镜头只选一个主运镜、一个主动作和可见的结束状态。
- CP-1 拒绝字段缺失或数值越界；CP-2 将微距镜头运动强度限制为 4；CP-3 自动补齐运镜措辞。
- 读取 `references/cinematic_styles.json` 选择风格；需要详细规则时读取 `references/seedance_spec.md`。

`templates/` 保存各阶段的 UI 结构，`scripts/workflow.ts` 保存阶段转换和卡片填充逻辑，`mcp_server.ts` 暴露阶段化 MCP 工具。

## 本地资源

- `skills/`：28 个 Seedance 专业子技能。
- `references/`：摄影、动作、灯光、声音、连续性、平台、交付和故障处理参考库。
- `schemas/`：项目状态、镜头合同和生成记录结构。
- `examples/`：分镜、续写、图生视频和多语言案例。
- `data/`：机器可读词表和数据映射。
- `scripts/`：商业状态机 TypeScript 与完整验证工具。
- `validation/`、`evals/`、`tests/`：规则、评测和回归测试。
- `docs/`、`assets/`：完整使用资料和视觉资产。
- `upstream-agents/`、`upstream-github/`、`upstream-os-root/`：参考工程的代理配置、自动化配置和根级资料镜像；仅作本地查阅，不覆盖本 Skill 的商业入口。
