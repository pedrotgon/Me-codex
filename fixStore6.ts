import fs from 'fs';

let storeTsx = fs.readFileSync('src/store.tsx', 'utf-8');

storeTsx = storeTsx.replace(/executionDate: ,\n\n\s+deadline: "-""-"/g, 'executionDate: "-",\n    deadline: "-"');

fs.writeFileSync('src/store.tsx', storeTsx);
console.log('Fixed executionDate: , deadline: "-""-" typo');
