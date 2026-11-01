import './knowledge.js';
import './research.js';
import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {DRACOLoader} from './vendor/DRACOLoader.js';
const stage=document.querySelector('#stage');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.45;renderer.localClippingEnabled=true;stage.appendChild(renderer.domElement);
const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(35,1,.1,700);camera.position.set(78,51,110);
const orbit=new OrbitControls(camera,renderer.domElement);orbit.target.set(0,32,0);orbit.enableDamping=true;orbit.dampingFactor=.08;orbit.maxDistance=270;orbit.minDistance=4;orbit.maxPolarAngle=Math.PI*.94;orbit.autoRotateSpeed=.55;
scene.add(new THREE.HemisphereLight(0xfff6df,0x70767b,2.4));
const sun=new THREE.DirectionalLight(0xffe5c4,3.2);sun.position.set(40,70,55);scene.add(sun);const fill=new THREE.DirectionalLight(0xc1d4e3,1.6);fill.position.set(-45,35,-15);scene.add(fill);
const ground=new THREE.Mesh(new THREE.CircleGeometry(24,80),new THREE.MeshStandardMaterial({color:0xd0c6ae,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.08;scene.add(ground);
const line=new THREE.Mesh(new THREE.RingGeometry(22.5,22.55,96),new THREE.MeshBasicMaterial({color:0xaaa18a,side:THREE.DoubleSide}));line.rotation.x=-Math.PI/2;line.position.y=-.04;scene.add(line);
const clip=new THREE.Plane(new THREE.Vector3(1,0,0),0);
const defs={roofs:['屋顶与椽子',/Roof|Rafters/],walls:['墙体与门窗',/Walls|Window_Sills|Inscription|Painted_Cloud/],frame:['柱梁框架',/Frame|Colonnade/],dark:['暗层支撑',/DarkLevel/],dougong:['斗栱铺作',/Dougong/],stairs:['楼梯',/Stairs/],buddhas:['佛像与造像',/Buddha|Attendant/],slabs:['楼板与平座',/Gallery_Floor|Shrine_Floor|Balustrades/]};
const state={mode:'exterior',floor:0,spread:0,visible:Object.fromEntries(Object.keys(defs).map(k=>[k,true]))};
let model;const groups=Object.fromEntries(Object.keys(defs).map(k=>[k,[]]));const floors=[];let finial;const meshRoots=[];let selected=null;let flying=null;
for(const [key,[label]] of Object.entries(defs)){const row=document.createElement('label');row.className='toggle';row.innerHTML=`<span>${label}</span><input type="checkbox" checked data-category="${key}">`;document.querySelector('#toggles').append(row);row.querySelector('input').addEventListener('change',e=>{state.visible[key]=e.target.checked;applyVisibility()})}
const draco=new DRACOLoader();draco.setDecoderPath('./vendor/draco/');const loader=new GLTFLoader();loader.setDRACOLoader(draco);
loader.load('./Yingxian_Pagoda_web.glb',gltf=>{
 model=gltf.scene;scene.add(model);
 model.traverse(o=>{
  for(const [key,[,pattern]] of Object.entries(defs))if(pattern.test(o.name))groups[key].push(o);
  const match=/^Floor_0([1-5])/.exec(o.name);if(match)floors.push({o,k:Number(match[1]),initial:o.position.clone()});
  if(/^Roof_Finial/.test(o.name))finial={o,initial:o.position.clone()};
  if(o.isMesh){meshRoots.push(o);for(const mat of (Array.isArray(o.material)?o.material:[o.material])){mat.side=THREE.DoubleSide;mat.clippingPlanes=[];if(mat.map)mat.map.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),4)}}
 });
 let triangles=0;for(const o of meshRoots)triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;
 document.querySelector('#stats').textContent=`${Math.round(triangles/1000)}k 三角面 · ${floors.length} 个楼层 · 贴图已加载`;
 document.querySelector('#loading').hidden=true;document.querySelector('#loading').style.display='none';applyVisibility();window.pagodaReady=true;window.pagoda={state,groups,floors,model,scene,renderer,camera};
},xhr=>{if(xhr.total)document.querySelector('#progress').style.width=`${Math.round(xhr.loaded/xhr.total*100)}%`},error=>{document.querySelector('#load-text').textContent='加载失败，请通过本地预览启动器打开，并检查文件是否完整。';console.error(error);window.pagodaError=String(error)});
function applyVisibility(){
 if(!model)return;
 // An object may belong to several categories; it must satisfy each category filter.
 model.traverse(o=>{if(o!==model)o.visible=true});
 for(const [key,objects] of Object.entries(groups))if(!state.visible[key])objects.forEach(o=>{o.visible=false});
 for(const f of floors){f.o.visible=!state.floor||f.k===state.floor;f.o.position.copy(f.initial);f.o.position.y+=(f.k-1)*state.spread}
 if(finial){finial.o.position.copy(finial.initial);finial.o.position.y+=4*state.spread;finial.o.visible=state.visible.roofs&&(!state.floor||state.floor===5)}
 model.traverse(o=>{if(o.isMesh)for(const mat of (Array.isArray(o.material)?o.material:[o.material])){mat.clippingPlanes=state.mode==='section'?[clip]:[]}});
 for(const input of document.querySelectorAll('[data-category]'))input.checked=state.visible[input.dataset.category];
 document.querySelector('#spread').value=state.spread;document.querySelector('#spread-value').textContent=`${state.spread.toFixed(1)} m`;
}
function fly(position,target){flying={position:new THREE.Vector3(...position),target:new THREE.Vector3(...target)}}
const titles={exterior:['层檐之间，读懂木构','八角塔身 / 五明四暗 / 分层构件'],structure:['隐去围护，显露骨架','柱梁 / 暗层支撑 / 斗栱与楼梯'],exploded:['层层展开，观察联系','分层节点保持独立，可拖动调整层间距'],section:['沿中轴剖开塔身','沿 X 轴半剖 · 屋顶和墙体的截面暂不封口']};
function setMode(mode){state.mode=mode;state.floor=0;state.spread=mode==='exploded'?8:0;for(const k of Object.keys(defs))state.visible[k]=true;if(mode==='structure'||mode==='exploded'){state.visible.roofs=false;state.visible.walls=false}document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));document.querySelectorAll('[data-floor]').forEach(b=>b.classList.toggle('active',b.dataset.floor==='0'));document.querySelector('#view-title').textContent=titles[mode][0];document.querySelector('#view-subtitle').textContent=titles[mode][1];fly(mode==='exploded'?[110,65,150]:[78,51,110],mode==='exploded'?[0,49,0]:[0,32,0]);applyVisibility()}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
document.querySelectorAll('[data-floor]').forEach(b=>b.addEventListener('click',()=>{state.floor=Number(b.dataset.floor);state.spread=0;document.querySelectorAll('[data-floor]').forEach(a=>a.classList.toggle('active',a===b));applyVisibility();if(!state.floor){fly([78,51,110],[0,32,0]);return}const f=floors.find(f=>f.k===state.floor);const box=new THREE.Box3().setFromObject(f.o);const c=box.getCenter(new THREE.Vector3());fly([c.x+24,c.y+12,c.z+38],c.toArray());document.querySelector('#info-title').textContent=`第 ${state.floor} 层`;document.querySelector('#info-text').textContent='当前仅显示这一层。可隐藏屋顶与墙体，近距离观察佛像、斗栱和楼梯；楼梯路径及造像细节为展示性推定。'}));
document.querySelector('#spread').addEventListener('input',e=>{state.spread=Number(e.target.value);applyVisibility()});document.querySelector('#rotate').addEventListener('change',e=>orbit.autoRotate=e.target.checked);
document.querySelector('#front').addEventListener('click',()=>fly([0,state.floor?[4.4,20,29.2,38.5,47.8][state.floor-1]+4:34,state.floor?52:132],[0,state.floor?[4.4,20,29.2,38.5,47.8][state.floor-1]+4:32,0]));
document.querySelector('#reset').addEventListener('click',()=>{orbit.autoRotate=false;document.querySelector('#rotate').checked=false;clearSelection();setMode('exterior')});
document.querySelector('#capture').addEventListener('click',()=>window.open('./media/exterior_v4.png','_blank','noopener'));
orbit.addEventListener('start',()=>flying=null);
function clearSelection(){if(!selected)return;for(const [o,m]of selected){o.material=m}selected=null}
const notes={roofs:['屋顶与椽子','曲面屋顶与瓦垄沿八面展开；首层重檐和顶层攒尖分别组织。屋面曲率与瓦当细节仍为图片推定。'],walls:['围护与门窗','墙板、格栅、窗槛和彩绘带构成外部围护。通过显隐开关可揭示内部柱圈。'],frame:['柱梁框架','内外柱圈通过梁枋联系。外圈补充了每面中间柱；柱网尺寸与节点细节仍有简化。'],dark:['暗层支撑','明层之间的斜撑和水平梁形成独立结构带。本模型用于解释连接关系，不用于结构验算。'],dougong:['斗栱铺作','柱头、补间和转角采用不同组合，并区分屋檐和平座下方支承。本版已替换全塔旧斗栱，按柱头、补间、转角和平座细化。适配现有塔体时进行了尺寸变换，尚不等同全部真实类型的精确复原。'],stairs:['楼梯','两段折返与中间平台展示上下联系。位置待核。资料说明楼梯逐层移位；当前同方位重复的楼梯仅为旧版示意，不代表实测布置。'],buddhas:['佛像与造像','26尊造像已重建，区分坐像、立姿胁侍、弟子、狮象乘骑与侍从，并细化冠饰、手指、衣褶和莲座。细部仍含推定，可进入“造像近观”查看。'],slabs:['楼板与平座','外围回廊、中心佛坛地面及栏杆分别建模，便于观察内外空间和层间联系。']};
let pointerDown;renderer.domElement.addEventListener('pointerdown',e=>pointerDown=[e.clientX,e.clientY]);renderer.domElement.addEventListener('pointerup',e=>{if(!model||!pointerDown||Math.hypot(e.clientX-pointerDown[0],e.clientY-pointerDown[1])>5)return;const rect=renderer.domElement.getBoundingClientRect();const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);const hits=ray.intersectObjects(meshRoots).filter(h=>{for(let o=h.object;o;o=o.parent)if(!o.visible)return false;return state.mode!=='section'||clip.distanceToPoint(h.point)>=0});if(!hits.length){clearSelection();return}clearSelection();let o=hits[0].object;let owner=o;while(owner.parent&&owner.parent!==model&&!/^L\d_|^Roof_|^Base_/.test(owner.name))owner=owner.parent;let key=Object.keys(defs).find(k=>defs[k][1].test(owner.name));if(!key)key=Object.keys(defs).find(k=>defs[k][1].test(o.name));const info=notes[key]??['台基','砖石台基与踏步承托塔身。本版台基形状和尺度为展示性重建。'];document.querySelector('#info-title').textContent=info[0];document.querySelector('#info-text').textContent=info[1];selected=[];owner.traverse(child=>{if(child.isMesh){const mats=child.material;selected.push([child,mats]);const tint=m=>{const x=m.clone();x.emissive=new THREE.Color(0x79431f);x.emissiveIntensity=.22;return x};child.material=Array.isArray(mats)?mats.map(tint):tint(mats)}})});
new ResizeObserver(()=>{const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()}).observe(stage);
function animate(){requestAnimationFrame(animate);if(flying){camera.position.lerp(flying.position,.075);orbit.target.lerp(flying.target,.075);if(camera.position.distanceTo(flying.position)<.05)flying=null}orbit.update();renderer.render(scene,camera)}animate();


