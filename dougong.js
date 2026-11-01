import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
const $=s=>document.querySelector(s),stage=$('#stage');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;stage.appendChild(renderer.domElement);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.01,180);camera.position.set(9,7,11);
const orbit=new OrbitControls(camera,renderer.domElement);orbit.target.set(0,2.5,0);orbit.enableDamping=true;orbit.minDistance=1;orbit.maxDistance=60;
scene.add(new THREE.HemisphereLight(0xfff2d7,0x71675f,2));const key=new THREE.DirectionalLight(0xffead0,3);key.position.set(4,10,8);scene.add(key);const fill=new THREE.DirectionalLight(0xcbd9e2,1.8);fill.position.set(-8,6,-4);scene.add(fill);
const grid=new THREE.GridHelper(14,14,0xb7a78f,0xd4cbbc);grid.position.y=-.08;scene.add(grid);
let roots=[],meshes=[],floor=3,selected=null,isolated=false,spread=0;
const original=new Map();
function clear(){for(const [o,material]of original){o.material.dispose();o.material=material}original.clear();selected=null;isolated=false;$('#isolate').classList.remove('active');}
function refresh(){for(const root of roots){root.visible=!floor||root.userData.floor===floor;root.position.x=floor?0:(root.userData.floor-4)*9;}
 for(const o of meshes){o.position.copy(o.userData.home);o.position.y+=spread*(Number(o.userData.layer)+.5);o.visible=!isolated||o===selected;}
 $('#title').textContent=floor?['','','','三层','四层','五层'][floor]+' · 外槽柱头铺作':'三、四、五层 · 并列比较';
 $('#status').textContent=`${floor?'单层':'三层位'}研究样件 · 已载入53条原型尺寸记录 · ${Math.round(spread/1.5*100)}%展开`;
}
function choose(o){clear();selected=o;const m=o.material.clone();original.set(o,o.material);o.material=m;m.emissive.set(0xb36c2f);m.emissiveIntensity=.35;
 const d=o.userData;$('#details').replaceChildren();const title=document.createElement('strong');title.textContent=d.part_id+' / '+d.part_name;const dims=document.createElement('p');dims.textContent='原型 '+d.prototype_mm.join(' × ')+' mm（长 × 宽 × 高）';const evidence=document.createElement('span');evidence.className='evidence';evidence.textContent='尺寸依据：论文表'+d.source_table;const note=document.createElement('p');note.textContent='轮廓与隐蔽榫口待核；装配坐标为示意。'+(d.instance_status||'');$('#details').append(title,dims,evidence,note);
 $('#parts').querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.id===`${d.floor}-${d.part_id}`));refresh();
}
function list(){const items=meshes.filter(o=>(!floor||o.userData.floor===floor)&&!o.userData.instance_status);$('#parts').replaceChildren();$('#count').textContent=`/ ${items.length}`;
 for(const o of items){const b=document.createElement('button');b.className='part';b.dataset.id=`${o.userData.floor}-${o.userData.part_id}`;b.textContent=`${!floor?o.userData.floor+'层 · ':''}${o.userData.part_id} ${o.userData.part_name}`;b.onclick=()=>choose(o);$('#parts').appendChild(b);}}
function frame(){orbit.target.set(0,2.5,0);camera.position.set(...(floor?[9,7,11]:[19,13,27]));grid.scale.setScalar(floor?1:2);orbit.update();}
new GLTFLoader().load('./media/dougong_study.glb',g=>{scene.add(g.scene);g.scene.traverse(o=>{if(o.name.startsWith('Floor_'))roots.push(o);if(o.isMesh){meshes.push(o);o.userData.home=o.position.clone();}});refresh();list();frame();window.dougongReady=true;},undefined,e=>{$('#status').textContent='样件读取失败，请使用本地预览启动器打开。';console.error(e)});
$('#floors').onclick=e=>{const b=e.target.closest('[data-floor]');if(!b)return;clear();floor=Number(b.dataset.floor);$('#floors').querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));refresh();list();frame();};
$('#explode').oninput=e=>{spread=Number(e.target.value)/100*1.5;$('#value').textContent=e.target.value+'%';refresh()};
$('#isolate').onclick=()=>{if(!selected){$('#details').querySelector('p').textContent='请先点击模型或目录中的构件。';return}isolated=!isolated;$('#isolate').classList.toggle('active',isolated);refresh()};
$('#reset').onclick=()=>{clear();spread=0;$('#explode').value=0;$('#value').textContent='0%';refresh();frame();$('#details').innerHTML='<strong>选择一个构件</strong><p>点击模型或目录查看尺寸。</p>'};
let down;renderer.domElement.addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;const r=renderer.domElement.getBoundingClientRect(),ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2),camera);const hits=ray.intersectObjects(meshes).filter(h=>{for(let o=h.object;o;o=o.parent)if(!o.visible)return false;return true});if(hits.length)choose(hits[0].object)});
new ResizeObserver(()=>{renderer.setSize(stage.clientWidth,stage.clientHeight);camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix()}).observe(stage);
function animate(){requestAnimationFrame(animate);orbit.update();renderer.render(scene,camera)}animate();
