import briefCardTemplate from '../templates/brief_card.json';
import directionCardTemplate from '../templates/direction_card.json';
import progressCardTemplate from '../templates/render_progress_card.json';
import { parseCommercialBrief } from './brief_parser';
import { compileSeedancePrompt, CompiledSeedancePrompt } from './prompt_compiler';
import { Shot, StyleKey } from './validators';
import { RenderTaskResponse, submitSeedanceRenderTask, queryTaskStatus } from './seedance_api';

export type AspectRatio = '2.39:1' | '16:9' | '9:16';
export type StoryboardShot = Shot & { title: string; visual: string; sound: string };
export type Direction = { style_key: StyleKey; aspect_ratio: AspectRatio; shots: StoryboardShot[]; prompts: CompiledSeedancePrompt[] };
type Card = Record<string, unknown>;

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const assertStyle = (value: unknown): StyleKey => {
  if (!['epic_natgeo', 'apple_minimalist', 'cinematic_film', 'cyber_tech'].includes(String(value))) throw new Error('CP1_INVALID_STYLE_KEY');
  return value as StyleKey;
};
const assertAspectRatio = (value: unknown): AspectRatio => {
  if (!['2.39:1', '16:9', '9:16'].includes(String(value))) throw new Error('CP1_INVALID_ASPECT_RATIO');
  return value as AspectRatio;
};

export function createBriefCard(userInput: string) {
  if (!userInput.trim()) throw new Error('CP1_BRIEF_REQUIRED');
  const brief = parseCommercialBrief(userInput);
  const card = clone(briefCardTemplate) as Card;
  card.data = { brief, stage: 'BRIEF_CONFIRMATION', next_action: 'confirm_direction' };
  return { stage: 'BRIEF_CONFIRMATION', brief, card, instruction: '请在 Card 1 选择风格和画幅，然后确认生成分镜。' };
}

export function confirmDirection(input: { confirmed: boolean; style_key: unknown; aspect_ratio: unknown; shots: StoryboardShot[] }) {
  if (input.confirmed !== true) throw new Error('CP1_BRIEF_CONFIRMATION_REQUIRED');
  if (!Array.isArray(input.shots) || input.shots.length === 0) throw new Error('CP1_STORYBOARD_REQUIRED');
  const style_key = assertStyle(input.style_key), aspect_ratio = assertAspectRatio(input.aspect_ratio);
  const prompts = input.shots.map(shot => compileSeedancePrompt(shot, style_key, aspect_ratio));
  const direction: Direction = { style_key, aspect_ratio, shots: input.shots, prompts };
  const card = clone(directionCardTemplate) as Card;
  card.data = { stage: 'DIRECTION_CONFIRMATION', direction, next_action: 'submit_render' };
  return { stage: 'DIRECTION_CONFIRMATION', direction, card, instruction: '请在 Card 2 审核分镜与提示词，然后确认生成视频。' };
}

export async function submitRender(input: { confirmed: boolean; direction: Direction }) {
  if (input.confirmed !== true) throw new Error('CP1_DIRECTION_CONFIRMATION_REQUIRED');
  if (!input.direction?.prompts?.length) throw new Error('CP1_COMPILED_PROMPTS_REQUIRED');
  const tasks = await Promise.all(input.direction.prompts.map(submitSeedanceRenderTask));
  return renderProgressCard(tasks);
}

export async function pollRenderProgress(taskIds: string[]) {
  if (!Array.isArray(taskIds) || taskIds.length === 0) throw new Error('CP1_TASK_IDS_REQUIRED');
  const tasks = await Promise.all(taskIds.map(queryTaskStatus));
  return renderProgressCard(tasks);
}

function renderProgressCard(tasks: RenderTaskResponse[]) {
  const card = clone(progressCardTemplate) as Card;
  const configured = Boolean(process.env.SEEDANCE_RENDER_ENDPOINT);
  card.data = { stage: 'RENDER_PROGRESS', provider_configured: configured, tasks, next_action: 'poll_render_progress' };
  return { stage: 'RENDER_PROGRESS', tasks, card, instruction: configured ? '可使用任务 ID 轮询渲染进度。' : '尚未配置 SEEDANCE_RENDER_ENDPOINT；当前任务未提交到真实渲染服务。' };
}
