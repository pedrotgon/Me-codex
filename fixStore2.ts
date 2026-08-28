import fs from 'fs';

let storeTsx = fs.readFileSync('src/store.tsx', 'utf-8');

// Also update initialTasks format.
storeTsx = storeTsx.replace(/due: (.*?),/g, 'executionDate: $1,\n    deadline: "-",');

// Update project and task add methods if they use `due`
storeTsx = storeTsx.replace(/due: "Hoje",/g, 'executionDate: "12-May-26",\n      deadline: "-",');

fs.writeFileSync('src/store.tsx', storeTsx);
console.log('Fixed dates in store.');
