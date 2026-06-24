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
      if (obj.step_index >= 2980 && obj.step_index <= 3000) {
        console.log(`Step ${obj.step_index} (${obj.type || obj.source}):`);
        if (obj.content) {
          console.log(obj.content.substring(0, 500));
        }
        if (obj.tool_calls) {
          console.log(JSON.stringify(obj.tool_calls, null, 2));
        }
      }
    } catch (e) {}
  }
}

main();
