const fs=require('fs');const {JSDOM}=require('jsdom');
const html=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8').replace(/<script[\s\S]*?<\/script>/g,'');
function boot(stored){
  const dom=new JSDOM(html,{pretendToBeVisual:true,runScripts:'outside-only',url:'https://breach.test/'});
  const w=dom.window; w.matchMedia=()=>({matches:false});
  const ctx=new Proxy({},{get:()=>()=>{},set:()=>true}); w.HTMLCanvasElement.prototype.getContext=()=>ctx; w.document.exitPointerLock=()=>{};
  if(stored) w.localStorage.setItem('breachpoint.save.v2',stored);
  const rafs=[]; w.requestAnimationFrame=f=>rafs.push(f);
  w.eval(fs.readFileSync(require.resolve('three/build/three.min.js'),'utf8'));
  w.THREE.WebGLRenderer=function(){return{setPixelRatio(){},setSize(){},clear(){},clearDepth(){},render(s){s.updateMatrixWorld();},shadowMap:{}};};
  let now=0; w.performance.now=()=>now; const errs=[];
  w.eval(fs.readFileSync(require('path').join(__dirname,'.build','game.js'),'utf8'));
  const step=n=>{for(let i=0;i<n;i++){ now+=16; try{ rafs.shift()(now);}catch(e){ errs.push(e.message); return; } }};
  return {w,bp:w.__bp,step,errs,$:id=>w.document.getElementById(id),kd:c=>w.dispatchEvent(new w.KeyboardEvent('keydown',{code:c})),ku:c=>w.dispatchEvent(new w.KeyboardEvent('keyup',{code:c}))};
}
let T=boot(null); let {bp,step,$,kd,ku}=T; const P=bp.P;
// Mountain Compound: free the doctor, break contact, checkpoint, die, retry
bp.save.unlocked=9; bp.save.selected=9; bp.startMission(null); step(5);
const doc=bp.chars.find(c=>c.id==='doc'); P.x=doc.x+0.9; P.z=doc.z; P.yaw=Math.atan2(-(doc.x-P.x),-(doc.z-P.z)); step(3); kd('KeyF'); step(70); ku('KeyF');
P.x=20.5; P.z=33.5; doc.x=20.5; doc.z=34.5; for(let k=0;k<15&&!(bp.save.checkpoints['2012-afghanistan']&&bp.save.checkpoints['2012-afghanistan'].label==='Doctor freed');k++){ P.health=100; step(60); }
const cp=bp.save.checkpoints['2012-afghanistan']; console.log('checkpoint:',cp&&cp.label, '| loadout in cp:',cp&&cp.P.slots.join('+'));
bp.damagePlayer(999); step(140);
console.log('after death:',$('aOutcome').textContent,'| retry btn:',$('retryCpBtn').hidden?'hidden':$('retryCpBtn').textContent);
$('retryCpBtn').click(); step(5);
console.log('restored doctor state:',bp.chars.find(c=>c.id==='doc').state,'| player alive:',P.alive,'| obj:',$('objText').textContent);
// Ruby Ridge: checkpoint during talk-out survives a reload
bp.save.unlocked=9; bp.save.selected=6; bp.startMission(null); step(5);
for(let k=0;k<4;k++){ P.x=18.5; P.z=27.5; kd('KeyV'); step(3); ku('KeyV'); step(200); }
for(let k=0;k<10&&!(bp.save.checkpoints['1992-ruby-ridge']);k++) step(60);
const rr=bp.save.checkpoints['1992-ruby-ridge']; console.log('ruby ridge cp:',rr&&rr.label,'talk:',rr&&rr.talk);
const stored=T.w.localStorage.getItem('breachpoint.save.v2');
T=boot(stored); ({bp,step,$}=T);
console.log('reload brief: progress',$('cProg').textContent,'| selected:',$('bName').textContent,'| continue:',$('continueBtn').hidden?'hidden':$('continueBtn').textContent,'| locked levels:',[...T.w.document.querySelectorAll('.level:disabled')].length);
$('continueBtn').click(); step(400);
console.log('resumed talk:',bp.talk,'| subjects:',bp.chars.map(c=>c.state).join(' '),'| obj:',$('objText').textContent);
console.log(T.errs.length?'ERRORS '+T.errs.join('|'):'no runtime errors');
