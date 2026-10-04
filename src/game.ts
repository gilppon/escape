export type ActionId = 'feed' | 'clean' | 'play' | 'sleep' | 'restore';
export type EventType = 'foodRain' | 'wasteMeteor' | 'pixelSignal' | 'moonPause' | 'warmPulse';
export type Pet = { hunger:number; waste:number; mood:number; energy:number; health:number; affection:number; growthStage:number; inventoryItemIds:string[]; lastCareTick:number };
export type Barrier = { id:string; zone:number; type:EventType; name:string; effect:string; x:number; z:number; tag:'glitchBarrier' };
export type WorldEvent = { id:string; type:EventType; sourceCareActionId:ActionId; targetBarrierId:string; queuedAt:number; status:'queued'|'aiming'|'falling'|'resolved'|'cancelled'; seed:number; startedAt?:number };
export type Resource = { id:string; zone:number; x:number; z:number; type:'snack'|'kit'|'battery'|'cassette'|'antenna'; amount:number; label:string };
export type GameState = { saveVersion:1; pet:Pet; currentZoneId:number; collectedResourceIds:string[]; clearedBarrierIds:string[]; worldEvents:WorldEvent[]; deviceBattery:number; inventory:Record<Resource['type'],number>; discoveredRecords:string[]; position:{x:number;z:number}; logs:string[]; started:boolean; ending:null|'full'|'partial'; cooldownUntil:number; clock:number; stabilized:boolean };
export const zones = [
  {name:'학교 뒤 골목',sub:'학교 뒤 골목과 문방구',english:'AFTER SCHOOL ALLEY',description:'작은 친구에게 밥을 주세요. 하늘에서 조금 커다란 답장이 올 거예요.',color:'#c6c7a6'},
  {name:'오락실 거리',sub:'오락실 거리와 비디오 대여점',english:'THE ARCADE DISTRICT',description:'카세트에 남은 신호를 따라, 잊힌 골목의 길을 찾아보세요.',color:'#bcb6bd'},
  {name:'중앙 신호탑',sub:'옥상 안테나와 중앙 신호탑',english:'THE MEMORY SIGNAL',description:'달빛으로 시간을 멈추고, 두 세계를 하나로 연결하세요.',color:'#b3bec4'},
];
const b = (id:string,zone:number,type:EventType,name:string,effect:string,z:number):Barrier => ({id,zone,type,name,effect,z,x:0,tag:'glitchBarrier'});
export const barriers:Barrier[] = [
 b('alley-food',0,'foodRain','01 · 식탐 차단물','음식 비로 부드러운 차단물을 해제해요.',-2),
 b('alley-waste',0,'wasteMeteor','02 · 오염 차단물','픽셀 운석으로 문방구 뒷길을 열어요.',-11),
 b('arcade-signal',1,'pixelSignal','03 · 숨겨진 계단','픽셀 불꽃이 안전한 지름길을 밝혀요.',-1),
 b('arcade-food',1,'foodRain','04 · 셔터 차단물','음식 비가 오류 셔터를 열어요.',-7),
 b('arcade-waste',1,'wasteMeteor','05 · 골목 차단물','만화 운석으로 옥상 입구를 열어요.',-13),
 b('tower-moon',2,'moonPause','06 · 회전 장벽','달빛 정지장으로 계단을 안정화해요.',-1),
 b('tower-food',2,'foodRain','07 · 안테나 차단물','음식 비로 신호탑의 오류를 지워요.',-7),
 b('tower-waste',2,'wasteMeteor','08 · 마지막 오류','마지막 오류를 해제하고 기억을 연결해요.',-13),
];
export const actions:Record<ActionId,{name:string;event:string;type:EventType;resource:Resource['type'];cost:number;description:string;symbol:string}> = {
 feed:{name:'밥 주기',event:'거대한 음식 비',type:'foodRain',resource:'snack',cost:1,description:'작은 한 입이, 하늘 가득 음식 비로.',symbol:'▧'},
 clean:{name:'청소하기',event:'분변 운석',type:'wasteMeteor',resource:'kit',cost:1,description:'깨끗한 픽셀 방, 시원하게 열린 골목.',symbol:'✦'},
 play:{name:'놀아주기',event:'픽셀 불꽃 신호',type:'pixelSignal',resource:'cassette',cost:1,description:'즐거운 마음이 숨겨진 길을 밝혀요.',symbol:'✧'},
 sleep:{name:'재우기',event:'달빛 정지장',type:'moonPause',resource:'battery',cost:0,description:'잠깐의 휴식이, 도시의 시간을 멈춰요.',symbol:'☾'},
 restore:{name:'픽셀 충전',event:'따뜻한 픽셀 파동',type:'warmPulse',resource:'battery',cost:1,description:'픽셀 에너지로 연결 범위를 넓혀요.',symbol:'♡'},
};
export const resources:Resource[] = [0,1,2].flatMap(zone=>[
 {id:`${zone}-supply`,zone,x:3,z:6,type:'battery' as const,amount:4,label:'반짝이는 배터리'},
 {id:`${zone}-snack`,zone,x:-3,z:3,type:'snack' as const,amount:2,label:'별사탕 재료'},
 {id:`${zone}-kit`,zone,x:3,z:-5,type:'kit' as const,amount:2,label:'작은 청소 키트'},
 {id:`${zone}-cassette`,zone,x:-3,z:-5,type:'cassette' as const,amount:2,label:'기억의 카세트'},
 {id:`${zone}-antenna`,zone,x:2.5,z:-16,type:'antenna' as const,amount:1,label:'안테나 부품'},
]);
export function initialState():GameState { return { saveVersion:1,pet:{hunger:62,waste:28,mood:78,energy:85,health:90,affection:42,growthStage:1,inventoryItemIds:[],lastCareTick:0},currentZoneId:0,collectedResourceIds:[],clearedBarrierIds:[],worldEvents:[],deviceBattery:8,inventory:{snack:4,kit:4,battery:3,cassette:3,antenna:0},discoveredRecords:[],position:{x:0,z:8},logs:['기억 연결 완료. 민호와 모모의 방과 후 모험이 시작됩니다.'],started:true,ending:null,cooldownUntil:0,clock:0,stabilized:false }; }
export function log(s:GameState,text:string) { s.logs=[text,...s.logs].slice(0,80); }
export function pending(s:GameState) { return s.worldEvents.find(e=>!['resolved','cancelled'].includes(e.status)); }
export function targetFor(s:GameState,id:ActionId) { return barriers.find(b=>b.zone===s.currentZoneId&&b.type===actions[id].type&&!s.clearedBarrierIds.includes(b.id)); }
export function actionReason(s:GameState,id:ActionId):string { const a=actions[id]; if(pending(s)) return '준비된 이벤트를 먼저 사용해 주세요'; if(s.cooldownUntil>s.clock) return `장치 안정화 중 · ${Math.ceil((s.cooldownUntil-s.clock)/1000)}초`; if(s.deviceBattery<1) return '도시에서 배터리를 수집해 주세요'; if(s.inventory[a.resource]<a.cost) return `${a.resource==='snack'?'간식':a.resource==='kit'?'청소 키트':a.resource==='cassette'?'카세트':'픽셀 에너지'}가 부족해요`; if(id!=='restore'&&!targetFor(s,id)) return '이 구역에 해당하는 대상이 없어요'; if(id==='restore'&&s.stabilized) return '장치가 이미 안정화되었어요'; return ''; }
export function care(state:GameState,id:ActionId):GameState { if(actionReason(state,id)) return state; const s=structuredClone(state),a=actions[id]; s.inventory[a.resource]-=a.cost; s.deviceBattery--; const p=s.pet;
 if(id==='feed'){p.hunger=Math.max(0,p.hunger-35);p.waste=Math.min(100,p.waste+25);p.affection=Math.min(100,p.affection+7);}
 if(id==='clean'){p.waste=Math.max(0,p.waste-55);p.health=Math.min(100,p.health+8);p.affection=Math.min(100,p.affection+7);}
 if(id==='play'){p.mood=Math.min(100,p.mood+22);p.affection=Math.min(100,p.affection+18);}
 if(id==='sleep'){p.energy=Math.min(100,p.energy+40);}
 if(id==='restore'){p.health=Math.min(100,p.health+25);}
 p.lastCareTick=s.clock; s.cooldownUntil=s.clock+4000;
 s.worldEvents.push({id:`evt-${s.worldEvents.length+1}`,type:a.type,sourceCareActionId:id,targetBarrierId:targetFor(s,id)?.id||'device',queuedAt:s.clock,status:'queued',seed:917+s.worldEvents.length*37});
 log(s,`${a.name} → ${a.event} 준비 · ${targetFor(s,id)?.name||'장치 안정화'}`); return s; }
