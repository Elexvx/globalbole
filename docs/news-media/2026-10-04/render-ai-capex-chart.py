"""Original chart from PwC's Global Data Centre Outlook 2026-50 central scenario."""
from pathlib import Path
import os
os.environ.setdefault('MPLCONFIGDIR', '/tmp/globalbole-matplotlib')
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / 'public/news-media/2026-10-04'
OUT.mkdir(parents=True, exist_ok=True)
fp = FontProperties(fname='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc')
bold = FontProperties(fname='/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc')
plt.rcParams.update({'font.family': fp.get_name(), 'axes.unicode_minus': False, 'svg.fonttype': 'path'})
ink, muted, red, paper, grid = '#18242d', '#65727b', '#c64431', '#fbfaf7', '#dedfdc'
fig = plt.figure(figsize=(13.2,8.5),dpi=150,facecolor=paper)
fig.text(.065,.925,'数据中心资本开支的长期预测',fontproperties=bold,fontsize=25,color=ink)
fig.text(.065,.867,'PwC中性情景：2026—2050年累计约31.6万亿美元',fontproperties=fp,fontsize=17,color=muted)
ax=fig.add_axes([.12,.275,.78,.45],facecolor=paper)
vals=[.8,1.1,1.8]
bars=ax.bar([0,1,2],vals,width=.45,color=['#627b8b','#627b8b',red],zorder=3)
ax.set_ylim(0,2.1)
ax.set_xlim(-.6,2.6)
ax.set_xticks([0,1,2],['2026年','2030年','2050年'],fontproperties=fp,fontsize=14,color=ink)
ax.set_yticks([0,.5,1,1.5,2],['0','0.5','1.0','1.5','2.0'],fontsize=12,color=muted)
ax.tick_params(axis='both',length=0,pad=12)
ax.grid(axis='y',color=grid,linewidth=.8,zorder=0)
for side in ['left','right','top','bottom']: ax.spines[side].set_visible(False)
for b,v in zip(bars,vals): ax.text(b.get_x()+b.get_width()/2,v+.06,f'{v:.1f}',ha='center',fontproperties=bold,fontsize=23,color=ink)
fig.text(.12,.765,'全球数据中心年度资本开支（万亿美元）',fontproperties=fp,fontsize=13,color=muted)
fig.text(.065,.159,'全部数值为模型预测，不是已发生支出；统计包含建筑与信息通信设备。',fontproperties=fp,fontsize=13,color=ink)
fig.text(.065,.109,'金额按报告所列实际美元与2025年汇率计；横轴为三个选定年份。',fontproperties=fp,fontsize=12,color=muted)
fig.text(.065,.045,'数据：PwC，2026-09-02  ·  建模：Oxford Economics  ·  制图：全球伯乐 News',fontproperties=fp,fontsize=11,color=muted)
fig.savefig(OUT/'ai-data-centre-capex.png',facecolor=paper,dpi=150)
fig.savefig(OUT/'ai-data-centre-capex.svg',facecolor=paper)
plt.close(fig)
