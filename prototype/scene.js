import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const $ = (s) => document.querySelector(s);
const view = $('#viewport');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.35;
view.prepend(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color('#202b26');
scene.fog = new THREE.Fog('#202b26', 17, 36);
const camera = new THREE.PerspectiveCamera(37, 1, .1, 80);
camera.position.set(10, 8, 13);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.3, 0);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;
controls.minPolarAngle = .3;
controls.maxPolarAngle = 1.45;
controls.minDistance = 5;
controls.maxDistance = 22;
// Vertical touch gestures stay available for reading the case study.
controls.touches.ONE = THREE.TOUCH.ROTATE;
renderer.domElement.style.touchAction = 'pan-y';
const world = new THREE.Group(); scene.add(world);
scene.add(new THREE.HemisphereLight('#d5e9be', '#233129', 2.0));
const sun = new THREE.DirectionalLight('#fff0c8', 3.5); sun.position.set(-5, 10, 6); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, {left:-8,right:8,top:8,bottom:-8,near:.5,far:30}); sun.shadow.normalBias = .04; scene.add(sun);
const rim = new THREE.DirectionalLight('#8ccab8', 2); rim.position.set(4, 5, -7); scene.add(rim);
const mat = (color, extras={}) => new THREE.MeshStandardMaterial({color, roughness:.84, ...extras});
const stone = mat('#64736a'); const darkstone = mat('#39463f'); const sand = mat('#58634d');
const cloth = mat('#ac6039'); const gold = mat('#a7975d', {metalness:.55,roughness:.4});
const wood = mat('#5e4935'); const leather = mat('#31382d'); const face = mat('#bdac82');
const glow = mat('#b8eb8d',{emissive:'#a4dc6b',emissiveIntensity:2.2,roughness:.3});
const meshes = [];
function mesh(geometry, material, pos, parent=world) {
  const m = new THREE.Mesh(geometry,material); m.position.set(...pos); m.castShadow=true; m.receiveShadow=true;
  m.userData.originalMaterial = material; parent.add(m); meshes.push(m); return m;
}
const box=(size,pos,material=stone,parent=world)=>mesh(new THREE.BoxGeometry(...size),material,pos,parent);
const cyl=(top,bottom,height,pos,material=stone,parent=world,sides=12)=>mesh(new THREE.CylinderGeometry(top,bottom,height,sides),material,pos,parent);
const sphere=(radius,pos,material,parent=world)=>mesh(new THREE.IcosahedronGeometry(radius,1),material,pos,parent);

