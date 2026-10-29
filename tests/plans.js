const fs=require('fs');const {JSDOM}=require('jsdom');
const html=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8').replace(/<script[\s\S]*?<\/script>/g,'');
const dom=new JSDOM(html,{pretendToBeVisual:true,runScripts:'outside-only',url:'https://breach.test/'});
const w=dom.window; w.matchMedia=()=>({matches:false}); w.speechSynthesis=undefined;
const ctx=new Proxy({},{get:()=>()=>{},set:()=>true}); w.HTMLCanvasElement.prototype.getContext=()=>ctx; w.document.exitPointerLock=()=>{};
const rafs=[]; w.requestAnimationFrame=f=>rafs.push(f);
w.eval(fs.readFileSync(require.resolve('three/build/three.min.js'),'utf8'));
w.THREE.WebGLRenderer=function(){return{setPixelRatio(){},setSize(){},clear(){},clearDepth(){},render(s){s.updateMatrixWorld();},shadowMap:{}};};
const errs=[]; let now=0; w.performance.now=()=>now;
w.eval(fs.readFileSync(require('path').join(__dirname,'.build','game.js'),'utf8'));
const bp=w.__bp, P=bp.P;
const step=n=>{for(let i=0;i<n;i++){ now+=16; if(bp.state!=='play') return; try{ rafs.shift()(now);}catch(e){ errs.push(e.stack.split('\n').slice(0,2).join(' ')); return; } }};
const kd=c=>w.dispatchEvent(new w.KeyboardEvent('keydown',{code:c})), ku=c=>w.dispatchEvent(new w.KeyboardEvent('keyup',{code:c}));
const TRIALS=+process.argv[2]||3;
const rows=[];
for(let li=0;li<bp.LEVELS.length;li++){ const L=bp.LEVELS[li];
  (L.plans||[]).forEach((pl,pi)=>{
    let lost=0,neut=0,down=0,host=0,won=0,ff=0,t=0;
    for(let k=0;k<TRIALS;k++){
      bp.save.unlocked=9; bp.save.selected=li; bp.save.plans[L.id]=pi; bp.startMission(null);
      const hostiles=bp.chars.filter(c=>c.kind==='hostile').length; host=hostiles;
      step(20);
      if(L.type==='surrender'){ for(let s=0;s<5;s++){ P.health=100; kd('KeyV'); step(3); ku('KeyV'); step(200); } step(700); }
      else { kd('KeyX'); ku('KeyX'); for(let s=0;s<45&&bp.state==='play';s++){ P.health=100; step(60); } }
      lost+=bp.stats.captivesLost; neut+=bp.chars.filter(c=>c.kind==='hostile'&&(!c.alive||c.state==='restrained')).length; down+=bp.stats.matesDown; ff+=bp.stats.ff+bp.stats.teamStray; if(bp.state==='aar'&&w.document.getElementById('aOutcome').textContent.match(/Secured|alive|rescued/i)) won++;
      if(bp.state==='play'){ bp.finish?0:0; }
      // reset state to brief for next loop
      w.document.getElementById('briefBtn').click();
    }
    const capt=L.spawns.filter(s=>s.captive).length;
    rows.push(`${L.year} ${L.name.padEnd(19)} | ${pl.name.padEnd(28)} | hostages lost ${(lost/TRIALS).toFixed(1)}/${capt} | hostiles down ${(neut/TRIALS).toFixed(1)}/${host} | wounded ${(down/TRIALS).toFixed(1)} | ff ${ff} | team-only wins ${won}/${TRIALS}`);
  });
}
rows.forEach(r=>console.log(r));
console.log(errs.length?'ERRORS:\n'+[...new Set(errs)].slice(0,8).join('\n'):'no runtime errors');
