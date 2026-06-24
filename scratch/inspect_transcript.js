const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function main() {
  const logFile = 'C:\\Users\\Home\\.gemini\\antigravity\\brain\\dba3de1f-edcc-4642-af9b-a0a1820ef545\\.system_generated\\logs\\transcript.jsonl';
  if (!fs.existsSync(logFile)) {
    console.log("Log file does not exist at:", logFile);
    return;
  }
  
  const fileStream = fs.createReadStream(logFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let stepCount = 0;
  for await (const line of rl) {
    stepCount++;
    try {
      const obj = JSON.parse(line);
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          if (tc.name === 'write_to_file' || tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
            const args = tc.args || (tc.arguments ? JSON.parse(tc.arguments) : {});
            const targetFile = args.TargetFile || args.targetFile || '';
            if (targetFile.includes('BookingWizard.tsx')) {
              console.log(`Step ${obj.step_index || stepCount}: ${tc.name} on BookingWizard.tsx`);
              if (args.CodeContent) {
                console.log(`  CodeContent length: ${args.CodeContent.length}`);
              }
              if (args.ReplacementChunks) {
                console.log(`  ReplacementChunks count: ${args.ReplacementChunks.length}`);
              }
            }
          }
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }
}

main();
