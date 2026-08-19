"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitSeedanceRenderTask = submitSeedanceRenderTask;
exports.queryTaskStatus = queryTaskStatus;
async function submitSeedanceRenderTask(promptData) { const task_id = `seedance_task_${Date.now()}_shot${promptData.shot_number}`; const endpoint = process.env.SEEDANCE_RENDER_ENDPOINT; if (endpoint) {
    const r = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(promptData) });
    if (!r.ok)
        throw new Error(`Seedance endpoint returned ${r.status}`);
    return await r.json();
} return { task_id, status: 'QUEUED', estimated_wait_s: 25 }; }
async function queryTaskStatus(task_id) { return { task_id, status: 'PROCESSING', estimated_wait_s: 10 }; }
