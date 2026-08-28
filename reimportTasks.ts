import fs from 'fs';

let storeTsx = fs.readFileSync('src/store.tsx', 'utf-8');
const csv = fs.readFileSync('tasks.csv', 'utf-8');

const lines = csv.split('\n').map(l => l.trim()).filter(l => l);
const headers = lines[0].split('\t');

const records = lines.slice(1).map(line => {
  const values = line.split('\t');
  const record: any = {};
  headers.forEach((h, i) => {
    record[h] = values[i] || '';
  });
  return record;
});

const tasks = records.map((r: any, i: number) => {
  let status = 'not-started';
  if (r.Status.toLowerCase().includes('done')) status = 'done';
  if (r.Status.toLowerCase().includes('arquivadas')) status = 'arquivadas';
  if (r.Status.toLowerCase().includes('progredindo')) status = 'in-progress';
  
  return {
    id: 'tk-csv-' + i,
    title: r.Name,
    status: status,
    area: r.Area || 'Inbox',
    project: r.Project || undefined,
    due: r.Due || '-',
    priority: r.Prioridade || 'P 3',
    naipe: r.Naipe || undefined,
    day: r.Day || undefined,
    link: r.Link || undefined,
    battleTokens: r['Battle Tokens'] || undefined,
    subAreas: r['Sub Áreas'] || undefined
  };
});

storeTsx = storeTsx.replace(/const initialTasks: Task\[\] = \[\s*[\s\S]*?\s*\];/, "const initialTasks: Task[] = " + JSON.stringify(tasks, null, 2).replace(/"([^"]+)":/g, '$1:') + ";");

fs.writeFileSync('src/store.tsx', storeTsx);
console.log('Successfully updated store.tsx with ALL task properties.');
