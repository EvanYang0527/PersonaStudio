import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', icon: Icon, loading, onClick, ...props }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm";
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md",
    secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 hover:border-rose-300",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={loading}
      {...props}
    >
      {loading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

export const Input = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label>}
    <input
      className={`px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm text-slate-800 placeholder:text-slate-400 ${className}`}
      {...props}
    />
  </div>
);

export const TextArea = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label>}
    <textarea
      className={`px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm text-slate-800 placeholder:text-slate-400 resize-none ${className}`}
      {...props}
    />
  </div>
);

export const Card = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 ${noPadding ? '' : 'p-6'} ${className}`}>
    {children}
  </div>
);

export const Badge = ({ children, color = 'indigo' }) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color] || colors.slate}`}>
      {children}
    </span>
  );
};
