import fs from 'fs';

let storeTsx = fs.readFileSync('src/store.tsx', 'utf-8');

// The initialTasks array has a bunch of due: "..." lines left.
storeTsx = storeTsx.replace(/(\s+)due: (.*?),?/g, (match, p1, p2) => {
  // if it's inside project, keep it? No wait, this might affect projects.
  // let's do a more careful replace.
  
  return `${p1}executionDate: ${p2.replace(/,$/, '')},\n${p1}deadline: "-"`;
});

// Since Project array ALSO got executionDate, let's just make Project use executionDate too, or restore Project to use due.
// It's easier to just ensure initialProjects uses due:
storeTsx = storeTsx.replace(/id: "pr-csv[\s\S]*?}/g, match => {
  return match.replace(/executionDate: (.*?), \n.*deadline: "-"/g, 'due: $1');
});

fs.writeFileSync('src/store.tsx', storeTsx);
console.log('Fixed ALL due occurences');
