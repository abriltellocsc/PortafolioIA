const fs = require('fs');
const content = fs.readFileSync('c:/Users/juare/Documents/UTN - TUP/TFI/PortafolioIA/frontend/src/pages/MyPortfolioPage.tsx', 'utf8');
let braces = 0;
let parens = 0;
let inString = false;
let stringChar = '';
let escape = false;
let lineNum = 1;
let issues = [];

for (let i = 0; i < content.length; i++) {
  const ch = content[i];
  const prev = content[i-1];
  
  if (ch === '\n') lineNum++;
  
  if (escape) {
    escape = false;
    continue;
  }
  
  if (ch === '\\') {
    escape = true;
    continue;
  }
  
  if (!inString && (ch === '"' || ch === "'" || ch === '`')) {
    inString = true;
    stringChar = ch;
    continue;
  }
  
  if (inString && ch === stringChar) {
    inString = false;
    continue;
  }
  
  if (inString) continue;
  
  // Skip JSX tags for brace counting
  if (ch === '<') {
    // Look ahead to see if this is JSX
    let j = i + 1;
    while (j < content.length && content[j] !== '>' && content[j] !== ' ' && content[j] !== '\n') {
      j++;
    }
    const tagName = content.slice(i+1, j);
    if (tagName && tagName[0] === tagName[0].toLowerCase() && !tagName.includes('{')) {
      // It's a lowercase tag, likely HTML/JSX - skip content until closing >
      while (i < content.length && content[i] !== '>') {
        if (content[i] === '{') {
          // This is a JSX expression, count the brace
          braces++;
        }
        i++;
      }
      continue;
    }
  }
  
  if (ch === '{') {
    braces++;
  }
  if (ch === '}') {
    braces--;
    if (braces < 0) {
      issues.push(`Line ${lineNum}: Too many closing braces`);
      braces = 0;
    }
  }
  if (ch === '(') parens++;
  if (ch === ')') parens--;
}

console.log('Final braces balance:', braces);
console.log('Final parens balance:', parens);
if (issues.length > 0) {
  console.log('Issues:', issues);
}
