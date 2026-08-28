import fs from 'fs';

let storeTsx = fs.readFileSync('src/store.tsx', 'utf-8');

// Use a simple parsing or just read tasks from initialTasks.
const tasksStr = "[\n" + storeTsx.match(/const initialTasks: Task\[\] = \[([\s\S]*?)\];/)[1] + "\n]";
let tasks = [];
try {
  tasks = eval(tasksStr);
} catch (e) {
  console.log("Error evaluating tasks", e);
  process.exit(1);
}

if(tasks.length === 0) {
  console.log("No tasks found");
  process.exit(1);
}

const areasSet = new Set(tasks.map((t: any) => t.area).filter((a: string) => a && a !== 'Inbox'));
const projectsSet = new Set(tasks.map((t: any) => t.project).filter((p: string) => p));

const initialAreas = Array.from(areasSet).map((name: any, i) => ({
  id: `ar-csv-${i}`,
  name: name,
  icon: "📁",
  count: tasks.filter((t: any) => t.area === name).length
}));

const initialProjects = Array.from(projectsSet).map((title: any, i) => {
  const task = tasks.find((t: any) => t.project === title);
  return {
    id: `pr-csv-${i}`,
    title: title,
    desc: "",
    progress: 0,
    area: task ? task.area : 'Inbox',
    due: "-",
    status: 'active'
  };
});

storeTsx = storeTsx.replace(/const initialAreas: Area\[\] = \[\s*[\s\S]*?\s*\];/, "const initialAreas: Area[] = " + JSON.stringify(initialAreas, null, 2).replace(/"([^"]+)":/g, '$1:') + ";");
storeTsx = storeTsx.replace(/const initialProjects: Project\[\] = \[\s*[\s\S]*?\s*\];/, "const initialProjects: Project[] = " + JSON.stringify(initialProjects, null, 2).replace(/"([^"]+)":/g, '$1:') + ";");

fs.writeFileSync('src/store.tsx', storeTsx);
console.log('Successfully updated store.tsx with areas and projects linked to tasks.');
