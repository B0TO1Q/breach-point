const fs=require('fs');const {JSDOM}=require('jsdom');
const html=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8').replace(/<script[\s\S]*?<\/script>/g,'');
const dom=new JSDOM(html,{pretendToBeVisual:true,runScripts:'outside-only',url:'https://breach.test/'});
const w=dom.window; w.matchMedia=()=>({matches:false}); const ctx=new Proxy({},{get:()=>()=>{},set:()=>true}); w.HTMLCanvasElement.prototype.getContext=()=>ctx; w.document.exitPointerLock=()=>{};
const rafs=[]; w.requestAnimationFrame=f=>rafs.push(f); w.eval(fs.readFileSync(require.resolve('three/build/three.min.js'),'utf8'));
w.THREE.WebGLRenderer=function(){return{setPixelRatio(){},setSize(){},clear(){},clearDepth(){},render(s){s.updateMatrixWorld();},shadowMap:{}};};
let now=0; w.performance.now=()=>now; const errs=[]; w.eval(fs.readFileSync(require('path').join(__dirname,'.build','game.js'),'utf8'));
const bp=w.__bp,P=bp.P,$=id=>w.document.getElementById(id);
const step=n=>{for(let i=0;i<n;i++){ now+=16; try{ rafs.shift()(now);}catch(e){ errs.push(e.message); return; } }};
const kd=c=>w.dispatchEvent(new w.KeyboardEvent('keydown',{code:c})), ku=c=>w.dispatchEvent(new w.KeyboardEvent('keyup',{code:c}));
// Brief shows plan picker for Lima
bp.save.unlocked=9; bp.save.selected=7; $('briefBtn').click();
console.log('plan buttons:',[...w.document.querySelectorAll('#plans .plan')].map(b=>b.querySelector('.pn').textContent+' ['+b.querySelector('.pt').textContent+']').join(' | '));
w.document.querySelectorAll('#plans .plan')[0].click();
console.log('saved plan for lima:',bp.save.plans['1997-lima']);
$('startBtn').click(); step(10);
console.log('HUD team:',JSON.stringify($('teamText').textContent));
console.log('mates:',bp.mates.map(m=>m.label+':'+m.state).join(', '));
kd('KeyX'); ku('KeyX');
for(let k=0;k<30;k++){ P.health=100; step(30); }
console.log('after go HUD:',JSON.stringify($('teamText').textContent));
// force a checkpoint once quiet
for(let k=0;k<40&&!bp.save.checkpoints['1997-lima'];k++){ P.health=100; step(60); }
const cp=bp.save.checkpoints['1997-lima']; console.log('checkpoint:',cp&&cp.label,'| mates saved:',cp&&cp.mates.map(m=>m.id+':'+m.state).join(' '),'| goGiven:',cp&&cp.goGiven);
bp.damagePlayer(999); step(140);
$('retryCpBtn').click(); step(5);
console.log('restored mates:',bp.mates.map(m=>m.label+':'+m.state+(m.down?'(down)':'')).join(', '),'| plan:',bp.plan.name);
// Z regroup
kd('KeyZ'); ku('KeyZ'); step(10); console.log('after Z:',bp.mates.filter(m=>!m.down).map(m=>m.state).join(' '));
// friendly fire
const m0=bp.mates.find(m=>!m.down); P.x=m0.x; P.z=m0.z+2; P.yaw=Math.atan2(-(m0.x-P.x),-(m0.z-P.z)); P.pitch=-0.1; step(2);
w.document.getElementById('view').dispatchEvent(new w.MouseEvent('mousedown',{button:0})); step(3); w.dispatchEvent(new w.MouseEvent('mouseup',{button:0}));
console.log('friendly fire logged:',bp.logList.some(l=>/Friendly fire/.test(l.text)),'| unjust:',bp.stats.unjust);
console.log(errs.length?'ERRORS '+errs.join('|'):'no runtime errors');
