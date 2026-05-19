const DATA = window.GPL_DATA;
const $=id=>document.getElementById(id);
const fmt=n=>Math.round(n).toLocaleString();
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const deep=o=>JSON.parse(JSON.stringify(o));

let p=null,currentTab="feed";

function randAppearance(){
 const A=DATA.appearance;
 return {
  face:pick(A.faces),hair:pick(A.hair),hairColor:pick(A.colors),body:pick(A.bodies),
  outfit:pick(A.outfits),accessory:pick(A.accessories),scar:"None",marks:[],ageStage:"Young",
  icon:"🙂",effect:""
 };
}
function avatarIcon(){
 if(!p||!p.appearance)return "☠️";
 let a=p.appearance;
 if(p.conqueror>0) return "👑";
 if(p.bounty>100000000) return "😠";
 if(a.scar!=="None") return "😤";
 if(p.path==="Marine") return "🫡";
 if(p.path==="Doctor") return "🧑‍⚕️";
 if(p.path==="Shipwright") return "👷";
 if(p.path==="Wandering Swordsman") return "🧑‍🦱";
 return a.icon||"🙂";
}
function fruitEffect(){
 if(!p||p.fruit==="None")return "";
 const f=DATA.fruits.find(x=>x.name===p.fruit);
 return f?f.effect:"✨";
}
function newPlayer(){return{
 name:"Rookie",age:10,actionsLeft:5,origin:"—",dream:"—",path:"Undecided",rank:"None",region:"Home Sea",island:"—",portrait:"☠️",epithet:"No Epithet",
 appearance:randAppearance(),berries:500,bounty:0,fruit:"None",fruitType:"",fruitMastery:0,fruitSkills:[],
 observation:0,armament:0,conqueror:0,observationXP:0,armamentXP:0,conquerorXP:0,haki:"Dormant",
 hakiSkills:{observation:[],armament:[],conqueror:[]},
 kingTraits:{leadership:0,ambition:0,defiance:0,courage:0,presence:0,sacrifice:0,independence:0},
 hiddenTraits:[],personality:{mercy:0,greed:0,freedom:0,ruthless:0,loyalty:0,ego:0},
 destiny:0,health:100,mood:50,
 strength:1,speed:1,durability:1,intelligence:1,charisma:1,navigation:0,sneak:0,discipline:0,sword:0,medicine:0,craft:0,marksmanship:0,
 honor:0,infamy:0,marineRep:0,revolutionaryRep:0,heat:0,crew:[],rivals:[],relationships:[],items:[],mystery:0,quest:null,
 ship:{name:"None",hp:0,maxHp:0,cannons:0,cargo:0,xp:0,tier:0},businesses:[],territories:[],debt:0,legacy:0,
 memories:{islands:{},npcs:{},world:[]},timeline:[],feed:[],log:[],newspapers:[],dead:false
}}


function ensureAppearance(){
 if(!p)return;
 if(!p.appearance)p.appearance=randAppearance();
 if(!p.appearance.face)p.appearance.face=pick(DATA.appearance.faces);
 if(!p.appearance.hair)p.appearance.hair=pick(DATA.appearance.hair);
 if(!p.appearance.hairColor)p.appearance.hairColor=pick(DATA.appearance.colors);
 if(!p.appearance.body)p.appearance.body=pick(DATA.appearance.bodies);
 if(!p.appearance.outfit)p.appearance.outfit=pick(DATA.appearance.outfits);
 if(!p.appearance.accessory)p.appearance.accessory="None";
 if(!p.appearance.scar)p.appearance.scar="None";
 if(!p.appearance.marks)p.appearance.marks=[];
 if(!p.hakiSkills)p.hakiSkills={observation:[],armament:[],conqueror:[]};
 if(!p.kingTraits)p.kingTraits={leadership:0,ambition:0,defiance:0,courage:0,presence:0,sacrifice:0,independence:0};
 if(!p.personality)p.personality={mercy:0,greed:0,freedom:0,ruthless:0,loyalty:0,ego:0};
 if(!p.feed)p.feed=[];
 if(!p.timeline)p.timeline=[];
 if(!p.territories)p.territories=[];
 if(!p.memories)p.memories={islands:{},npcs:{},world:[]};
 if(!p.memories.islands)p.memories.islands={};
}
function death(title,detail){
 p.dead=true;
 p.health=0;
 fx("shake");
 major(detail||title);
 $("screen").innerHTML=`<h2>${title}</h2><div class="alert">${detail||"Your journey ended."}</div><div class="choices"><button class="primary" onclick="setup()">Start New Life</button></div>`;
 render();
}
function dangerCheck(label, fatalChance=0, injuryChance=0){
 if(p.dead)return true;
 const regionRisk=(currentRegion().danger||1)*0.005;
 const heatRisk=(p.heat||0)*0.003;
 const finalFatal=fatalChance+regionRisk+heatRisk;
 if(Math.random()<finalFatal){
   death("You Died",`${label} went horribly wrong. The sea claimed your story at age ${p.age}.`);
   return true;
 }
 if(Math.random()<injuryChance){
   injuryRoll();
   p.health=clamp(p.health-10,0,100);
 }
 return false;
}

function toast(msg,major=false){const stack=$("toastStack");if(!stack)return;const d=document.createElement("div");d.className="toast";if(major)d.style.borderLeftColor="var(--purple)";d.textContent=msg;stack.appendChild(d);setTimeout(()=>d.remove(),3600)}
function fx(type){const el=$("fxLayer");if(!el)return;el.className="fxLayer "+type;setTimeout(()=>el.className="fxLayer",1100)}
function addFeed(t,major=false){p.feed.unshift({age:p.age,text:t,major});p.feed=p.feed.slice(0,90);toast(t,major)}
function addLog(t){p.log.unshift(`Age ${p.age}: ${t}`);p.log=p.log.slice(0,170)}
function addNews(headline,body){p.newspapers.unshift({age:p.age,headline,body});p.newspapers=p.newspapers.slice(0,40);addFeed(`Newspaper: ${headline}`,true)}
function addMemory(place,text){if(!p.memories.islands[place])p.memories.islands[place]=[];p.memories.islands[place].push({age:p.age,text});p.memories.islands[place]=p.memories.islands[place].slice(-6)}
function notice(title,msg){$("screen").innerHTML=`<h2>${title}</h2><div class="notice">${msg}</div><div class="choices"><button class="primary" onclick="showMenu()">Back</button></div>`;render()}
function silent(text){addFeed(text,false)}
function major(text){addFeed(text,true);addLog(text)}
function spendAction(n=1){if(p.actionsLeft<n){notice("Out of Energy","You are out of energy for this age. Press Age Up to continue.");return false}p.actionsLeft-=n;p.mood=clamp(p.mood-2*n,0,100);return true}
function crewBonus(role){return p.crew.filter(c=>String(c.role).toLowerCase().includes(role)).length}
function currentIsland(){return DATA.islands.find(i=>i.name===p.island)||DATA.islands[0]}
function currentRegion(){return DATA.regions.find(r=>r.name===p.region)||DATA.regions[0]}