// The whole diorama is deliberately constructed from editable primitives.
cyl(5.4,4.8,.65,[0,-.45,0],darkstone,world,10);
cyl(5.38,5.35,.12,[0,-.08,0],sand,world,10);
const baseRing = mesh(new THREE.TorusGeometry(5.05,.012,4,80),gold,[0,.003,0]); baseRing.rotation.x=Math.PI/2;
for(let i=0;i<13;i++){
  const a=i*2.4; const r=2+Math.sin(i*1.9)*1.8;
  const tile=box([.8+(i%3)*.13,.07,.65],[Math.cos(a)*r,.015,Math.sin(a)*r],i%2?stone:darkstone);
  tile.rotation.y=i*.37;
}
// Broken gateway: separate blocks expose modular construction in wire mode.
for(const x of [-2.05,2.05]){
  box([1.15,.25,1.15],[x,.13,-1.7],darkstone);
  for(let j=0;j<5;j++){const block=box([.8,.65,.87],[x+(j%2)*.025,.58+j*.67,-1.7],stone);block.rotation.y=(j%2)*.04;}
  box([1.05,.21,1.02],[x,3.7,-1.7],darkstone);
}
for(let i=0;i<7;i++){
  const a=(i+.5)/7*Math.PI; const block=box([.76,.72,.86],[Math.cos(a)*2.05,3.47+Math.sin(a)*1.85,-1.7],stone);block.rotation.z=a-Math.PI/2;
}
const portal = mesh(new THREE.TorusGeometry(1.42,.035,8,64),glow,[0,2.24,-1.71]);
const innerRing=mesh(new THREE.TorusGeometry(1.27,.012,5,64),gold,[0,2.24,-1.73]);
const portalLight=new THREE.PointLight('#bbe8a1',10,8);portalLight.position.set(0,2,-1);scene.add(portalLight);
for(let i=0;i<9;i++){
  const angle=i*2.39;const r=3.55+(i%3)*.4;
  const rock=sphere(.35+(i%3)*.12,[Math.cos(angle)*r,.19,Math.sin(angle)*r],i%2?stone:darkstone);rock.scale.set(1.3,.8,1);rock.rotation.y=i;
}
// Cart and potion silhouettes.
const cart=new THREE.Group();cart.position.set(2.8,.5,.8);cart.rotation.y=-.2;world.add(cart);
box([1.25,.18,.85],[0,0,0],wood,cart);box([1.3,.45,.12],[0,.22,-.43],wood,cart);
for(const x of [-.6,.6])box([.1,.45,.9],[x,.22,0],wood,cart);
for(const x of [-.7,.7])for(const z of [-.28,.28]){const wheel=cyl(.25,.25,.1,[x,-.2,z],leather,cart);wheel.rotation.z=Math.PI/2;}
for(let i=0;i<3;i++){sphere(.16,[i*.3-.3,.35,0],i%2?glow:gold,cart);cyl(.06,.065,.14,[i*.3-.3,.52,0],gold,cart);}
box([.12,.12,1.4],[.42,-.04,.9],wood,cart);box([.12,.12,1.4],[-.42,-.04,.9],wood,cart);
// Grass clumps retain a clear silhouette at a distance.
for(let i=0;i<26;i++){
  const a=i*2.399, r=3.4+(i%5)*.23;
  const stalk=mesh(new THREE.ConeGeometry(.1,.35+(i%3)*.13,3),mat(i%2?'#77815a':'#969968'),[Math.cos(a)*r,.15,Math.sin(a)*r]);stalk.rotation.z=Math.sin(i)*.3;
}
const actor=new THREE.Group();actor.position.set(-.6,0,.9);world.add(actor);
const figure=new THREE.Group();actor.add(figure);
cyl(.34,.58,1.1,[0,.88,0],cloth,figure,8);
box([.65,.18,.42],[0,1.36,0],leather,figure);
sphere(.28,[0,1.79,0],face,figure);
const hood=sphere(.34,[0,1.81,-.1],cloth,figure);hood.scale.set(1,1.08,.85);
box([.29,.14,.09],[0,1.8,.27],leather,figure);
box([.15,.055,.03],[0,1.82,.325],glow,figure);
const hat=cyl(.025,.43,.54,[.04,2.2,-.03],cloth,figure,7);hat.rotation.z=-.13;
const leftLeg=new THREE.Group(),rightLeg=new THREE.Group();leftLeg.position.set(-.22,.55,0);rightLeg.position.set(.22,.55,0);figure.add(leftLeg,rightLeg);
box([.25,.48,.28],[0,-.19,0],leather,leftLeg);box([.25,.48,.28],[0,-.19,0],leather,rightLeg);
box([.28,.18,.4],[0,-.43,.08],leather,leftLeg);box([.28,.18,.4],[0,-.43,.08],leather,rightLeg);
const leftArm=new THREE.Group(),rightArm=new THREE.Group();leftArm.position.set(-.43,1.35,0);rightArm.position.set(.43,1.35,0);figure.add(leftArm,rightArm);
cyl(.14,.2,.6,[0,-.24,0],cloth,leftArm,8);cyl(.14,.2,.6,[0,-.24,0],cloth,rightArm,8);
sphere(.12,[0,-.57,0],face,leftArm);sphere(.12,[0,-.57,0],face,rightArm);
const staff=new THREE.Group();staff.position.set(.17,-.25,.08);rightArm.add(staff);
cyl(.035,.045,1.9,[0,.1,0],wood,staff,8);const gem=sphere(.18,[0,1.12,0],glow,staff);gem.scale.set(.75,1.5,.75);
const pulse=mesh(new THREE.TorusGeometry(.4,.025,8,48),glow,[0,.08,0],actor);pulse.rotation.x=Math.PI/2;pulse.visible=false;
const ground=mesh(new THREE.PlaneGeometry(200,200),mat('#202b26'),[0,-.82,0],scene);ground.rotation.x=-Math.PI/2;ground.castShadow=false;

