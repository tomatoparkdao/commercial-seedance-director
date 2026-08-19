import { createBriefCard, confirmDirection, submitRender, pollRenderProgress } from './scripts/workflow';

type Request = { jsonrpc?: string; id?: string | number | null; method: string; params?: Record<string, unknown> };
const tools = [
  { name: 'create_brief_card', description: '阶段 1：解析简报并返回 Card 1；等待用户确认风格和画幅。', inputSchema: { type: 'object', properties: { user_input: { type: 'string' } }, required: ['user_input'] } },
  { name: 'confirm_direction', description: '阶段 2：仅在 Card 1 确认后生成分镜和 Card 2。', inputSchema: { type: 'object', properties: { confirmed: { type: 'boolean' }, style_key: { type: 'string' }, aspect_ratio: { type: 'string' }, shots: { type: 'array' } }, required: ['confirmed', 'style_key', 'aspect_ratio', 'shots'] } },
  { name: 'submit_render', description: '阶段 3：仅在 Card 2 确认后提交任务并返回 Card 3。', inputSchema: { type: 'object', properties: { confirmed: { type: 'boolean' }, direction: { type: 'object' } }, required: ['confirmed', 'direction'] } },
  { name: 'poll_render_progress', description: '阶段 4：轮询 Card 3 中的任务 ID。', inputSchema: { type: 'object', properties: { task_ids: { type: 'array', items: { type: 'string' } } }, required: ['task_ids'] } }
];
function response(id: Request['id'], result: unknown) { return JSON.stringify({ jsonrpc: '2.0', id, result }); }
async function handle(req: Request) {
  if (req.method === 'initialize') return response(req.id, { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'commercial-seedance-director', version: '1.1.0' } });
  if (req.method === 'tools/list') return response(req.id, { tools });
  if (req.method !== 'tools/call') return response(req.id, { error: { code: -32601, message: `Unknown method: ${req.method}` } });
  const p = req.params || {}, name = String(p.name || ''), a = (p.arguments || {}) as Record<string, any>;
  try {
    if (name === 'create_brief_card') return response(req.id, { content: [{ type: 'text', text: JSON.stringify(createBriefCard(String(a.user_input || ''))) }] });
    if (name === 'confirm_direction') return response(req.id, { content: [{ type: 'text', text: JSON.stringify(confirmDirection(a as any)) }] });
    if (name === 'submit_render') return response(req.id, { content: [{ type: 'text', text: JSON.stringify(await submitRender(a as any)) }] });
    if (name === 'poll_render_progress') return response(req.id, { content: [{ type: 'text', text: JSON.stringify(await pollRenderProgress(a.task_ids)) }] });
    return response(req.id, { isError: true, content: [{ type: 'text', text: `Unknown tool: ${name}` }] });
  } catch (error) { return response(req.id, { isError: true, content: [{ type: 'text', text: error instanceof Error ? error.message : String(error) }] }); }
}
let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { buffer += chunk; const lines = buffer.split(/\r?\n/); buffer = lines.pop() || ''; for (const line of lines) if (line.trim()) void handle(JSON.parse(line)).then(output => process.stdout.write(output + '\n')); });