function apply(e){
 for(const[k,v]of Object.entries(e)){
  if(k==="fruitRoll"){fruitRoll();continue}
  if(k==="companionRoll"){gainCompanion();continue}
  if(k==="rivalRoll"){gainRival();continue}
  if(k==="crewRoll"){gainCrewRole();continue}
  if(k==="mystery"){p.mystery+=v;let item=pick(DATA.mysteries);p.items.push(item);if(!p.quest)p.quest=pick(DATA.quests);silent(`Found clue: ${item}.`);continue}
  if(k==="shipDamage"){damageShip(Math.abs(v));continue}
  if(k==="shipXP"){p.ship.xp+=v;continue}
  if(k==="observationXP"||k==="armamentXP"||k==="conquerorXP"){gainHakiXP(k.replace("XP",""),v);continue}
  if(k==="hakiXP"){gainHakiXP("observation",v);gainHakiXP("armament",v);continue}
  if(k==="crewLoss"){loseCrew();continue}
  if(k==="crewLoyalty"){p.crew.forEach(c=>c.loyalty=clamp(c.loyalty+v,0,10));continue}
  if(k==="itemRoll"){gainItem();continue}
  if(k==="appearanceItem"){p.appearance.accessory=v;silent(`Appearance changed: ${v}.`);continue}
  if(k==="fruitMastery"&&p.fruit==="None")continue;
  if(k in p.kingTraits){p.kingTraits[k]+=v;continue}
  if(k in p.personality){p.personality[k]+=v;continue}
  p[k]=(p[k]||0)+v;
  if(["berries","bounty","health","mood","heat","destiny"].includes(k))p[k]=Math.max(0,p[k]);
 }
 updateAppearance();
 updateHiddenTraits();
 checkConquerorAwakening(false);
 if(p.health<=0)survivalCheck();
}
function updateAppearance(){
 if(!p.appearance)p.appearance=randAppearance();
 if(p.age<16)p.appearance.ageStage="Child";
 else if(p.age<25)p.appearance.ageStage="Young Adult";
 else if(p.age<40)p.appearance.ageStage="Prime";
 else if(p.age<60)p.appearance.ageStage="Veteran";
 else p.appearance.ageStage="Legend";
 if(p.bounty>50000000 && p.appearance.outfit==="Street Clothes")p.appearance.outfit="Pirate Coat";
 if(p.path==="Marine")p.appearance.outfit="Marine Uniform";
 if(p.path==="Doctor")p.appearance.outfit="Doctor Coat";
 if(p.path==="Shipwright")p.appearance.outfit="Shipwright Apron";
 if(p.health<35 && p.appearance.scar==="None")p.appearance.scar=pick(["Blade Scar","Burn Mark","Bite Scar"]);
}
function updateHiddenTraits(){
 const tr=p.hiddenTraits;
 function add(name,cond){if(cond&&!tr.includes(name)){tr.push(name);silent(`Trait developed: ${name}.`)}}
 add("Protector",p.personality.mercy>=6||p.honor>=12);
 add("Opportunist",p.personality.greed>=6);
 add("Liberator",p.personality.freedom>=6||p.revolutionaryRep>=10);
 add("Tyrant",p.personality.ruthless>=8&&p.infamy>=8);
 add("Commanding",p.kingTraits.leadership>=6);
 add("Defiant",p.kingTraits.defiance>=6);
 add("Battle Hungry",p.infamy>=12&&p.strength+p.sword+p.marksmanship>=15);
 add("Main Character Energy",p.destiny>=10);
}
function kingScore(){return Object.values(p.kingTraits).reduce((a,b)=>a+b,0)+Math.floor(p.destiny/2)+Math.floor(p.bounty/100000)}
function checkConquerorAwakening(force){
 if(p.conqueror>0)return;
 const score=kingScore();
 const dramatic=force||p.health<35||p.crew.length>=5||p.bounty>100000000||p.kingTraits.defiance>=8;
 const chance=Math.min(.35,score/120);
 if(dramatic&&score>=16&&Math.random()<chance){
   p.conqueror=1;p.haki="Conqueror's Haki";p.hakiSkills.conqueror=["Pressure Aura"];
   fx("conq");major("CONQUEROR'S HAKI AWAKENED — the air cracked under your will.");
   addNews("A KINGLY WILL ERUPTS",`${p.name}'s presence reportedly knocked weak enemies unconscious.`);
 }
}
function gainHakiXP(type,n){
 if(!["observation","armament","conqueror"].includes(type))return;
 p[type+"XP"]+=n;
 const tree=DATA.hakiTrees[type];
 if(type==="conqueror"&&p.conqueror<=0){checkConquerorAwakening(true);return}
 const threshold=(p[type]+1)*3;
 if(p[type+"XP"]>=threshold && p[type]<tree.length){
   p[type]++; const skill=tree[p[type]-1]; 
   if(!p.hakiSkills[type].includes(skill))p.hakiSkills[type].push(skill);
   if(p.haki==="Dormant")p.haki=type[0].toUpperCase()+type.slice(1)+" Haki";
   if(type==="observation")fx("flash"); if(type==="armament")fx("shake"); if(type==="conqueror")fx("conq");
   major(`Unlocked ${type} Haki skill: ${skill}.`);
 }
}
function useObservation(){if(!spendAction())return;if(p.observation<=0){notice("Observation Dormant","You have not awakened Observation Haki yet.");return}silent(`Observation Haki: ${pick(["sensed an ambush before it formed","noticed someone lying","tracked a hidden enemy","felt a Devil Fruit user nearby","predicted a minor danger"])}.`);apply({observationXP:1,intelligence:1});fx("flash");showMenu()}
function useArmament(){if(!spendAction())return;if(p.armament<=0){notice("Armament Dormant","You have not awakened Armament Haki yet.");return}silent(`Armament Haki: ${pick(["hardened your fists against steel","coated your weapon briefly","blocked a bullet with willpower","trained impact against stone","damaged a slippery power user"])}.`);apply({armamentXP:1,strength:1,health:-3});fx("shake");showMenu()}
function useConqueror(){if(!spendAction())return;if(p.conqueror<=0){notice("Conqueror Dormant","You do not currently have Conqueror's Haki. King-like actions raise the chance.");return}major(`Conqueror's Haki: ${pick(["weak enemies stepped back without knowing why","your crew stood taller under your presence","a room went silent when you entered","your glare stopped a fight before it began"])}.`);apply({conquerorXP:1,presence:1,leadership:1});fx("conq");showMenu()}

function fruitRoll(){if(p.fruit!=="None"){silent("Found a Devil Fruit, but already had powers.");return}
 if(Math.random()<.58){let f=pick(DATA.fruits);p.fruit=f.name;p.fruitType=f.type;p.fruitMastery=1;p.fruitSkills=[f.tree[0]];p.appearance.effect=f.effect;major(`Ate the ${f.name}: ${f.power}. Unlocked ${f.tree[0]}.`);addNews("STRANGE FRUIT INCIDENT",`${p.name} reportedly gained unnatural powers after eating a mysterious fruit.`)}
 else silent("The fruit was fake or rotten. Nothing happened.")
}
function fruitObj(){return DATA.fruits.find(f=>f.name===p.fruit)}
function trainFruitSkill(){if(p.fruit==="None"){notice("No Devil Fruit","You do not have a Devil Fruit.");return}let f=fruitObj();let next=f.tree[p.fruitSkills.length];if(!next){p.fruitMastery++;silent(`${p.fruit} mastery improved beyond its known tree.`);return}p.fruitSkills.push(next);p.fruitMastery++;major(`Unlocked Devil Fruit skill: ${next}.`);if(next.includes("Awakening"))addNews("AWAKENED POWER SHAKES THE SEA",`${p.name}'s Devil Fruit power has reportedly reached an awakened state.`)}
function gainCompanion(){let c=deep(pick(DATA.companions));p.crew.push(c);apply(c.bonus);major(`Gained companion: ${c.name}, ${c.role}.`)}
function gainCrewRole(){let roles=["Navigator","Cook","Doctor","Shipwright","Sniper","Swordsman","Musician","Quartermaster","Lookout","Archaeologist","Scout","Helmsman","Informant"];let c={name:pick(DATA.names),role:pick(roles),loyalty:4+Math.floor(Math.random()*5),salary:400+Math.floor(Math.random()*1000),traits:[pick(["Brave","Greedy","Kind","Ambitious","Secretive","Funny","Haunted","Proud"])]};p.crew.push(c);major(`Recruited ${c.name}, the ${c.role}.`)}
function gainRival(){let r=pick(DATA.rivals);if(!p.rivals.includes(r)){p.rivals.push(r);major(`Made a rival: ${r}.`);addNews("NEW RIVALRY ON THE SEAS",`${p.name} has reportedly crossed paths with a ${r}.`)}}
function loseCrew(){if(!p.crew.length)return;let lost=p.crew.splice(Math.floor(Math.random()*p.crew.length),1)[0];major(`${lost.name||lost} was lost because of your decision.`)}
function gainItem(){let i=pick(DATA.items);p.items.push(i.name);apply(i.effect);silent(`Acquired item: ${i.name}.`)}
function damageShip(amount){if(p.ship.name==="None")return;p.ship.hp=clamp(p.ship.hp-amount,0,p.ship.maxHp);if(p.ship.hp<=0){major(`${p.ship.name} was destroyed.`);p.ship={name:"None",hp:0,maxHp:0,cannons:0,cargo:0,xp:0,tier:0}}}
function survivalCheck(){let chance=(p.durability+p.discipline+p.medicine+crewBonus("doctor")*3)/30;if(Math.random()<chance){p.health=15;major("Barely survived a near-death event.");injuryRoll();apply({courage:1,sacrifice:1})}else{p.dead=true;p.health=0;ending("Death at Sea")}}
function injuryRoll(){let injuries=[["Bruised ribs",{durability:-1}],["Cut above the eye",{charisma:-1}],["Sprained ankle",{speed:-1}],["Broken arm",{strength:-1,sword:-1}],["Concussion",{intelligence:-1}],["Deep scar",{charisma:1}],["Damaged lung",{durability:-2}],["Burned hand",{craft:-1,sword:-1}],["Damaged reputation",{charisma:-1,honor:-1}]];let inj=pick(injuries);p.items.push("Injury: "+inj[0]);p.appearance.scar=pick(DATA.appearance.scars.filter(x=>x!=="None"));apply(inj[1]);major(`Suffered injury: ${inj[0]}.`)}

