"""Rebuild original factual chart from BLS 2026-10-02 release (no invented data)."""
from pathlib import Path
import os
os.environ.setdefault('MPLCONFIGDIR', '/tmp/globalbole-matplotlib')
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties
from matplotlib.ticker import FuncFormatter

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / 'public/news-media/2026-10-03'
FONT = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
BOLD = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
fp = FontProperties(fname=FONT)
bold = FontProperties(fname=BOLD)
plt.rcParams.update({'font.family':fp.get_name(), 'axes.unicode_minus':False, 'svg.fonttype':'path'})
ink, muted, red, paper, grid = '#18242d', '#65727b', '#c64431', '#fbfaf7', '#dedfdc'
fig = plt.figure(figsize=(13.2,8.5), dpi=150, facecolor=paper)
fig.text(.065,.934,'美国就业  /  2026年9月', fontproperties=bold, fontsize=24, color=ink)
fig.text(.065,.886,'新增岗位有限，前两个月数据再下修', fontproperties=fp, fontsize=17, color=muted)
fig.text(.067,.776,'2.9万', fontproperties=bold, fontsize=31,color=red)
fig.text(.067,.738,'9月新增非农就业', fontproperties=fp,fontsize=12,color=muted)
fig.text(.390,.776,'4.2%',fontproperties=bold,fontsize=31,color=ink)
fig.text(.390,.738,'9月失业率',fontproperties=fp,fontsize=12,color=muted)
fig.text(.704,.776,'3.0%',fontproperties=bold,fontsize=31,color=ink)
fig.text(.704,.738,'私人非农平均时薪同比',fontproperties=fp,fontsize=12,color=muted)
ax = fig.add_axes([.11,.305,.78,.345], facecolor=paper)
vals=[-1,13.3,2.9]
bars=ax.bar([0,1,2],vals,width=.45,color=['#627b8b','#627b8b',red],zorder=3)
ax.set_ylim(-3.6,17)
ax.set_xlim(-.6,2.6)
ax.set_xticks([0,1,2],['7月（修订后）','8月（修订后）','9月（初值）'],fontproperties=fp,fontsize=12)
ax.set_yticks([0,5,10,15],['0','5','10','15'],fontsize=11,color=muted)
ax.tick_params(axis='both',length=0,pad=10)
ax.grid(axis='y',color=grid,linewidth=.8,zorder=0)
ax.axhline(0,color=ink,linewidth=1,zorder=1)
for s in ['left','right','top','bottom']:ax.spines[s].set_visible(False)
for b,v in zip(bars,vals):
 ax.text(b.get_x()+b.get_width()/2, v+(.5 if v>=0 else -.6), ('+' if v>0 else '−')+f'{abs(v):g}',ha='center',va='bottom' if v>=0 else 'top',fontproperties=bold,fontsize=17,color=red if v==2.9 else ink)
fig.text(.11,.669,'非农就业月度变化（万人，经季节调整）',fontproperties=fp,fontsize=12,color=muted)
fig.text(.065,.199,'修订幅度',fontproperties=bold,fontsize=14,color=ink)
fig.text(.065,.153,'7月：+2.1万 → −1.0万     8月：+16.2万 → +13.3万',fontproperties=fp,fontsize=14,color=ink)
fig.text(.065,.103,'两月合计较此前公布值减少6.0万；9月数据仍可能修订',fontproperties=fp,fontsize=13,color=red)
fig.text(.065,.039,'数据：美国劳工统计局，2026-10-02  ·  制图：全球伯乐 News',fontproperties=fp,fontsize=10,color=muted)
fig.savefig(OUT/'us-employment-september-2026.png',facecolor=paper,dpi=150)
fig.savefig(OUT/'us-employment-september-2026.svg',facecolor=paper)
plt.close(fig)
