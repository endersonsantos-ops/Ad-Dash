
import React from 'react';
import { DesignerStat } from '../types';

interface DesignerAnalyticsProps {
  stats: DesignerStat[];
  onSelectDesigner: (name: string, type: 'winners' | 'all') => void;
  selectedDesigner: string | null;
  currentViewType: 'winners' | 'all';
}

export const DesignerAnalytics: React.FC<DesignerAnalyticsProps> = ({ 
  stats, 
  onSelectDesigner, 
  selectedDesigner,
  currentViewType 
}) => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.sort((a, b) => b.highPerfCount - a.highPerfCount).map((designer) => {
        const isSelected = selectedDesigner === designer.name;
        
        return (
          <div 
            key={designer.name} 
            className={`bg-slate-800 border p-6 rounded-2xl shadow-xl flex flex-col transition-all hover:border-slate-500 group relative overflow-hidden ${
              isSelected 
                ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-indigo-500/10 scale-[1.02]' 
                : 'border-slate-700'
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className={`text-xl font-bold mb-1 transition-colors ${isSelected ? 'text-indigo-400' : 'text-white'}`}>
                  {designer.name}
                </h3>
                <p className="text-slate-400 text-xs uppercase font-semibold tracking-wider">Editor Criativo</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded text-[10px] font-bold border border-indigo-500/20 uppercase whitespace-nowrap">
                  {designer.totalAdsCount} Anúncios
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/20 uppercase whitespace-nowrap">
                  {designer.highPerfCount} Vencedores
                </span>
              </div>
            </div>

            <div className="space-y-4 flex-grow">
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                <p className="text-slate-500 text-[10px] mb-1 uppercase font-bold tracking-widest">Faturamento Total</p>
                <p className="text-2xl font-mono font-bold text-emerald-400">{formatter.format(designer.totalRevenue)}</p>
              </div>

              <div>
                <p className="text-slate-500 text-[10px] mb-2 uppercase font-bold tracking-widest">Breakdown por Formato</p>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                  {designer.formatBreakdown.sort((a,b) => b.count - a.count).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-slate-900/30 p-2 rounded-lg border border-slate-700/30">
                      <span className="text-slate-300 truncate font-medium">{item.format}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-indigo-400 font-mono font-bold">{item.count}</span>
                        <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full" 
                            style={{ width: `${(item.count / designer.totalAdsCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-700/50 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => onSelectDesigner(designer.name, 'winners')}
                  className={`py-2.5 px-3 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1 border shadow-sm ${
                    isSelected && currentViewType === 'winners'
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-slate-900 border-slate-700 text-emerald-400 hover:border-emerald-500/50 hover:bg-slate-800'
                  }`}
                >
                  Ver Sucessos
                </button>
                <button 
                  onClick={() => onSelectDesigner(designer.name, 'all')}
                  className={`py-2.5 px-3 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1 border shadow-sm ${
                    isSelected && currentViewType === 'all'
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-900 border-slate-700 text-indigo-400 hover:border-indigo-500/50 hover:bg-slate-800'
                  }`}
                >
                  Listar Todos
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
