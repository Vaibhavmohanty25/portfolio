"use client";
import { useEffect, useRef, useState } from "react";
import { profile, projects } from "@/data/portfolio";
import { Arrow, MotionPausedContext, Reveal } from "./Interface";
import ProjectExplorer from "./ProjectExplorer";
import SignalLab from "./SignalLab";
import { AcidTicker, AcidWaves } from "./AcidAtmosphere";

const menuItems=[{label:"Work",href:"#work"},{label:"Play",href:"#lab"},{label:"About",href:"#about"},{label:"Contact",href:"#contact"}];
function SystemCore() {
  const [focus,setFocus]=useState(0);
  const project=projects[focus];
  return <div className={`system-console core-${project.visual}`}>
    <AcidWaves />
    <div className="console-topline mono"><span>ACID_OS / SIGNAL VISUALIZER</span><span>LIVE EXPLORATION <i /></span></div>
    <div className="core-sculpture" aria-hidden="true"><div className="core-halo" /><div className="core-ring core-ring-one" /><div className="core-ring core-ring-two" /><div className="core-ring core-ring-three" /><div className="core-sphere"><span>{project.number}</span></div><div className="core-axis axis-x" /><div className="core-axis axis-y" /></div>
    <div className="core-caption" aria-live="polite"><span className="mono">SYSTEM {project.number} / 04</span><strong>{project.name}</strong><p>{project.summary}</p></div>
    <div className="core-selectors" role="group" aria-label="Choose a system to preview">{projects.map((item,index)=><button type="button" key={item.name} aria-pressed={focus===index} onClick={()=>setFocus(index)}><span>{item.number}</span>{item.name}</button>)}</div>
  </div>;
}
export default function Portfolio() {
  const [menuOpen,setMenuOpen]=useState(false);
  const [motionPaused,setMotionPaused]=useState(false);
  const [accent,setAccent]=useState("green");
  const [explored,setExplored]=useState<string[]>([]);
  const [labComplete,setLabComplete]=useState(false);
  const menuButton=useRef<HTMLButtonElement>(null);
  useEffect(()=>{if(!menuOpen)return;const escape=(event:KeyboardEvent)=>{if(event.key==="Escape"){setMenuOpen(false);menuButton.current?.focus();}};document.addEventListener("keydown",escape);return()=>document.removeEventListener("keydown",escape);},[menuOpen]);
  function explore(name:string){setExplored(current=>current.includes(name)?current:[...current,name]);}
  return <MotionPausedContext value={motionPaused}><div data-accent={accent} className={`site-shell ${motionPaused?"motion-paused":""}`}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><a className="wordmark" href="#top" aria-label="Vaibhav Mohanty, back to top"><span className="wordmark-mark">v/m</span><span>VAIBHAV<br />MOHANTY</span></a><nav className="desktop-nav" aria-label="Main navigation">{menuItems.map((item,i)=><a key={item.href} href={item.href}><span className="nav-index">0{i+1} / </span>{item.label}</a>)}</nav><div className="header-actions"><button className="motion-toggle" type="button" aria-pressed={motionPaused} onClick={()=>setMotionPaused(value=>!value)}>{motionPaused?"EFFECTS: REDUCED":"REDUCE EFFECTS"}</button><a className="header-cta" href={profile.resume} target="_blank" rel="noopener noreferrer">RÉSUMÉ <Arrow diagonal /></a></div><button ref={menuButton} className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={()=>setMenuOpen(value=>!value)}>{menuOpen?"CLOSE −":"MENU +"}</button></header>
    <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation" hidden={!menuOpen}>{menuItems.map((item,index)=><a key={item.href} href={item.href} onClick={()=>setMenuOpen(false)}><span>0{index+1}</span>{item.label}<Arrow diagonal /></a>)}<button type="button" aria-pressed={motionPaused} onClick={()=>setMotionPaused(value=>!value)}>{motionPaused?"Effects reduced — restore":"Reduce effects"}</button></nav>
    <div className="wave-controls"><span className="mono">PERSONAL SIGNAL / VOL. 026</span><div className="accent-controls" role="group" aria-label="Choose an acid accent"><span className="mono">TUNE THE WAVE</span>{["green","pink","cyan","yellow"].map(color=><button key={color} className={`accent-swatch swatch-${color}`} type="button" aria-label={`Use ${color} accent`} aria-pressed={accent===color} onClick={()=>setAccent(color)} />)}</div></div>
    <main id="main">
      <section className="hero" id="top" aria-labelledby="hero-title"><div className="hero-topline mono"><span>INDEPENDENT MIND. CONNECTED SYSTEMS.</span><span>REALITY.EXE / REIMAGINED</span></div><div className="hero-title-row"><Reveal><p className="eyebrow"><span className="status-dot" /> OPEN TO OPPORTUNITIES</p><h1 id="hero-title">VAIBHAV<br /><em>MOHANTY</em></h1></Reveal><Reveal className="hero-intro" delay={.12}><span className="eyebrow">AI / ML / CONTROLLED CHAOS</span><p>{profile.intro}</p><div className="hero-actions"><a className="solid-button" href="#work">ENTER THE WAVE <Arrow /></a><a className="text-link" href={`mailto:${profile.email}`}>LET’S TALK <Arrow diagonal /></a></div></Reveal></div><SystemCore /><div className="hero-footer mono"><span>12 PROJECTS. ONE CURIOUS MIND.</span><a href="#lab">TAKE THE SIGNAL CHALLENGE <Arrow /></a><span>SCROLL TO DISCOVER ↓</span></div></section>
      <AcidTicker />
      <div className="explorer-status" aria-label="Exploration progress"><span className="mono">YOUR EXPLORATION</span><div className="exploration-track" aria-hidden="true">{projects.map(project=><i key={project.name} data-done={explored.includes(project.name)} />)}</div><span className="mono" aria-live="polite">{explored.length}/4 SYSTEMS {explored.length===4?"DECODED":"EXPLORED"}</span>{labComplete&&<span className="lab-badge">SIGNAL MATCHER ✓</span>}<a href="#work" className="mono">CONTINUE <Arrow /></a></div>
      <ProjectExplorer explored={explored} onExplore={explore} />
      <SignalLab onComplete={()=>setLabComplete(true)} />
      <section className="about-section section-pad" id="about" aria-labelledby="about-title"><Reveal className="section-heading"><div><p className="eyebrow">03 / THE MIND BEHIND THE SYSTEMS</p><h2 id="about-title">Built with logic.<br /><em>Driven by curiosity.</em></h2></div></Reveal><div className="about-grid"><div className="about-label mono">[ APPROACH ]<span>01 → 04</span></div><p className="about-lead">I’m interested in the space between a difficult problem and a tool people can actually use.</p><div className="about-copy"><p>My projects explore document intelligence, grounded AI, voice interfaces, and computer vision. I care about the entire experience: the evidence behind an answer, the system that produces it, and the person using it.</p><a className="text-link" href={profile.resume} target="_blank" rel="noopener noreferrer">VIEW MY RÉSUMÉ <Arrow diagonal /></a></div></div><div className="principles">{[{title:"Understand",text:"Start with the actual problem."},{title:"Build",text:"Make the idea tangible."},{title:"Verify",text:"Inspect the evidence and behavior."},{title:"Refine",text:"Make the experience clearer."}].map((item,i)=><Reveal key={item.title} delay={i*.04}><span className="mono">0{i+1}</span><h3>{item.title}</h3><p>{item.text}</p></Reveal>)}</div></section>
      <section className="contact-section section-pad" id="contact" aria-labelledby="contact-title"><p className="eyebrow">04 / FINAL BOSS: SAY HELLO</p><Reveal><h2 id="contact-title">LET’S BUILD<br />WHAT’S <em>NEXT.</em><Arrow diagonal /></h2></Reveal><div className="contact-row"><p>Looking for an AI/ML engineer with a builder’s mindset? Let’s start a conversation.</p><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<Arrow diagonal /></a></div></section>
    </main>
    <footer className="site-footer"><a className="wordmark" href="#top"><span className="wordmark-mark">v/m</span><span>VAIBHAV MOHANTY</span></a><p>© 2026 · MADE TO BE EXPLORED.</p><div className="footer-links"><a href={profile.github} target="_blank" rel="noopener noreferrer">GITHUB <Arrow diagonal /></a><a href={profile.resume} target="_blank" rel="noopener noreferrer">RÉSUMÉ <Arrow diagonal /></a><a href="#top">BACK TO TOP ↑</a></div></footer>
  </div></MotionPausedContext>;
}
