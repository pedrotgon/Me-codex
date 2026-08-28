import fs from 'fs';

let storeTsx = fs.readFileSync('src/store.tsx', 'utf-8');

// Replace executionDate: "-", deadline: "-" with due: "-" inside Project objects
// Since it's mainly in initialProjects:
storeTsx = storeTsx.replace(/executionDate: "-",\n    deadline: "-"/g, 'due: "-"');

fs.writeFileSync('src/store.tsx', storeTsx);
console.log('Fixed projects dates in store.');