const checkerCanvas=document.createElement('canvas');checkerCanvas.width=checkerCanvas.height=256;
const ctx=checkerCanvas.getContext('2d');
for(let y=0;y<8;y++)for(let x=0;x<8;x++){ctx.fillStyle=(x+y)%2?'#344347':'#c4e49b';ctx.fillRect(x*32,y*32,32,32);ctx.fillStyle=(x+y)%2?'#dce8d1':'#394a42';ctx.font='10px monospace';ctx.fillText(`${x}${y}`,x*32+7,y*32+20);}
const checker=new THREE.CanvasTexture(checkerCanvas);checker.colorSpace=THREE.SRGBColorSpace;
const modes={clay:mat('#b9beb0'),wire:new THREE.MeshBasicMaterial({color:'#c9ed9e',wireframe:true}),uv:mat('#ffffff',{map:checker})};
let mode='beauty',paused=reduced,playing=false,elapsed=0,castTime=0,mixer=null,customModel=null;
const keys=new Set();
function setMode(next){mode=next;world.traverse(o=>{if(o.isMesh){o.userData.originalMaterial??=o.material;o.material=modes[mode]||o.userData.originalMaterial;}});document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
document.querySelectorAll('[data-setmode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.setmode)));
function setPause(value){paused=value;$('#pause').textContent=paused?'Play ▷':'Pause Ⅱ';$('#pause').setAttribute('aria-pressed',String(paused));}
$('#pause').addEventListener('click',()=>setPause(!paused));setPause(paused);
function enterPlay(value){playing=value;keys.clear();$('#play').setAttribute('aria-pressed',String(value));$('#play').textContent=value?'Exit controls · Esc':'Explore the scene ↗';$('.play-tools').classList.toggle('active',value);$('#play-help').textContent=value?'WASD / arrows · Space to cast · Esc to release':'Walk with WASD · Space to cast';if(value){setPause(false);view.focus({preventScroll:true});}}
$('#play').addEventListener('click',()=>enterPlay(!playing));$('#story-play').addEventListener('click',()=>enterPlay(true));
function cast(){castTime=1.2;setPause(false);}
$('#cast').addEventListener('click',cast);
view.addEventListener('keydown',e=>{if(e.code==='Escape'){enterPlay(false);$('#play').focus({preventScroll:true});return;}if(!playing)return;const k={ArrowUp:'w',ArrowDown:'s',ArrowLeft:'a',ArrowRight:'d'}[e.key]||e.key.toLowerCase();if('wasd'.includes(k)&&k.length===1){e.preventDefault();keys.add(k);}if(e.code==='Space'){e.preventDefault();if(!e.repeat)cast();}});
window.addEventListener('keyup',e=>{keys.delete(({ArrowUp:'w',ArrowDown:'s',ArrowLeft:'a',ArrowRight:'d'}[e.key]||e.key.toLowerCase()));});
window.addEventListener('blur',()=>keys.clear());view.addEventListener('blur',()=>keys.clear());
document.querySelectorAll('[data-key]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();keys.add(b.dataset.key);b.setPointerCapture(e.pointerId);});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>keys.delete(b.dataset.key));});
function wide(){camera.position.set(10,8,13);controls.target.set(0,1.3,0);controls.update();}
$('#reset').addEventListener('click',()=>{actor.position.set(-.6,0,.9);actor.rotation.set(0,0,0);castTime=0;keys.clear();setMode('beauty');wide();});
document.querySelector('[data-focus]').addEventListener('click',()=>{setMode('beauty');wide();});
const labels=['01 / BLOCKOUT','01 / COMPOSITION','02 / TOPOLOGY','03 / MATERIALS','04 / INTERACTION','05 / DELIVERY','06 / CONTACT'];
function updateReading(){const sections=[...document.querySelectorAll('[data-step]')];const threshold=innerWidth<=720?innerHeight*.6:innerHeight*.45;let active=sections[0];for(const section of sections)if(section.getBoundingClientRect().top<threshold)active=section;$('#stage-label').textContent=labels[+active.dataset.step];const max=document.documentElement.scrollHeight-innerHeight;$('#progress').style.width=`${max>0?scrollY/max*100:0}%`;}
window.addEventListener('scroll',updateReading,{passive:true});updateReading();
new ResizeObserver(()=>{const w=view.clientWidth,h=view.clientHeight;camera.aspect=w/h;camera.fov=THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(37/2))/Math.min(camera.aspect,1)));camera.updateProjectionMatrix();renderer.setSize(w,h,false);}).observe(view);

