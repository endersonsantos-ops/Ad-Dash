import React, { useState, useMemo } from 'react';
import { parseCSVData } from './utils/dataParser';
import { ProcessedAd, MetricSummary, DesignerStat } from './types';
import { MetricCard } from './components/MetricCard';
import { RankingTable } from './components/RankingTable';
import { DesignerAnalytics } from './components/DesignerAnalytics';

type Tab = 'dashboard' | 'designers' | 'weekly';
type ViewType = 'winners' | 'all';
type WeeklySubTab = 'ads' | 'designers';

// DADOS DE JANEIRO 2026 - BASE COMPLETA
const FULL_CSV_JAN_2026 = `Ad Name,# Impressões,# Clicks,# Frequência,R$ CPM,R$ CPC,% CTR,# Vendas Reais,R$ CPA Real,R$ Faturamento,R$ Valor Gasto,# ROAS,R$ Margem,% Margem,R$ Margem Projetada,% Margem Projetada,R$ TMF,R$ EPC,% CVR
[#RIPYT] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],5.976.612,236.282,1,"R$ 223,58","R$ 5,66","3,95%",1.145,"R$ 1.167,05","2.371.723,21","R$ 1.336.269,74","1,43","R$ 261.273,33","11,02%","R$ 214.201,23","9,03%","R$ 2.071,37","R$ 10,04","0,48%"
[#767_cv52_cb184_vr30] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],1.642.556,70.561,1,"R$ 227,31","R$ 5,29","4,3%",315,"R$ 1.185,3","627.261,16","R$ 373.369,62","1,38","R$ 54.618,33","8,71%","R$ 34.538,04","5,51%","R$ 1.991,31","R$ 8,89","0,45%"
[#912_cv52_cb184_vr66] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],626.466,24.751,"1,01","R$ 221,57","R$ 5,61","3,95%",113,"R$ 1.228,37","219.109,22","R$ 138.805,69","1,29","R$ 8.754,91",4%,"R$ 4.148,44","1,89%","R$ 1.939,02","R$ 8,85","0,46%"
[#765_cv10_cb30_vr210] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],547.247,26.766,1,"R$ 275,85","R$ 5,64","4,89%",120,"R$ 1.257,99","247.702,85","R$ 150.958,8","1,35","R$ 18.838,93","7,61%","R$ 10.357,82","4,18%","R$ 2.064,19","R$ 9,25","0,45%"
[#910_cv10_cb30_vr225] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],363.866,13.896,"1,01","R$ 252,24","R$ 6,6","3,82%",82,"R$ 1.119,27","175.718,76",R$ 91.780,"1,72","R$ 39.357,96","22,4%","R$ 20.253,61","11,53%","R$ 2.142,91","R$ 12,65","0,59%"
[#793_cv52_cb184_vr45] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Lucas Botelho],254.255,9.747,1,"R$ 207,53","R$ 5,41","3,83%",54,"R$ 977,13","119.147,39","R$ 52.765,13","1,94","R$ 33.189,1","27,86%","R$ 24.661,4","20,7%","R$ 2.206,43","R$ 12,22","0,55%"
[#875_cv68_cb270_vr] [UGC] [Novo Hook] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Laysa Diniz],328.683,13.929,1,"R$ 207,01","R$ 4,88","4,24%",58,"R$ 1.173,12","111.808,07","R$ 68.040,86","1,32","R$ 6.013,22","5,38%","R$ 5.209,66","4,66%","R$ 1.927,73","R$ 8,03","0,42%"
[#694_cv52_cb184_vr23] [UGC] [Variação de Vídeo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Ender],245.878,11.025,1,"R$ 186,53","R$ 4,16","4,48%",52,"R$ 882,02","103.745,51","R$ 45.864,85","1,75","R$ 20.191,79","19,46%","R$ 24.631,17","23,74%","R$ 1.995,11","R$ 9,41","0,47%"
[#510_cv52_cb184_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Yuri Brandão] [Designer Vinicius Carvalho],866.253,34.681,1,"R$ 228,23","R$ 5,7",4%,148,"R$ 1.335,85","324.323,85","R$ 197.706,48","1,19","R$ 5.407,11","1,67%","R$ 23.201,93","7,15%","R$ 2.191,38","R$ 9,35","0,43%"
[#726_cv62_cb238_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Júlia Lopes] [Designer Gustavo Costa],214.268,8.257,1,"R$ 235,51","R$ 6,11","3,85%",35,"R$ 1.441,81","75.313,62","R$ 50.463,22","1,23","R$ 1.634,51","2,17%","R$ -962,38","-1,28%","R$ 2.151,82","R$ 9,12","0,42%"
[#585_cv10_cb30_vr164] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Matheus Subires],209.900,9.536,1,"R$ 268,66","R$ 5,91","4,54%",36,"R$ 1.566,45","73.393,74","R$ 56.392,16","0,93","R$ -10.862,56","-14,8%","R$ -6.821,38","-9,29%","R$ 2.038,72","R$ 7,7","0,38%"
[#341_cv10_cb30_vr85] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Matheus Subires],870.361,38.522,1,"R$ 262,29","R$ 5,93","4,43%",165,"R$ 1.383,54","329.165,05","R$ 228.283,29","1,13","R$ -12.104,67","-3,68%","R$ -6.241,74","-1,9%","R$ 1.994,94","R$ 8,54","0,43%"
[#678_cv52_cb184_vr22] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Matheus Subires],172.496,5.563,"1,01","R$ 162,5","R$ 5,04","3,23%",34,"R$ 824,41","69.419,21",R$ 28.030,"1,62","R$ 9.006,9","12,97%","R$ 18.590,35","26,78%","R$ 2.041,74","R$ 12,48","0,61%"
[#472_cv10_cb30_vr] [UGC] [Novo Hook] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],134.015,7.494,1,"R$ 235,36","R$ 4,21","5,59%",34,"R$ 927,71","69.936,3","R$ 31.542,16","1,38","R$ 6.060,87","8,67%","R$ 16.969,73","24,26%","R$ 2.056,95","R$ 9,33","0,45%"
[#711_cv58_cb202_vr3] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],253.728,8.788,1,"R$ 137,7","R$ 3,98","3,46%",29,"R$ 1.204,75","66.041,74","R$ 34.937,63","1,65","R$ 14.431,33","21,85%","R$ 8.716,93","13,2%","R$ 2.277,3","R$ 7,51","0,33%"
[#868_cv68_cb263_vr0] [Ripado] [Ripado] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],140.385,6.487,1,"R$ 226,89","R$ 4,91","4,62%",31,"R$ 1.027,47","65.673,1","R$ 31.851,57","1,51","R$ 8.350,27","12,71%","R$ 12.569,01","19,14%","R$ 2.118,49","R$ 10,12","0,48%"
[#2_cv1_cb2_vr0] [UGC] [Criativo Novo] [MLT_INTER-F226-2025-AQS] [Facebook Ad's] [Copywriter Yuri Brandão] [Designer Vinicius Carvalho],78.028,5.915,"1,01","R$ 263,07","R$ 3,47","7,58%",28,"R$ 733,1","64.696,82","R$ 20.526,67","2,77","R$ 25.964,04","40,13%","R$ 19.637,73","30,35%","R$ 2.310,6","R$ 10,94","0,47%"
[#703_cv10_cb30_vr190] [UGC] [Novo Hook] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gustavo Costa],106.915,5.514,1,R$ 293,"R$ 5,68","5,16%",32,"R$ 978,95","65.864,41","R$ 31.326,45","1,83","R$ 16.383,02","24,87%","R$ 12.421,2","18,86%","R$ 2.058,26","R$ 11,94","0,58%"
[#960_cv95_cb322_vr] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Allan Brandão ] [Designer Laysa Diniz],143.138,7.599,1,"R$ 285,11","R$ 5,37","5,31%",31,"R$ 1.316,44","65.569,06","R$ 40.809,62","1,29","R$ 1.982,97","3,02%","R$ 2.510,52","3,83%","R$ 2.115,13","R$ 8,63","0,41%"
[#1004_cv98_cb338_vr0] [UGC] [Criativo Novo] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gustavo Costa],189.358,6.841,"1,01","R$ 208,91","R$ 5,78","3,61%",30,"R$ 1.318,65","60.465,39","R$ 39.559,38","1,3","R$ 2.511,74","4,15%","R$ -178,08","-0,29%","R$ 2.015,51","R$ 8,84","0,44%"
[#677_cv52_cb184_vr21] [Podcast] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Matheus Subires],130.849,6.480,1,"R$ 234,06","R$ 4,73","4,95%",25,"R$ 1.225,06","54.140,9","R$ 30.626,48","1,31","R$ 3.647,87","6,74%","R$ 5.872,1","10,85%","R$ 2.165,64","R$ 8,36","0,39%"
[#710_cv58_cb202_vr2] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],114.026,5.642,1,"R$ 230,52","R$ 4,66","4,95%",22,"R$ 1.194,79","51.139,11","R$ 26.285,32","1,53","R$ 7.134,68","13,95%","R$ 8.706,23","17,02%","R$ 2.324,51","R$ 9,06","0,39%"
[#870_cv68_cb265_vr0] [Ripado] [Ripado] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Guilherme Martins],132.765,5.921,1,"R$ 234,95","R$ 5,27","4,46%",26,"R$ 1.199,74","51.793,78","R$ 31.193,22","1,29","R$ 3.061,48","5,91%","R$ 3.065,47","5,92%","R$ 1.992,07","R$ 8,75","0,44%"`;

