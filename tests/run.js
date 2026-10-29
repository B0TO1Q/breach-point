// Runs every test and fails if any of them reports an error, a broken map or plan, or a level that couldn't be finished.
const {execFileSync}=require('child_process'), path=require('path');
const tests=[['validate.js'],['campaign.js'],['plans.js','2'],['checkpoints.js'],['team-checkpoints.js']];
let failed=0;
for(const [t,...args] of tests){
  let out='';
  try{ out=execFileSync(process.execPath,[path.join(__dirname,t),...args],{encoding:'utf8',cwd:__dirname,maxBuffer:1<<26}); }
  catch(e){ out=(e.stdout||'')+(e.stderr||''); failed++; console.log(`FAIL ${t} (crashed)`); }
  const bad=/BOOT ERROR|ERRORS:|PAGEERR|issues [1-9]|"state":"play"/.test(out);
  if(bad) failed++;
  console.log(`${bad?'FAIL':'ok  '} ${t}`); if(bad||process.env.VERBOSE) console.log(out.trim().split('\n').slice(-12).join('\n'));
}
if(failed){ console.log(`${failed} test(s) failed`); process.exit(1); } else console.log('all tests passed');