function passiveYear(){
 let s=pick(["strength","speed","durability","intelligence","charisma"]);p[s]++;
 p.health=clamp(p.health+12+crewBonus("doctor")*3,0,100);p.mood=clamp(p.mood+18+crewBonus("cook")*3,0,100);
 p.actionsLeft=5+Math.floor((p.discipline+p.durability)/6);
 let expenses=p.crew.reduce((a,c)=>a+(c.salary||0),0); let income=p.businesses.reduce((a,b)=>a+b.income,0)+p.territories.reduce((a,t)=>a+t.income,0);
 p.berries+=income-expenses;
 if(expenses>0)silent(`Paid crew expenses: ฿${fmt(expenses)}.`);
 if(income>0)silent(`Collected income: ฿${fmt(income)}.`);
 if(p.berries<0){p.debt+=Math.abs(p.berries);p.berries=0;major(`Went into debt. Total debt: ฿${fmt(p.debt)}.`)}
 if(p.debt>0){let interest=Math.floor(p.debt*.08);p.debt+=interest;silent(`Debt interest added: ฿${fmt(interest)}.`)}
 simulateCrewLives(); simulateWorld(); updateAppearance();
 if(p.fruit!=="None"&&Math.random()<.18)trainFruitSkill();
 if(p.age>=15&&p.observation<=0&&Math.random()<.06+(p.intelligence+p.sneak)/120)gainHakiXP("observation",3);
 if(p.age>=15&&p.armament<=0&&Math.random()<.06+(p.strength+p.durability)/120)gainHakiXP("armament",3);
 checkConquerorAwakening(false);
 if(p.heat>=6&&Math.random()<.35)marinePursuit();
 if(p.mystery>=5&&p.quest)questResolution();
 if(lowLoyaltyRisk())mutinyCheck();
 if(p.age%5===0)yearlyNews();
 promoteCheck();
}
function ageUp(){p.age++;passiveYear();major("A year passed.");if(p.age===16&&p.path==="Undecided")choosePath();else if(Math.random()<.32)showEvent(chooseWeightedEvent());else showMenu()}
function simulateCrewLives(){p.crew.forEach(c=>{if(Math.random()<.18)c.loyalty=clamp(c.loyalty+pick([-1,0,1]),0,10);if(Math.random()<.08){let tr=pick(["Scarred","Inspired","Restless","Afraid","Devoted","Suspicious"]);if(!c.traits.includes(tr))c.traits.push(tr);silent(`${c.name} changed: ${tr}.`)}if(Math.random()<.05 && p.age>20){c.haki=pick(["Observation","Armament"]);major(`${c.name} awakened ${c.haki} Haki.`)}})}
function simulateWorld(){if(Math.random()<.45){let ev=pick(DATA.worldEvents);p.timeline.unshift({age:p.age,text:ev});p.timeline=p.timeline.slice(0,60);silent(`World: ${ev}.`)}if(Math.random()<.12 && p.rivals.length){let r=pick(p.rivals);silent(`Rumor: your rival, ${r}, grew stronger somewhere at sea.`)}}
function yearlyNews(){addNews("WORLD ECONOMIC JOURNAL",`${p.name}, known as ${p.epithet}, has reached age ${p.age}. Current bounty: ฿${fmt(p.bounty)}.`)}
function marinePursuit(){pick([()=>{p.bounty+=15000;p.health-=15;major("Marine pursuit forced a violent escape.")},()=>{p.berries=Math.max(0,p.berries-5000);p.heat-=2;silent("Bribed your way out of a Marine dragnet.")},()=>{gainRival();p.heat+=1;major("A Marine rival was assigned to your case.")}])()}
function questResolution(){addNews("MYSTERY UNRAVELED",`${p.name} made major progress in ${p.quest.name}: ${p.quest.theme}.`);p.bounty+=10000;p.honor+=1;p.infamy+=1;p.mystery=0;p.legacy+=3;major(`Resolved a chapter of ${p.quest.name}.`);p.quest=Math.random()<.55?pick(DATA.quests):null}
function lowLoyaltyRisk(){return p.crew.length>=3 && p.crew.some(c=>c.loyalty<=1)}
function mutinyCheck(){if(Math.random()<.25){let deserters=p.crew.filter(c=>c.loyalty<=2);p.crew=p.crew.filter(c=>c.loyalty>2);p.infamy++;p.mood-=10;major(`Mutiny/desertion: ${deserters.map(d=>d.name).join(", ")} left the crew.`)}}
function promoteCheck(){if(p.path==="Undecided")return;let ranks=DATA.careers[p.path]||["Rookie"];let score=p.bounty/50000+p.marineRep*1.5+p.revolutionaryRep*1.5+p.berries/75000+p.infamy+p.honor+p.crew.length+p.legacy;let idx=clamp(Math.floor(score/7),0,ranks.length-1);if(ranks[idx]!==p.rank){p.rank=ranks[idx];major(`Rank changed: ${p.rank}.`);addNews("RANK UPDATE",`${p.name} is now recognized as ${p.rank} in the ${p.path} path.`)}}

