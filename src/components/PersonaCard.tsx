import React from 'react';
import { Users } from 'lucide-react';

const PersonaCard = ({ data, compact = false }) => {
  const hasAvatar = !!data.avatarUrl;

  return (
    <div className={`bg-white overflow-hidden flex flex-col h-full ${compact ? 'rounded-lg border border-slate-200' : 'rounded-2xl shadow-xl border border-slate-100'}`}>
      <div className={`relative ${compact ? 'h-32' : 'h-64'} bg-slate-100 group`}>
        {hasAvatar ? (
          <img
            src={data.avatarUrl}
            alt={data.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 pattern-grid-lg">
            <Users size={compact ? 24 : 48} className="mb-2 opacity-20" />
            <span className="text-xs font-medium uppercase tracking-widest opacity-40">No Portrait</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12 text-white">
          <h3 className={`font-bold ${compact ? 'text-lg leading-tight' : 'text-3xl'}`}>
            {data.name || "Persona Name"}
          </h3>
          <p className={`opacity-90 ${compact ? 'text-xs' : 'text-sm font-medium'}`}>
            {data.role || "Role"} • {data.age ? `${data.age} yrs` : "Age"}
          </p>
        </div>
      </div>

      <div className={`flex-1 flex flex-col ${compact ? 'p-3 gap-2' : 'p-6 gap-6'}`}>
        {!compact && data.quote && (
          <blockquote className="relative italic text-lg text-slate-600 border-l-4 border-indigo-500 pl-4 py-1">
            "{data.quote}"
          </blockquote>
        )}

        <div className={`grid grid-cols-2 ${compact ? 'gap-2 text-xs' : 'gap-4 text-sm'}`}>
          <div className="bg-slate-50 p-2 rounded border border-slate-100">
            <span className="block text-slate-400 text-[10px] uppercase font-bold">Location</span>
            <span className="font-medium text-slate-700">{data.nationality || "-"}</span>
          </div>
          <div className="bg-slate-50 p-2 rounded border border-slate-100">
             <span className="block text-slate-400 text-[10px] uppercase font-bold">Occupation</span>
             <span className="font-medium text-slate-700">{data.occupation || "-"}</span>
          </div>
        </div>

        {!compact && data.bio && (
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Background</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{data.bio}</p>
          </div>
        )}

        {!compact && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
            <div>
              <h4 className="text-xs font-bold uppercase text-emerald-600 mb-2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Goals
              </h4>
              <ul className="space-y-1">
                {data.goals.filter(g => g).map((g, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 flex-shrink-0"></span>
                    {g}
                  </li>
                ))}
                {data.goals.every(g => !g) && <span className="text-xs text-slate-300 italic">No goals listed</span>}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-rose-600 mb-2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> Pain Points
              </h4>
              <ul className="space-y-1">
                {data.frustrations.filter(f => f).map((f, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                     <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 flex-shrink-0"></span>
                    {f}
                  </li>
                ))}
                 {data.frustrations.every(f => !f) && <span className="text-xs text-slate-300 italic">No pain points listed</span>}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonaCard;
