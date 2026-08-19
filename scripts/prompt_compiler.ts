import styles from '../references/cinematic_styles.json';
import { Shot, StyleKey, validateAndSelfCorrect } from './validators';
export type CompiledSeedancePrompt = {
  shot_number: number;
  duration: string;
  seedance_prompt: string;
  parameters: { model: string; aspect_ratio: string; motion: number; fps: number };
};
export function compileSeedancePrompt(rawShot:Shot, styleKey:StyleKey, aspectRatio:'2.39:1'|'16:9'|'9:16'): CompiledSeedancePrompt { const check=validateAndSelfCorrect(rawShot); if(!check.valid) throw new Error(`[${check.error_code}] ${check.message}: ${check.details.join(', ')}`); const shot=check.sanitized_shot, style=(styles as any)[styleKey] || (styles as any).cinematic_film; return {shot_number:shot.shot_number,duration:`${shot.duration_s}s`,seedance_prompt:[`【镜头运镜】${shot.camera_movement}，画面稳定、焦点清晰。`,`【动态主体】${shot.subject_action}，呈现自然物理惯性与微动态。`,`【光影材质】${shot.lighting_material}，${style.lighting}。`,`【风格规范】${style.lens}，${style.color_style}，画幅 ${aspectRatio}。`].join(' '),parameters:{model:'Seedance 2.0 Pro',aspect_ratio:aspectRatio,motion:shot.motion_intensity,fps:30} }; }
