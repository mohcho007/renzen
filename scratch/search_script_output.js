const fs = require('fs');
const readline = require('readline');

async function main() {
  const logFile = 'C:\\Users\\Home\\.gemini\\antigravity\\brain\\dba3de1f-edcc-4642-af9b-a0a1820ef545\\.system_generated\\logs\\transcript.jsonl';
  if (!fs.existsSync(logFile)) return;

  const fileStream = fs.createReadStream(logFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      if (obj.content && obj.content.includes('refactor_steps_centered.js')) {
        console.log(`Step ${obj.step_index}:`);
        console.log(obj.content);
      }
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          if (tc.name === 'run_command' && tc.args && tc.args.CommandLine && tc.args.CommandLine.includes('refactor_steps_centered.js')) {
            console.log(`Step ${obj.step_index} tool call:`, tc.args.CommandLine);
          }
        }
      }
      // Also look for command outputs containing refactor_steps_centered
      if (obj.type === 'TOOL_RESPONSE' && obj.content && (obj.content.includes('restructuring columns') || obj.content.includes('refactor_steps_centered'))) {
        console.log(`Step ${obj.step_index} response:`);
        console.log(obj.content.substring(0, 1000));
      }
    } catch (e) {}
  }
}

main();
