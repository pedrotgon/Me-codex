const fs = require('fs');
let store = fs.readFileSync('src/store.tsx', 'utf-8');

const areaIcons = {
  "Unicamp": "♦️",
  "Estudo": "📝",
  "Saúde": "🤍",
  "Pessoal": "🏃",
  "Profissional": "💼",
  "Finanças": "🗂️",
  "Inbox": "📥"
};

const projectIcons = {
  "Engenharia Econômica": "📈",
  "LE704 - Laboratório de Engenharia 1": "🧪",
  "Cirurgia": "🩺",
  "2° Cérebro": "🧠",
  "Apartamento": "🏠",
  "Academia": "🏋️",
  "Alimentação base": "🥗",
  "ApartaRank": "📊",
  "Compras conscientes": "🛍️",
  "Dindoca": "🛍️",
  "Óculos": "🕶️",
  "Nutricionista": "🥗",
  "LLMOps": "🤖",
  "Financeiro mínimo": "🏦",
  "Formatura": "🎓",
  "Casaco de frio": "🧥",
  "Perfil profissional": "💼",
  "Mercado inteligente": "🛒"
};

store = store.replace(/name:\s*"([^"]+)",\s*icon:\s*"[^"]*"/g, (match, name) => {
  if (areaIcons[name]) {
    return `name: "${name}",\n    icon: "${areaIcons[name]}"`;
  }
  return match;
});

store = store.replace(/title:\s*"([^"]+)",\s*desc:/g, (match, title) => {
  if (projectIcons[title]) {
    return `title: "${title}",\n    icon: "${projectIcons[title]}",\n    desc:`;
  }
  return match;
});

fs.writeFileSync('src/store.tsx', store);
console.log("Projects and Areas updated");
