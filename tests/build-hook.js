// Copies the game's inline script out of index.html and adds a test hook (window.__bp) so the tests can drive it.
const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const mark='referrerpolicy="no-referrer"></script>\n<script>', i=html.indexOf(mark);
if(i<0){ console.error('Could not find the inline game script.'); process.exit(1); }
const start=i+mark.length, js=html.slice(start,html.indexOf('</script>',start));
const hook="window.__bp={LEVELS,get M(){return M;},P,chars,mates,get groups(){return groups;},get plan(){return plan;},doorMap,get grid(){return grid;},get BLD(){return BLD;},blocksAI,blocksMove,pathTo,toWorld,loadMission,startMission,get save(){return save;},get stats(){return stats;},get logList(){return logList;},damagePlayer,restrain,freeHostage,hitChar,get state(){return state;},get talk(){return talk;},get escalated(){return escalated;},furn,key,tileAt,isDoorCh,doorInfo,bldAt,giveGo,get alarm(){return alarm;}};\n";
const out=js.replace('\nrequestAnimationFrame(frame);\n})();','\n'+hook+'requestAnimationFrame(frame);\n})();');
if(out===js){ console.error('Could not find the game loop to hook.'); process.exit(1); }
fs.mkdirSync(path.join(__dirname,'.build'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'.build','game.js'),out);
console.log('built tests/.build/game.js');
