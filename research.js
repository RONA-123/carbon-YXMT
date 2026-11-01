const chapter=document.createElement('article');chapter.className='chapter';chapter.id='research-update';
chapter.innerHTML=`<span class="kicker">RESEARCH UPDATE / 2026.10.31</span><h2>有了尺寸，怎样把斗栱一步步做准？</h2><p class="lead">新建立三、四、五层的独立柱头铺作研究样件。先将构件与文献编号对应，再校核形态、装配与榫口；第四版已据此更新全塔斗栱的展示组合。全塔适配采用了非等比例尺寸调整，柱头样件之外的补间、转角、平座和低层组合仍为推定；全塔模型不继承样件的原型尺寸精度。</p>
<div class="evidence"><p><strong>53条尺寸记录，不等于53种斗栱。</strong>它们是三个层位样件的构件表条目。斗栱还须区分柱头、补间与转角，以及同类在不同层位的变化。</p><p>样件采用论文表中的<strong>原型尺寸</strong>。该论文同时列出1:3.7缩尺试验尺寸，两栏不能混用。<a href="https://pubs.cstam.org.cn/article/doi/10.6052/j.issn.1000-4750.2022.08.0754" target="_blank" rel="noopener">阅读论文图2与表1–3 ↗</a></p></div>
<p><a href="./dougong.html">进入斗栱三维研究室：切换层位、展开与点选构件 ↗</a></p>
<iframe title="三至五层斗栱构件研究" src="./dougong.html" loading="lazy" style="width:100%;height:800px;border:1px solid #c8bda9;border-radius:4px"></iframe>
<h3>第四版：全塔整合与26尊造像细化</h3><p>原简化斗栱已从新版场景中移除，六道檐口与四道平座下采用了新组合。26尊造像按立像、坐像、弟子、乘骑和侍从区分，并增加面部、手指、衣褶、冠饰及莲瓣。</p><p><a href="./sculptures.html">进入造像近观：逐层与单尊查看 ↗</a></p><p>本版仍为解释性模型：模型中的480组展示布置不等于文献记载的实物铺作总数，也不能替代全塔逐件类型总表。</p><h3>这个版本已经做到哪一步？</h3><div class="table-scroll"><table><thead><tr><th>对象</th><th>已落实的依据</th><th>仍待补齐</th></tr></thead><tbody>
<tr><td>斗栱样件</td><td>三个层位的构件编号、名称与原型外包尺寸</td><td>精确轮廓、装配坐标、榫口，以及全塔类型与位置总表</td></tr>
<tr><td>柱网与暗层</td><td>找到历史平面、断面测稿和结构论文</td><td>不同年代图档对照及模糊尺寸的高清原图</td></tr>
<tr><td>造像</td><td>找到造像空间与尺度研究，可用于校正群像关系</td><td>每尊造像的完整多角度图像或扫描，特别是背部与手部</td></tr>
<tr><td>楼梯</td><td>大学课程资料说明楼梯逐层移位</td><td>各层精确方位、踏步数与洞口尺寸；当前模型位置仍待核</td></tr></tbody></table></div>
<h3>让资料与模型一起被看见</h3><p>后续构件采用三种说明：<strong>实测依据</strong>用于能够对应图纸或尺寸表的部分；<strong>学术推定</strong>用于有研究解释但尚未实测闭合的部分；<strong>展示补配</strong>用于阅读模型所需的简化表达。同一构件可能尺寸有据、轮廓仍待核，不能只用一个“精确”标签概括。</p>
<p><a href="https://ci.nii.ac.jp/ncid/BD1220482X" target="_blank" rel="noopener">《应县木塔大木作研究·榫卯篇》馆藏记录 ↗</a>：已核实2025年三卷本的书目，尚未取得完整图集。</p>
<p><a href="https://newetds.lib.tsinghua.edu.cn/qh/paper/summary?dbCode=ETDQH&sysId=285111" target="_blank" rel="noopener">清华大学大木作尺度研究博士论文摘要 ↗</a>：可了解表里探查方法，公开摘要不等于取得整篇论文或点云。</p>
<p><a href="https://jianzhushi.gdut.edu.cn/info/1182/1311.htm" target="_blank" rel="noopener">广东工业大学建筑史课程：楼梯逐层移位 ↗</a>：支持修正旧示意，但不足以确定每层具体方位。</p>`;
const insert=()=>{const target=document.querySelector('#restoration-reading');if(target){target.after(chapter);const nav=document.querySelector('#reading nav');if(nav){const link=document.createElement('a');link.href='#research-update';link.textContent='斗栱研究更新';nav.append(link)}return true}return false};
if(!insert())window.addEventListener('DOMContentLoaded',insert,{once:true});
