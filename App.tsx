import React, { useState, useMemo } from 'react';
import { parseCSVData } from './utils/dataParser';
import { ProcessedAd, MetricSummary, DesignerStat } from './types';
import { MetricCard } from './components/MetricCard';
import { RankingTable } from './components/RankingTable';
import { DesignerAnalytics } from './components/DesignerAnalytics';

type Tab = 'dashboard' | 'designers' | 'weekly';
type ViewType = 'winners' | 'all';
type WeeklySubTab = 'ads' | 'designers';

// DADOS DE JANEIRO 2026 - BASE COMPLETA ENVIADA PELO USUÁRIO
const FULL_CSV_JAN_2026 = `Ad Name,# Impressões,# Clicks,# Frequência,R$ CPM,R$ CPC,% CTR,# Vendas Reais,R$ CPA Real,R$ Faturamento,R$ Valor Gasto,# ROAS,R$ Margem,% Margem,R$ Margem Projetada,% Margem Projetada,R$ TMF,R$ EPC,% CVR
[#RIPYT] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],5.976.612,236.282,1,"R$ 223,58","R$ 5,66","3,95%",1.145,"R$ 1.167,05","2.371.723,21","R$ 1.336.269,74","1,43","R$ 261.273,33","11,02%","R$ 214.201,23","9,03%","R$ 2.071,37","R$ 10,04","0,48%"
[#767_cv52_cb184_vr30] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],1.642.556,70.561,1,"R$ 227,31","R$ 5,29","4,3%",315,"R$ 1.185,3","627.261,16","R$ 373.369,62","1,38","R$ 54.618,33","8,71%","R$ 34.538,04","5,51%","R$ 1.991,31","R$ 8,89","0,45%"
[#910_cv10_cb30_vr225] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],363.866,13.896,"1,01","R$ 252,24","R$ 6,6","3,82%",82,"R$ 1.119,27","175.718,76",R$ 91.780,"1,72","R$ 39.357,96","22,4%","R$ 20.253,61","11,53%","R$ 2.142,91","R$ 12,65","0,59%"
[#793_cv52_cb184_vr45] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Lucas Botelho],254.255,9.747,1,"R$ 207,53","R$ 5,41","3,83%",54,"R$ 977,13","119.147,39","R$ 52.765,13","1,94","R$ 33.189,1","27,86%","R$ 24.661,4","20,7%","R$ 2.206,43","R$ 12,22","0,55%"
[#2_cv1_cb2_vr0] [UGC] [Criativo Novo] [MLT_INTER-F226-2025-AQS] [Facebook Ad's] [Copywriter Yuri Brandão] [Designer Vinicius Carvalho],78.028,5.915,"1,01","R$ 263,07","R$ 3,47","7,58%",28,"R$ 733,1","64.696,82","R$ 20.526,67","2,77","R$ 25.964,04","40,13%","R$ 19.637,73","30,35%","R$ 2.310,6","R$ 10,94","0,47%"
[#694_cv52_cb184_vr23] [UGC] [Variação de Vídeo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Ender],245.878,11.025,1,"R$ 186,53","R$ 4,16","4,48%",52,"R$ 882,02","103.745,51","R$ 45.864,85","1,75","R$ 20.191,79","19,46%","R$ 24.631,17","23,74%","R$ 1.995,11","R$ 9,41","0,47%"
[#765_cv10_cb30_vr210] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],547.247,26.766,1,"R$ 275,85","R$ 5,64","4,89%",120,"R$ 1.257,99","247.702,85","R$ 150.958,8","1,35","R$ 18.838,93","7,61%","R$ 10.357,82","4,18%","R$ 2.064,19","R$ 9,25","0,45%"
[#703_cv10_cb30_vr190] [UGC] [Novo Hook] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gustavo Costa],106.915,5.514,1,R$ 293,"R$ 5,68","5,16%",32,"R$ 978,95","65.864,41","R$ 31.326,45","1,83","R$ 16.383,02","24,87%","R$ 12.421,2","18,86%","R$ 2.058,26","R$ 11,94","0,58%"
[#20_cv7_cb20_vr0] [UGC] [Criativo Novo] [MLT_INTER-F226-2025-AQS] [Facebook Ad's] [Copywriter Yuri Brandão] [Designer Vinicius Carvalho],64.686,3.117,1,"R$ 303,48","R$ 6,3","4,82%",22,"R$ 892,32","47.092,39","R$ 19.630,98","2,16","R$ 14.752,04","31,33%","R$ 10.236,54","21,74%","R$ 2.140,56","R$ 15,11","0,71%"
[#711_cv58_cb202_vr3] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],253.728,8.788,1,"R$ 137,7","R$ 3,98","3,46%",29,"R$ 1.204,75","66.041,74","R$ 34.937,63","1,65","R$ 14.431,33","21,85%","R$ 8.716,93","13,2%","R$ 2.277,3","R$ 7,51","0,33%"
[#891_cv74_cb285_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],82.500,3.883,1,"R$ 197,56","R$ 4,2","4,71%",20,"R$ 814,95","40.220,69","R$ 16.299,06","1,98","R$ 9.861,97","24,52%","R$ 9.941,12","24,72%","R$ 2.011,03","R$ 10,36","0,52%"
[#8_cv3_cb8_vr0] [UGC] [Criativo Novo] [MLT_INTER-F226-2025-AQS] [Facebook Ad's] [Copywriter Yuri Brandão] [Designer Vinicius Carvalho],35.878,2.006,1,"R$ 355,12","R$ 6,35","5,59%",14,"R$ 910,08","33.481,15","R$ 12.741,1","2,18","R$ 9.500,56","28,38%","R$ 8.839,33","26,4%","R$ 2.391,51","R$ 16,69","0,7%"
[#678_cv52_cb184_vr22] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Matheus Subires],172.496,5.563,"1,01","R$ 162,5","R$ 5,04","3,23%",34,"R$ 824,41","69.419,21",R$ 28.030,"1,62","R$ 9.006,9","12,97%","R$ 18.590,35","26,78%","R$ 2.041,74","R$ 12,48","0,61%"
[#912_cv52_cb184_vr66] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],626.466,24.751,"1,01","R$ 221,57","R$ 5,61","3,95%",113,"R$ 1.228,37","219.109,22","R$ 138.805,69","1,29","R$ 8.754,91",4%,"R$ 4.148,44","1,89%","R$ 1.939,02","R$ 8,85","0,46%"
[#934_cv88_cb305_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Yuri Brandão] [Designer Guilherme Martins],35.877,1.500,1,"R$ 271,88","R$ 6,5","4,18%",11,"R$ 886,75","23.799,61","R$ 9.754,24","2,26","R$ 8.470,44","35,59%","R$ 5.376,49","22,59%","R$ 2.163,6","R$ 15,87","0,73%"
[#868_cv68_cb263_vr0] [Ripado] [Ripado] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],140.385,6.487,1,"R$ 226,89","R$ 4,91","4,62%",31,"R$ 1.027,47","65.673,1","R$ 31.851,57","1,51","R$ 8.350,27","12,71%","R$ 12.569,01","19,14%","R$ 2.118,49","R$ 10,12","0,48%"
[#25_cv9_cb25_vr0] [UGC] [Criativo Novo] [MLT_INTER-F229-2025-AQS] [Facebook Ad's] [Copywriter Lucas Sasaki] [Designer Gustavo Costa],24.635,1.239,"1,01","R$ 352,16",R$ 7,"5,03%",10,"R$ 867,55","25.493,53","R$ 8.675,48","2,34","R$ 7.567,42","29,68%","R$ 7.935,39","31,13%","R$ 2.549,35","R$ 20,58","0,81%"
[#710_cv58_cb202_vr2] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],114.026,5.642,1,"R$ 230,52","R$ 4,66","4,95%",22,"R$ 1.194,79","51.139,11","R$ 26.285,32","1,53","R$ 7.134,68","13,95%","R$ 8.706,23","17,02%","R$ 2.324,51","R$ 9,06","0,39%"
[#1090_cv62_cb238_vr1] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gustavo Costa],63.069,1.720,"1,01","R$ 240,28","R$ 8,81","2,73%",14,"R$ 1.082,44","28.212,67","R$ 15.154,22","1,73","R$ 6.586,69","23,35%","R$ 2.919,04","10,35%","R$ 2.015,19","R$ 16,4","0,81%"
[Mel Oz 2],243.856,9.914,"1,01","R$ 221,39","R$ 5,45","4,07%",40,"R$ 1.349,7","83.984,49","R$ 53.988,12","1,35","R$ 6.314,7","7,52%","R$ 35,48","0,04%","R$ 2.099,61","R$ 8,47","0,4%"
[#472_cv10_cb30_vr] [UGC] [Novo Hook] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],134.015,7.494,1,"R$ 235,36","R$ 4,21","5,59%",34,"R$ 927,71","69.936,3","R$ 31.542,16","1,38","R$ 6.060,87","8,67%","R$ 16.969,73","24,26%","R$ 2.056,95","R$ 9,33","0,45%"
[#875_cv68_cb270_vr] [UGC] [Novo Hook] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Laysa Diniz],328.683,13.929,1,"R$ 207,01","R$ 4,88","4,24%",58,"R$ 1.173,12","111.808,07","R$ 68.040,86","1,32","R$ 6.013,22","5,38%","R$ 5.209,66","4,66%","R$ 1.927,73","R$ 8,03","0,42%"
[#712_cv52_cb184_vr25] [UGC] [Variação de Vídeo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Ender],167.098,7.774,"1,01","R$ 165,84","R$ 3,56","4,65%",23,"R$ 1.204,84","44.395,24","R$ 27.711,42","1,41","R$ 5.990,33","13,49%","R$ 1.231,01","2,77%","R$ 1.930,23","R$ 5,71","0,3%"
[#510_cv52_cb184_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Yuri Brandão] [Designer Vinicius Carvalho],866.253,34.681,1,"R$ 228,23","R$ 5,7",4%,148,"R$ 1.335,85","324.323,85","R$ 197.706,48","1,19","R$ 5.407,11","1,67%","R$ 23.201,93","7,15%","R$ 2.191,38","R$ 9,35","0,43%"
[#1003_cv52_cb184_vr76] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],53.082,2.184,1,"R$ 246,81",R$ 6,"4,11%",11,"R$ 1.191,04","23.908,55","R$ 13.101,39","1,69","R$ 5.121,45","21,42%","R$ 2.013,34","8,42%","R$ 2.173,5","R$ 10,95","0,5%"
[#9_cv3_cb9_vr0] [UGC] [Criativo Novo] [MLT_INTER-F229-2025-AQS] [Facebook Ad's] [Copywriter Lucas Sasaki] [Designer Vinicius Carvalho],39.932,3.072,1,"R$ 341,61","R$ 4,44","7,69%",12,"R$ 1.136,76","24.540,19","R$ 13.641,17","1,68","R$ 5.053,77","20,59%","R$ 1.863,55","7,59%","R$ 2.045,02","R$ 7,99","0,39%"
[#12_cv5_cb12_vr] [UGC] [Criativo Novo] [VPF_INTER-F252-2025-AQS] [Facebook Ad's] [Copywriter Lucas Sasaki] [Designer Vinicius Carvalho],33.580,3.222,1,"R$ 250,52","R$ 2,61","9,59%",8,"R$ 1.051,55","17.441,58","R$ 8.412,42","1,92","R$ 4.940,15","28,32%","R$ 2.672,75","15,32%","R$ 2.180,2","R$ 5,41","0,25%"
[#6_cv2_cb6_vr0] [UGC] [Criativo Novo] [MLT_INTER-F229-2025-AQS] [Facebook Ad's] [Copywriter Lucas Sasaki] [Designer Vinicius Carvalho],25.415,1.380,"1,01","R$ 414,23","R$ 7,63","5,43%",11,"R$ 957,07","19.563,25","R$ 10.527,72","1,73","R$ 4.308,98","22,03%","R$ 1.765,75","9,03%","R$ 1.778,48","R$ 14,18","0,8%"
[#18_cv6_cb18_vr0] [UGC] [Criativo Novo] [MLT_INTER-F229-2025-AQS] [Facebook Ad's] [Copywriter Lucas Sasaki] [Designer Vinicius Carvalho],17.797,966,1,"R$ 329,57","R$ 6,07","5,43%",5,"R$ 1.173,07","13.549,87","R$ 5.865,34","2,15","R$ 4.236,6","31,27%","R$ 2.475,11","18,27%","R$ 2.709,97","R$ 14,03","0,52%"
[#888_cv73_cb282_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],61.046,2.548,1,"R$ 195,05","R$ 4,67","4,17%",12,"R$ 992,24","24.340,34","R$ 11.906,89","1,65","R$ 4.146,45","17,04%","R$ 4.264,07","17,52%","R$ 2.028,36","R$ 9,55","0,47%"
[#666_cv10_cb30_vr174] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gustavo Costa],53.025,2.130,1,"R$ 221,58","R$ 5,52","4,02%",7,"R$ 1.678,47","19.455,02","R$ 11.749,27","1,54","R$ 3.953,91","20,32%","R$ 1.424,76","7,32%","R$ 2.779,29","R$ 9,13","0,33%"
[#1083_cv73_cb283_vr27] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],138.365,7.385,"1,01","R$ 169,56","R$ 3,18","5,34%",15,"R$ 1.564,03","35.606,83","R$ 23.460,51","1,41","R$ 3.918,62","11,01%","R$ -710,27","-1,99%","R$ 2.373,79","R$ 4,82","0,2%"
[Tom 3] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto],68.029,2.422,1,"R$ 177,22","R$ 4,98","3,56%",10,"R$ 1.205,58","22.705,43","R$ 12.055,85","1,56","R$ 3.696,37","16,28%","R$ 3.380,53","14,89%","R$ 2.270,54","R$ 9,37","0,41%"
[#677_cv52_cb184_vr21] [Podcast] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Matheus Subires],130.849,6.480,1,"R$ 234,06","R$ 4,73","4,95%",25,"R$ 1.225,06","54.140,9","R$ 30.626,48","1,31","R$ 3.647,87","6,74%","R$ 5.872,1","10,85%","R$ 2.165,64","R$ 8,36","0,39%"
[#911_cv10_cb30_vr226] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],16.589,791,1,"R$ 268,1","R$ 5,62","4,77%",5,"R$ 889,51","10.100,75","R$ 4.447,56","2,1","R$ 3.431,07","33,97%","R$ 2.117,97","20,97%","R$ 2.020,15","R$ 12,77","0,63%"
[#909_cv52_cb184_vr65] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],26.775,1.139,"1,01","R$ 159,66","R$ 3,75","4,25%",4,"R$ 1.068,74","10.281,03","R$ 4.274,95","1,98",R$ 3.378,"32,86%","R$ 2.464,86","23,97%","R$ 2.570,26","R$ 9,03","0,35%"
[#1002_cv52_cb337_vr0] [UGC] [Novo Hook] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],145.499,5.715,1,"R$ 336,48","R$ 8,57","3,93%",34,"R$ 1.439,91","69.490,42","R$ 48.956,84","1,27","R$ 3.374,72","4,86%","R$ -4.706,46","-6,77%","R$ 2.043,84","R$ 12,16","0,59%"
[#26_cv9_cb26_vr0] [UGC] [Criativo Novo] [MLT_INTER-F229-2025-AQS] [Facebook Ad's] [Copywriter Lucas Sasaki] [Designer Gustavo Costa],21.584,1.034,"1,01","R$ 339,89","R$ 7,09","4,79%",5,"R$ 1.467,22","14.245,3","R$ 7.336,11","1,81","R$ 3.344,24","23,48%","R$ 1.492,35","10,48%","R$ 2.849,06","R$ 13,78","0,48%"
[#887_cv72_cb281_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],8.231,323,1,"R$ 316,54","R$ 8,07","3,92%",3,"R$ 868,48","7.603,86","R$ 2.605,43","2,7","R$ 3.272,25","43,03%","R$ 2.283,75","30,03%","R$ 2.534,62","R$ 23,54","0,93%"
[#870_cv68_cb265_vr0] [Ripado] [Ripado] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],132.765,5.921,1,"R$ 234,95","R$ 5,27","4,46%",26,"R$ 1.199,74","51.139,11","R$ 26.285,32","1,53","R$ 7.134,68","13,95%","R$ 8.706,23","17,02%","R$ 2.324,51","R$ 9,06","0,39%"
[#743_cv10_cb30_vr193] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],15.073,713,1,"R$ 251,34","R$ 5,31","4,73%",3,"R$ 1.262,84","9.428,29","R$ 3.788,51","1,78","R$ 2.939,73","31,18%","R$ 2.568,35","27,24%","R$ 3.142,76","R$ 13,22","0,42%"
[#660_cv52_cb183_vr14] [UGC] [Clickbait] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],20.894,967,1,"R$ 254,46","R$ 5,5","4,63%",5,"R$ 1.063,36","13.377,66","R$ 5.316,78","1,87","R$ 2.776,97","20,76%","R$ 3.770,38","28,18%","R$ 2.675,53","R$ 13,83","0,52%"
[#898_cv76_cb292_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Indefinido] [Designer Gustavo Costa],3.768,138,1,"R$ 257,3","R$ 7,03","3,66%",2,"R$ 484,75","4.882,03","R$ 969,5","4,65","R$ 2.751,4","56,36%","R$ 2.116,73","43,36%","R$ 2.441,02","R$ 35,38","1,45%"
[#908_cv52_cb184_vr64] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],92.097,4.052,1,"R$ 201,83","R$ 4,59","4,4%",14,"R$ 1.327,73","33.331,11","R$ 18.588,16","1,23","R$ 2.649,39","7,95%","R$ 2.843,76","8,53%","R$ 2.380,79","R$ 8,23","0,35%"
[#1004_cv98_cb338_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gustavo Costa],189.358,6.841,"1,01","R$ 208,91","R$ 5,78","3,61%",30,"R$ 1.318,65","60.465,39","R$ 39.559,38","1,3","R$ 2.511,74","4,15%","R$ -178,08","-0,29%","R$ 2.015,51","R$ 8,84","0,44%"
[#1126_cv68_cb283_vr0] [UGC] [Empilhamento] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],3.400,173,1,"R$ 244,63","R$ 4,81","5,09%",1,"R$ 831,75","4.316,32","R$ 831,75","4,82","R$ 2.431,13","56,32%","R$ 1.870,01","43,32%","R$ 4.316,32","R$ 24,95","0,58%"
[#646_cv52_cb184_vr5] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Laysa Diniz],104.681,3.846,1,"R$ 186,82","R$ 5,08","3,67%",19,"R$ 1.029,27","37.824,88","R$ 19.556,18","1,39","R$ 2.332,13","6,17%","R$ 6.455,13","17,07%","R$ 1.990,78","R$ 9,83","0,49%"
[#936_cv89_cb307_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Júlia Lopes] [Designer Gabriel Barboza],5.513,175,1,"R$ 342,95","R$ 10,8","3,17%",2,"R$ 945,34",5.245,"R$ 1.890,68","2,56","R$ 2.323,79","44,3%","R$ 1.641,94","31,3%","R$ 2.622,5","R$ 29,97","1,14%"
[#892_cv74_cb286_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],39.437,1.956,1,"R$ 247,97",R$ 5,"4,96%",7,"R$ 1.397,05","15.680,01","R$ 9.779,35","1,49","R$ 2.234,55","14,25%","R$ 196,15","1,25%",R$ 2.240,"R$ 8,02","0,36%"
[#775_cv10_cb30_vr218] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],4.972,331,1,"R$ 276,06","R$ 4,15","6,66%",3,"R$ 457,52","4.508,12","R$ 1.372,56","3,08","R$ 2.192,33","48,63%","R$ 1.606,28","35,63%","R$ 1.502,71","R$ 13,62","0,91%"
[#895_cv75_cb289_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],9.208,332,1,"R$ 249,91","R$ 6,93","3,61%",2,"R$ 1.150,58","5.355,13","R$ 2.301,15","2,15","R$ 2.013,92","37,61%","R$ 1.317,76","24,61%","R$ 2.677,57","R$ 16,13","0,6%"
[#960_cv95_cb322_vr] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Allan Brandão ] [Designer Laysa Diniz],143.138,7.599,1,"R$ 285,11","R$ 5,37","5,31%",31,"R$ 1.316,44","65.569,06","R$ 40.809,62","1,29","R$ 1.982,97","3,02%","R$ 2.510,52","3,83%","R$ 2.115,13","R$ 8,63","0,41%"
[#145_cv33_cb118_vr0] [UGC] [Novo Hook] [VPF_INTER-F252-2025-AQS] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Matheus Subires],1.127,112,1,"R$ 224,48","R$ 2,26","9,94%",1,"R$ 252,99","2.719,66","R$ 252,99","9,97","R$ 1.833,65","67,42%","R$ 1.480,09","54,42%","R$ 2.719,66","R$ 24,28","0,89%"
[#797_cv52_cb184_vr49] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Lucas Botelho],4.137,231,1,"R$ 257,76","R$ 4,62","5,58%",1,"R$ 1.066,35","3.449,1","R$ 1.066,35","3,05","R$ 1.825,04","52,91%","R$ 1.376,65","39,91%","R$ 3.449,1","R$ 14,93","0,43%"
[#978_cv10_cb272_vr] [UGC] [Clickbait] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],65.965,3.294,"1,01","R$ 166,45","R$ 3,33","4,99%",9,"R$ 1.219,96","16.651,81","R$ 10.979,68","1,41","R$ 1.700,14","10,21%","R$ -464,6","-2,79%","R$ 1.850,2","R$ 5,06","0,27%"
[#630_cv52_cb221_vr0] [UGC] [Novo Hook] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],36.875,1.964,1,"R$ 255,77","R$ 4,8","5,33%",9,"R$ 1.047,94","21.158,77","R$ 9.431,43","1,31","R$ 1.665,7","7,87%","R$ 5.596,57","26,45%","R$ 2.350,97","R$ 10,77","0,46%"
[#1135_cv98_cb338_vr3] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gustavo Costa],2.890,99,1,"R$ 332,85","R$ 9,72","3,43%",1,"R$ 961,93","3.163,88","R$ 961,93","3,06","R$ 1.638,11","51,78%","R$ 1.226,8","38,78%","R$ 3.163,88","R$ 31,96","1,01%"
[#726_cv62_cb238_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Júlia Lopes] [Designer Gustavo Costa],214.268,8.257,1,"R$ 235,51","R$ 6,11","3,85%",35,"R$ 1.441,81","75.313,62","R$ 50.463,22","1,23","R$ 1.634,51","2,17%","R$ -962,38","-1,28%","R$ 2.151,82","R$ 9,12","0,42%"
[#876_cv68_cb271_vr] [UGC] [Novo Hook] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Laysa Diniz],9.189,417,1,"R$ 252,81","R$ 5,57","4,54%",3,"R$ 774,36","4.989,72","R$ 2.323,07","1,99","R$ 1.570,04","31,47%","R$ 921,38","18,47%","R$ 1.663,24","R$ 11,97","0,72%"
[#1132_cv10_cb30_vr239] [UGC] [Variação de Vídeo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gustavo Costa],2.761,86,1,"R$ 349,67","R$ 11,23","3,11%",2,"R$ 482,73","3.247,98","R$ 965,45","3,14","R$ 1.537,81","47,35%","R$ 1.115,57","34,35%","R$ 1.623,99","R$ 37,77","2,33%"
[#899_cv77_cb293_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Indefinido] [Designer Gustavo Costa],3.546,131,1,"R$ 287,04","R$ 7,77","3,69%",2,"R$ 508,93","3.322,89","R$ 1.017,86","3,03","R$ 1.535,09","46,2%","R$ 1.103,11","33,2%","R$ 1.661,45","R$ 25,37","1,53%"
[#785_cv52_cb184_vr37] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],5.326,317,1,"R$ 251,74","R$ 4,23","5,95%",1,"R$ 1.340,76","3.665,48","R$ 1.340,76","2,57","R$ 1.509,04","41,17%","R$ 1.032,52","28,17%","R$ 3.665,48","R$ 11,56","0,32%"
#RIPM,1.275,153,1,"R$ 206,02","R$ 1,72",12%,1,"R$ 262,68","2.277,86","R$ 262,68","8,06","R$ 1.498,19","65,77%","R$ 1.202,07","52,77%","R$ 2.277,86","R$ 14,89","0,65%"
[#893_cv74_cb287_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],6.369,290,1,"R$ 311,21","R$ 6,83","4,55%",2,"R$ 991,04","4.262,34","R$ 1.982,08","1,99","R$ 1.387,42","32,55%","R$ 833,32","19,55%","R$ 2.131,17","R$ 14,7","0,69%"
[#995_cv52_cb330_vr0] [UGC] [Novo Hook] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],3.314,138,1,"R$ 313,09","R$ 7,52","4,16%",2,"R$ 518,8","3.183,1","R$ 1.037,59","2,84","R$ 1.377,04","43,26%","R$ 963,23","30,26%","R$ 1.591,55","R$ 23,07","1,45%"
[#955_cv93_cb317_vr] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Allan Brandão ] [Designer Laysa Diniz],32.844,1.861,1,"R$ 326,52","R$ 5,76","5,67%",9,"R$ 1.191,58","17.452,45","R$ 10.724,19","1,36","R$ 1.316,02","7,54%","R$ 709,81","4,07%","R$ 1.939,16","R$ 9,38","0,48%"
[#671_cv52_cb184_vr15] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Matheus Subires],9.702,449,1,"R$ 254,15","R$ 5,49","4,63%",2,"R$ 1.232,87","4.842,47","R$ 2.465,74","1,85","R$ 1.308,63","27,02%","R$ 679,11","14,02%","R$ 2.421,24","R$ 10,79","0,45%"
[#1131_cv10_cb30_vr238] [UGC] [Variação de Vídeo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gustavo Costa],2.762,133,1,"R$ 349,24","R$ 7,25","4,82%",1,"R$ 964,6","2.786,82","R$ 964,6","2,69","R$ 1.304,18","46,8%","R$ 941,89","33,8%","R$ 2.786,82","R$ 20,95","0,75%"
[#25_cv9_cb25_vr0] [UGC] [Criativo Novo] [MLT_INTER-F226-2025-AQS] [Facebook Ad's] [Copywriter Yuri Brandão] [Designer Vinicius Carvalho],12.824,578,"1,01","R$ 217,98","R$ 4,84","4,51%",2,"R$ 1.397,7","5.403,77","R$ 2.795,39","1,8","R$ 1.257,05","23,26%","R$ 554,56","10,26%","R$ 2.701,89","R$ 9,35","0,35%"
[#992_cv52_cb184_vr81] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gustavo Costa],109.273,4.525,1,"R$ 225,2","R$ 5,44","4,14%",22,"R$ 1.118,58","38.512,41","R$ 24.608,78","1,26","R$ 1.016,84","2,64%","R$ 265,42","0,69%","R$ 1.750,56","R$ 8,51","0,49%"
[#141_cv1_cb114_vr0] [UGC] [Novo Hook] [VPF_INTER-F252-2025-AQS] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Matheus Subires],1.127,82,1,"R$ 242,2","R$ 3,33","7,28%",1,"R$ 272,96","1.660,66","R$ 272,96","5,68","R$ 1.011,13","60,89%","R$ 795,24","47,89%","R$ 1.660,66","R$ 20,25","1,22%"
[#1120_cv10_cb374_vr0] [UGC] [Novo Hook] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],3.562,142,1,"R$ 270,3","R$ 6,78","3,99%",2,"R$ 481,4","2.482,69","R$ 962,81","2,39","R$ 923,16","37,18%","R$ 600,41","24,18%","R$ 1.241,35","R$ 17,48","1,41%"
[#900_cv77_cb294_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Indefinido] [Designer Gustavo Costa],6.259,235,1,"R$ 322,91","R$ 8,6","3,75%",1,"R$ 2.021,07","3.684,52","R$ 2.021,07","1,69","R$ 904,14","24,54%","R$ 425,16","11,54%","R$ 3.684,52","R$ 15,68","0,43%"
[#924_cv52_cb184_vr69] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],7.128,350,"1,01","R$ 168,94","R$ 3,44","4,91%",1,"R$ 1.204,17","2.591,46","R$ 1.204,17",2,"R$ 890,72","34,37%","R$ 553,83","21,37%","R$ 2.591,46","R$ 7,4","0,29%"
[#848_cv69_cb274_vr4] [Ripado] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],8.551,423,1,"R$ 422,96","R$ 8,55","4,95%",2,"R$ 1.808,36","5.784,18","R$ 3.616,73","1,48","R$ 785,63","13,58%","R$ 33,69","0,58%","R$ 2.892,09","R$ 13,67","0,47%"
[#1000_cv52_cb335_vr0] [UGC] [Novo Hook] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],7.206,293,1,R$ 348,"R$ 8,56","4,07%",2,"R$ 1.253,84","4.280,09","R$ 2.507,68","1,58","R$ 763,83","17,85%","R$ 207,41","4,85%","R$ 2.140,05","R$ 14,61","0,68%"
[#909_cv52_cb184_vr65] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza].mp4,28.257,1.034,1,"R$ 223,48","R$ 6,11","3,66%",5,"R$ 1.262,98","9.184,58","R$ 6.314,88","1,35","R$ 739,5","8,05%","R$ -454,49","-4,95%","R$ 1.836,92","R$ 8,88","0,48%"
[#869_cv68_cb264_vr0] [Ripado] [Ripado] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],10.350,457,1,R$ 227,"R$ 5,14","4,42%",1,"R$ 2.349,43","3.670,45","R$ 2.349,43","1,45","R$ 694,97","18,93%","R$ 217,81","5,93%","R$ 3.670,45","R$ 8,03","0,22%"
[#997_cv52_cb332_vr0] [UGC] [Novo Hook] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],7.552,303,1,"R$ 343,83","R$ 8,57","4,01%",1,"R$ 2.596,64","4.268,25","R$ 2.596,64","1,52","R$ 660,42","15,47%","R$ 105,54","2,47%","R$ 4.268,25","R$ 14,09","0,33%"
[#865_cv50_cb178_vr5] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],21.101,888,1,"R$ 284,04","R$ 6,75","4,21%",5,"R$ 1.198,72","8.645,15","R$ 5.993,6","1,33","R$ 614,4","7,11%","R$ -509,47","-5,89%","R$ 1.729,03","R$ 9,74","0,56%"
[#12_cv4_cb12_vr0] [UGC] [Criativo Novo] [MLT_INTER-F226-2025-AQS] [Facebook Ad's] [Copywriter Yuri Brandão] [Designer Vinicius Carvalho],5.777,245,"1,01","R$ 369,48","R$ 8,71","4,24%",1,"R$ 2.134,51","3.677,04","R$ 2.134,51","1,61","R$ 585,77","15,93%","R$ 107,75","2,93%","R$ 3.677,04","R$ 15,01","0,41%"
[#879_cv63_cb242_vr1] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],5.704,232,1,"R$ 306,32","R$ 7,53","4,07%",2,"R$ 873,62","3.081,37","R$ 1.747,24","1,63","R$ 581,83","18,88%","R$ 181,25","5,88%","R$ 1.540,69","R$ 13,28","0,86%"
[#692_cv10_cb30_vr184] [UGC] [Variação de Vídeo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Ender],1.595,140,"1,01","R$ 233,82","R$ 2,66","8,78%",1,"R$ 372,95","1.196,31","R$ 372,95","3,01","R$ 563,12","47,07%","R$ 407,6","34,07%","R$ 1.196,31","R$ 8,55","0,71%"
[#789_cv52_cb184_vr41] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],3.881,194,1,"R$ 259,99","R$ 5,2",5%,2,"R$ 504,51","3.130,12","R$ 1.009,02","1,38","R$ 506,41","16,18%","R$ 976,69","31,2%","R$ 1.565,06","R$ 16,13","1,03%"
[#745_cv10_cb30_vr195] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],6.602,346,1,"R$ 302,87","R$ 5,78","5,24%",2,"R$ 999,78","3.127,52","R$ 1.999,55","1,46","R$ 392,6","12,55%","R$ -13,97","-0,45%","R$ 1.563,76","R$ 9,04","0,58%"
[#959_cv95_cb321_vr] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Allan Brandão ] [Designer Laysa Diniz],10.167,459,1,"R$ 367,59","R$ 8,14","4,51%",4,"R$ 934,31","8.096,29","R$ 3.737,24","1,36","R$ 390,54","4,82%","R$ 1.957,66","24,18%","R$ 2.024,07","R$ 17,64","0,87%"
[#1091_cv62_cb238_vr2] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gustavo Costa],6.193,203,1,"R$ 240,41","R$ 7,33","3,28%",1,"R$ 1.488,89","2.474,83","R$ 1.488,89","1,54","R$ 383,95","15,51%","R$ 62,22","2,51%","R$ 2.474,83","R$ 12,19","0,49%"
[#904_cv78_cb296_vr1] [UGC IA] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Indefinido] [Designer Gustavo Costa],35.928,1.450,1,"R$ 250,37","R$ 6,2","4,04%",5,"R$ 1.799,08","11.747,77","R$ 8.995,4","1,21","R$ 383,66","3,27%","R$ -1.143,55","-9,73%","R$ 2.349,55","R$ 8,1","0,34%"
[#916_cv79_cb296_vr1] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Indefinido] [Designer Gustavo Costa],6.433,317,1,"R$ 291,89","R$ 5,92","4,93%",1,"R$ 1.877,71","2.725,32","R$ 1.877,71","1,35","R$ 334,97","12,29%","R$ -19,32","-0,71%","R$ 2.725,32","R$ 8,6","0,32%"
[#754_cv10_cb30_vr204] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],5.732,262,1,"R$ 334,81","R$ 7,32","4,57%",1,"R$ 1.919,14","2.721,86","R$ 1.919,14","1,34","R$ 331,33","12,17%","R$ -22,51","-0,83%","R$ 2.721,86","R$ 10,39","0,38%"
[#954_cv93_cb316_vr] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Allan Brandão ] [Designer Laysa Diniz],4.500,252,1,"R$ 368,68","R$ 6,58","5,6%",2,"R$ 829,53","2.593,44","R$ 1.659,07","1,45","R$ 324,79","12,52%","R$ -12,36","-0,48%","R$ 1.296,72","R$ 10,29","0,79%"
[#905_cv77_cb294_vr2] [UGC IA] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Indefinido] [Designer Gustavo Costa],6.790,280,1,"R$ 275,29","R$ 6,68","4,12%",1,"R$ 1.869,19","2.720,39","R$ 1.869,19","1,34","R$ 320,1","11,77%","R$ -33,55","-1,23%","R$ 2.720,39","R$ 9,72","0,36%"
[#1107_cv101_cb361_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter pedro silva] [Designer Laysa Diniz],2.933,85,1,"R$ 327,89","R$ 11,31","2,9%",1,"R$ 961,69","1.666,67","R$ 961,69","1,61","R$ 317,42","19,04%","R$ 100,75","6,04%","R$ 1.666,67","R$ 19,61","1,18%"
[#1129_cv10_cb30_vr236] [UGC] [Variação de Vídeo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gustavo Costa],3.092,123,1,"R$ 312,71","R$ 7,86","3,98%",1,"R$ 966,9","1.623,99","R$ 966,9","1,56","R$ 277,61","17,09%","R$ 66,49","4,09%","R$ 1.623,99","R$ 13,2","0,81%"
[#1118_cv104_cb372_vr0] [UGC IA] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter pedro silva] [Designer Matheus Subires],3.013,99,1,"R$ 319,33","R$ 9,72","3,29%",1,"R$ 962,15","1.605,06","R$ 962,15","1,55","R$ 268,32","16,72%","R$ 59,66","3,72%","R$ 1.605,06","R$ 16,21","1,01%"
[#1123_cv10_cb377_vr0] [UGC] [Novo Hook] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],2.866,126,1,"R$ 337,68","R$ 7,68","4,4%",1,"R$ 967,79","1.604,63","R$ 967,79","1,55","R$ 266,71","16,62%","R$ 58,11","3,62%","R$ 1.604,63","R$ 12,74","0,79%"
[#1109_cv101_cb363_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter pedro silva] [Designer Laysa Diniz],2.997,128,1,"R$ 321,39","R$ 7,53","4,27%",1,"R$ 963,21","1.604,1","R$ 963,21","1,55","R$ 264,57","16,49%","R$ 56,03","3,49%","R$ 1.604,1","R$ 12,53","0,78%"
[#1119_cv10_cb373_vr0] [UGC] [Novo Hook] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],3.138,107,1,"R$ 308,15","R$ 9,04","3,41%",1,"R$ 966,99","1.605,06","R$ 966,99","1,54","R$ 258,71","16,12%","R$ 50,05","3,12%","R$ 1.605,06",R$ 15,"0,93%"
[#999_cv52_cb334_vr0] [UGC] [Novo Hook] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],3.375,148,1,"R$ 307,06",R$ 7,"4,39%",1,"R$ 1.036,32","1.667,43","R$ 1.036,32","1,49","R$ 245,42","14,72%","R$ 28,65","1,72%","R$ 1.667,43","R$ 11,27","0,68%"
[#1086_cv68_cb270_vr19] [UGC] [Empilhamento] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Laysa Diniz],7.007,343,1,"R$ 209,79","R$ 4,29","4,9%",1,R$ 1.470,"2.218,8",R$ 1.470,"1,4","R$ 240,16","10,82%","R$ -48,28","-2,18%","R$ 2.218,8","R$ 6,47","0,29%"
[#864_cv50_cb178_vr4] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],6.823,292,1,"R$ 272,41","R$ 6,37","4,28%",1,"R$ 1.858,62","2.721,71","R$ 1.858,62","1,36","R$ 234,79","8,63%","R$ -119,03","-4,37%","R$ 2.721,71","R$ 9,32","0,34%"
[#979_cv10_cb273_vr] [UGC] [Clickbait] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],3.096,162,1,"R$ 338,55","R$ 6,47","5,23%",1,"R$ 1.048,14","1.658,78","R$ 1.048,14","1,46","R$ 216,21","13,03%","R$ 0,57","0,03%","R$ 1.658,78","R$ 10,24","0,62%"
[#1116_cv104_cb370_vr0] [UGC IA] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter pedro silva] [Designer Matheus Subires],3.654,131,"1,01","R$ 265,07","R$ 7,39","3,59%",1,"R$ 968,55","1.536,56","R$ 968,55","1,47","R$ 198,72","12,93%","R$ -1,03","-0,07%","R$ 1.536,56","R$ 11,73","0,76%"
[#883_cv71_cb277_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],6.272,272,1,"R$ 312,56","R$ 7,21","4,34%",1,"R$ 1.960,37","2.649,91","R$ 1.960,37","1,25","R$ 168,78","6,37%","R$ -175,7","-6,63%","R$ 2.649,91","R$ 9,74","0,37%"
[#741_cv10_cb30_vr191] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],6.850,339,1,"R$ 328,27","R$ 6,63","4,95%",2,"R$ 1.124,32","6.396,43","R$ 2.248,64",0,"R$ 159,94","2,5%","R$ 2.199,71","34,39%","R$ 3.198,22","R$ 18,87","0,59%"
[#23_cv8_cb23_vr0] [UGC] [Criativo Novo] [MLT_INTER-F229-2025-AQS] [Facebook Ad's] [Copywriter Lucas Sasaki] [Designer Vinicius Carvalho],22.454,1.151,"1,01","R$ 405,97","R$ 7,92","5,13%",7,"R$ 1.302,24","12.347,92","R$ 9.115,69","1,26","R$ 155,31","1,26%","R$ -1.449,92","-11,74%","R$ 1.763,99","R$ 10,73","0,61%"
[#1073_cv73_cb283_vr22] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gustavo Costa],82.970,3.187,"1,01","R$ 229,89","R$ 5,98","3,84%",13,"R$ 1.467,21","24.734,93","R$ 19.073,68","1,21","R$ 84,34","0,34%","R$ -3.131,2","-12,66%","R$ 1.902,69","R$ 7,76","0,41%"
[#1010_cv100_cb344_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gustavo Costa],73.068,2.752,1,"R$ 245,03","R$ 6,51","3,77%",10,"R$ 1.790,4","23.160,67","R$ 17.903,97","1,2","R$ 36,76","0,16%","R$ -2.974,13","-12,84%","R$ 2.316,07","R$ 8,42","0,36%"
[#778_cv10_cb30_vr221] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],4.413,225,1,"R$ 287,36","R$ 5,64","5,1%",1,"R$ 1.268,1","1.648,08","R$ 1.268,1","1,23","R$ 21,34","1,29%","R$ -192,91","-11,71%","R$ 1.648,08","R$ 7,32","0,44%"
[#986_cv10_cb280_vr] [UGC] [Clickbait] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],9.401,367,1,"R$ 225,52","R$ 5,78","3,9%",1,"R$ 2.120,1","2.748,5","R$ 2.120,1","1,2","R$ -3,11","-0,11%","R$ -360,42","-13,11%","R$ 2.748,5","R$ 7,49","0,27%"
#2_cv1_h2_vr0_yp_gn_drphill_f01_fb,5.413,185,"1,01","R$ 238,99","R$ 6,99","3,42%",1,"R$ 1.293,66","1.650,01","R$ 1.293,66","1,18","R$ -29,59","-1,79%","R$ -244,09","-14,79%","R$ 1.650,01","R$ 8,92","0,54%"
[#906_cv10_cb30_vr223] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],12.349,502,1,"R$ 266,09","R$ 6,55","4,07%",2,"R$ 1.642,95","4.123,9","R$ 3.285,91","1,16","R$ -52,71","-1,28%","R$ -588,82","-14,28%","R$ 2.061,95","R$ 8,21","0,4%"
[#795_cv52_cb184_vr47] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Lucas Botelho],3.705,148,1,"R$ 204,83","R$ 5,13","3,99%",1,"R$ 758,89","910,54","R$ 758,89","1,13","R$ -54,81","-6,02%","R$ -173,18","-19,02%","R$ 910,54","R$ 6,15","0,68%"
[#794_cv52_cb184_vr46] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Lucas Botelho],8.013,412,1,"R$ 279,61","R$ 5,44","5,14%",2,"R$ 1.120,25","2.816,51","R$ 2.240,51","1,17","R$ -59,43","-2,11%","R$ -425,57","-15,11%","R$ 1.408,26","R$ 6,84","0,49%"
[#473_cv10_cb30_vr] [UGC] [Novo Hook] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],29.827,2.164,"1,01","R$ 224,25","R$ 3,09","7,26%",4,"R$ 1.672,18","8.313,74","R$ 6.688,73","1,16","R$ -72,84","-0,88%","R$ -1.153,62","-13,88%","R$ 2.078,44","R$ 3,84","0,18%"
[#1130_cv10_cb30_vr237] [UGC] [Variação de Vídeo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gustavo Costa],3.265,138,1,"R$ 295,32","R$ 6,99","4,23%",1,"R$ 964,21","1.153,08","R$ 964,21","1,11","R$ -77,26","-6,7%","R$ -227,16","-19,7%","R$ 1.153,08","R$ 8,36","0,72%"
[#921_cv10_cb30_vr229] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],5.632,189,1,"R$ 222,34","R$ 6,63","3,36%",1,"R$ 1.252,2","1.525,06","R$ 1.252,2","1,13","R$ -95,75","-6,28%","R$ -294,01","-19,28%","R$ 1.525,06","R$ 8,07","0,53%"
[#15_cv5_cb15_vr0] [Podcast] [Criativo Novo] [MLT_INTER-F226-2025-AQS] [Facebook Ad's] [Copywriter Yuri Brandão] [Designer Vinicius Carvalho],5.889,226,"1,02","R$ 352,15","R$ 9,18","3,84%",2,"R$ 1.036,92","2.566,82","R$ 2.073,84","1,15","R$ -127,18","-4,95%","R$ -460,87","-17,95%","R$ 1.283,41","R$ 11,36","0,88%"
[#19_cv7_cb19_vr0] [UGC] [Criativo Novo] [MLT_INTER-F229-2025-AQS] [Facebook Ad's] [Copywriter Lucas Sasaki] [Designer Vinicius Carvalho],4.869,204,1,"R$ 271,9","R$ 6,49","4,19%",1,"R$ 1.323,86","1.553,64","R$ 1.323,86","1,09","R$ -142,57","-9,18%","R$ -344,55","-22,18%","R$ 1.553,64","R$ 7,62","0,49%"
[#1075_cv73_cb283_vr24] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gustavo Costa],7.227,294,1,"R$ 203,66","R$ 5,01","4,07%",1,"R$ 1.471,83","1.660,66","R$ 1.471,83","1,05","R$ -195,57","-11,78%","R$ -411,46","-24,78%","R$ 1.660,66","R$ 5,65","0,34%"
[#1087_cv5_cb184_vr245] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],8.492,351,1,"R$ 173,33","R$ 4,19","4,13%",1,"R$ 1.471,92","1.634,62","R$ 1.471,92","1,04","R$ -210,88","-12,9%","R$ -423,38","-25,9%","R$ 1.634,62","R$ 4,66","0,28%"
[#984_cv10_cb278_vr] [UGC] [Clickbait] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],5.651,223,1,"R$ 260,71","R$ 6,61","3,95%",1,"R$ 1.473,29","1.632,21","R$ 1.473,29","1,02","R$ -238,09","-14,59%","R$ -450,28","-27,59%","R$ 1.632,21","R$ 7,32","0,45%"
[#1089_cv73_cb283_vr28] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],7.054,325,1,"R$ 203,8","R$ 4,42","4,61%",1,"R$ 1.437,59","1.555,03","R$ 1.437,59","1,01","R$ -246,99","-15,88%","R$ -449,15","-28,88%","R$ 1.555,03","R$ 4,78","0,31%"
[#932_cv86_cb303_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza].mp4,6.712,247,1,"R$ 217,71","R$ 5,92","3,68%",1,"R$ 1.461,25","1.579,31","R$ 1.461,25",1,"R$ -257,06","-16,28%","R$ -462,37","-29,28%","R$ 1.579,31","R$ 6,39","0,4%"
[#1072_cv73_cb283_vr21] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gustavo Costa],41.597,1.606,"1,01","R$ 208,26","R$ 5,39","3,86%",5,"R$ 1.732,63","11.021,81","R$ 8.663,15","1,19","R$ -268,73","-2,44%","R$ -1.701,57","-15,44%","R$ 2.204,36","R$ 6,86","0,31%"
[#3_cv1_cb3_vr0] [UGC] [Criativo Novo] [MLT_INTER-F226-2025-AQS] [Facebook Ad's] [Copywriter Yuri Brandão] [Designer Vinicius Carvalho],4.467,221,1,"R$ 328,93","R$ 6,65","4,95%",1,"R$ 1.469,32","1.552,73","R$ 1.469,32","0,99","R$ -280,76","-18,08%","R$ -482,61","-31,08%","R$ 1.552,73","R$ 7,03","0,45%"
[#715_cv52_cb184_vr28] [UGC] [Variação de Vídeo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Ender],99.157,4.421,"1,01","R$ 134,94","R$ 3,03","4,46%",9,"R$ 1.486,74","19.375,57","R$ 13.380,64","1,17","R$ -303,97","-1,57%","R$ -155,76","-0,8%","R$ 2.152,84","R$ 4,38","0,2%"
[#982_cv10_cb276_vr] [UGC] [Clickbait] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],7.261,308,1,"R$ 204,19","R$ 4,81","4,24%",1,"R$ 1.482,64","1.524,32","R$ 1.482,64","0,96","R$ -326,84","-21,44%",R$ -525,"-34,44%","R$ 1.524,32","R$ 4,95","0,32%"
[#918_cv80_cb297_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Indefinido] [Designer Gustavo Costa],11.902,462,1,"R$ 240,8","R$ 6,2","3,88%",2,"R$ 1.432,98","3.968,69","R$ 2.865,95","0,74",R$ -337,"-8,49%","R$ -212,61","-5,36%","R$ 1.984,35","R$ 8,59","0,43%"
[#968_cv97_cb327_vr2] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Júlia Lopes] [Designer Laysa Diniz],4.765,244,1,"R$ 336,61","R$ 6,57","5,12%",1,"R$ 1.603,97","1.657,48","R$ 1.603,97","0,95","R$ -339,39","-20,48%","R$ -554,87","-33,48%","R$ 1.657,48","R$ 6,79","0,41%"
[#929_cv83_cb300_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Yuri Brandão] [Designer Guilherme Martins],4.917,186,1,"R$ 323,4","R$ 8,55","3,78%",1,"R$ 1.590,15","1.579,31","R$ 1.590,15","0,92","R$ -385,96","-24,44%","R$ -591,27","-37,44%","R$ 1.579,31","R$ 8,49","0,54%"
[#496_cv50_cb178_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],11.058,306,"1,01","R$ 157,08","R$ 5,68","2,77%",1,"R$ 1.737,04","1.676,16","R$ 1.737,04","0,91","R$ -422,48","-25,21%","R$ -640,38","-38,21%","R$ 1.676,16","R$ 5,48","0,33%"
[#674_cv52_cb184_vr18] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Matheus Subires],12.759,511,"1,01","R$ 189,65","R$ 4,74","4,01%",2,"R$ 1.209,88","2.558,62","R$ 2.419,76",1,"R$ -426,59","-16,67%","R$ -759,21","-29,67%","R$ 1.279,31","R$ 5,01","0,39%"
[#881_cv63_cb242_vr3] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],6.316,260,1,"R$ 275,97","R$ 6,7","4,12%",1,R$ 1.743,"1.686,21",R$ 1.743,"0,9","R$ -444,73","-26,37%","R$ -663,94","-39,37%","R$ 1.686,21","R$ 6,49","0,38%"
[#862_cv50_cb178_vr2] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],7.107,324,1,"R$ 252,66","R$ 5,54","4,56%",1,"R$ 1.795,65","1.686,21","R$ 1.795,65","0,87","R$ -497,38","-29,5%","R$ -716,59","-42,5%","R$ 1.686,21","R$ 5,2","0,31%"
[#903_cv78_cb296_vr1] [UGC IA] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Indefinido] [Designer Gustavo Costa],5.888,259,1,"R$ 306,19","R$ 6,96","4,4%",1,"R$ 1.802,85","1.686,21","R$ 1.802,85","0,87","R$ -504,58","-29,92%","R$ -723,79","-42,92%","R$ 1.686,21","R$ 6,51","0,39%"
[#928_cv82_cb299_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Yuri Brandão] [Designer Guilherme Martins],6.244,205,1,"R$ 290,01","R$ 8,83","3,28%",1,"R$ 1.810,84","1.686,21","R$ 1.810,84","0,86","R$ -519,06","-30,78%","R$ -738,27","-43,78%","R$ 1.686,21","R$ 8,23","0,49%"
[#927_cv81_cb298_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Yuri Brandão] [Designer Guilherme Martins],6.348,209,1,"R$ 289,93","R$ 8,81","3,29%",1,"R$ 1.840,5","1.686,21","R$ 1.840,5","0,85","R$ -550,5","-32,65%","R$ -769,71","-45,65%","R$ 1.686,21","R$ 8,07","0,48%"
[#843_cv68_cb272_vr] [UGC] [Novo Hook] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Laysa Diniz],9.073,418,1,"R$ 481,22","R$ 10,45","4,61%",4,"R$ 1.091,53","8.582,22","R$ 4.366,13","1,13","R$ -555,84","-6,48%","R$ 1.604,93","18,7%","R$ 2.145,56","R$ 20,53","0,96%"
[#953_cv93_cb315_vr] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Allan Brandão ] [Designer Laysa Diniz],4.560,300,1,"R$ 404,02","R$ 6,14","6,58%",1,"R$ 1.842,31","1.659,38","R$ 1.842,31","0,84","R$ -567,66","-34,21%","R$ -783,38","-47,21%","R$ 1.659,38","R$ 5,53","0,33%"
[#742_cv10_cb30_vr192] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],5.817,286,1,"R$ 315,51","R$ 6,42","4,92%",1,"R$ 1.835,32","1.594,39","R$ 1.835,32","0,82","R$ -600,95","-37,69%","R$ -808,22","-50,69%","R$ 1.594,39","R$ 5,57","0,35%"
[#845_cv69_cb274_vr1] [Ripado] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],8.958,441,1,"R$ 433,22","R$ 8,8","4,92%",2,"R$ 1.940,39","4.290,25","R$ 3.880,78","1,02","R$ -619,5","-14,44%","R$ -1.177,23","-27,44%","R$ 2.145,13","R$ 9,73","0,45%"
[#158_cv37_cb127_vr0] [UGC] [Criativo Novo] [VPF_INTER-F252-2025-AQS] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Matheus Subires],2.418,198,1,"R$ 236,29","R$ 2,89","8,19%",1,"R$ 571,34","1.660,66","R$ 571,34",0,"R$ -680,78","-40,99%","R$ 763,99","46,01%","R$ 1.660,66","R$ 8,39","0,51%"
[#1084_cv52_cb270_vr1] [UGC] [Empilhamento] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Laysa Diniz],91.695,3.349,"1,01","R$ 194,22","R$ 5,32","3,65%",10,"R$ 1.780,89","21.751,7","R$ 17.808,93","1,13","R$ -702,28","-3,23%",R$ -3.530,"-16,23%","R$ 2.175,17","R$ 6,49","0,3%"
[#1074_cv73_cb283_vr23] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gustavo Costa],6.227,257,1,"R$ 225,24","R$ 5,46","4,13%",1,"R$ 1.402,59","915,15","R$ 1.402,59","0,61","R$ -704,46","-76,98%","R$ -823,43","-89,98%","R$ 915,15","R$ 3,56","0,39%"
[#1098_cv73_cb283_vr29] [Ripado] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],5.890,280,1,"R$ 240,5","R$ 5,06","4,75%",1,"R$ 1.416,52","915,06","R$ 1.416,52","0,6","R$ -714,89","-78,13%","R$ -833,85","-91,13%","R$ 915,06","R$ 3,27","0,36%"
[#1093_cv62_cb238_vr4] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Laysa Diniz],5.823,188,1,"R$ 255,11","R$ 7,9","3,23%",1,"R$ 1.485,51","941,16","R$ 1.485,51","0,59","R$ -764,15","-81,19%","R$ -886,5","-94,19%","R$ 941,16","R$ 5,01","0,53%"
[#1094_cv62_cb238_vr5] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Laysa Diniz],5.520,197,1,"R$ 268,47","R$ 7,52","3,57%",1,"R$ 1.481,98","912,4","R$ 1.481,98","0,57","R$ -791,05","-86,7%","R$ -909,66","-99,7%","R$ 912,4","R$ 4,63","0,51%"
[#679_cv60_cb208_vr1] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Matheus Subires],4.727,260,1,"R$ 323,17","R$ 5,88","5,5%",1,"R$ 1.527,61","910,54","R$ 1.527,61","0,56","R$ -820,88","-90,15%","R$ -939,25","-103,15%","R$ 910,54","R$ 3,5","0,38%"
[#15_cv5_cb15_vr0] [UGC] [Criativo Novo] [MLT_INTER-F229-2025-AQS] [Facebook Ad's] [Copywriter Lucas Sasaki] [Designer Vinicius Carvalho],6.729,305,"1,01","R$ 411,11","R$ 9,07","4,53%",2,"R$ 1.383,17","2.489,96","R$ 2.766,34","0,84","R$ -859,65","-34,52%","R$ -1.183,34","-47,52%","R$ 1.244,98","R$ 8,16","0,66%"
#02-ED-MCL-GAB-H1,72.658,4.509,1,"R$ 266,22","R$ 4,29","6,21%",12,"R$ 1.611,9","24.099,96","R$ 19.342,75","1,16","R$ -870,54","-3,61%","R$ -4.003,53","-16,61%","R$ 2.008,33","R$ 5,34","0,27%"
[#894_cv75_cb288_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],7.650,307,1,"R$ 271,89","R$ 6,78","4,01%",1,"R$ 2.079,93","1.579,31","R$ 2.079,93","0,71","R$ -875,74","-55,45%","R$ -1.081,05","-68,45%","R$ 1.579,31","R$ 5,14","0,33%"
[#1092_cv62_cb238_vr3] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gustavo Costa],6.229,186,1,"R$ 232,91","R$ 7,8","2,99%",2,"R$ 725,39","4.184,03","R$ 1.450,78",0,"R$ -888,35","-21,23%","R$ 1.469,43","35,12%","R$ 2.092,02","R$ 22,49","1,08%"
[#966_cv58_cb202_vr5] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],7.984,352,1,"R$ 271,07","R$ 6,15","4,41%",1,"R$ 2.164,26","1.653,96","R$ 2.164,26","0,71","R$ -902,48","-54,56%","R$ -1.117,49","-67,56%","R$ 1.653,96","R$ 4,7","0,28%"
[#890_cv73_cb284_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],21.091,916,"1,01","R$ 254,73","R$ 5,87","4,34%",5,"R$ 1.074,52","8.304,66","R$ 5.372,6","1,04","R$ -916,55","-11,04%","R$ 270,26","3,25%","R$ 1.660,93","R$ 9,07","0,55%"
#12-ED-GAB-KAUE-H1,59.695,3.937,1,"R$ 280,44","R$ 4,25","6,6%",9,"R$ 1.860,1","20.620,79","R$ 16.740,87","1,14","R$ -925,16","-4,49%","R$ -3.605,86","-17,49%","R$ 2.291,2","R$ 5,24","0,23%"
[#952_cv92_cb314_vr] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Allan Brandão ] [Designer Laysa Diniz],93.148,3.041,1,"R$ 278,2","R$ 8,52","3,26%",15,"R$ 1.727,61","25.485,33","R$ 25.914,1","0,82","R$ -7.671,39","-30,1%","R$ -9.676,98","-37,97%","R$ 1.699,02","R$ 8,38","0,49%"
[Oz 3] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto],65.008,2.896,1,"R$ 228,1","R$ 5,12","4,45%",8,"R$ 1.853,57","15.516,05","R$ 14.828,54","0,59","R$ -8.140,13","-52,46%","R$ -3.659,42","-23,58%","R$ 1.939,51","R$ 5,36","0,28%"
[#717_cv59_cb229_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Júlia Lopes] [Designer Guilherme Martins],60.157,3.125,"1,01","R$ 181,77","R$ 3,5","5,19%",2,"R$ 5.467,36","3.324,24","R$ 10.934,71","0,29","R$ -8.341,41","-250,93%","R$ -8.773,56","-263,93%","R$ 1.662,12","R$ 1,06","0,06%"
[#908_cv52_cb184_vr64] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza].mp4,58.242,2.017,1,"R$ 201,1","R$ 5,81","3,46%",2,"R$ 5.856,34","4.335,31","R$ 11.712,67","0,34","R$ -8.382,96","-193,36%","R$ -8.946,55","-206,36%","R$ 2.167,66","R$ 2,15","0,1%"
[#723_cv61_cb235_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Yuri Brandão] [Designer Guilherme Martins],102.622,5.344,1,"R$ 219,65","R$ 4,22","5,21%",11,"R$ 2.049,16","20.877,64","R$ 22.540,74","0,58","R$ -10.214,99","-48,93%","R$ -8.492,31","-40,68%","R$ 1.897,97","R$ 3,91","0,21%"
[#585_cv10_cb30_vr164] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Matheus Subires],209.900,9.536,1,"R$ 268,66","R$ 5,91","4,54%",36,"R$ 1.566,45","73.393,74","R$ 56.392,16","0,93","R$ -10.862,56","-14,8%","R$ -6.821,38","-9,29%","R$ 2.038,72","R$ 7,7","0,38%"
[#341_cv10_cb30_vr85] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Matheus Subires],870.361,38.522,1,"R$ 262,29","R$ 5,93","4,43%",165,"R$ 1.383,54","329.165,05","R$ 228.283,29","1,13","R$ -12.104,67","-3,68%","R$ -6.241,74","-1,9%","R$ 1.994,94","R$ 8,54","0,43%"
[#730_cv63_cb242_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Júlia Lopes] [Designer Gustavo Costa],298.986,14.011,1,"R$ 188,68","R$ 4,03","4,69%",32,"R$ 1.762,86","57.266,36","R$ 56.411,65","0,91","R$ -13.526,85","-23,62%","R$ -18.438,62","-32,2%","R$ 1.789,57","R$ 4,09","0,23%"
[#687_cv10_cb30_vr179] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Matheus Subires],123.869,6.180,"1,01","R$ 226,07","R$ 4,53","4,99%",14,"R$ 2.000,22","29.138,49","R$ 28.003,13","0,48","R$ -17.534,69","-60,18%","R$ -6.536,82","-22,43%","R$ 2.081,32","R$ 4,71","0,23%"
[George 1] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto],194.699,8.436,1,"R$ 223,3","R$ 5,15","4,33%",23,"R$ 1.890,24","44.119,58","R$ 43.475,52","0,71","R$ -17.739,22","-40,21%","R$ -13.151,14","-29,81%","R$ 1.918,24","R$ 5,23","0,27%"`;

