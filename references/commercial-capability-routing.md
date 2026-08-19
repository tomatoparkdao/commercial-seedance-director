# 商业宣传片能力路由

在三卡片状态机中按需读取下列子技能。不要一次加载全部文件；根据当前阶段和简报风险选择相关模块。

## Card 1：简报与方向确认

- 品类、制作模式和工作流：`skills/seedance-pipeline/SKILL.md`
- 风格选择与去品牌化风格描述：`skills/seedance-style/SKILL.md`
- 中文专业表达：`skills/seedance-vocab-zh/SKILL.md`
- 提示词资源分配：`references/allocation-model.md`
- 意图与精度取舍：`references/intent-vs-precision.md`
- 平台能力与不稳定参数：`references/surface-prompt-profiles.md`

Card 1 必须让用户确认品类、用途、片长目标、画幅、主风格、人物/产品引用素材和最终交付渠道。

## Card 2：分镜和提示词编导

- 镜头选择、焦段、机位和运镜：`skills/seedance-camera/SKILL.md`
- 主体动作、物理惯性和运动后果：`skills/seedance-motion/SKILL.md`
- 光源、色温、材质和气氛：`skills/seedance-lighting/SKILL.md`
- 音效、对白和音乐节奏：`skills/seedance-audio/SKILL.md`
- 人物、服装、产品和品牌连续性：`skills/seedance-characters/SKILL.md`
- 多镜头时序和承接：`skills/seedance-sequence/SKILL.md`
- 单镜继续生成：`skills/seedance-continuation/SKILL.md`
- VFX 与材料变化：`skills/seedance-vfx/SKILL.md`
- 采访、人物口播和企业访谈：`skills/seedance-interview/SKILL.md`
- 快节奏竖屏采访：`skills/seedance-interview-short/SKILL.md`
- 完整提示词编译：`skills/seedance-prompt/SKILL.md`
- 紧凑提示词版本：`skills/seedance-prompt-short/SKILL.md`
- 常用制作方案：`skills/seedance-recipes/SKILL.md`
- 删除空泛形容词：`skills/seedance-antislop/SKILL.md`

编译前还要按需读取：

- `references/cinematography-shot-language.md`
- `references/directing-engine.md`
- `references/prompt-compiler.md`
- `references/shot-list-continuity.md`
- `references/reference-workflow.md`
- `references/reference-transfer-contract.md`
- `references/event-density.md`
- `references/multishot-grammar.md`
- `references/audio-guide.md`
- `references/color-pipeline-aces.md`

Card 2 的每个镜头至少交付：镜号、时长、景别、焦段、机位、唯一主运镜、主体动作、物理后果、结束状态、光线、材质、声音、连续性锁、Seedance 四段式提示词、motion 和画幅。

## Card 3：生成、轮询和交付

- API 与人工平台工作流：`references/api-workflow.md`
- 能力现状与平台限制：`references/api-status.md`、`references/platform-surface-matrix.md`
- 失败分析和提示词修复：`skills/seedance-troubleshoot/SKILL.md`
- 生成失败图谱：`references/failure-atlas.md`
- 重拍策略：`references/retake-protocol.md`
- 连续性检查：`references/continuity-qc.md`
- 最终交付检查：`references/delivery-qc.md`
- 比例与多平台导出：`references/aspect-ratio-delivery.md`
- 字幕与本地化：`references/subtitles-localization.md`
- 音频后期交付：`references/audio-post-delivery.md`

Card 3 应对每个镜头记录任务 ID、状态、重试次数、采用版本、视频地址和失败原因。没有真实 provider 时显示配置要求，不能伪造完成状态。

## 工具和验证

- 提示词静态检查：`scripts/prompt_lint.py`
- Skill 与仓库验证：`scripts/validate_skills.py`、`scripts/validate_repo.py`
- Schema 验证：`scripts/schema_check.py`
- 连续镜头链检查：`scripts/continuity_chain_check.py`
- 项目状态检查：`scripts/project_state_check.py`
- 生成运行记录检查：`scripts/generation_run_check.py`
- 评估运行：`scripts/eval_run.py`

结构化工程数据使用 `schemas/`；完整示范使用 `examples/`；评测输入与预期使用 `evals/`；机器可读词表使用 `data/`。