function combatScore(mode="duel"){let score=p.strength*2+p.speed+p.durability+p.sword*2+p.marksmanship*1.5+p.armament*5+p.observation*3+p.conqueror*6+p.fruitMastery*3+p.crew.length*1.5;if(mode==="naval")score+=p.ship.cannons*5+p.ship.tier*8+crewBonus("navigator")*4+crewBonus("sniper")*3;if(mode==="escape")score+=p.speed*2+p.sneak*2+p.navigation+crewBonus("navigator")*3+p.observation*4;return score}
function resolveCombat(kind,targetPower,reward){let score=combatScore(kind)+Math.random()*20;let enemy=targetPower+Math.random()*20;if(score>=enemy){apply(reward||{});silent(`Won ${kind} encounter. Score ${Math.round(score)} vs ${Math.round(enemy)}.`);return true}let dmg=Math.floor((enemy-score)/2)+10;p.health-=dmg;p.bounty+=kind==="naval"?8000:3000;major(`Lost or barely escaped ${kind} encounter. Took ${dmg} damage.`);fx("shake");if(Math.random()<.35)injuryRoll();if(p.health<=0)survivalCheck();return false}
function chooseWeightedEvent(){let pool=[...EVENTS];let isl=currentIsland();pool=pool.concat(EVENTS.filter(e=>e.tags.some(t=>isl.tags.includes(t))));if(p.ship.name==="None")pool=pool.filter(e=>!e.tags.includes("sea")||Math.random()<.35);if(p.crew.length===0)pool=pool.filter(e=>!e.tags.includes("crew")||Math.random()<.25);if(p.region!=="New World")pool=pool.filter(e=>!e.tags.includes("newworld"));if(p.path==="Marine")pool.push(...EVENTS.filter(e=>e.tags.includes("marine")));if(p.path==="Revolutionary")pool.push(...EVENTS.filter(e=>e.tags.includes("revolutionary")||e.tags.includes("freedom")));if(p.path==="Pirate")pool.push(...EVENTS.filter(e=>e.tags.includes("sea")||e.tags.includes("money")));return pick(pool)}
const EVENTS=[
{title:"Burning Dock",tags:["dock","street"],text:"A dock warehouse catches fire. Screams, smoke, and opportunity all appear at once.",choices:[["Save someone trapped inside",{honor:2,durability:1,berries:500,heat:1,mercy:1,sacrifice:1,courage:1},"Risked your life in a burning dock warehouse."],["Steal from the abandoned crates",{berries:4000,infamy:1,honor:-1,greed:1},"Looted a burning warehouse."],["Chase the suspicious arsonists",{speed:1,sneak:1,mystery:1,courage:1},"Chased the arsonists and found a clue."],["Disappear before anyone sees you",{sneak:1},"Vanished before the authorities arrived."]]},
{title:"Black Market Offer",tags:["secret","money","fruit"],text:"A vendor under a torn tent offers you a disgusting fruit and swears it can change your life.",choices:[["Eat the strange fruit",{fruitRoll:1,berries:-5000,ambition:1},"Took a chance on a strange fruit."],["Sell the information",{berries:2500,infamy:1,greed:1},"Sold a black market rumor."],["Report the market",{marineRep:1,honor:1},"Reported the black market."],["Rob the vendor",{berries:5000,infamy:2,honor:-2,heat:2,ruthless:1},"Robbed a black market vendor."]]},
{title:"Marine Inspection",tags:["marine","justice"],text:"Marines lock down the streets and begin checking papers. Something about you makes them stare too long.",choices:[["Cooperate",{marineRep:1,discipline:1},"Cooperated with a Marine inspection."],["Run across the rooftops",{speed:2,bounty:3000,heat:1,independence:1},"Escaped Marines across rooftops."],["Lie confidently",{charisma:2,sneak:1},"Bluffed through an inspection."],["Laugh in their face and fight",{strength:2,bounty:10000,infamy:2,heat:3,defiance:2,courage:1},"Started a fight with Marines."]]},
{title:"Secret Training",tags:["haki","fighter"],text:"An old traveler notices something in your spirit and offers brutal training.",choices:[["Accept brutal spirit training",{discipline:2,observationXP:1,armamentXP:1,health:-10,courage:1},"Accepted brutal spirit training."],["Ask for perception training",{intelligence:1,observationXP:2},"Studied spiritual perception."],["Train impact coating",{strength:1,armamentXP:2,health:-8},"Trained impact and hardening."],["Declare you need no master",{defiance:1,independence:1,conquerorXP:1},"Rejected the old traveler's lesson."]]},
{title:"Crew Dispute",tags:["crew"],text:"Two allies argue over supplies and loyalty. The crew watches how you handle it.",choices:[["Mediate fairly",{charisma:1,honor:1,crewLoyalty:1,leadership:1},"Mediated a crew dispute."],["Punish both",{discipline:2,infamy:1,crewLoyalty:-1,ruthless:1},"Punished both sides of a crew dispute."],["Take a side",{charisma:1,crewLoyalty:-1},"Took a side in a crew dispute."],["Give a captain's speech",{leadership:2,presence:1,conquerorXP:1},"Gave a commanding speech to the crew."]]},
{title:"Sea Beast Attack",tags:["sea","fighter"],text:"A sea beast rises beside your vessel, large enough to crack the hull in one bite.",choices:[["Fight it head-on",{strength:2,bounty:5000,shipDamage:25,health:-18,courage:2,armamentXP:1},"Fought off a sea beast."],["Outmaneuver it",{navigation:2,shipXP:1,observationXP:1},"Outmaneuvered a sea beast."],["Sacrifice cargo",{berries:-3000},"Sacrificed cargo to escape a sea beast."],["Use your crew as bait",{infamy:3,honor:-3,crewLoss:1,ruthless:3},"Used someone as bait."]]},
{title:"Emperor Scout",tags:["newworld","fame","rival"],text:"A scout from a terrifying New World power offers you protection in exchange for loyalty.",choices:[["Refuse proudly",{honor:2,bounty:30000,rivalRoll:1,defiance:3,independence:2},"Refused an emperor scout."],["Accept temporarily",{infamy:1,berries:20000},"Accepted an ugly alliance."],["Attack the scout",{strength:2,armamentXP:2,conquerorXP:2,bounty:50000,health:-30,courage:2,ambition:1},"Attacked an emperor scout."],["Gather intel",{sneak:2,mystery:1,observationXP:1},"Gathered intel on an emperor crew."]]}
];
function showEvent(e){$("screen").innerHTML=`<h2>${e.title}</h2><p>${e.text}</p><div class="choices">${e.choices.map((c,i)=>`<button onclick="chooseEvent(${EVENTS.indexOf(e)},${i})">${c[0]}</button>`).join("")}</div>`;render()}
function chooseEvent(ei,ci){let c=EVENTS[ei].choices[ci];apply(c[1]);major(c[2]);postEventConsequences();showMenu()}
function postEventConsequences(){if(Math.random()<.12&&p.health<70)injuryRoll();if(p.bounty>0&&Math.random()<.18)addNews("BOUNTY UPDATED",`${p.name}, ${p.epithet}, now carries a bounty of ฿${fmt(p.bounty)}.`);if(p.infamy>=10&&["No Epithet","the Unwritten"].includes(p.epithet)){p.epithet=pick(["the Menace","Red-Hand","the Problem","Stormbringer","Black Wake"]);major(`Earned epithet: ${p.epithet}.`)}if(p.honor>=10&&["No Epithet","the Unwritten"].includes(p.epithet)){p.epithet=pick(["the Kind Blade","Harbor Saint","the Shield","the Gentle Storm","Dawn Hand"]);major(`Earned epithet: ${p.epithet}.`)}}

function setup(){
 p=newPlayer();
 $("screen").innerHTML=`<h2>Start a New Life</h2><p><b>v4.0 Living Interface</b> adds appearance evolution, animated dashboard, live notifications, interactive maps, newspapers, timeline, Haki effects, visual character stages, and smoother menus.</p><input id="nameInput" placeholder="Character name, or leave blank for random"><div class="choices"><button class="primary" onclick="randomStart()">Random Life</button><button onclick="chooseOriginScreen()">Choose Origin</button>${(localStorage.getItem("gpls_save_v41")||localStorage.getItem("gpls_save_v40"))?'<button onclick="loadGame()">Load Saved Life</button>':''}<button class="danger" onclick="clearSave()">Clear Save</button></div>`;
 render();
}
function randomStart(){p=newPlayer();p.name=$("nameInput").value.trim()||pick(DATA.names);p.dream=pick(DATA.dreams);let o=pick(DATA.origins);startWithOrigin(o)}
function chooseOriginScreen(){p=newPlayer();p.name=$("nameInput").value.trim()||pick(DATA.names);p.dream=pick(DATA.dreams);$("screen").innerHTML=`<h2>Choose Origin</h2><p>Your origin gives bonuses and shapes your event pool. Dream is randomized to keep lives different.</p><div class="choices">${DATA.origins.map((o,i)=>`<button onclick="startWithOrigin(DATA.origins[${i}])">${o[1]} ${o[0]}</button>`).join("")}</div>`}
function startWithOrigin(o){p.origin=o[0];p.portrait=o[1];let starts=DATA.islands.filter(i=>i.region==="Home Sea");let isl=pick(starts);p.region=isl.region;p.island=isl.name;apply(o[2]);p.epithet=pick(["the Unwritten","the Small Storm","Iron Will","Chainbreaker","Sea Rat","the Runaway","the Quiet Spark","No-Name","the Dawn Rookie"]);major(`Born as a ${p.origin}, starting on ${p.island}. Dream: ${p.dream}.`);if(Math.random()<.25){p.items.push(pick(DATA.mysteries));p.mystery=1;silent("Started life already carrying a strange clue.")}showMenu()}
function choosePath(){$("screen").innerHTML=`<h2>Age 16: Choose Your Path</h2><p>This shapes ranks, events, promotion, enemies, and endings.</p><div class="choices">${DATA.paths.map((x,i)=>`<button onclick="setPath(${i})">${x[1]} ${x[0]}</button>`).join("")}</div>`;render()}
function setPath(i){let x=DATA.paths[i];p.path=x[0];p.portrait=x[1];p.rank=DATA.careers[p.path][0];apply(x[2]);major(`Chose the path of ${p.path}.`);showMenu()}

