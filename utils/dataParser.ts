import { ProcessedAd } from '../types';

// O caminho acima assume que 'utils' está dentro de 'src' ou similar. 
// Como o projeto é plano, ajustamos para './types' se necessário, 
// mas mantivemos a lógica de limpeza de dados.

const parseBRL = (val: string): number => {
  if (!val) return 0;
  const clean = val.replace(/R\$\s?/, '').replace(/\./g, '').replace(',', '.').replace(/%/g, '').trim();
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
};

export const parseCSVData = (csvContent: string): ProcessedAd[] => {
  const lines = csvContent.trim().split('\n');
  const dataRows = lines.slice(1);

  return dataRows.map(row => {
    const regex = /(?:^|,)(?:"([^"]*(?:""[^"]*)*)"|([^",]*))/g;
    const parts: string[] = [];
    let match;
    while ((match = regex.exec(row)) !== null) {
      parts.push(match[1] || match[2] || '');
    }

    if (parts.length < 10) return null as any;

    const adName = (parts[0] || '').trim();
    const revenue = parseBRL(parts[9]);
    const impressions = parseBRL(parts[1]);
    const clicks = parseBRL(parts[2]);
    const spend = parseBRL(parts[10]);

    let designer = 'Não Identificado';
    const names = ['Gabriel Barboza', 'Vinicius Carvalho', 'Guilherme Martins', 'Laysa Diniz', 'Gustavo Costa', 'Matheus Subires', 'Ender', 'Lucas Botelho', 'Júlia Lopes', 'Yuri Brandão', 'Lucas Sasaki'];
    for (const name of names) {
      if (adName.includes(name)) {
        designer = name;
        break;
      }
    }

    let format = 'Geral';
    const formatKeywords = [
      'Mudança Avatar', 'Criativo Novo', 'Novo Hook', 'Variação de Vídeo', 
      'Clickbait', 'Ripado', 'Podcast', 'BTC', 'IA', 'Metadados', 'Empilhamento', 'UGC'
    ];
    const lowerName = adName.toLowerCase();
    for (const k of formatKeywords) {
      if (lowerName.includes(k.toLowerCase())) {
        format = k;
        break;
      }
    }

    const funnelMatches = adName.match(/\[([^\]]*?F\d{2,4}[^\]]*?)\]/gi);
    let funnel = 'Geral / Outros';
    
    if (funnelMatches) {
        const structuralFunnel = funnelMatches.find(m => !m.includes('#') && m.length > 5);
        let extracted = structuralFunnel ? structuralFunnel.replace(/[\[\]]/g, '') : funnelMatches[0].replace(/[\[\]]/g, '');
        
        if (extracted === 'FTB_INTER-F210-2025-AQS') {
            extracted = 'GLT_INTER-F210-2026';
        }
        funnel = extracted;
    }

    return {
      adName, impressions, clicks, frequency: parseBRL(parts[3]),
      cpm: parseBRL(parts[4]), cpc: parseBRL(parts[5]),
      ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
      sales: parseBRL(parts[7]), cpa: parseBRL(parts[8]),
      revenue, spend, roas: spend > 0 ? revenue / spend : 0,
      margin: parseBRL(parts[12]), marginPercent: parseBRL(parts[13]),
      cvr: parseBRL(parts[18]), designer, format, funnel
    };
  }).filter(ad => ad !== null);
};