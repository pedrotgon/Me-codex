import React from 'react';

export default function ViewHeader({ title, description, icon: Icon, action }: any) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
      <div>
        <h2 className="text-[22px] font-bold text-forest flex items-center gap-2">
          {Icon && <Icon className="w-6 h-6 opacity-80" />}
          {title}
        </h2>
        {description && <p className="text-[14px] font-medium text-forest/60 mt-1.5 leading-relaxed">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