function showMenu(){
 render(); if(p.dead)return; if(p.age>=80)return ending();
 if(p.age===16&&p.path==="Undecided")return choosePath();
 const crewPop=p.crew.length&&Math.random()<.18?`<div class="storyCard"><b>${pick(p.crew).name} approaches:</b> "${pick(["Captain, the sea feels strange today.","We should train soon.","I heard rumors in town.","Are we still chasing your dream?"])}"</div>`:"";
 $("screen").innerHTML=`<h2>Age ${p.age}: ${p.name}'s Life</h2>${crewPop}<p><b>${p.actionsLeft}</b> energy left. The dashboard, poster, feed, and background now evolve with your life.</p>
 <div class="menuGrid">
 <button class="primary" onclick="ageUp()">Age Up</button>
 <button onclick="randomEventAction()">Major Event</button>
 <button onclick="activitiesMenu()">Activities</button>
 <button onclick="trainingMenu()">Training</button>
 <button onclick="hakiMenu()">Haki Actions</button>
 <button onclick="appearanceMenu()">Appearance</button>
 <button onclick="travelMenu()">Travel</button>
 <button onclick="combatMenu()">Combat</button>
 <button onclick="crewMenu()">Crew</button>
 <button onclick="careerMenu()">Career</button>
 <button onclick="assetsMenu()">Assets</button>
 <button onclick="blackMarketMenu()">Black Market</button>
 <button onclick="relationshipsMenu()">Relationships</button>
 <button onclick="legacyMenu()">Legacy</button>
 <button onclick="manualSave()">Save</button>
 </div>`;
}
function submenu(title,desc,buttons){$("screen").innerHTML=`<h2>${title}</h2><p>${desc}</p><div class="choices">${buttons.join("")}<button class="primary" onclick="showMenu()">Back</button></div>`;render()}
function randomEventAction(){if(!spendAction())return;showEvent(chooseWeightedEvent())}
function activitiesMenu(){submenu("Activities","Most actions update the feed silently unless something major happens.",[`<button onclick="work()">Work for Berries</button>`,`<button onclick="explore()">Explore Island</button>`,`<button onclick="rest()">Rest / Recover</button>`,`<button onclick="gambleMenu()">Gamble</button>`,`<button onclick="investigate()">Investigate Mystery</button>`,`<button onclick="newspaperInterview()">Newspaper Interview</button>`])}
function trainingMenu(){submenu("Training","Improve stats, styles, fruit powers, or willpower.",[`<button onclick="train()">Train Body</button>`,`<button onclick="study()">Study / Scheme</button>`,`<button onclick="fruitTrain()">Train Devil Fruit</button>`,`<button onclick="swordTrain()">Sword Training</button>`,`<button onclick="shootTrain()">Marksmanship Training</button>`])}
function hakiMenu(){submenu("Haki Actions","Haki unlocks usable actions, not just bonuses.",[`<button onclick="useObservation()">Use Observation Haki</button>`,`<button onclick="useArmament()">Use Armament Haki</button>`,`<button onclick="useConqueror()">Use Conqueror's Haki</button>`,`<button onclick="hakiMeditation()">Meditate on Will</button>`])}
function appearanceMenu(){submenu("Appearance","Customize or evolve your look. Some items affect reactions and identity.",[`<button onclick="changeOutfit()">Change Outfit</button>`,`<button onclick="changeHair()">Change Hair</button>`,`<button onclick="changeAccessory()">Change Accessory</button>`,`<button onclick="poseForPoster()">Pose for Wanted Poster</button>`,`<button onclick="embraceScar()">Embrace Battle Scar</button>`])}
function travelMenu(){let regionButtons=DATA.regions.map((r,i)=>`<button onclick="travelRegion(${i})">${r.name} — Danger ${r.danger}/10</button>`);submenu("Travel","Sail islands or attempt to advance regions. Better ship and navigation matter.",[`<button onclick="sail()">Sail to Nearby Island</button>`,...regionButtons])}
function combatMenu(){submenu("Combat","Risky actions with bigger rewards.",[`<button onclick="huntBounty()">Hunt Bounty</button>`,`<button onclick="duelRival()">Duel Rival</button>`,`<button onclick="navalBattle()">Seek Naval Battle</button>`,`<button onclick="raidTarget()">Raid Target</button>`,`<button onclick="escapeHeat()">Escape Marine Heat</button>`])}
function crewMenu(){submenu("Crew","Crew now have traits, loyalty, salary, and yearly life changes.",[`<button onclick="recruit()">Recruit Crew</button>`,`<button onclick="crewBond()">Spend Time with Crew</button>`,`<button onclick="payBonus()">Pay Crew Bonus</button>`,`<button onclick="disciplineCrew()">Discipline Crew</button>`,`<button onclick="crewConversation()">Crew Conversation</button>`,`<button onclick="fireLowest()">Dismiss Lowest Loyalty Crew</button>`])}
function careerMenu(){submenu("Career","Build your path and reputation.",[`<button onclick="careerWork()">Career Mission</button>`,`<button onclick="seekPromotion()">Seek Promotion / Recognition</button>`,`<button onclick="changePath()">Change Career Path</button>`,`<button onclick="layLow()">Lay Low</button>`])}
function assetsMenu(){submenu("Assets","Buy ships, businesses, repairs, upgrades, and items.",[`<button onclick="shipyard()">Shipyard</button>`,`<button onclick="businessMenu()">Businesses</button>`,`<button onclick="shop()">Item Shop</button>`,`<button onclick="payDebt()">Pay Debt</button>`])}
function blackMarketMenu(){submenu("Black Market","High-risk, high-reward options.",[`<button onclick="blackFruit()">Search for Devil Fruit</button>`,`<button onclick="buySecret()">Buy Secret Intel</button>`,`<button onclick="smuggleRun()">Smuggling Run</button>`,`<button onclick="bribeOfficials()">Bribe Officials</button>`])}
function relationshipsMenu(){submenu("Relationships","Create or deepen relationships.",[`<button onclick="makeFriend()">Make Friend</button>`,`<button onclick="findMentor()">Find Mentor</button>`,`<button onclick="romance()">Romance</button>`,`<button onclick="betrayContact()">Betray Contact</button>`])}
function legacyMenu(){submenu("Legacy","Long-term progression and inheritance.",[`<button onclick="writeWill()">Write Legacy Will</button>`,`<button onclick="trainSuccessor()">Train Successor</button>`,`<button onclick="claimTerritory()">Claim Territory</button>`,`<button onclick="retire()">Retire / End Life</button>`])}

