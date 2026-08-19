export type Category = 'enterprise' | 'product' | 'tourism';
export type StyleKey = 'epic_natgeo' | 'apple_minimalist' | 'cinematic_film' | 'cyber_tech';
export type Shot = { shot_number:number; shot_type:'extreme_wide'|'wide'|'medium'|'close_up'|'macro'; camera_movement:string; subject_action:string; lighting_material:string; duration_s?:number; motion_intensity?:number };
export function validateAndSelfCorrect(raw: unknown): {valid:true; sanitized_shot: Required<Shot>} | {valid:false; error_code:string; message:string; details:string[]} {
  const s = raw as Partial<Shot>;
  const errors:string[]=[];
  if (typeof s.shot_number !== 'number' || s.shot_number <= 0) errors.push('shot_number');
  if (!['extreme_wide','wide','medium','close_up','macro'].includes(String(s.shot_type))) errors.push('shot_type');
  for (const k of ['camera_movement','subject_action','lighting_material'] as const) if (typeof s[k] !== 'string' || s[k].trim().length < (k==='camera_movement'?1:3)) errors.push(k);
  const duration_s=s.duration_s ?? 5, motion_intensity=s.motion_intensity ?? 5;
  if (typeof duration_s !== 'number' || duration_s < 2 || duration_s > 10) errors.push('duration_s');
  if (typeof motion_intensity !== 'number' || motion_intensity < 1 || motion_intensity > 10) errors.push('motion_intensity');
  if (errors.length) return {valid:false,error_code:'CP1_SCHEMA_INVALID',message:'分镜参数格式不完整',details:errors};
  let movement=s.camera_movement!.trim();
  if (!/运镜|镜头/.test(movement)) movement=`电影级平滑 ${movement} 运镜`;
  return {valid:true,sanitized_shot:{shot_number:s.shot_number!,shot_type:s.shot_type!,camera_movement:movement,subject_action:s.subject_action!.trim(),lighting_material:s.lighting_material!.trim(),duration_s,motion_intensity:s.shot_type==='macro' ? Math.min(motion_intensity,4) : motion_intensity}};
}
