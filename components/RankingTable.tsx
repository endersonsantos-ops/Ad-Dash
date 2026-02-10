
import React from 'react';
import { ProcessedAd } from '../types';

interface RankingTableProps {
  ads: ProcessedAd[];
}

export const RankingTable: React.FC<RankingTableProps> = ({ ads }) => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm shadow-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-800/80">
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rank</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Anúncio</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Faturamento</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Funil</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Editor</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">ROAS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {ads.map((ad, index) => (
            <tr key={index} className="hover:bg-slate-700/30 transition-colors group">
              <td className="px-6 py-4">
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded text-[11px] font-black tracking-tighter
                  ${index === 0 ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 
                    index === 1 ? 'bg-slate-300 text-black shadow-lg shadow-slate-300/20' : 
                    index === 2 ? 'bg-amber-700 text-white shadow-lg shadow-amber-700/20' : 'bg-slate-700 text-slate-400'}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="max-w-[240px] truncate font-bold text-slate-200 group-hover:text-white transition-colors" title={ad.adName}>
                  {ad.adName}
                </div>
                <div className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">{ad.format}</div>
              </td>
              <td className="px-6 py-4 text-right font-mono font-black text-emerald-400">
                {formatter.format(ad.revenue)}
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border
                  ${ad.funnel === 'TOFU' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                    ad.funnel === 'MOFU' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                    ad.funnel === 'BOFU' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                  {ad.funnel}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-slate-900 border border-slate-700 text-slate-400 group-hover:text-indigo-300 transition-colors uppercase">
                  {ad.designer}
                </span>
              </td>
              <td className="px-6 py-4 text-right text-slate-300 font-black font-mono text-xs">
                {ad.roas.toFixed(2)}X
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
