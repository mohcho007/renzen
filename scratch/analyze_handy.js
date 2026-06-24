const fs = require('fs');
const path = require('path');

const contentPath = 'C:\\Users\\Home\\.gemini\\antigravity\\brain\\dba3de1f-edcc-4642-af9b-a0a1820ef545\\.system_generated\\steps\\2626\\content.md';
if (!fs.existsSync(contentPath)) {
  console.log("File does not exist: ", contentPath);
  process.exit(1);
}

const lines = fs.readFileSync(contentPath, 'utf8').split('\n');

console.log("=== Matching lines in Handy.com Page ===");
lines.forEach((line, idx) => {
  const cleanLine = line.trim();
  if (
    cleanLine.toLowerCase().includes('price') ||
    cleanLine.toLowerCase().includes('fee') ||
    cleanLine.toLowerCase().includes('total') ||
    cleanLine.toLowerCase().includes('discount') ||
    cleanLine.toLowerCase().includes('plan') ||
    cleanLine.toLowerCase().includes('membership') ||
    cleanLine.toLowerCase().includes('commit') ||
    cleanLine.toLowerCase().includes('terms') ||
    cleanLine.toLowerCase().includes('checkout') ||
    cleanLine.toLowerCase().includes('summary')
  ) {
    if (cleanLine.length > 5 && cleanLine.length < 300) {
      console.log(`Line ${idx + 1}: ${cleanLine}`);
    }
  }
});