// DADOS DE FEVEREIRO 2026 - RESTAURADOS INTEGRALMENTE
const WEEKLY_CSV_FEB_2026 = `Ad Name,# Impressões,# Clicks,# Frequência,R$ CPM,R$ CPC,% CTR,# Vendas Reais,R$ CPA Real,R$ Faturamento,R$ Valor Gasto,# ROAS,R$ Margem,% Margem,R$ Margem Projetada,% Margem Projetada,R$ TMF,R$ EPC,% CVR
[#RIPYT] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],543.203,19.458,1,"R$ 205,77","R$ 5,74","3,58%",107,"R$ 1.044,64","201.347,55","R$ 111.776,39","1,53","R$ 30.296,13","15,05%","R$ 19.117,2","9,49%","R$ 1.881,75","R$ 10,35","0,55%"
[#17_cv2_cb2_vr5] [] [Variação de Vídeo] [GLT_INTER-F210-2026] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gustavo Costa],333.446,14.627,1,"R$ 315,6","R$ 7,19","4,39%",106,"R$ 992,78","180.033,55","R$ 105.234,29","1,51","R$ 28.989,62","16,1%","R$ 10.039,11","5,58%","R$ 1.698,43","R$ 12,31","0,72%"
[#18_cv2_cb2_vr6] [] [Variação de Vídeo] [GLT_INTER-F210-2026] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gustavo Costa],287.713,11.799,1,"R$ 312,7","R$ 7,62","4,1%",93,"R$ 967,38","158.483,41","R$ 89.966,46","1,54","R$ 26.501,14","16,72%","R$ 11.990,21","7,57%","R$ 1.704,12","R$ 13,43","0,79%"
[#18_cv6_cb18_vr0] [UGC] [Criativo Novo] [MLT_INTER-F229-2025-AQS] [Facebook Ad's] [Copywriter Lucas Sasaki] [Designer Vinicius Carvalho],62.757,5.861,1,"R$ 362,9","R$ 3,89","9,34%",35,"R$ 650,7","59.072,1","R$ 22.774,59","2,27","R$ 20.953,58","35,47%","R$ 15.165,42","25,67%","R$ 1.687,77","R$ 10,08","0,6%"
[#23_cv3_cb3_vr8] [] [Variação de Vídeo] [GLT_INTER-F210-2026] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],312.691,13.311,1,"R$ 286,69","R$ 6,73","4,26%",86,"R$ 1.042,39","147.152,86","R$ 89.645,57","1,47","R$ 19.913,39","13,53%","R$ 5.272,84","3,58%","R$ 1.711,08","R$ 11,05","0,65%"
[Mel Oz 5],146.971,6.072,"1,01","R$ 184,65","R$ 4,47","4,13%",39,"R$ 695,84","65.443,08","R$ 27.137,77","1,99","R$ 17.833,99","27,25%","R$ 15.559,04","23,77%","R$ 1.678,03","R$ 10,78","0,64%"
[#43_cv9_cb26_vr4] [] [Mudança Avatar] [MLT_INTER-F229-2025-AQS] [Facebook Ad's] [Copywriter pedro silva] [Designer Gabriel Barboza],42.092,2.507,1,"R$ 364,02","R$ 6,11","5,96%",23,"R$ 666,18","47.347,58","R$ 15.322,17","2,57","R$ 17.157,2","36,24%","R$ 16.011,16","33,82%","R$ 2.058,59","R$ 18,89","0,92%"
[#3_cv3_cb3_vr0] [] [Criativo Novo] [GLT_INTER-F210-2026] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Ender],167.030,8.648,1,"R$ 321,59","R$ 6,21","5,18%",56,"R$ 959,2","93.854,09","R$ 53.715,27","1,57","R$ 16.030,92","17,08%","R$ 6.038,47","6,43%","R$ 1.675,97","R$ 10,85","0,65%"
[#2_cv2_cb2_vr0] [] [Criativo Novo] [GLT_INTER-F210-2026] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Ender],33.668,1.697,1,"R$ 415,6","R$ 8,25","5,04%",20,"R$ 699,62","36.884,56","R$ 13.992,32","2,16","R$ 12.625,7","34,23%","R$ 9.465,68","25,66%","R$ 1.844,23","R$ 21,74","1,18%"
[#1002_cv52_cb337_vr0] [UGC] [Novo Hook] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],227.099,7.524,"1,01","R$ 251,57","R$ 7,59","3,31%",51,"R$ 1.120,21","96.130,72","R$ 57.130,81","1,44","R$ 11.990,84","12,47%","R$ 4.813,49","5,01%","R$ 1.884,92","R$ 12,78","0,68%"
[#1051_cv73_cb283_vr6] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Vinicius Carvalho].mp4,218.785,8.364,"1,01","R$ 143,33","R$ 3,75","3,82%",29,"R$ 1.081,31","55.729,12","R$ 31.357,87","1,65","R$ 11.570,72","20,76%","R$ 4.325,94","7,76%","R$ 1.921,69","R$ 6,66","0,35%"
[#28_cv1_cb1_vr7] [] [Mudança Avatar] [GLT_INTER-F210-2026] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],28.937,1.394,1,"R$ 381,94","R$ 7,93","4,82%",11,"R$ 1.004,74","29.816,62","R$ 11.052,1","2,19","R$ 10.642,45","35,69%","R$ 8.189,93","27,47%","R$ 2.710,6","R$ 21,39","0,79%"
[Mel Oz 3],198.594,7.078,"1,01","R$ 168,31","R$ 4,72","3,56%",31,"R$ 1.078,26","59.127,69","R$ 33.426,21","1,51","R$ 9.301,38","15,73%","R$ 4.951,12","8,37%","R$ 1.907,34","R$ 8,35","0,44%"
#4_cv2_h1_vr0_yp_gn_drphill_f01_fb,165.123,6.429,"1,01","R$ 186,43","R$ 4,79","3,89%",31,"R$ 993,03","56.357,69","R$ 30.783,96","1,59","R$ 9.155,8","16,25%","R$ 5.771,16","10,24%","R$ 1.817,99","R$ 8,77","0,48%"
[#37_cv9_cb26_vr1] [] [Mudança Avatar] [MLT_INTER-F229-2025-AQS] [Facebook Ad's] [Copywriter pedro silva] [Designer Gustavo Costa],32.501,2.027,1,"R$ 387,08","R$ 6,21","6,24%",16,"R$ 786,28","27.914,02","R$ 12.580,44","2,07","R$ 9.004,97","32,26%","R$ 5.376,15","19,26%","R$ 1.744,63","R$ 13,77","0,79%"
[#36_cv9_cb29_vr0] [] [Clickbait] [MLT_INTER-F229-2025-AQS] [Facebook Ad's] [Copywriter pedro silva] [Designer Guilherme Martins],29.616,2.306,1,"R$ 353,54","R$ 4,54","7,79%",10,"R$ 1.047,05","24.776,03","R$ 10.470,47","2,21","R$ 8.793,06","35,49%","R$ 5.572,17","22,49%","R$ 2.477,6","R$ 10,74","0,43%"
[#1054_cv68_cb30_vr14] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Vinicius Carvalho],264.212,9.223,"1,01","R$ 149,29","R$ 4,28","3,49%",33,"R$ 1.195,29","64.054,66","R$ 39.444,57","1,44","R$ 8.625,02","13,47%","R$ 1.209,29","1,89%","R$ 1.941,05","R$ 6,95","0,36%"
[#9_cv3_cb9_vr0] [UGC] [Criativo Novo] [MLT_INTER-F229-2025-AQS] [Facebook Ad's] [Copywriter Lucas Sasaki] [Designer Vinicius Carvalho],81.714,5.702,1,"R$ 308,09","R$ 4,42","6,98%",21,"R$ 1.198,83","44.646,49","R$ 25.175,38","1,54","R$ 8.502,69","19,04%","R$ 3.801,89","8,52%","R$ 2.126,02","R$ 7,83","0,37%"
[#63_cv1_cb8_vr0] [] [Novo Hook] [MLT_INTER-F226-2025-AQS] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],40.135,2.008,"1,01","R$ 224,89","R$ 4,5",5%,6,"R$ 1.504,36","10.171,2","R$ 9.026,16","0,88","R$ -2.517,08","-24,75%","R$ -2.194,53","-21,58%","R$ 1.695,2","R$ 5,07","0,3%"
[#2_cv1_cb2_vr0] [UGC] [Criativo Novo] [MLT_INTER-F226-2025-AQS] [Facebook Ad's] [Copywriter Yuri Brandão] [Designer Vinicius Carvalho],362.339,23.335,"1,01","R$ 303,56","R$ 4,71","6,44%",65,"R$ 1.692,19","142.880,46","R$ 109.992,46","1,15","R$ -4.105,96","-2,87%","R$ -18.716,33","-13,1%","R$ 2.198,16","R$ 6,12","0,28%"
[#1083_cv73_cb283_vr27] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],247.457,9.263,"1,01","R$ 172,51","R$ 4,61","3,74%",31,"R$ 1.377,02","48.935,17","R$ 42.687,74","1,01","R$ -7432,79","-15,19%","R$ -11055,26","-22,59%","R$ 1.578,55","R$ 5,28","0,33%"
[#910_cv10_cb30_vr225] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],166.308,7.044,"1,01","R$ 244,87","R$ 5,78","4,24%",25,"R$ 1.628,97","52.266,87","R$ 40.724,15","0,97","R$ -7579,92","-14,5%","R$ -6217,47","-11,9%","R$ 2.090,67","R$ 7,42","0,35%"
[#20_cv7_cb20_vr0] [UGC] [Criativo Novo] [MLT_INTER-F226-2025-AQS] [Facebook Ad's] [Copywriter Yuri Brandão] [Designer Vinicius Carvalho],153.362,7.018,1,"R$ 268,86","R$ 5,88","4,58%",20,"R$ 2.061,66","32.632,18","R$ 41.233,24","0,74","R$ -16.183,56","-49,59%","R$ -20.425,74","-62,59%","R$ 1.631,61","R$ 4,65","0,28%"`;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [weeklySubTab, setWeeklySubTab] = useState<WeeklySubTab>('ads');
  const [selectedDesigner, setSelectedDesigner] = useState<string | null>(null);
  const [viewType, setViewType] = useState<ViewType>('winners');

  const janData = useMemo(() => parseCSVData(FULL_CSV_JAN_2026), []);
  const febWeeklyData = useMemo(() => parseCSVData(WEEKLY_CSV_FEB_2026), []);

  // REQUISITO: Dash Geral - Apenas Winners (>= 100k)
  const winnersJan = useMemo(() => janData.filter(ad => ad.revenue >= 100000).sort((a, b) => b.revenue - a.revenue), [janData]);

  // Estatísticas de Editores Jan (Processa todos os registros)
  const designerStats = useMemo(() => {
    const stats: Record<string, DesignerStat> = {};
    janData.forEach(ad => {
      if (!stats[ad.designer]) {
        stats[ad.designer] = {
          name: ad.designer, highPerfCount: 0, totalAdsCount: 0, totalRevenue: 0, formatBreakdown: []
        };
      }
      stats[ad.designer].totalAdsCount++;
      stats[ad.designer].totalRevenue += ad.revenue;
      if (ad.revenue >= 100000) stats[ad.designer].highPerfCount++;
      
      const fIdx = stats[ad.designer].formatBreakdown.findIndex(f => f.format === ad.format);
      if (fIdx > -1) stats[ad.designer].formatBreakdown[fIdx].count++;
      else stats[ad.designer].formatBreakdown.push({ format: ad.format, count: 1 });
    });
    return Object.values(stats).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [janData]);

  const summaryJan = useMemo((): MetricSummary => {
    const totalRev = janData.reduce((sum, ad) => sum + ad.revenue, 0);
    const topD = [...designerStats].sort((a, b) => b.totalRevenue - a.totalRevenue)[0] || { name: 'N/A' };
    return {
      topDesigner: topD.name,
      topFormat: "UGC / Mudança Avatar",
      totalRevenue: totalRev,
      totalAdsAbove100k: winnersJan.length
    };
  }, [janData, designerStats, winnersJan]);

  const groupedWeekly = useMemo(() => {
    const funnels: Record<string, { ads: ProcessedAd[], designerRanking: { name: string, revenue: number, adCount: number }[] }> = {};
    febWeeklyData.forEach(ad => {
      if (!funnels[ad.funnel]) funnels[ad.funnel] = { ads: [], designerRanking: [] };
      funnels[ad.funnel].ads.push(ad);
    });

    return Object.entries(funnels).map(([name, data]) => {
      const designersMap: Record<string, { revenue: number, adCount: number }> = {};
      data.ads.forEach(ad => {
        if (!designersMap[ad.designer]) designersMap[ad.designer] = { revenue: 0, adCount: 0 };
        designersMap[ad.designer].revenue += ad.revenue;
        designersMap[ad.designer].adCount += 1;
      });
      const designerRanking = Object.entries(designersMap).map(([dName, stats]) => ({ name: dName, ...stats })).sort((a, b) => b.revenue - a.revenue);
      return {
        name,
        totalRevenue: data.ads.reduce((s, a) => s + a.revenue, 0),
        ads: data.ads.sort((a, b) => b.revenue - a.revenue).slice(0, 5),
        designers: designerRanking.slice(0, 5)
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [febWeeklyData]);

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-20">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white italic">C</div>
            <span className="text-lg font-black tracking-tighter uppercase italic">Ranking <span className="text-indigo-500">Ops</span></span>
          </div>
          <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700">
            {(['dashboard', 'designers', 'weekly'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSelectedDesigner(null); }}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                  activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'dashboard' ? 'Dash Geral' : tab === 'designers' ? 'Editores Jan' : 'Semanal (Fev)'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard title="Faturamento Jan/26" value={formatter.format(summaryJan.totalRevenue)} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
              <MetricCard title="Winners Jan (+100k)" value={summaryJan.totalAdsAbove100k} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
              <MetricCard title="Top Editor Jan" value={summaryJan.topDesigner} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} />
              <MetricCard title="ROAS Médio Jan" value="1.43X" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>} />
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Ranking Winners Jan (+R$ 100k)</h2>
              <RankingTable ads={winnersJan} />
            </div>
          </div>
        )}

        {activeTab === 'designers' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter border-b border-slate-800 pb-4">Performance dos Editores (Jan)</h2>
            <DesignerAnalytics 
              stats={designerStats} 
              onSelectDesigner={(name, type) => { setSelectedDesigner(name); setViewType(type); }}
              selectedDesigner={selectedDesigner}
              currentViewType={viewType}
            />
            {selectedDesigner && (
              <div className="mt-8 space-y-4">
                <h3 className="text-xl font-bold text-white uppercase italic">Criativos de <span className="text-indigo-400">{selectedDesigner}</span></h3>
                <RankingTable ads={janData.filter(ad => ad.designer === selectedDesigner && (viewType === 'all' || ad.revenue >= 100000)).sort((a,b)=>b.revenue-a.revenue)} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'weekly' && (
          <div className="space-y-8 animate-in fade-in duration-700">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">Performance Semanal (Fev)</h2>
                  <p className="text-slate-400 text-sm">Dados semanais restaurados integralmente.</p>
                </div>
                <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-slate-800 shadow-xl">
                  <button onClick={() => setWeeklySubTab('ads')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${weeklySubTab === 'ads' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}>Top Anúncios</button>
                  <button onClick={() => setWeeklySubTab('designers')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${weeklySubTab === 'designers' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-500 hover:text-slate-300'}`}>Top Editores</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {groupedWeekly.map((group, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col group hover:border-indigo-500/30 transition-all">
                  <div className="p-6 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
                    <div className="min-w-0">
                      <h3 className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-1">Célula Funil</h3>
                      <h4 className="text-white font-bold truncate text-xl tracking-tight uppercase">{group.name}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-mono font-black text-lg">{formatter.format(group.totalRevenue)}</p>
                    </div>
                  </div>
                  <div className="p-3 flex-grow">
                    <div className="space-y-2">
                      {(weeklySubTab === 'ads' ? group.ads : group.designers).map((item: any, i) => (
                        <div key={i} className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${i === 0 ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-transparent border-transparent hover:bg-slate-800/40'}`}>
                          <div className="flex items-center gap-4 min-w-0">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${i === 0 ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}`}>{i + 1}</div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-slate-200 truncate uppercase" title={item.adName || item.name}>{item.adName || item.name}</p>
                              <p className="text-[9px] text-slate-500 font-bold uppercase">{item.designer || `${item.adCount} Criativos`}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs font-black font-mono text-emerald-400">{formatter.format(item.revenue)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <footer className="text-center py-20 opacity-30 text-[10px] font-black uppercase tracking-[0.4em]">Creative Intelligence Unit • Data Verified 2026</footer>
    </div>
  );
};

export default App;