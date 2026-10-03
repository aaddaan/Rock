import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {AnimatePresence, motion} from 'framer-motion';
import {ArrowLeft, RotateCcw, Home, ChevronRight, Crosshair, Info} from 'lucide-react';
import './styles.css';

const stageData={
  s200:{name:'SOLID STRAP-ON MOTORS',code:'S200',type:'Solid propulsion',accent:'#ff7a45',desc:'Twin solid strap-on boosters provide the high initial thrust required during the early phase of flight.',facts:[['Configuration','2 × S200'],['Propulsion','Solid'],['Role','Initial boost']],components:{pyro:{name:'PYRO IGNITER',desc:'An ignition system associated with initiating the solid motor firing sequence.',tag:'IGNITION'},fuel:{name:'FUEL CORE',desc:'The solid propellant region that generates hot gases for thrust when the motor operates.',tag:'PROPULSION'},nozzle:{name:'EXHAUST NOZZLE',desc:'Shapes and accelerates the combustion gases to produce directed thrust.',tag:'THRUST'}}},
  l110:{name:'LIQUID CORE STAGE',code:'L110',type:'Liquid propulsion',accent:'#42d9c5',desc:'The L110 is the liquid core stage of LVM3 and uses twin Vikas engines.',facts:[['Engine','2 × Vikas'],['Propellant','Liquid'],['Role','Core stage']],components:{oxidizer:{name:'OXIDIZER TANK',desc:'Stores the oxidizer used by the liquid propulsion system.',tag:'TANK'},fuel:{name:'FUEL TANK',desc:'Stores the liquid fuel used by the stage propulsion system.',tag:'TANK'},feed:{name:'FUEL SUPPLY LINE',desc:'Feed hardware routes propellants from storage toward the engine system.',tag:'FEED'},vikas:{name:'VIKAS ENGINE',desc:'The L110 uses twin Vikas engines for liquid propulsion.',tag:'ENGINE'}}},
  c25:{name:'CRYOGENIC UPPER STAGE',code:'C25',type:'Cryogenic propulsion',accent:'#8aa7ff',desc:'The C25 is the cryogenic upper stage of LVM3 and is powered by the CE-20 engine.',facts:[['Engine','CE-20'],['Propellant','LOX + LH2'],['Role','Upper stage']],components:{hydrogen:{name:'HYDROGEN / LH2 TANK',desc:'Stores liquid hydrogen used by the cryogenic propulsion system.',tag:'TANK'},oxygen:{name:'OXYGEN / LOX TANK',desc:'Stores liquid oxygen used as the oxidizer.',tag:'TANK'},feed:{name:'PROPELLANT FEED',desc:'Propellant feed hardware routes cryogenic fluids toward the engine.',tag:'FEED'},ce20:{name:'CE-20 ENGINE',desc:'The CE-20 is the cryogenic engine used on the C25 upper stage.',tag:'ENGINE'}}}
};

function SpaceBg(){return <div className="space-bg"><div className="nebula n1"/><div className="nebula n2"/><div className="grid"/><div className="stars">{Array.from({length:90},(_,i)=><i key={i} style={{left:`${(i*37)%100}%`,top:`${(i*61)%100}%`,animationDelay:`${(i%7)*.4}s`}}/> )}</div><div className="orbit o1"/><div className="orbit o2"/></div>}

function Rocket({selected, onSelect, selectedComponent}){
 const dim=(key)=>selected && selected!==key ? .18 : 1;
 return <div className="rocket-wrap">
   <div className="rocket-glow"/>
   <motion.div className="rocket" animate={{scale:selected?.8:1, x:selected?80:0}} transition={{duration:.7,ease:[.22,.8,.2,1]}}>
     <button className="hotspot payload" onClick={()=>onSelect('payload')} aria-label="Payload section"><span>PAYLOAD</span></button>
     <div className="fairing"><div className="fairing-mark">LVM3</div></div>
     <motion.div className="stage c25" style={{opacity:dim('c25')}} onClick={()=>onSelect('c25')} whileTap={{scale:.97}}><div className="tank topTank"/><div className="engine cengine"/></motion.div>
     <motion.div className="stage l110" style={{opacity:dim('l110')}} onClick={()=>onSelect('l110')} whileTap={{scale:.97}}><div className="tank blueTank"/><div className="engine lengine"/><div className="band"/></motion.div>
     <motion.div className="stage s200 left" style={{opacity:dim('s200')}} onClick={()=>onSelect('s200')} whileTap={{scale:.97}}><div className="boosterCap"/><div className="boosterBody"/><div className="boosterNozzle"/></motion.div>
     <motion.div className="stage s200 right" style={{opacity:dim('s200')}} onClick={()=>onSelect('s200')} whileTap={{scale:.97}}><div className="boosterCap"/><div className="boosterBody"/><div className="boosterNozzle"/></motion.div>
     <div className="core"><div className="coreBody"/><div className="coreNozzle"/></div>
     <div className="rocket-base"/>
   </motion.div>
   {selected && selected!=='payload' && <StageCallouts stage={selected} component={selectedComponent}/>} 
 </div>
}