export function setEventStatus(state:GameState,status:WorldEvent['status']):GameState {const s=structuredClone(state);const e=pending(s); if(e){e.status=status;if(status==='falling')e.startedAt=s.clock;}return s;}
export function resolveEvent(state:GameState):GameState {const e=pending(state);if(!e||e.status!=='falling')return state;const target=barriers.find(b=>b.id===e.targetBarrierId);if(e.type!=='warmPulse'&&(!target||target.tag!=='glitchBarrier'||target.type!==e.type||target.zone!==state.currentZoneId))return state;const s=structuredClone(state);const ev=pending(s)!;ev.status='resolved';if(e.type==='warmPulse')s.stabilized=true;else if(!s.clearedBarrierIds.includes(e.targetBarrierId))s.clearedBarrierIds.push(e.targetBarrierId);log(s,`${actions[e.sourceCareActionId].event} 성공! ${target?.name||'장치'} · ${e.type==='moonPause'?'시간 정지 · 안전 경로 고정':e.type==='warmPulse'?'조준 범위 18m → 30m':'새로운 길이 열렸어요.'}`); return s;}
export function collect(state:GameState,id:string):GameState {const r=resources.find(r=>r.id===id);if(!r||r.zone!==state.currentZoneId||state.collectedResourceIds.includes(id)||Math.hypot(r.x-state.position.x,r.z-state.position.z)>4.5)return state;const s=structuredClone(state);s.collectedResourceIds.push(id);s.inventory[r.type]+=r.amount;if(r.type==='battery')s.deviceBattery=Math.min(24,s.deviceBattery+r.amount);if(r.type==='cassette'){s.discoveredRecords.push(`기억 ${r.zone+1} · ${['하교 길에 들리던 작은 전자음. 오늘은 집에 조금 늦게 가도 괜찮아.','비어 있는 오락실에도 우리의 최고 기록은 남아 있어.','작은 친구를 돌보는 마음이 이 도시의 마지막 신호였어.'][r.zone]}`);s.pet.mood=Math.min(100,s.pet.mood+5);}log(s,`${r.label} +${r.amount} 수집${r.type==='cassette'?' · 새로운 기억을 발견했어요.':''}`);return s;}
export function nextZone(state:GameState):GameState {if(barriers.some(b=>b.zone===state.currentZoneId&&!state.clearedBarrierIds.includes(b.id))||state.position.z>-14)return state;const s=structuredClone(state);if(s.currentZoneId===2){if(s.inventory.antenna<3){log(s,'안테나 부품 3개가 필요해요. 지도에서 이전 구역을 다시 탐험할 수 있어요.');return s;}s.ending=s.pet.health>=80&&s.pet.mood>=80&&s.pet.affection>=80&&s.discoveredRecords.length>=2?'full':'partial';s.pet.growthStage=2;log(s,'중앙 신호탑 활성화. 작은 마음과 커다란 세계가 연결되었습니다.');}else{s.currentZoneId++;s.position={x:0,z:8};log(s,`${zones[s.currentZoneId].name}에 도착했어요.`);}return s;}
export function seededTrajectory(seed:number,index:number,t:number){const n=(Math.sin(seed*12.9898+index*78.233)*43758.5453)%1;return {x:Math.sin(index*2.4)*2.1,z:Math.cos(index*2.4)*1.7,y:Math.max(0,14-(t-Math.abs(n)*.8)*12)};}
export const SAVE_KEY='keychain-pet-matrix-v1';
const validNumber=(n:unknown,min:number,max:number)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
export function validateSave(value:unknown):GameState { const base=initialState(); if(!value||typeof value!=='object')return base;const v=value as GameState;
 if(v.saveVersion!==1||!v.pet||!validNumber(v.currentZoneId,0,2)||!Number.isInteger(v.currentZoneId)||!validNumber(v.deviceBattery,0,24)||!v.inventory||!v.position||!validNumber(v.position.x,-5,5)||!validNumber(v.position.z,-20,12)||!validNumber(v.clock,0,1e12)||!validNumber(v.cooldownUntil,0,1e12))return base;
 if(!['hunger','waste','mood','energy','health','affection'].every(k=>validNumber(v.pet[k as keyof Pet],0,100))||v.pet.health<1||!validNumber(v.pet.growthStage,1,2)||!validNumber(v.pet.lastCareTick,0,1e12)||!Array.isArray(v.pet.inventoryItemIds)||!v.pet.inventoryItemIds.every(id=>typeof id==='string'&&id.length<100))return base;
 if(Array.isArray(v.worldEvents)&&v.worldEvents.filter(e=>e&&['queued','aiming','falling'].includes(e.status)).length>1)return base;
 if(!Object.keys(base.inventory).every(k=>validNumber(v.inventory[k as Resource['type']],0,999)))return base;
 if(!Array.isArray(v.clearedBarrierIds)||!v.clearedBarrierIds.every(id=>barriers.some(b=>b.id===id))||!Array.isArray(v.collectedResourceIds)||!v.collectedResourceIds.every(id=>resources.some(r=>r.id===id))||!Array.isArray(v.logs)||!v.logs.every(x=>typeof x==='string'&&x.length<500)||!Array.isArray(v.discoveredRecords)||!v.discoveredRecords.every(x=>typeof x==='string'&&x.length<500)||!Array.isArray(v.worldEvents))return base;
 if(v.worldEvents.length>100||v.worldEvents.some(e=>!e||!Object.prototype.hasOwnProperty.call(actions,e.sourceCareActionId)||actions[e.sourceCareActionId].type!==e.type||(e.startedAt!==undefined&&!validNumber(e.startedAt,0,1e12))||!['queued','aiming','falling','resolved','cancelled'].includes(e.status)||!validNumber(e.seed,0,1e8)||!validNumber(e.queuedAt,0,1e12)||typeof e.id!=='string'||(e.type!=='warmPulse'&&!barriers.some(b=>b.id===e.targetBarrierId&&b.type===e.type))||(e.type==='warmPulse'&&e.targetBarrierId!=='device')))return base;
 if(![null,'full','partial'].includes(v.ending)||typeof v.stabilized!=='boolean'||typeof v.started!=='boolean')return base;
 const s=structuredClone(v);s.pet.health=Math.max(20,s.pet.health);s.worldEvents=s.worldEvents.map(e=>({...e,status:e.status==='falling'||e.status==='queued'?'aiming':e.status}));return s;
}
export function loadGame():GameState {try{return validateSave(JSON.parse(localStorage.getItem(SAVE_KEY)||'null'));}catch{return initialState();}}
export type Options = { muted:boolean;petVolume:number;worldVolume:number;crt:boolean;noise:boolean;shake:boolean;aberration:boolean;reducedMotion:boolean;highContrast:boolean;colorblind:boolean;simpleWaste:boolean;largePet:boolean;uiScale:number;sensitivity:number;invert:boolean;touchSize:number;touchOffset:number;subtitles:boolean;keys:Record<string,string> };
export const defaultOptions:Options={muted:true,petVolume:.35,worldVolume:.25,crt:true,noise:true,shake:false,aberration:false,reducedMotion:typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches,highContrast:false,colorblind:false,simpleWaste:false,largePet:false,uiScale:1,sensitivity:1,invert:false,touchSize:42,touchOffset:12,subtitles:true,keys:{up:'w',down:'s',left:'a',right:'d',interact:'e',device:'Tab',preview:'q',map:'m',pause:'Escape',feed:'1',clean:'2',play:'3',sleep:'4',restore:'5'}};
export function loadOptions():Options {try {const v=JSON.parse(localStorage.getItem('kpm-options')||'null');if(!v||typeof v!=='object')return {...defaultOptions};const o={...defaultOptions,keys:{...defaultOptions.keys}};for(const k of Object.keys(o) as (keyof Options)[]){if(k==='keys'){if(v.keys&&Object.values(v.keys).every(x=>typeof x==='string'&&x.length<20))o.keys={...o.keys,...v.keys};}else if(typeof v[k]===typeof o[k]){if(typeof v[k]==='number'&&(!Number.isFinite(v[k])||v[k]<0||v[k]>3))continue;(o as any)[k]=v[k];}}o.touchSize=validNumber(v.touchSize,36,64)?v.touchSize:42;o.touchOffset=validNumber(v.touchOffset,4,60)?v.touchOffset:12;o.uiScale=Math.max(.85,Math.min(1.2,o.uiScale));return o;}catch{return {...defaultOptions};}}
let audio:AudioContext|undefined;
export function beep(options:Options,kind:'care'|'success'|'click'='click'){if(options.muted)return;try{audio ||= new AudioContext();void audio.resume();const now=audio.currentTime;const notes=kind==='success'?[392,494,587,784]:kind==='care'?[523,659]:[330];notes.forEach((frequency,i)=>{const o=audio!.createOscillator(),g=audio!.createGain();o.type='sine';o.frequency.value=frequency;o.connect(g);g.connect(audio!.destination);g.gain.setValueAtTime((kind==='success'?options.worldVolume:options.petVolume)*.13,now+i*.1);g.gain.exponentialRampToValueAtTime(.001,now+i*.1+.2);o.start(now+i*.1);o.stop(now+i*.1+.21);});}catch{/* Audio is optional. */}}
export function closeBeep(){try{void audio?.close().catch(()=>undefined);}catch{/* ignore */}finally{audio=undefined;}}
if(typeof document!=='undefined'){document.addEventListener('visibilitychange',()=>{if(document.hidden)closeBeep();});}
