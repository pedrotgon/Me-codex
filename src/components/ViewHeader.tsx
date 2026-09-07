import React from 'react';

export default function ViewHeader({ title, description, icon: Icon, action }: any) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-3 pb-3 border-b border-[#e8e8e8]">
      <div>
        <h2 className="text-[24px] font-serif font-normal text-[#0c2b15] flex items-center gap-2.5 tracking-tight">
          {Icon && <Icon className="w-5 h-5 text-[#0c2b15] shrink-0" />}
          {title}
        </h2>
        {description && <p className="text-[13px] font-sans text-[#696969] mt-1 leading-relaxed">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