function StageCallouts({stage,component}){const d=stageData[stage]; const keys=Object.keys(d.components); return <div className={`callouts ${stage}`}>
 {keys.map((k,i)=>{const c=d.components[k]; return <motion.div key={k} className={`callout c-${k} ${component===k?'active':''}`} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:.15+i*.08}}><span className="line"/><button className="callout-btn" onClick={()=>window.dispatchEvent(new CustomEvent('component-select',{detail:k}))}><small>{c.tag}</small><strong>{c.name}</strong></button></motion.div>})}
 </div>}

function InfoPanel({stage,component,onBack}){if(!stage)return null; const d=stageData[stage]; const c=component?d.components[component]:null; return <motion.aside className="info-panel" initial={{opacity:0,x:35}} animate={{opacity:1,x:0}} exit={{opacity:0,x:35}} transition={{duration:.45}}>
 <div className="panel-kicker">{c?'COMPONENT DETAIL':'SECTION EXPLORER'} <span>{d.code}</span></div>
 <h2>{c?c.name:d.name}</h2>
 <p>{c?c.desc:d.desc}</p>
 {c?<div className="component-pill"><span/><b>{c.tag}</b><em>Interactive element</em></div>:<div className="facts">{d.facts.map(([a,b])=><div key={a}><span>{a}</span><strong>{b}</strong></div>)}</div>}
 <button className="back-btn" onClick={onBack}><ArrowLeft size={17}/> {c?'Back to section':'Back to vehicle'}</button>
 </motion.aside>}

function App(){const [screen,setScreen]=useState('home'); const [selected,setSelected]=useState(null); const [component,setComponent]=useState(null);
 useEffect(()=>{const f=e=>setComponent(e.detail); window.addEventListener('component-select',f); return()=>window.removeEventListener('component-select',f)},[]);
 useEffect(()=>{if(screen!=='explore')return; const t=setTimeout(()=>{setScreen('home');setSelected(null);setComponent(null)},90000); return()=>clearTimeout(t)},[screen,selected,component]);
 const start=()=>{setScreen('explore');setSelected(null);setComponent(null)};
 const reset=()=>{setSelected(null);setComponent(null)};
 const select=s=>{if(s==='payload'){setSelected(null);setComponent(null);return} setSelected(s);setComponent(null)};
 return <main className="app"><SpaceBg/>
  <AnimatePresence mode="wait">
   {screen==='home'?<motion.section key="home" className="home" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
     <div className="eyebrow"><span className="status-dot"/> CONCEPT DEMONSTRATION <span className="slash">/</span> SPACE EXPLORATION</div>
     <motion.div className="home-title" initial={{y:25,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:.15}}><span>ISRO</span><h1>LVM3</h1><p>INTERACTIVE LAUNCH VEHICLE EXPLORER</p></motion.div>
     <div className="home-rocket-mini"><div className="mini-glow"/><div className="mini-rocket"><div/><i/><b/></div></div>
     <p className="home-copy">Explore the launch vehicle section by section.<br/>Tap any stage to discover what lies beneath.</p>
     <button className="start-btn" onClick={start}><span>START EXPLORING</span><ChevronRight/></button>
     <div className="home-meta"><span>TOUCH-FIRST EXPERIENCE</span><span>INTERACTIVE TECHNICAL MODEL</span><span>PROTOTYPE v0.1</span></div>
   </motion.section>:<motion.section key="explore" className="explorer" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
     <header className="topbar"><div className="brand"><div className="brand-mark">L</div><div><b>LVM3</b><small>LAUNCH VEHICLE EXPLORER</small></div></div><div className="instruction"><Crosshair size={15}/> CLICK ON ANY SECTION TO EXPLORE</div><div className="actions"><button onClick={reset}><RotateCcw size={16}/> START OVER</button><button onClick={()=>{setScreen('home');reset()}}><Home size={16}/> HOME</button></div></header>
     <div className="explore-title"><span>INDIA'S HEAVY-LIFT LAUNCH VEHICLE</span><h1>{selected?stageData[selected]?.code:'LVM3'}</h1></div>
     <div className="stage-tabs">{[['s200','S200'],['l110','L110'],['c25','C25']].map(([k,l])=><button key={k} className={selected===k?'active':''} onClick={()=>select(k)}><i style={{background:stageData[k].accent}}/><span>{l}</span><small>{stageData[k].type}</small></button>)}</div>
     <Rocket selected={selected} onSelect={select} selectedComponent={component}/>
     {!selected && <div className="hint"><div className="pulse-ring"/><span>Tap a highlighted stage to explore</span></div>}
     <AnimatePresence>{selected&&<InfoPanel stage={selected} component={component} onBack={()=>component?setComponent(null):reset()}/>}</AnimatePresence>
     <div className="bottom-status"><span><i/> SYSTEM READY</span><span>INTERACTIVE MODEL</span><span>TOUCH / CLICK TO EXPLORE</span></div>
   </motion.section>}
  </AnimatePresence>
 </main>
}
createRoot(document.getElementById('root')).render(<App/>);
