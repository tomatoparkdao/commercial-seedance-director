"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBriefCard = createBriefCard;
exports.confirmDirection = confirmDirection;
exports.submitRender = submitRender;
exports.pollRenderProgress = pollRenderProgress;
const brief_card_json_1 = __importDefault(require("../templates/brief_card.json"));
const direction_card_json_1 = __importDefault(require("../templates/direction_card.json"));
const render_progress_card_json_1 = __importDefault(require("../templates/render_progress_card.json"));
const brief_parser_1 = require("./brief_parser");
const prompt_compiler_1 = require("./prompt_compiler");
const seedance_api_1 = require("./seedance_api");
const clone = (value) => JSON.parse(JSON.stringify(value));
const assertStyle = (value) => {
    if (!['epic_natgeo', 'apple_minimalist', 'cinematic_film', 'cyber_tech'].includes(String(value)))
        throw new Error('CP1_INVALID_STYLE_KEY');
    return value;
};
const assertAspectRatio = (value) => {
    if (!['2.39:1', '16:9', '9:16'].includes(String(value)))
        throw new Error('CP1_INVALID_ASPECT_RATIO');
    return value;
};
function createBriefCard(userInput) {
    if (!userInput.trim())
        throw new Error('CP1_BRIEF_REQUIRED');
    const brief = (0, brief_parser_1.parseCommercialBrief)(userInput);
    const card = clone(brief_card_json_1.default);
    card.data = { brief, stage: 'BRIEF_CONFIRMATION', next_action: 'confirm_direction' };
    return { stage: 'BRIEF_CONFIRMATION', brief, card, instruction: '请在 Card 1 选择风格和画幅，然后确认生成分镜。' };
}
function confirmDirection(input) {
    if (input.confirmed !== true)
        throw new Error('CP1_BRIEF_CONFIRMATION_REQUIRED');
    if (!Array.isArray(input.shots) || input.shots.length === 0)
        throw new Error('CP1_STORYBOARD_REQUIRED');
    const style_key = assertStyle(input.style_key), aspect_ratio = assertAspectRatio(input.aspect_ratio);
    const prompts = input.shots.map(shot => (0, prompt_compiler_1.compileSeedancePrompt)(shot, style_key, aspect_ratio));
    const direction = { style_key, aspect_ratio, shots: input.shots, prompts };
    const card = clone(direction_card_json_1.default);
    card.data = { stage: 'DIRECTION_CONFIRMATION', direction, next_action: 'submit_render' };
    return { stage: 'DIRECTION_CONFIRMATION', direction, card, instruction: '请在 Card 2 审核分镜与提示词，然后确认生成视频。' };
}
async function submitRender(input) {
    if (input.confirmed !== true)
        throw new Error('CP1_DIRECTION_CONFIRMATION_REQUIRED');
    if (!input.direction?.prompts?.length)
        throw new Error('CP1_COMPILED_PROMPTS_REQUIRED');
    const tasks = await Promise.all(input.direction.prompts.map(seedance_api_1.submitSeedanceRenderTask));
    return renderProgressCard(tasks);
}
async function pollRenderProgress(taskIds) {
    if (!Array.isArray(taskIds) || taskIds.length === 0)
        throw new Error('CP1_TASK_IDS_REQUIRED');
    const tasks = await Promise.all(taskIds.map(seedance_api_1.queryTaskStatus));
    return renderProgressCard(tasks);
}
function renderProgressCard(tasks) {
    const card = clone(render_progress_card_json_1.default);
    const configured = Boolean(process.env.SEEDANCE_RENDER_ENDPOINT);
    card.data = { stage: 'RENDER_PROGRESS', provider_configured: configured, tasks, next_action: 'poll_render_progress' };
    return { stage: 'RENDER_PROGRESS', tasks, card, instruction: configured ? '可使用任务 ID 轮询渲染进度。' : '尚未配置 SEEDANCE_RENDER_ENDPOINT；当前任务未提交到真实渲染服务。' };
}
