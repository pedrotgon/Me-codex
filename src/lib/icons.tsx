import React from 'react';

export const getAreaIcon = (name: string): React.ReactNode => {
  const map: Record<string, string> = {
    "Unicamp": "https://upload.wikimedia.org/wikipedia/pt/b/b2/Logo_da_UNICAMP.svg",
    "Estudo": "📝",
    "Saúde": "🤍",
    "Pessoal": "🏃",
    "Profissional": "💼",
    "Finanças": "🗂️",
    "Inbox": "📥"
  };
  const icon = map[name] || "📁";
  if (name === "Unicamp") {
    return <img src={icon} alt="Unicamp" className="w-[1.2em] h-[1.2em] object-contain inline-block" />;
  }
  return <span>{icon}</span>;
};

export const getProjectIcon = (title: string): React.ReactNode => {
  const map: Record<string, string> = {
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
  return <span>{map[title] || "📋"}</span>;
};

export const formatNaipe = (naipe: string | undefined): string => {
  if (!naipe || naipe === '-') return '-';
  return naipe.split(' ')[0];
};