function work(){if(!spendAction())return;let pay=1500+Math.floor(Math.random()*6000)+(p.rank!=="None"?1000:0);apply({berries:pay,charisma:Math.random()<.5?1:0});silent(`Worked and earned ฿${fmt(pay)}.`);showMenu()}
function train(){if(!spendAction())return;apply({strength:1,speed:Math.random()<.5?1:0,durability:Math.random()<.5?1:0,discipline:1,health:-4});silent("Trained body and discipline.");showMenu()}
function study(){if(!spendAction())return;apply({intelligence:2,navigation:Math.random()<.5?1:0,observationXP:Math.random()<.25?1:0});silent("Studied maps, history, tactics, and rumors.");showMenu()}
function swordTrain(){if(!spendAction())return;apply({sword:2,discipline:1,health:-5,armamentXP:Math.random()<.2?1:0});silent("Trained swordsmanship.");showMenu()}
function shootTrain(){if(!spendAction())return;apply({marksmanship:2,speed:1,health:-4,observationXP:Math.random()<.2?1:0});silent("Trained marksmanship.");showMenu()}
function fruitTrain(){if(!spendAction())return;if(p.fruit==="None"){notice("No Devil Fruit","You do not have a Devil Fruit.");return}trainFruitSkill();p.health=clamp(p.health-5,0,100);showMenu()}
function hakiMeditation(){if(!spendAction())return;apply({observationXP:1,armamentXP:1,discipline:1,health:-4});if(kingScore()>=12)apply({conquerorXP:1});silent("Meditated on willpower.");showMenu()}
function explore(){if(!spendAction())return;if(Math.random()<.25){showEvent(chooseWeightedEvent());return}let found=pick(["quiet shrine","hidden tavern","abandoned camp","strange footprint","old battlefield","locked cellar","underground tunnel","washed-up crate"]);silent(`Explored ${p.island} and found a ${found}.`);addMemory(p.island,`You found a ${found}.`);apply({mystery:Math.random()<.35?1:0,berries:Math.random()<.3?1000:0});showMenu()}
function rest(){if(!spendAction())return;p.health=clamp(p.health+30,0,100);p.mood=clamp(p.mood+15,0,100);if(p.berries>500)p.berries-=500;silent("Rested and recovered.");showMenu()}
function investigate(){if(!spendAction())return;apply({mystery:1,intelligence:1,heat:Math.random()<.25?1:0,observationXP:1});silent("Investigated ongoing mysteries.");showMenu()}
function newspaperInterview(){if(!spendAction())return;let mode=pick(["honest","myth","silent"]);if(mode==="honest"){p.honor++;p.charisma++;addNews("ROOKIE SPEAKS",`${p.name} gave an unusually honest interview.`)}else if(mode==="myth"){p.infamy++;p.charisma+=2;addNews("A LEGEND IS BORN?",`${p.name} exaggerated their exploits, and people believed it.`)}else{p.discipline++;silent("Refused to comment to the newspaper.")}showMenu()}
function changeOutfit(){if(!spendAction())return;p.appearance.outfit=pick(DATA.appearance.outfits);silent(`Changed outfit: ${p.appearance.outfit}.`);showMenu()}
function changeHair(){if(!spendAction())return;p.appearance.hair=pick(DATA.appearance.hair);p.appearance.hairColor=pick(DATA.appearance.colors);silent(`Changed hair: ${p.appearance.hairColor} ${p.appearance.hair}.`);showMenu()}
function changeAccessory(){if(!spendAction())return;p.appearance.accessory=pick(DATA.appearance.accessories);silent(`Changed accessory: ${p.appearance.accessory}.`);showMenu()}
function poseForPoster(){if(!spendAction())return;p.charisma++;p.bounty+=Math.floor(p.bounty*.05)+1000;addNews("NEW WANTED PHOTO RELEASED",`${p.name}'s new poster has begun circulating across ${p.region}.`);showMenu()}
function embraceScar(){if(!spendAction())return;p.appearance.scar=pick(DATA.appearance.scars.filter(x=>x!=="None"));p.charisma++;p.kingTraits.presence=(p.kingTraits.presence||0)+1;silent(`New defining scar: ${p.appearance.scar}.`);showMenu()}
function gambleMenu(){submenu("Gambling Den","Risk berries for a chance at profit. Uses 1 energy.",[`<button onclick="doGamble(500)">Low Table — ฿500</button>`,`<button onclick="doGamble(2500)">Mid Table — ฿2,500</button>`,`<button onclick="doGamble(10000)">High Roller — ฿10,000</button>`])}
function doGamble(amount){if(!spendAction())return;if(p.berries<amount){notice("Not enough berries","You cannot cover the bet.");return}p.berries-=amount;let skill=(p.charisma+p.sneak+p.intelligence)/30;if(Math.random()<.42+skill){let win=amount*(2+Math.floor(Math.random()*3));p.berries+=win;silent(`Won ฿${fmt(win)} gambling.`)}else{silent(`Lost ฿${fmt(amount)} gambling.`);if(Math.random()<.2)gainRival()}showMenu()}
function sail(){if(!spendAction())return;if(p.ship.name==="None"){silent("Bought passage to another island.");p.berries=Math.max(0,p.berries-1000)}else{p.ship.xp++;if(Math.random()<.25)damageShip(5+Math.floor(Math.random()*20))}let list=DATA.islands.filter(i=>i.region===p.region);let isl=pick(list);p.island=isl.name;silent(`Sailed to ${isl.name}: ${isl.desc}.`);if(p.memories.islands[p.island])silent(`This island remembers you: ${pick(p.memories.islands[p.island]).text}`);if(Math.random()<.25)showEvent(chooseWeightedEvent());else showMenu()}
function travelRegion(i){if(!spendAction())return;let r=DATA.regions[i];let ok=p.navigation+crewBonus("navigator")*2>=r.req.nav && p.ship.maxHp>=r.req.ship;if(!ok){p.health-=15;damageShip(25);major(`Failed to safely reach ${r.name}. Need Navigation ${r.req.nav} and ship HP ${r.req.ship}.`);if(dangerCheck('Failed Grand Line travel',0.06,0.35))return;showMenu();return}p.region=r.name;let islands=DATA.islands.filter(x=>x.region===r.name);p.island=pick(islands).name;major(`Reached ${r.name}. ${r.desc}`);addNews("NEW SEA REACHED",`${p.name} has entered ${r.name}.`);showMenu()}
function huntBounty(){if(!spendAction())return;let power=25+currentRegion().danger*8;resolveCombat("duel",power,{berries:9000+currentRegion().danger*3000,marineRep:1,strength:1,armamentXP:1});showMenu()}
function duelRival(){if(!spendAction())return;if(dangerCheck("Rival duel",0.018,0.18))return;if(!p.rivals.length)gainRival();let power=30+currentRegion().danger*10+p.rivals.length*3;let win=resolveCombat("duel",power,{bounty:12000,infamy:1,armamentXP:1,conquerorXP:1,courage:1});if(win&&Math.random()<.35){let r=p.rivals.shift();major(`Defeated rival permanently: ${r}.`);p.legacy+=2}showMenu()}
function navalBattle(){if(!spendAction())return;if(dangerCheck("Naval battle",0.025,0.18))return;if(p.ship.name==="None"){notice("No Ship","You need a ship for naval battles.");return}let power=30+currentRegion().danger*12;resolveCombat("naval",power,{berries:15000,bounty:18000,shipXP:2,infamy:1,leadership:1});damageShip(Math.floor(Math.random()*15));showMenu()}
function raidTarget(){if(!spendAction())return;if(dangerCheck("Raid",0.035,0.22))return;let power=35+currentRegion().danger*10;resolveCombat("duel",power,{berries:22000,bounty:25000,infamy:2,heat:2,ruthless:1});showMenu()}
function escapeHeat(){if(!spendAction())return;let power=25+p.heat*8;let win=resolveCombat("escape",power,{heat:-3,sneak:1,observationXP:1});if(win)p.heat=clamp(p.heat-3,0,99);showMenu()}
function recruit(){if(!spendAction())return;if(Math.random()<.55+(p.charisma/30)+(p.conqueror*.08)){gainCrewRole();p.mood+=3;apply({leadership:1})}else{silent("Failed to recruit anyone useful.");if(Math.random()<.25)gainRival()}showMenu()}
function crewBond(){if(!spendAction())return;if(!p.crew.length){notice("No Crew","You have no crew yet.");return}p.crew.forEach(c=>c.loyalty=clamp(c.loyalty+1,0,10));p.mood=clamp(p.mood+8,0,100);silent("Spent time bonding with the crew.");apply({leadership:1,loyalty:1});showMenu()}
function crewConversation(){if(!spendAction())return;if(!p.crew.length){notice("No Crew","You have no crew yet.");return}let c=pick(p.crew);let line=pick([`${c.name} asks if the crew is becoming too cruel.`,`${c.name} admits they want to become stronger.`,`${c.name} says the ship feels like home.`,`${c.name} warns that someone may betray you.`,`${c.name} asks what your dream really means.`]);major(line);c.loyalty=clamp(c.loyalty+pick([-1,1,2]),0,10);showMenu()}
function payBonus(){if(!spendAction())return;if(!p.crew.length){notice("No Crew","You have no crew yet.");return}let cost=p.crew.length*2000;if(p.berries<cost){notice("Not enough berries",`Need ฿${fmt(cost)}.`);return}p.berries-=cost;p.crew.forEach(c=>c.loyalty=clamp(c.loyalty+2,0,10));silent("Paid crew bonuses.");showMenu()}
function disciplineCrew(){if(!spendAction())return;p.crew.forEach(c=>c.loyalty=clamp(c.loyalty-1,0,10));p.discipline+=2;p.infamy++;apply({ruthless:1});silent("Disciplined the crew harshly.");showMenu()}
function fireLowest(){if(!spendAction())return;if(!p.crew.length)return notice("No Crew","No one to dismiss.");p.crew.sort((a,b)=>a.loyalty-b.loyalty);let c=p.crew.shift();major(`Dismissed ${c.name}.`);showMenu()}
function careerWork(){if(!spendAction())return;let reward={};if(p.path==="Marine")reward={marineRep:2,berries:5000,heat:-1};else if(p.path==="Pirate")reward={bounty:12000,infamy:1,berries:8000,ambition:1};else if(p.path==="Revolutionary")reward={revolutionaryRep:2,honor:1,heat:1,freedom:1};else reward={berries:7000,charisma:1};apply(reward);silent(`Completed a ${p.path} career mission.`);promoteCheck();showMenu()}
function seekPromotion(){if(!spendAction())return;promoteCheck();p.charisma++;silent("Sought recognition and advancement.");showMenu()}
function changePath(){submenu("Change Career","Choose a new life path.",DATA.paths.map((x,i)=>`<button onclick="setPath(${i})">${x[1]} ${x[0]}</button>`))}
function layLow(){if(!spendAction())return;p.heat=clamp(p.heat-3,0,99);p.bounty=Math.max(0,p.bounty-1000);p.mood-=3;silent("Laid low to reduce heat.");showMenu()}
function shipyard(){submenu("Shipyard","Buy, repair, or upgrade ships.",[...DATA.ships.map((s,i)=>`<button onclick="buyShip(${i})">${s.name} — ฿${fmt(s.cost)} · HP ${s.hp} · Cannons ${s.cannons}</button>`),`<button onclick="repairShip()">Repair Current Ship</button>`,`<button onclick="upgradeShip()">Upgrade Current Ship</button>`])}
function buyShip(i){let s=DATA.ships[i];if(p.berries<s.cost){notice("Not enough berries",`Need ฿${fmt(s.cost)}.`);return}p.berries-=s.cost;p.ship={name:s.name,hp:s.hp,maxHp:s.hp,cannons:s.cannons,cargo:s.cargo,xp:0,tier:s.tier};major(`Acquired ship: ${s.name}.`);showMenu()}
function repairShip(){if(p.ship.name==="None")return notice("No Ship","You do not own a ship.");let cost=(p.ship.maxHp-p.ship.hp)*120;if(p.berries<cost)return notice("Not enough berries",`Need ฿${fmt(cost)}.`);p.berries-=cost;p.ship.hp=p.ship.maxHp;silent(`Repaired ${p.ship.name}.`);showMenu()}
function upgradeShip(){if(p.ship.name==="None")return notice("No Ship","You do not own a ship.");let cost=10000+p.ship.cannons*5000;if(p.berries<cost)return notice("Not enough berries",`Need ฿${fmt(cost)}.`);p.berries-=cost;p.ship.cannons++;p.ship.maxHp+=15;p.ship.hp+=15;p.ship.tier+=.2;silent(`Upgraded ${p.ship.name}.`);showMenu()}
function businessMenu(){submenu("Businesses","Buy assets that generate yearly income, but may create risk.",DATA.businesses.map((b,i)=>`<button onclick="buyBusiness(${i})">${b.name} — ฿${fmt(b.cost)} · Income ฿${fmt(b.income)}/yr</button>`))}
function buyBusiness(i){if(!spendAction())return;let b=DATA.businesses[i];if(p.berries<b.cost)return notice("Not enough berries",`Need ฿${fmt(b.cost)}.`);p.berries-=b.cost;p.businesses.push(deep(b));major(`Bought business: ${b.name}.`);showMenu()}
function shop(){submenu("Item Shop","Buy useful items. Purchases use 1 energy.",DATA.items.map((it,i)=>`<button onclick="buyItem(${i})">${it.name} — ฿${fmt(it.cost)}</button>`))}
function buyItem(i){if(!spendAction())return;let it=DATA.items[i];if(p.berries<it.cost)return notice("Not enough berries",`Need ฿${fmt(it.cost)}.`);p.berries-=it.cost;p.items.push(it.name);apply(it.effect);silent(`Bought ${it.name}.`);showMenu()}
function payDebt(){if(!spendAction())return;if(p.debt<=0)return notice("No Debt","You have no debt.");let amount=Math.min(p.berries,p.debt);p.berries-=amount;p.debt-=amount;silent(`Paid ฿${fmt(amount)} toward debt.`);showMenu()}
function blackFruit(){if(!spendAction())return;if(dangerCheck("Black market fruit deal",0.01,0.08))return;if(p.berries<15000)return notice("Not enough berries","Need ฿15,000 to search black market fruit sellers.");p.berries-=15000;apply({fruitRoll:1,heat:1});showMenu()}
function buySecret(){if(!spendAction())return;if(p.berries<8000)return notice("Not enough berries","Need ฿8,000.");p.berries-=8000;apply({mystery:1});showMenu()}
function smuggleRun(){if(!spendAction())return;if(dangerCheck("Smuggling run",0.02,0.15))return;let power=25+currentRegion().danger*8;let win=resolveCombat("escape",power,{berries:25000,infamy:1,heat:2});if(win)silent("Completed smuggling run.");showMenu()}
function bribeOfficials(){if(!spendAction())return;let cost=5000+p.heat*2000;if(p.berries<cost)return notice("Not enough berries",`Need ฿${fmt(cost)}.`);p.berries-=cost;p.heat=clamp(p.heat-4,0,99);silent("Bribed officials to reduce heat.");showMenu()}
function makeFriend(){if(!spendAction())return;let rel={name:pick(DATA.names),type:"Friend",bond:3+Math.floor(Math.random()*4)};p.relationships.push(rel);p.mood+=5;silent(`Made a friend: ${rel.name}.`);showMenu()}
function findMentor(){if(!spendAction())return;let rel={name:pick(DATA.names),type:"Mentor",bond:4};p.relationships.push(rel);apply({discipline:1,observationXP:1,armamentXP:1});silent(`Found a mentor: ${rel.name}.`);showMenu()}
function romance(){if(!spendAction())return;let rel={name:pick(DATA.names),type:"Romance",bond:3+Math.floor(Math.random()*5)};p.relationships.push(rel);p.mood+=10;silent(`Started a romance with ${rel.name}.`);showMenu()}
function betrayContact(){if(!spendAction())return;if(!p.relationships.length)return notice("No Contacts","You have no relationships to betray.");let rel=p.relationships.shift();p.berries+=12000;p.infamy+=2;p.mood-=10;apply({ruthless:1,greed:1});major(`Betrayed ${rel.name} for money.`);showMenu()}
function writeWill(){if(!spendAction())return;p.legacy+=2;p.discipline++;silent("Wrote a legacy will.");showMenu()}
function trainSuccessor(){if(!spendAction())return;p.legacy+=3;p.mood+=4;p.honor++;apply({leadership:1,sacrifice:1});silent("Trained a possible successor.");showMenu()}
function claimTerritory(){if(!spendAction())return;let power=70+currentRegion().danger*10;if(resolveCombat("duel",power,{bounty:50000,leadership:2,presence:2})){p.territories.push({name:p.island,stability:50,income:12000+currentRegion().danger*3000});major(`Claimed territory: ${p.island}.`)}showMenu()}
function retire(){ending("Retired Legend")}

