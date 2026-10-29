const fs=require('fs');const {JSDOM}=require('jsdom');
const html=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8').replace(/<script[\s\S]*?<\/script>/g,'');
const dom=new JSDOM(html,{pretendToBeVisual:true,runScripts:'outside-only',url:'https://breach.test/'});
const w=dom.window; w.matchMedia=()=>({matches:false});
const ctx=new Proxy({},{get:()=>()=>{},set:()=>true}); w.HTMLCanvasElement.prototype.getContext=()=>ctx;
w.document.exitPointerLock=()=>{};
const rafs=[]; w.requestAnimationFrame=f=>rafs.push(f);
w.eval(fs.readFileSync(require.resolve('three/build/three.min.js'),'utf8'));
w.THREE.WebGLRenderer=function(){return{setPixelRatio(){},setSize(){},clear(){},clearDepth(){},render(s){s.updateMatrixWorld();},shadowMap:{}};};
const errs=[]; w.addEventListener('error',e=>errs.push(e.message));
let now=0; w.performance.now=()=>now;
w.eval(fs.readFileSync(require('path').join(__dirname,'.build','game.js'),'utf8'));
const bp=w.__bp, $=id=>w.document.getElementById(id);
const step=n=>{for(let i=0;i<n;i++){ now+=16; try{ rafs.shift()(now); }catch(e){ errs.push(e.stack.split('\n').slice(0,3).join(' ')); return; } }};
const kd=c=>w.dispatchEvent(new w.KeyboardEvent('keydown',{code:c})), ku=c=>w.dispatchEvent(new w.KeyboardEvent('keyup',{code:c}));
const P=bp.P;
const faceTo=o=>{ P.yaw=Math.atan2(-(o.x-P.x),-(o.z-P.z)); P.pitch=-0.1; };
function standNear(ch){ for(const [dx,dz] of [[0.9,0],[-0.9,0],[0,0.9],[0,-0.9],[0.7,0.7],[-0.7,-0.7],[0.7,-0.7],[-0.7,0.7]]){ const x=ch.x+dx,z=ch.z+dz; if(!bp.blocksMove(Math.floor(x),Math.floor(z))){ P.x=x; P.z=z; faceTo(ch); return; } } P.x=ch.x+0.9; P.z=ch.z; faceTo(ch); }
function shoutAt(ch){ standNear(ch); P.health=100; step(2); kd('KeyV'); step(3); ku('KeyV'); step(70); }
function cuff(ch){ standNear(ch); P.health=100; step(2); kd('KeyF'); step(75); ku('KeyF'); step(2); }
const results=[];
for(let i=0;i<bp.LEVELS.length;i++){
  const L=bp.LEVELS[i];
  bp.save.unlocked=Math.max(bp.save.unlocked,i); bp.save.selected=i;
  bp.startMission(null); step(30);
  if(L.type==='surrender'){
    for(let k=0;k<5;k++){ P.health=100; P.x=L.start.x; P.z=L.start.z-6; kd('KeyV'); step(3); ku('KeyV'); step(200); }
    step(900);
    for(const ch of bp.chars.filter(c=>c.kind==='subject'&&c.state==='surrendered')){ cuff(ch); }
  } else {
    for(const ch of bp.chars.filter(c=>c.kind==='hostile')){
      if(!ch.alive||ch.state==='restrained') continue; P.health=100;
      if(ch.ai==='complier'||ch.ai==='faker'){ shoutAt(ch); if(['surrendered','fake'].includes(ch.state)){ cuff(ch); continue; } }
      if(ch.alive&&ch.state!=='restrained'){ standNear(ch); step(1); bp.hitChar(ch,'head',200); step(5); }
    }
    if(L.type==='rescue'){
      for(const h of bp.chars.filter(c=>c.kind==='hostage')){ if(h.alive){ standNear(h); step(2); kd('KeyF'); step(70); ku('KeyF'); step(2); } }
      P.x=L.exfil.x; P.z=L.exfil.z-1; for(const h of bp.chars.filter(c=>c.kind==='hostage')){ h.x=L.exfil.x+0.6; h.z=L.exfil.z; }
    }
  }
  for(let k=0;k<20&&bp.state!=='aar';k++){ P.health=100; step(30); }
  const g=bp.chars;
  results.push({lvl:`${L.year} ${L.name}`,state:bp.state,out:$('aOutcome').textContent,grade:$('aGrade').textContent,next:$('nextBtn').hidden?'-':$('nextBtn').textContent,unlocked:bp.save.unlocked,lost:bp.stats.captivesLost,unjust:bp.stats.unjust,esc:bp.escalated});
}
results.forEach(r=>console.log(JSON.stringify(r)));
// executions: Embassy, trigger alarm and wait without engaging
bp.save.selected=4; bp.startMission(null); step(10);
P.x=bp.LEVELS[4].start.x; P.z=bp.LEVELS[4].start.z; kd('KeyB'); ku('KeyB');
const door=[...bp.doorMap.values()].find(d=>d.name==='front door'); P.x=door.c+0.5; P.z=door.r+1.6; P.yaw=0; step(3); kd('KeyB'); ku('KeyB'); step(3);
// fire a shot to raise the alarm, then back off and wait
w.document.getElementById('view').dispatchEvent(new w.MouseEvent('mousedown',{button:0})); step(2); w.dispatchEvent(new w.MouseEvent('mouseup',{button:0}));
P.x=17.5; P.z=28.5; for(let k=0;k<30;k++){ P.health=100; step(30); }
console.log('Embassy executions after alarm, player absent:', bp.stats.captivesLost, '| log:', bp.logList.filter(l=>/killed by/.test(l.text)).map(l=>l.text)[0]||'none');
// Ruby Ridge escalation: fire near the cabin
bp.save.selected=6; bp.startMission(null); step(10); P.x=18.5; P.z=22; P.yaw=0;
w.document.getElementById('view').dispatchEvent(new w.MouseEvent('mousedown',{button:0})); step(2); w.dispatchEvent(new w.MouseEvent('mouseup',{button:0})); step(30);
console.log('Ruby Ridge after a shot: escalated=',bp.escalated,'kinds=',bp.chars.map(c=>c.kind+'/'+c.state).join(' '),'obj=',$('objText').textContent);
console.log(errs.length?'ERRORS:\n'+[...new Set(errs)].join('\n'):'no runtime errors');
