"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileSeedancePrompt = compileSeedancePrompt;
const cinematic_styles_json_1 = __importDefault(require("../references/cinematic_styles.json"));
const validators_1 = require("./validators");
function compileSeedancePrompt(rawShot, styleKey, aspectRatio) { const check = (0, validators_1.validateAndSelfCorrect)(rawShot); if (!check.valid)
    throw new Error(`[${check.error_code}] ${check.message}: ${check.details.join(', ')}`); const shot = check.sanitized_shot, style = cinematic_styles_json_1.default[styleKey] || cinematic_styles_json_1.default.cinematic_film; return { shot_number: shot.shot_number, duration: `${shot.duration_s}s`, seedance_prompt: [`【镜头运镜】${shot.camera_movement}，画面稳定、焦点清晰。`, `【动态主体】${shot.subject_action}，呈现自然物理惯性与微动态。`, `【光影材质】${shot.lighting_material}，${style.lighting}。`, `【风格规范】${style.lens}，${style.color_style}，画幅 ${aspectRatio}。`].join(' '), parameters: { model: 'Seedance 2.0 Pro', aspect_ratio: aspectRatio, motion: shot.motion_intensity, fps: 30 } }; }