function render(){
 if(!p)return; ensureAppearance();
 document.body.className="region-"+String(p.region||"").toLowerCase().replaceAll(" ","-");
 $("characterStage").className="characterStage "+(p.conqueror>0?"hasConq ":"")+(p.fruit!=="None"?"hasFruit ":"")+(p.appearance?.scar&&p.appearance.scar!=="None"?"hasScar":"");
 $("portrait").textContent=avatarIcon();$("avatarDetails").textContent=(p.appearance?.accessory==="Eyepatch"?"🏴":p.appearance?.accessory==="Cape"?"🧥":fruitEffect());
 $("posterName").textContent=p.name.toUpperCase();$("posterBounty").textContent="฿"+fmt(p.bounty);$("epithet").textContent=p.epithet;
 $("age").textContent=p.age;$("energy").textContent=p.actionsLeft;$("origin").textContent=p.origin;$("dream").textContent=p.dream;$("path").textContent=p.path;$("rank").textContent=p.rank;$("region").textContent=p.region;$("island").textContent=p.island;$("ship").textContent=p.ship.name;
 $("berries").textContent=fmt(p.berries);$("fruit").textContent=p.fruit==="None"?"None":`${p.fruit} Lv.${p.fruitMastery}`;$("haki").textContent=hakiSummary();$("health").textContent=p.health+"%";$("mood").textContent=p.mood+"%";
 $("healthMeter").style.width=clamp(p.health,0,100)+"%";$("moodMeter").style.width=clamp(p.mood,0,100)+"%";$("energyMeter").style.width=clamp(p.actionsLeft*16,0,100)+"%";
 let stats=["strength","speed","durability","intelligence","charisma","navigation","sneak","discipline","sword","marksmanship","medicine","craft"];
 $("stats").innerHTML=stats.map(s=>`<div class="stat"><div class="statTop"><span>${s}</span><b>${p[s]}</b></div><div class="bar"><div class="fill" style="width:${Math.min(100,p[s]*10)}%"></div></div></div>`).join("");
 localStorage.setItem("gpls_save_v41",JSON.stringify(p));
 showTab(currentTab,true);
}
function hakiSummary(){let h=[];if(p.observation>0)h.push("Obs "+p.observation);if(p.armament>0)h.push("Arm "+p.armament);if(p.conqueror>0)h.push("Conq "+p.conqueror);return h.length?h.join(" / "):"Dormant"}
function showTab(tab,silentRender=false){
 currentTab=tab;if(!p)return; ensureAppearance();let html="";
 if(tab==="feed")html=`<h3>Recent Feed</h3>${p.feed.map(x=>`<div class="feedEntry ${x.major?'major':''}">Age ${x.age}: ${x.text}</div>`).join("")||"<p>No recent updates.</p>"}`;
 if(tab==="appearance")html=`<h3>Appearance</h3><div class="cardGrid"><div class="miniCard"><h4>Visual Identity</h4><p>${p.appearance.ageStage} · ${p.appearance.face} face · ${p.appearance.hairColor} ${p.appearance.hair} hair · ${p.appearance.body} build</p></div><div class="miniCard"><h4>Outfit</h4><p>${p.appearance.outfit} · ${p.appearance.accessory}</p></div><div class="miniCard"><h4>Battle Marks</h4><p>${p.appearance.scar}</p></div><div class="miniCard"><h4>Power Effects</h4><p>${p.fruit!=="None"?fruitEffect()+" "+p.fruit:"No fruit aura"} ${p.conqueror>0?" · King's aura":""}</p></div></div>`;
 if(tab==="life")html=`<h3>Reputation & Personality</h3><div class="badgeRow"><span class="badge">Honor ${p.honor}</span><span class="badge">Infamy ${p.infamy}</span><span class="badge">Marine Rep ${p.marineRep}</span><span class="badge">Revolutionary Rep ${p.revolutionaryRep}</span><span class="badge">Heat ${p.heat}</span><span class="badge">Mystery ${p.mystery}/5</span><span class="badge">Legacy ${p.legacy}</span><span class="badge">Destiny ${p.destiny}</span><span class="badge">Debt ฿${fmt(p.debt)}</span></div><h3>Hidden Traits Revealed</h3><div class="badgeRow">${p.hiddenTraits.map(t=>`<span class="badge">${t}</span>`).join("")||"<span class='badge'>None yet</span>"}</div>${p.quest?`<div class="notice"><b>Active Quest:</b> ${p.quest.name}<br><span class="small">${p.quest.theme}</span></div>`:""}<h3>Relationships</h3>${p.relationships.length?p.relationships.map(r=>`<div class="line"><span>${r.type}</span><b>${r.name} · Bond ${r.bond}</b></div>`).join(""):"<p>No relationships yet.</p>"}`;
 if(tab==="crew")html=`<h3>Crew & Rivals</h3>${p.crew.length?p.crew.map(c=>`<div class="line"><span>${c.role}</span><b>${c.name} · Loyalty ${c.loyalty} · ${c.haki||"No Haki"} · ฿${fmt(c.salary||0)}/yr</b></div><div class="small">${(c.traits||[]).join(", ")}</div>`).join(""):"<p>No crew yet.</p>"}${p.rivals.length?"<h3>Rivals</h3>"+p.rivals.map(x=>`<div class="line"><span>Rival</span><b>${x}</b></div>`).join(""):""}`;
 if(tab==="haki")html=`<h3>Haki System</h3><div class="cardGrid"><div class="miniCard"><h4>Observation ${p.observation}</h4><p>XP ${p.observationXP}</p><div class="badgeRow">${p.hakiSkills.observation.map(s=>`<span class="badge">${s}</span>`).join("")||"<span class='badge'>Dormant</span>"}</div></div><div class="miniCard"><h4>Armament ${p.armament}</h4><p>XP ${p.armamentXP}</p><div class="badgeRow">${p.hakiSkills.armament.map(s=>`<span class="badge">${s}</span>`).join("")||"<span class='badge'>Dormant</span>"}</div></div><div class="miniCard"><h4>Conqueror ${p.conqueror}</h4><p>XP ${p.conquerorXP}</p><div class="badgeRow">${p.hakiSkills.conqueror.map(s=>`<span class="badge">${s}</span>`).join("")||"<span class='badge'>Dormant</span>"}</div></div><div class="miniCard"><h4>King Traits</h4><p>Leadership ${p.kingTraits.leadership}, Ambition ${p.kingTraits.ambition}, Defiance ${p.kingTraits.defiance}, Courage ${p.kingTraits.courage}, Presence ${p.kingTraits.presence}, Sacrifice ${p.kingTraits.sacrifice}, Independence ${p.kingTraits.independence}</p></div></div>`;
 if(tab==="powers")html=`<h3>Powers</h3><div class="line"><span>Devil Fruit</span><b>${p.fruit}</b></div><div class="line"><span>Fruit Type</span><b>${p.fruitType||"None"}</b></div><div class="line"><span>Fruit Mastery</span><b>${p.fruitMastery}</b></div><div class="badgeRow">${p.fruitSkills.map(s=>`<span class="badge">${s}</span>`).join("")||"<span class='badge'>No fruit skills</span>"}</div><h3>Ship & Assets</h3><div class="line"><span>Ship</span><b>${p.ship.name} · HP ${p.ship.hp}/${p.ship.maxHp} · Cannons ${p.ship.cannons}</b></div><div class="badgeRow">${p.items.map(i=>`<span class="badge">${typeof i==="string"?i:i.name}</span>`).join("")||"<span class='badge'>No items</span>"}</div>`;
 if(tab==="map")html=`<h3>World Map</h3><div class="mapTrack">${DATA.regions.map(r=>`<div class="mapNode ${r.name===p.region?'active':''}"><h4>${r.name}</h4><p>${r.desc}</p><span class="badge">Danger ${r.danger}/10</span> <span class="badge">Req Nav ${r.req.nav}</span> <span class="badge">Ship HP ${r.req.ship}</span></div>`).join("")}</div><h3>Current Island</h3><p><b>${currentIsland().name}</b> — ${currentIsland().type}: ${currentIsland().desc}</p>`;
 if(tab==="news")html=`<h3>World Timeline</h3><div class="timeline">${p.timeline.map(t=>`<div class="timelineItem"><b>Age ${t.age}</b><br>${t.text}</div>`).join("")||"<p>The world is quiet... for now.</p>"}</div><h3>Newspapers</h3>${p.newspapers.length?p.newspapers.map(n=>`<div class="newspaper"><h2>${n.headline}</h2><p><b>Age ${n.age}</b> — ${n.body}</p></div>`).join(""):"<p>No newspapers yet.</p>"}`;
 if(tab==="legacy")html=`<h3>Legacy</h3><div class="line"><span>Legacy Score</span><b>${p.legacy}</b></div><div class="line"><span>Territories</span><b>${p.territories.length}</b></div>${p.territories.map(t=>`<div class="line"><span>${t.name}</span><b>Stability ${t.stability} · Income ฿${fmt(t.income)}/yr</b></div>`).join("")||"<p>No territories yet.</p>"}<h3>Island Memory</h3>${Object.entries(p.memories.islands).map(([k,v])=>`<div class="miniCard"><h4>${k}</h4><p>${v.map(m=>`Age ${m.age}: ${m.text}`).join("<br>")}</p></div>`).join("")||"<p>No island memories yet.</p>"}`;
 if(tab==="log")html=`<h3>Life Log</h3>${p.log.map(x=>`<div class="logEntry">${x}</div>`).join("")||"<p>No log yet.</p>"}`;
 $("tab").innerHTML=html;
}
function ending(forcedTitle=null){let title=forcedTitle||"Unknown Drifter";if(!forcedTitle){if(p.conqueror>=5&&p.bounty>500000000)title="Emperor Candidate";else if(p.bounty>300000000)title="Legendary Pirate";else if(p.bounty>100000000)title="Supernova";else if(p.marineRep>35)title="Admiral Candidate";else if(p.revolutionaryRep>25)title="World Government Threat";else if(p.berries>600000)title="Underworld Tycoon";else if(p.infamy>25)title="Sea Menace";else if(p.honor>25)title="Local Legend";else if(p.crew.length>=10)title="Beloved Captain"}$("screen").innerHTML=`<h2>Ending: ${title}</h2><p>Your life reaches its final chapter. Legacy: ${p.legacy}. Future versions can let old lives become world legends.</p><div class="choices"><button class="primary" onclick="setup()">Start New Life</button></div>`;major(`Final title: ${title}.`);addNews("LIFE OF A LEGEND",`${p.name}'s story ends with the title: ${title}.`);render()}
function help(){ $("screen").innerHTML=`<h2>How to Play v4.0</h2><div class="notice"><b>Living UI:</b> Watch the poster, appearance, background, feed, map, and newspapers evolve.<br><br><b>Appearance:</b> Your look changes from age, wounds, outfit, career, Devil Fruit, and Haki.<br><br><b>Notifications:</b> Small updates appear as toasts; major events still interrupt.<br><br><b>Haki:</b> Observation, Armament, and Conqueror unlock usable actions.</div><div class="choices"><button class="primary" onclick="showMenu()">Back</button></div>`}
function manualSave(){localStorage.setItem("gpls_save_v41",JSON.stringify(p));silent("Game saved.");showMenu()}
function loadGame(){p=JSON.parse(localStorage.getItem("gpls_save_v41"))||JSON.parse(localStorage.getItem("gpls_save_v40"));ensureAppearance();showMenu()}
function clearSave(){localStorage.removeItem("gpls_save_v41");localStorage.removeItem("gpls_save_v40");setup()}
$("saveBtn").onclick=manualSave;$("newBtn").onclick=setup;$("helpBtn").onclick=help;setup();
