const fs=require('fs');const {JSDOM}=require('jsdom');
const html=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8').replace(/<script[\s\S]*?<\/script>/g,'');
const dom=new JSDOM(html,{pretendToBeVisual:true,runScripts:'outside-only',url:'https://breach.test/'});
const w=dom.window; w.matchMedia=()=>({matches:false});
const ctx=new Proxy({},{get:()=>()=>{},set:()=>true}); w.HTMLCanvasElement.prototype.getContext=()=>ctx;
const rafs=[]; w.requestAnimationFrame=f=>rafs.push(f);
w.eval(fs.readFileSync(require.resolve('three/build/three.min.js'),'utf8'));
w.THREE.WebGLRenderer=function(){return{setPixelRatio(){},setSize(){},clear(){},clearDepth(){},render(s){s.updateMatrixWorld();},shadowMap:{}};};
const errs=[]; w.addEventListener('error',e=>errs.push(e.message));
try{ w.eval(fs.readFileSync(require('path').join(__dirname,'.build','game.js'),'utf8')); }catch(e){ console.log('BOOT ERROR',e.stack); process.exit(1); }
const bp=w.__bp; let bad=0; const P=(...a)=>{ console.log(...a); };
bp.LEVELS.forEach((L,i)=>{
  const issues=[];
  bp.loadMission(i);
  const BLD=bp.BLD;
  L.buildings.forEach((b,bi)=>{ const wdt=b.plan[0].length; b.plan.forEach((row,r)=>{ if(row.length!==wdt) issues.push(`b${bi} row ${r} width ${row.length}!=${wdt}`); });
    if(b.x<0||b.z<0||b.x+wdt>L.W||b.z+b.plan.length>L.H) issues.push(`b${bi} out of map`); });
  const wallish=(c,r)=>{ const t=bp.tileAt(c,r); return t==='#'||t==='w'; };
  // reachability from start
  const sx=Math.floor(L.start.x), sz=Math.floor(L.start.z);
  if(bp.blocksAI(sx,sz)) issues.push('start tile blocked');
  const seen=new Set([bp.key(sx,sz)]), q=[[sx,sz]];
  for(let qi=0;qi<q.length;qi++){ const [c,r]=q[qi]; for(const [dc,dr] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nc=c+dc,nr=r+dr,k=bp.key(nc,nr); if(seen.has(k)||bp.blocksAI(nc,nr)) continue; seen.add(k); q.push([nc,nr]); } }
  const reach=(c,r)=>seen.has(bp.key(c,r))||[[1,0],[-1,0],[0,1],[0,-1]].some(([dc,dr])=>seen.has(bp.key(c+dc,r+dr)));
  bp.doorMap.forEach(d=>{ const h=wallish(d.c-1,d.r)&&wallish(d.c+1,d.r), v=wallish(d.c,d.r-1)&&wallish(d.c,d.r+1);
    if(!h&&!v) issues.push(`door ${d.name} (${d.c},${d.r}) has no wall pair`);
    const sides=h?[[d.c,d.r-1],[d.c,d.r+1]]:[[d.c-1,d.r],[d.c+1,d.r]];
    sides.forEach(([c,r])=>{ if(bp.blocksAI(c,r)) issues.push(`door ${d.name} side (${c},${r}) blocked`); else if(!seen.has(bp.key(c,r))) issues.push(`door ${d.name} side (${c},${r}) unreachable`); });
    if(d.name==='door') issues.push(`door at (${d.c},${d.r}) has no name`); });
  Object.keys(L.doorNames).forEach(k=>{ const [b,rc]=k.split(':'); const [r,c]=rc.split(',').map(Number); const B=L.buildings[+b]; if(!B||!'DLS'.includes((B.plan[r]||'')[c])) issues.push(`doorName ${k} not on a door`); });
  L.spawns.forEach(s=>{ const b=s.b===undefined?0:s.b; const p=bp.toWorld(s.at,b); const c=Math.floor(p.x),r=Math.floor(p.z); const t=bp.tileAt(c,r);
    const seated=bp.furn.has(bp.key(c,r));
    if(t!=='.'&&t!=='_') issues.push(`${s.id} at ${s.at} on '${t}'`);
    if(seated&&!(s.captive)) issues.push(`${s.id} on furniture`);
    if(!reach(c,r)&&!(s.captive&&seated)) issues.push(`${s.id} unreachable`);
    [s.hold,...(s.patrol||[])].filter(Boolean).forEach(pt=>{ const q2=bp.toWorld(pt,b); const qc=Math.floor(q2.x),qr=Math.floor(q2.z); if(bp.blocksAI(qc,qr)) issues.push(`${s.id} point ${pt} blocked ('${bp.tileAt(qc,qr)}')`); else if(!seen.has(bp.key(qc,qr))) issues.push(`${s.id} point ${pt} unreachable`); });
  });
  if(L.exfil){ const ec=Math.floor(L.exfil.x),er=Math.floor(L.exfil.z); if(!seen.has(bp.key(ec,er))) issues.push('exfil unreachable'); }
  (L.exitSpots||[]).forEach(pt=>{ const q2=bp.toWorld(pt,0); if(!seen.has(bp.key(Math.floor(q2.x),Math.floor(q2.z)))) issues.push(`exit spot ${pt} unreachable`); });
  const kinds={}; L.spawns.forEach(s=>kinds[s.kind]=(kinds[s.kind]||0)+1);
  console.log(`${String(i+1).padStart(2)} ${L.year} ${L.name.padEnd(20)} ${L.type.padEnd(9)} doors:${bp.doorMap.size} ${JSON.stringify(kinds)} ${issues.length?'ISSUES:\n   - '+issues.join('\n   - '):'OK'}`);
  bad+=issues.length;
});
console.log(errs.length?'RUNTIME ERRORS: '+errs.join(' | '):'no runtime errors', '| total issues', bad);
// ---- plans
let pbad=0;
bp.LEVELS.forEach((L,i)=>{ bp.loadMission(i); const iss=[];
  const sx=Math.floor(L.start.x), sz=Math.floor(L.start.z); const seen=new Set([bp.key(sx,sz)]), q=[[sx,sz]];
  for(let qi=0;qi<q.length;qi++){ const [c,r]=q[qi]; for(const [dc,dr] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nc=c+dc,nr=r+dr,k=bp.key(nc,nr); if(seen.has(k)||bp.blocksAI(nc,nr)) continue; seen.add(k); q.push([nc,nr]); } }
  const ok=(x,z)=>seen.has(bp.key(Math.floor(x),Math.floor(z)));
  (L.plans||[]).forEach((pl,pi)=>{ const tag=`plan ${pi+1} "${pl.name}"`;
    const n=(pl.follow||0)+(pl.els||[]).reduce((a,e)=>a+e.n,0)+(pl.over||[]).length+(pl.posts||[]).length; if(n!==4) iss.push(`${tag}: team of ${n}, expected 4`);
    if(pl.start&&!ok(pl.start.x,pl.start.z)) iss.push(`${tag}: start unreachable`);
    (pl.els||[]).forEach(e=>{ let info; try{ info=bp.doorInfo(e.door); }catch(err){ iss.push(`${tag}: door ${e.door} invalid`); return; }
      if(!info.door) { iss.push(`${tag}: no door at ${e.door}`); return; }
      if(bp.bldAt(info.out.x,info.out.z)>=0) iss.push(`${tag}: ${e.name} door ${info.door.name} is not an exterior door`);
      if(!ok(info.out.x,info.out.z)) iss.push(`${tag}: ${e.name} breach point unreachable`);
      if(!e.stage&&info.stack.length<e.n) iss.push(`${tag}: ${e.name} only ${info.stack.length} stack spots for ${e.n}`);
      if(e.stage){ const p=bp.toWorld(e.stage,-1); if(bp.blocksAI(Math.floor(p.x),Math.floor(p.z))) iss.push(`${tag}: stage blocked (will shift)`); }
      (e.to||[]).forEach(nm=>{ if(!L.rooms.some(r=>r.n===nm)) iss.push(`${tag}: unknown room ${nm}`); }); });
    [...(pl.over||[]),...(pl.posts||[])].forEach(pt=>{ const p=bp.toWorld(pt,-1); if(bp.blocksAI(Math.floor(p.x),Math.floor(p.z))) iss.push(`${tag}: point ${pt} blocked (will shift)`); else if(!ok(p.x,p.z)) iss.push(`${tag}: point ${pt} unreachable`); });
  });
  console.log(`${String(i+1).padStart(2)} plans:${(L.plans||[]).length} ${iss.length?'\n   - '+iss.join('\n   - '):'OK'}`); pbad+=iss.length; });
console.log('plan issues',pbad);