// DADOS DE FEVEREIRO 2026 - INTEGRAL (23 REGISTROS)
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
[#1083_cv73_cb283_vr27] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],247.457,9.263,"1,01","R$ 172,51","R$ 4,61","3,74%",31,"R$ 1.377,02","48.935,17","R$ 42.687,74","1,01","R$ -7.432,79","-15,19%","R$ -11.055,26","-22,59%","R$ 1.578,55","R$ 5,28","0,33%"
[#910_cv10_cb30_vr225] [UGC] [Mudança Avatar] [F220-SGC_INTER-2025] [Facebook Ad's] [Copywriter Ruan Titto] [Designer Gabriel Barboza],166.308,7.044,"1,01","R$ 244,87","R$ 5,78","4,24%",25,"R$ 1.628,97","52.266,87","R$ 40.724,15","0,97","R$ -7.579,92","-14,5%","R$ -6.217,47","-11,9%","R$ 2.090,67","R$ 7,42","0,35%"
[#20_cv7_cb20_vr0] [UGC] [Criativo Novo] [MLT_INTER-F226-2025-AQS] [Facebook Ad's] [Copywriter Yuri Brandão] [Designer Vinicius Carvalho],153.362,7.018,1,"R$ 268,86","R$ 5,88","4,58%",20,"R$ 2.061,66","32.632,18","R$ 41.233,24","0,74","R$ -16.183,56","-49,59%","R$ -20.425,74","-62,59%","R$ 1.631,61","R$ 4,65","0,28%"`;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [weeklySubTab, setWeeklySubTab] = useState<WeeklySubTab>('ads');
  const [selectedDesigner, setSelectedDesigner] = useState<string | null>(null);
  const [viewType, setViewType] = useState<ViewType>('winners');

  const janData = useMemo(() => parseCSVData(FULL_CSV_JAN_2026), []);
  const febWeeklyData = useMemo(() => parseCSVData(WEEKLY_CSV_FEB_2026), []);

  const winnersJan = useMemo(() => janData.filter(ad => ad.revenue >= 100000).sort((a, b) => b.revenue - a.revenue), [janData]);

  const designerStats = useMemo(() => {
    const stats: Record<string, DesignerStat> = {};
    janData.forEach(ad => {
      if (!stats[ad.designer]) {
        stats[ad.designer] = { name: ad.designer, highPerfCount: 0, totalAdsCount: 0, totalRevenue: 0, formatBreakdown: [] };
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

  const summaryJan = useMemo((): MetricSummary => ({
    topDesigner: [...designerStats].sort((a, b) => b.totalRevenue - a.totalRevenue)[0]?.name || '...',
    topFormat: "UGC / Mudança Avatar",
    totalRevenue: janData.reduce((sum, ad) => sum + ad.revenue, 0),
    totalAdsAbove100k: winnersJan.length
  }), [janData, designerStats, winnersJan]);

  const groupedWeekly = useMemo(() => {
    const funnels: Record<string, { ads: ProcessedAd[] }> = {};
    febWeeklyData.forEach(ad => {
      if (!funnels[ad.funnel]) funnels[ad.funnel] = { ads: [] };
      funnels[ad.funnel].ads.push(ad);
    });
    return Object.entries(funnels).map(([name, data]) => {
      const designersMap: Record<string, { revenue: number, adCount: number }> = {};
      data.ads.forEach(ad => {
        if (!designersMap[ad.designer]) designersMap[ad.designer] = { revenue: 0, adCount: 0 };
        designersMap[ad.designer].revenue += ad.revenue;
        designersMap[ad.designer].adCount += 1;
      });
      return {
        name,
        totalRevenue: data.ads.reduce((s, a) => s + a.revenue, 0),
        ads: [...data.ads].sort((a, b) => b.revenue - a.revenue).slice(0, 5),
        designers: Object.entries(designersMap).map(([d, s]) => ({ name: d, ...s })).sort((a, b) => b.revenue - a.revenue).slice(0, 5)
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
              <button key={tab} onClick={() => { setActiveTab(tab); setSelectedDesigner(null); }} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
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
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Elite January (+R$ 100k)</h2>
            <RankingTable ads={winnersJan} />
          </div>
        )}
        {activeTab === 'designers' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter border-b border-slate-800 pb-4">Editores Criativos (Jan)</h2>
            <DesignerAnalytics stats={designerStats} onSelectDesigner={(n, t) => { setSelectedDesigner(n); setViewType(t); }} selectedDesigner={selectedDesigner} currentViewType={viewType} />
            {selectedDesigner && (
              <div className="mt-8 space-y-4">
                <h3 className="text-xl font-bold text-white uppercase italic">Criativos: <span className="text-indigo-400">{selectedDesigner}</span></h3>
                <RankingTable ads={janData.filter(ad => ad.designer === selectedDesigner && (viewType === 'all' || ad.revenue >= 100000)).sort((a,b)=>b.revenue-a.revenue)} />
              </div>
            )}
          </div>
        )}
        {activeTab === 'weekly' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">Semanal (Fev)</h2>
                <p className="text-slate-400 text-sm">Dados restaurados: 23 registros ativos.</p>
              </div>
              <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
                <button onClick={() => setWeeklySubTab('ads')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${weeklySubTab === 'ads' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Top Anúncios</button>
                <button onClick={() => setWeeklySubTab('designers')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${weeklySubTab === 'designers' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>Top Editores</button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {groupedWeekly.map((group, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col group hover:border-indigo-500/30 transition-all">
                  <div className="p-6 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
                    <div className="min-w-0">
                      <h3 className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-1">Célula Funil</h3>
                      <h4 className="text-white font-bold truncate text-xl uppercase">{group.name}</h4>
                    </div>
                    <p className="text-emerald-400 font-mono font-black text-lg">{formatter.format(group.totalRevenue)}</p>
                  </div>
                  <div className="p-3 flex-grow space-y-2">
                    {(weeklySubTab === 'ads' ? group.ads : group.designers).map((item: any, i) => (
                      <div key={i} className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${i === 0 ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-transparent border-transparent hover:bg-slate-800/40'}`}>
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${i === 0 ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}`}>{i + 1}</div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-slate-200 truncate uppercase" title={item.adName || item.name}>{item.adName || item.name}</p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase">{item.designer || `${item.adCount} Criativos`}</p>
                          </div>
                        </div>
                        <p className="text-xs font-black font-mono text-emerald-400">{formatter.format(item.revenue)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <footer className="text-center py-20 opacity-30 text-[10px] font-black uppercase tracking-[0.4em]">Creative Ops • Intelligence Unit 2026</footer>
    </div>
  );
};

export default App;