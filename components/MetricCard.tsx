
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon, trend }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl transition-all hover:border-indigo-500/50 group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-900 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {trend.value}
          </span>
        )}
      </div>
      <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      {subtitle && <p className="text-slate-500 text-xs">{subtitle}</p>}
    </div>
  );
};
