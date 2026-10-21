"use client";
import { useEffect, useRef, useState } from "react";
import { additionalProjects, projects, type Project } from "@/data/portfolio";
import { Arrow, Reveal } from "./Interface";

export function ProjectVisual({ project }: { project: Project }) {
  return <div className={`project-visual visual-${project.visual}`} role="img" aria-label={`Original abstract illustration for ${project.name}`}>
    <div className="visual-grid" /><span className="visual-corner">VM / {project.number}</span>
    {project.visual === "prism" && <><div className="prism-shape"><span /></div><div className="prism-beam" /><span className="visual-word">SEE THE<br />BIGGER PICTURE.</span></>}
    {project.visual === "claim" && <><div className="claim-card claim-card-back" /><div className="claim-card claim-card-front"><span>EVIDENCE / 001</span><strong>Clarity<br />from complexity.</strong><span className="claim-line" /><span className="claim-line short" /><span className="claim-dot">● &nbsp; HUMAN IN THE LOOP</span></div></>}
    {project.visual === "saarthi" && <><div className="saarthi-ring ring-one" /><div className="saarthi-ring ring-two" /><div className="saarthi-ring ring-three" /><div className="saarthi-core">स</div><span className="visual-word">LEARN.<br />VERIFY. GROW.</span></>}
    {project.visual === "jarvis" && <><div className="jarvis-orbit orbit-one" /><div className="jarvis-orbit orbit-two" /><div className="jarvis-center">J<span>●</span></div><div className="waveform">{Array.from({length:15},(_,i) => <i key={i} style={{height:`${12+((i*17)%42)}px`}} />)}</div></>}
    <span className="visual-index">{project.name.toUpperCase()} / SYSTEM STUDY</span>
  </div>;
}

type Props = { explored: string[]; onExplore: (name: string) => void };
export default function ProjectExplorer({ explored, onExplore }: Props) {
  const [active,setActive] = useState<Project|null>(null);
  const [filter,setFilter] = useState("All projects");
  const dialog = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLButtonElement|null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const filtered = additionalProjects.filter(project => filter === "All projects" || (filter === "AI & ML" ? /AI|LANGUAGE|VISION/.test(project.category) : !/AI|LANGUAGE|VISION/.test(project.category)));
  useEffect(() => { if(active && !dialog.current?.open) {dialog.current?.showModal();closeButton.current?.focus();} },[active]);
  function openProject(project:Project,trigger:HTMLButtonElement) {lastTrigger.current=trigger;setActive(project);onExplore(project.name);}
  function closeProject() {dialog.current?.close();setActive(null);lastTrigger.current?.focus();}
  return <>
    <section id="work" className="work-section section-pad" aria-labelledby="work-title">
      <Reveal className="section-heading"><div><p className="eyebrow">01 / SELECTED SYSTEMS</p><h2 id="work-title">Ideas made<br /><em>operational.</em></h2></div><div className="section-aside"><p>Four ways I’m exploring what AI can do. Open a project to inspect the thinking behind it.</p><span className="mono">{String(explored.length).padStart(2,"0")} / 04 EXPLORED THIS VISIT</span></div></Reveal>
      <div className="projects-grid">{projects.map((project,index) => <Reveal className="project-card" key={project.name} delay={index%2*.08}>
        <button type="button" className="project-cover" onClick={event => openProject(project,event.currentTarget)} aria-label={`Explore ${project.name}`}><ProjectVisual project={project} /><span className="cover-action">{explored.includes(project.name) ? "EXPLORED ✓" : "EXPLORE SYSTEM"} <Arrow diagonal /></span></button>
        <div className="project-info"><div className="project-overline"><span>{project.number} / 04</span><span>{project.category}</span></div><h3>{project.name}</h3><p className="project-summary">{project.summary}</p><div className="project-bottom"><div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><a className="code-link" href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.name} code on GitHub`}>View code <Arrow diagonal /></a></div></div>
      </Reveal>)}</div>
      <div className="more-work"><Reveal className="more-work-heading"><div><p className="eyebrow">THE FULL COLLECTION</p><h3>Still curious?</h3></div><p>Eight more projects. A wider view of how I build.</p></Reveal>
        <div className="project-filters" role="group" aria-label="Filter additional projects">{["All projects","AI & ML","Web & systems"].map(label => <button key={label} type="button" aria-pressed={filter===label} onClick={() => setFilter(label)}>{label}</button>)}<span aria-live="polite">{filtered.length} projects</span></div>
        <div className="more-work-list">{filtered.map(project => <a className="more-work-row" href={project.github} key={project.name} target="_blank" rel="noopener noreferrer"><span className="more-number">{String(additionalProjects.indexOf(project)+5).padStart(2,"0")}</span><span className="more-name">{project.name}</span><span className="more-category">{project.category}</span><Arrow diagonal /></a>)}</div>
      </div>
    </section>
    <dialog className="project-dialog" ref={dialog} aria-labelledby="dossier-title" onClose={() => {setActive(null);lastTrigger.current?.focus();}} onClick={event => {if(event.target===event.currentTarget) closeProject();}}>
      {active && <div className="dossier"><div className="dossier-top"><span className="eyebrow">PROJECT FILE / {active.number}</span><button ref={closeButton} type="button" onClick={closeProject} aria-label="Close project details">CLOSE ×</button></div><h2 id="dossier-title">{active.name}</h2><p className="dossier-summary">{active.summary}</p><ProjectVisual project={active} /><div className="dossier-detail"><span className="eyebrow">THE SYSTEM</span><p>{active.detail}</p></div><div className="dossier-detail"><span className="eyebrow">BUILT WITH</span><div className="project-tags">{active.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><a className="solid-button" href={active.github} target="_blank" rel="noopener noreferrer">VIEW {active.name.toUpperCase()} CODE <Arrow diagonal /></a></div>}
    </dialog>
  </>;
}
