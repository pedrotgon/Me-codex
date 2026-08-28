import fs from 'fs';
import path from 'path';

function replaceInDir(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      // We know task due -> executionDate, deadline
      // For generic cases where it references t.due, we change to t.executionDate.
      content = content.replace(/t\.due/g, 't.executionDate');
      content = content.replace(/task\.due/g, 'task.executionDate');
      content = content.replace(/d\.due/g, 'd.executionDate'); // For unifiedData mapping
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

replaceInDir('src/components');
console.log('Fixed properties in components.');