function geometryStats(){let tris=0;world.traverseVisible(o=>{if(o.isMesh){const g=o.geometry;tris+=(g.index?g.index.count:g.attributes.position.count)/3;}});$('#tri-count').textContent=`${Math.round(tris).toLocaleString()} triangles`;}
geometryStats();
const clock=new THREE.Clock();let frames=0,fpsStart=performance.now();
function render(){
  requestAnimationFrame(render);const dt=Math.min(clock.getDelta(),.05);if(document.hidden)return;
  if(!paused){elapsed+=dt;let dx=(keys.has('d')?1:0)-(keys.has('a')?1:0),dz=(keys.has('s')?1:0)-(keys.has('w')?1:0);const walking=playing&&(dx||dz);
    if(walking){const len=Math.hypot(dx,dz);actor.position.x+=dx/len*dt*1.6;actor.position.z+=dz/len*dt*1.6;const radius=Math.hypot(actor.position.x,actor.position.z);if(radius>4){actor.position.x*=4/radius;actor.position.z*=4/radius;}actor.rotation.y=Math.atan2(dx,dz);}
    const stride=walking?Math.sin(elapsed*10)*.52:0;leftLeg.rotation.x=stride;rightLeg.rotation.x=-stride;leftArm.rotation.x=-stride*.7;
    figure.position.y=walking?Math.abs(Math.sin(elapsed*10))*.045:Math.sin(elapsed*2)*.025;
    castTime=Math.max(0,castTime-dt);rightArm.rotation.x=castTime>0?-1.2:stride*.4;gem.rotation.y+=dt;
    portal.rotation.z+=dt*.05;innerRing.rotation.z-=dt*.1;portalLight.intensity=9+Math.sin(elapsed*1.6);
    pulse.visible=castTime>0;if(pulse.visible){pulse.scale.setScalar(1+(1.2-castTime)*6);pulse.position.y=.08+(1.2-castTime)*.12;}
    if(mixer)mixer.update(dt);
  }
  controls.update();renderer.render(scene,camera);frames++;
  if(performance.now()-fpsStart>700){$('#stats').textContent=`${Math.round(frames*1000/(performance.now()-fpsStart))} FPS · ${renderer.info.render.triangles.toLocaleString()} rendered tris`;frames=0;fpsStart=performance.now();}
}
$('#loading').remove();render();
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();const n=document.createElement('div');n.id='loading';n.setAttribute('role','status');n.textContent='Graphics context lost. Reload this page to restore the viewer.';view.append(n);});
$('#model-file').addEventListener('change',async e=>{
  const file=e.target.files[0];if(!file)return;const status=$('#asset-status');
  if(!file.name.toLowerCase().endsWith('.glb')){status.textContent='Please choose a self-contained .glb file.';return;}
  if(file.size>50*1024*1024){status.textContent='Please use a GLB smaller than 50 MB for this browser prototype.';return;}
  status.textContent='Loading model locally…';
  try{
    const gltf=await new GLTFLoader().parseAsync(await file.arrayBuffer(),'');
    const replacement=gltf.scene;const bounds=new THREE.Box3().setFromObject(replacement),size=bounds.getSize(new THREE.Vector3());
    if(!Number.isFinite(size.y)||size.y<=0)throw new Error('Empty geometry');
    const scale=2.5/size.y;replacement.scale.multiplyScalar(scale);bounds.setFromObject(replacement);const center=bounds.getCenter(new THREE.Vector3());replacement.position.x-=center.x;replacement.position.z-=center.z;replacement.position.y-=bounds.min.y;
    if(customModel){actor.remove(customModel);customModel.traverse(o=>{if(o.isMesh){o.geometry.dispose();const materials=Array.isArray(o.userData.originalMaterial)?o.userData.originalMaterial:[o.userData.originalMaterial||o.material];materials.forEach(m=>{for(const v of Object.values(m))if(v?.isTexture)v.dispose();m.dispose();});}});}
    figure.visible=false;customModel=replacement;actor.add(replacement);replacement.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
    mixer=gltf.animations.length?new THREE.AnimationMixer(replacement):null;if(mixer)mixer.clipAction(gltf.animations[0]).play();setMode(mode);setPause(false);geometryStats();
    status.textContent=`Loaded ${file.name} · ${gltf.animations.length} animation clip(s). First clip plays if present. Local preview only.`;
  }catch(error){status.textContent='Could not read this model. Export a self-contained GLB without Draco or KTX2 compression and try again.';}
});
