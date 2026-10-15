const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync('index.html', 'utf8');

// Exercise the actual storage module with blocked storage and malformed saved JSON.
const storageSource = html.slice(html.indexOf('const Storage = (() => {'), html.indexOf('    const raw = Storage.load()'));
for (const localStorage of [
  { getItem(){ throw new Error('blocked'); }, setItem(){ throw new Error('blocked'); } },
  { getItem(){ return '{invalid'; }, setItem(){ throw new Error('quota'); } }
]) {
  const context = vm.createContext({ localStorage });
  vm.runInContext(storageSource + '\nglobalThis.subject = Storage;', context);
  assert.equal(context.subject.load(), null);
  context.subject.save({ xp: 25 });
  assert.equal(context.subject.load().xp, 25);
}
console.log('PASS: blocked and malformed localStorage use the memory fallback.');

// Real progression function: one key awards once and crosses a level threshold once.
const awardSource = html.slice(html.indexOf('    function award(key,'), html.indexOf('    function unlock(id)'));
const overlay = { textContent:'', classList:{ remove(){}, add(){} } };
const progression = vm.createContext({
  state:{ rewards:[],xp:140 }, RANKS:[{at:0,name:'LURKER'},{at:150,name:'EXPLORER'}],
  rankIndex(){ return this.state?.xp >= 150 ? 1 : 0; },
  save(){}, updateHUD(){}, xpPopup(){}, AudioFX:{blip(){}},
  toast(){}, $(){return overlay;},requestAnimationFrame(fn){fn();},setTimeout(){}
});
vm.runInContext('rankIndex = () => state.xp >= 150 ? 1 : 0;' + awardSource, progression);
assert.equal(vm.runInContext("award('project:saarthi',30)", progression), true);
assert.equal(vm.runInContext("award('project:saarthi',30)", progression), false);
assert.equal(progression.state.xp, 170);
assert.equal(progression.state.rewards.length, 1);
console.log('PASS: repeated discovery cannot farm XP; level thresholds work.');

// Run the actual canvas game module with deterministic drops and a controlled animation clock.
const gameSource = html.slice(html.indexOf('    const Game=(()=>{'), html.indexOf('    // MODULE 09'));
const elements = new Map();
const context2d = new Proxy({}, {get:(_,key)=>key==='measureText'?()=>({width:10}):()=>{},set:()=>true});
function element(id){
  if(!elements.has(id))elements.set(id,{textContent:'',disabled:false,style:{},handlers:{},
    addEventListener(type,fn){(this.handlers[type] ||= []).push(fn);},
    getContext(){return context2d;},getBoundingClientRect(){return {left:0,top:0,width:600,height:300};},
    focus(){},setPointerCapture(){}});
  return elements.get(id);
}
const frames = new Map();let frameId=0,time=0,awards=[];
const gameState={best:0,badges:[]};
const math=Object.create(Math);math.random=()=>.5;
const gameContext=vm.createContext({
  $:element,state:gameState,Math:math,XP:{arcade:100},
  document:{documentElement:{},hidden:false,addEventListener(){}},
  window:{addEventListener(){}},AudioFX:{blip(){}},save(){},updateHUD(){},toast(){},
  getComputedStyle(){return {getPropertyValue(){return '#B6FF00';}};},
  award(key,value){awards.push({key,value});},unlock(id){gameState.badges.push(id);},
  performance:{now(){return time;}},requestAnimationFrame(fn){frames.set(++frameId,fn);return frameId;},cancelAnimationFrame(id){frames.delete(id);},
  IntersectionObserver:class {constructor(fn){this.fn=fn;}observe(){}},
});
vm.runInContext(gameSource,gameContext);
function click(id){for(const fn of element(id).handlers.click||[])fn();}
function advance(count){for(let i=0;i<count;i++){const first=frames.entries().next().value;if(!first)break;frames.delete(first[0]);time+=34;first[1](time);}}
click('#game-start');advance(360);
assert.ok(Number(element('#game-score').textContent)>=50);
assert.ok(gameState.best>=50);
assert.deepEqual(gameState.badges,['wave']);
assert.equal(awards.filter(a=>a.key==='arcade:50').length,1);
advance(180);
assert.equal(awards.filter(a=>a.key==='arcade:50').length,1);
click('#game-pause');const pausedScore=element('#game-score').textContent;advance(100);
assert.equal(element('#game-score').textContent,pausedScore);
assert.equal(frames.size,0);
click('#game-pause');advance(120);
assert.ok(Number(element('#game-score').textContent)>Number(pausedScore));
for(const fn of element('#game').handlers.pointerdown)fn({clientX:42,pointerId:1});
advance(500);
assert.match(element('#game-status').textContent,/Run complete/);
assert.equal(element('#game-pause').disabled,true);
assert.equal(frames.size,0);
console.log('PASS: catches score points; the badge awards once; pause/resume and three misses work.');

// The complete journey can reach 100% without the time-dependent Night Owl badge.
const completionSource = html.match(/const completion=\(\)=>[^;]+;/)[0];
const hudSource = html.slice(html.indexOf('    function updateHUD(){'), html.indexOf('    // MODULE 04'));
const hudNodes = new Map();let certificates=0;
const hudState={name:'PLAYER_001',xp:1000,viewed:Array(12).fill('x'),drops:Array(8).fill(0),sections:Array(5).fill('x'),commands:Array(5).fill('x'),badges:['wave'],streak:1,best:50,certificate:false};
function hudNode(id){if(!hudNodes.has(id))hudNodes.set(id,{style:{},textContent:'',hidden:true,setAttribute(){}});return hudNodes.get(id);}
const hudContext=vm.createContext({state:hudState,RANKS:[{at:0,name:'LURKER'}],BADGES:[],rankIndex:()=>0,$:hudNode,$$:()=>[],save(){},toast(){certificates++;},Date,Math,String,document:{activeElement:null}});
vm.runInContext(completionSource+hudSource+'updateHUD();updateHUD();',hudContext);
assert.equal(hudNode('#completion-label').textContent,'100%');
assert.equal(hudNode('#certificate').hidden,false);
assert.equal(hudNode('#certificate-name').textContent,'PLAYER_001');
assert.equal(certificates,1);
console.log('PASS: 100% reveals a personalized certificate once; Night Owl is optional.');
