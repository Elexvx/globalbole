"""Rebuild the original chart from India's 2026-09-30 GEC-III announcement."""
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
fig = plt.figure(figsize=(13.2,8.5), dpi=150, facecolor=paper)
fig.text(.065,.922,'印度绿色能源走廊三期',fontproperties=bold,fontsize=26,color=ink)
fig.text(.065,.865,'输电与储能同步规划，目标于2032—2033财年建成',fontproperties=fp,fontsize=17,color=muted)
ax = fig.add_axes([.21,.37,.66,.36],facecolor=paper)
values = [136378,50000]
ax.barh([1,0],values,height=.43,color=['#627b8b',red],zorder=3)
ax.set_yticks([1,0],['邦内输电系统','电池储能'],fontproperties=bold,fontsize=14,color=ink)
ax.set_xlim(0,155000)
ax.set_xticks([0,50000,100000,150000],['0','50,000','100,000','150,000'],fontsize=11,color=muted)
ax.tick_params(axis='both',length=0,pad=13)
ax.grid(axis='x',color=grid,linewidth=.8,zorder=0)
for side in ['left','right','top','bottom']: ax.spines[side].set_visible(False)
for y,value in zip([1,0],values):
    ax.text(value+2300,y,f'{value:,}',va='center',fontproperties=bold,fontsize=16,color=ink)
fig.text(.21,.758,'公告列示投资分项（crore 卢比；1 crore = 1,000万卢比）',fontproperties=fp,fontsize=12,color=muted)
fig.text(.065,.235,'135 GW',fontproperties=bold,fontsize=27,color=ink)
fig.text(.065,.190,'拟支撑的新能源送出规模',fontproperties=fp,fontsize=13,color=muted)
fig.text(.55,.235,'50 GWh',fontproperties=bold,fontsize=27,color=red)
fig.text(.55,.190,'规划电池储能容量',fontproperties=fp,fontsize=13,color=muted)
fig.text(.065,.102,'GW为功率，GWh为能量；两项目标单位不同，不作比例比较。',fontproperties=fp,fontsize=12,color=muted)
fig.text(.065,.048,'数据：印度总理府，2026-09-30  ·  制图：全球伯乐 News',fontproperties=fp,fontsize=11,color=muted)
fig.savefig(OUT/'india-green-energy-corridor-investment.png',facecolor=paper,dpi=150)
fig.savefig(OUT/'india-green-energy-corridor-investment.svg',facecolor=paper)
plt.close(fig)
