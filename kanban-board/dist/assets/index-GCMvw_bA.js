import Be from"https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const c of a)if(c.type==="childList")for(const l of c.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function n(a){const c={};return a.integrity&&(c.integrity=a.integrity),a.referrerPolicy&&(c.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?c.credentials="include":a.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function o(a){if(a.ep)return;a.ep=!0;const c=n(a);fetch(a.href,c)}})();Be.initialize({startOnLoad:!1,theme:"dark",themeVariables:{primaryColor:"#334155",primaryBorderColor:"#60a5fa",primaryTextColor:"#f1f5f9",lineColor:"#64748b",secondaryColor:"#1e293b",tertiaryColor:"#0f172a"}});window.__mermaid=Be;const ee=[{key:"todo",label:"Requirements",icon:"📋"},{key:"plan",label:"Plan",icon:"🗺️"},{key:"plan_review",label:"Review Plan",icon:"🔍"},{key:"impl",label:"Implement",icon:"🔨"},{key:"impl_review",label:"Review Impl",icon:"📝"},{key:"test",label:"Test",icon:"🧪"},{key:"done",label:"Done",icon:"✅"}],Ue={plan:"Planning",plan_review:"Plan Review",impl:"Implementing",impl_review:"Impl Review",test:"Testing"};let S=null,te=!1,se="board",_e="",x="default",D=!1;function Re(e){return e==="high"?"high":e==="medium"?"medium":e==="low"?"low":""}function Ee(e){return e?Date.now()-new Date(e).getTime()>4320*60*1e3:!1}function Se(e){return x==="default"?e:[...e].sort((t,n)=>x==="created_asc"?t.created_at.localeCompare(n.created_at):x==="created_desc"?n.created_at.localeCompare(t.created_at):x==="completed_desc"?(n.completed_at||"").localeCompare(t.completed_at||""):0)}function W(){const e=_e.toLowerCase().replace(/^#/,""),t=e.length>0||D;se==="board"?(document.querySelectorAll(".card").forEach(n=>{const o=!e||(()=>{var i,p,u,h;const c=n.dataset.id||"",l=((p=(i=n.querySelector(".card-title"))==null?void 0:i.textContent)==null?void 0:p.toLowerCase())||"",g=((h=(u=n.querySelector(".card-desc"))==null?void 0:u.textContent)==null?void 0:h.toLowerCase())||"",s=[...n.querySelectorAll(".tag")].map(f=>{var m;return((m=f.textContent)==null?void 0:m.toLowerCase())||""}).join(" ");return c===e||l.includes(e)||g.includes(e)||s.includes(e)})(),a=D&&n.dataset.status==="done"&&Ee(n.dataset.completedAt||"");n.style.display=o&&!a?"":"none"}),document.querySelectorAll(".column").forEach(n=>{const o=n.querySelectorAll(".card"),a=[...o].filter(l=>l.style.display!=="none").length,c=n.querySelector(".count");c&&(c.textContent=t?`${a}/${o.length}`:`${o.length}`)})):document.querySelectorAll("#list-view tbody tr").forEach(n=>{const o=!e||(()=>{var i,p,u,h;const c=n.dataset.id||"",l=((p=(i=n.querySelector(".col-title"))==null?void 0:i.textContent)==null?void 0:p.toLowerCase())||"",g=((h=(u=n.cells[5])==null?void 0:u.textContent)==null?void 0:h.toLowerCase())||"",s=[...n.querySelectorAll(".tag")].map(f=>{var m;return((m=f.textContent)==null?void 0:m.toLowerCase())||""}).join(" ");return c===e||l.includes(e)||g.includes(e)||s.includes(e)})(),a=D&&n.classList.contains("status-done")&&Ee(n.dataset.completedAt||"");n.style.display=o&&!a?"":"none"})}function ae(e){if(!e||e==="null")return[];try{const t=JSON.parse(e);return Array.isArray(t)?t:[]}catch{return[]}}function Fe(e){const t=new Date(e+"Z"),o=new Date().getTime()-t.getTime(),a=Math.floor(o/864e5);return a===0?"today":a===1?"yesterday":a<7?`${a}d ago`:a<30?`${Math.floor(a/7)}w ago`:e.slice(0,10)}function C(e){if(!e||e==="null")return[];try{const t=JSON.parse(e);return Array.isArray(t)?t:[]}catch{return[]}}function d(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}function Je(e){const t=Re(e.priority),n=t?`<span class="badge ${t}">${d(e.priority)}</span>`:"",o=e.completed_at?`<span class="badge date">${e.completed_at.slice(0,10)}</span>`:e.created_at?`<span class="badge created">${Fe(e.created_at)}</span>`:"",a=!S&&e.project?`<span class="badge project">${d(e.project)}</span>`:"",c=Ue[e.status],l=c?`<span class="badge status-${d(e.status)}">${c}</span>`:"",g=`<span class="badge level-${e.level}">L${e.level}</span>`,s=e.current_agent?`<span class="badge agent-tag">${d(e.current_agent)}</span>`:"",i=C(e.review_comments),p=i.length>0?i[i.length-1]:null,u=p?`<span class="badge ${p.status==="approved"?"review-approved":"review-changes"}">${p.status==="approved"?"Approved":"Changes Req."}</span>`:e.status==="impl_review"?'<span class="badge review-pending">Awaiting Review</span>':"",h=C(e.plan_review_comments),f=h.length>0?h[h.length-1]:null,m=f?`<span class="badge ${f.status==="approved"?"review-approved":"review-changes"}">${f.status==="approved"?"Plan OK":"Plan Changes"}</span>`:e.status==="plan_review"?'<span class="badge review-pending">Plan Review</span>':"",v=ae(e.tags).map(N=>`<span class="tag">${d(N)}</span>`).join(""),y=e.description?e.description.split(`
`)[0].slice(0,80):"",b=C(e.notes).length,L=b>0?`<span class="badge notes-count" title="${b} note(s)">💬 ${b}</span>`:"";return`
    <div class="card" draggable="true" data-id="${e.id}" data-status="${d(e.status)}" data-project="${d(e.project)}" data-completed-at="${d(e.completed_at)}">
      <div class="card-header">
        <span class="card-id">#${e.id}</span>
        ${g}
        ${n}
        ${l}
        ${s}
        <button class="card-copy-btn" data-copy="#${e.id} ${d(e.title)}" title="Copy to clipboard">⎘</button>
      </div>
      <div class="card-title">${d(e.title)}</div>
      ${y?`<div class="card-desc">${d(y)}</div>`:""}
      <div class="card-footer">
        ${a}
        ${m}
        ${u}
        ${L}
        ${o}
      </div>
      ${v?`<div class="card-tags">${v}</div>`:""}
    </div>
  `}function ze(e,t,n,o){const a=Se(o).map(Je).join("");return`
    <div class="column ${e}" data-column="${e}">
      <div class="column-header">
        <span>${n} ${t}</span>
        <div class="column-header-right">
          ${e==="todo"?'<button class="add-card-btn" id="add-card-btn" title="Add card">+</button>':""}
          <span class="count">${o.length}</span>
        </div>
      </div>
      <div class="column-body" data-column="${e}">
        ${a||'<div class="empty">No items</div>'}
      </div>
    </div>
  `}const Ve=/```[\s\S]*?```/g,Ke=/```\w*\n?/,be=/```$/,we=/^```mermaid\s*\n?/,We=/\*\*(.+?)\*\*/g,Ye=/`([^`]+)`/g,Ze=/^\x00CB(\d+)\x00$/,Ge=/^### (.+)$/,Qe=/^## (.+)$/,Xe=/^# (.+)$/,et=/^[-*]\s+(.+)$/,tt=/^\d+\.\s+(.+)$/,Le=/^\|(.+)\|$/,Ie=/^\|[\s:-]+\|$/;let nt=0;function F(e){const t=[];let n=e.replace(Ve,i=>{if(we.test(i)){const p=i.replace(we,"").replace(be,"").trim(),u=`mermaid-${++nt}`;t.push(`<pre class="mermaid" id="${u}">${d(p)}</pre>`)}else{const p=i.replace(Ke,"").replace(be,"");t.push(`<pre><code>${d(p)}</code></pre>`)}return`\0CB${t.length-1}\0`});n=d(n),n=n.replace(We,"<strong>$1</strong>").replace(Ye,"<code>$1</code>");const o=n.split(`
`),a=[];let c=!1,l=!1;function g(){c&&(a.push("</ul>"),c=!1),l&&(a.push("</ol>"),l=!1)}let s=0;for(;s<o.length;){const i=o[s].trim(),p=i.match(Ze);if(p){g(),a.push(t[parseInt(p[1])]),s++;continue}if(Le.test(i)){g();const y=[];for(;s<o.length&&Le.test(o[s].trim());)y.push(o[s].trim()),s++;if(y.length>=2){const b=Ie.test(y[1]),L=b?y[0]:null,N=b?2:0;let T='<table class="md-table">';if(L){const j=L.slice(1,-1).split("|").map(B=>B.trim());T+="<thead><tr>"+j.map(B=>`<th>${B}</th>`).join("")+"</tr></thead>"}T+="<tbody>";for(let j=N;j<y.length;j++){if(Ie.test(y[j]))continue;const B=y[j].slice(1,-1).split("|").map(H=>H.trim());T+="<tr>"+B.map(H=>`<td>${H}</td>`).join("")+"</tr>"}T+="</tbody></table>",a.push(T)}else a.push(`<p>${y[0]}</p>`);continue}const u=i.match(Ge);if(u){g(),a.push(`<h3>${u[1]}</h3>`),s++;continue}const h=i.match(Qe);if(h){g(),a.push(`<h2>${h[1]}</h2>`),s++;continue}const f=i.match(Xe);if(f){g(),a.push(`<h1>${f[1]}</h1>`),s++;continue}const m=i.match(et);if(m){l&&(a.push("</ol>"),l=!1),c||(a.push("<ul>"),c=!0),a.push(`<li>${m[1]}</li>`),s++;continue}const v=i.match(tt);if(v){c&&(a.push("</ul>"),c=!1),l||(a.push("<ol>"),l=!0),a.push(`<li>${v[1]}</li>`),s++;continue}g(),i===""?a.push(""):a.push(`<p>${i}</p>`),s++}return g(),a.join(`
`)}async function st(e){const t=window.__mermaid;if(!t)return;const n=e.querySelectorAll("pre.mermaid");if(n.length!==0)try{await t.run({nodes:n})}catch(o){console.warn("Mermaid render failed:",o)}}function X(e,t,n,o,a){if(!o&&!a)return"";const c=o?F(o):'<span class="phase-empty">Not yet documented</span>';return`
    <div class="lifecycle-phase ${n} ${a?"active":""}">
      <div class="phase-header">
        <span class="phase-icon">${t}</span>
        <span class="phase-label">${e}</span>
      </div>
      <div class="phase-body">${c}</div>
    </div>
  `}function Ce(e){return e.length===0?"":e.map(t=>{var n;return`
    <div class="review-entry ${d(t.status)}">
      <div class="review-header">
        <span class="badge ${t.status==="approved"?"review-approved":"review-changes"}">
          ${t.status==="approved"?"Approved":"Changes Requested"}
        </span>
        <span class="review-meta">${d(t.reviewer)} &middot; ${d((n=t.timestamp)==null?void 0:n.slice(0,16))}</span>
      </div>
      <div class="review-comment">${F(t.comment||"")}</div>
    </div>
  `}).join("")}function at(e){return e.length===0?"":e.map(t=>{var n;return`
    <div class="review-entry ${t.status==="pass"?"approved":"changes_requested"}">
      <div class="review-header">
        <span class="badge ${t.status==="pass"?"review-approved":"review-changes"}">
          ${t.status==="pass"?"Pass":"Fail"}
        </span>
        <span class="review-meta">${d(t.tester)} &middot; ${d((n=t.timestamp)==null?void 0:n.slice(0,16))}</span>
      </div>
      ${t.lint?`<div class="test-output"><strong>Lint:</strong> <pre>${d(t.lint)}</pre></div>`:""}
      ${t.build?`<div class="test-output"><strong>Build:</strong> <pre>${d(t.build)}</pre></div>`:""}
      ${t.tests?`<div class="test-output"><strong>Tests:</strong> <pre>${d(t.tests)}</pre></div>`:""}
      ${t.comment?`<div class="review-comment">${F(t.comment)}</div>`:""}
    </div>
  `}).join("")}async function ne(e,t,n){for(const o of Array.from(t)){if(!o.type.startsWith("image/"))continue;const a=new FileReader,c=await new Promise(l=>{a.onload=()=>l(a.result),a.readAsDataURL(o)});await fetch(`/api/task/${e}/attachment?project=${encodeURIComponent(n)}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({filename:o.name,data:c})})}R(e,n)}async function R(e,t){var c;const n=document.getElementById("modal-overlay"),o=document.getElementById("modal-content");o.innerHTML='<div style="color:#94a3b8">Loading...</div>',n.classList.remove("hidden");try{const l=t?`?project=${encodeURIComponent(t)}`:"",s=await(await fetch(`/api/task/${e}${l}`)).json(),i=ae(s.tags),p=i.length?`<div class="modal-tags">${i.map(r=>`<span class="tag">${d(r)}</span>`).join("")}</div>`:"",u=[`<strong>Project:</strong> ${d(s.project)}`,`<strong>Status:</strong> ${d(s.status)}`,`<strong>Priority:</strong> ${d(s.priority)}`,`<strong>Created:</strong> ${((c=s.created_at)==null?void 0:c.slice(0,10))||"-"}`,s.started_at?`<strong>Started:</strong> ${s.started_at.slice(0,10)}`:"",s.planned_at?`<strong>Planned:</strong> ${s.planned_at.slice(0,10)}`:"",s.reviewed_at?`<strong>Reviewed:</strong> ${s.reviewed_at.slice(0,10)}`:"",s.tested_at?`<strong>Tested:</strong> ${s.tested_at.slice(0,10)}`:"",s.completed_at?`<strong>Completed:</strong> ${s.completed_at.slice(0,10)}`:""].filter(Boolean).join(" &nbsp;|&nbsp; "),h={1:{labels:["Req","Impl","Done"],statuses:["todo","impl","done"]},2:{labels:["Req","Plan","Impl","Review","Done"],statuses:["todo","plan","impl","impl_review","done"]},3:{labels:["Req","Plan","Plan Rev","Impl","Impl Rev","Test","Done"],statuses:["todo","plan","plan_review","impl","impl_review","test","done"]}},f=h[s.level]||h[3],m=Math.max(0,f.statuses.indexOf(s.status)),v=`
      <div class="lifecycle-progress">
        <span class="level-indicator">L${s.level}</span>
        ${f.labels.map((r,$)=>`
          <div class="progress-step ${$<m?"completed":""} ${$===m?"current":""}">
            <div class="step-dot"></div>
            <span class="step-label">${r}</span>
          </div>
        `).join('<div class="progress-line"></div>')}
      </div>
    `,y=C(s.attachments),b=y.length>0?`<div class="attachments-grid">${y.map(r=>`<div class="attachment-thumb" data-stored="${d(r.storedName)}">
            <img src="${d(r.url)}" alt="${d(r.filename)}" loading="lazy" />
            <button class="attachment-remove" data-id="${e}" data-name="${d(r.storedName)}" title="Remove">&times;</button>
            <span class="attachment-name">${d(r.filename)}</span>
          </div>`).join("")}</div>`:"",L=s.description?F(s.description):'<span class="phase-empty">Not yet documented</span>',N=[1,2,3].map(r=>`<option value="${r}" ${r===s.level?"selected":""}>L${r}</option>`).join(""),T=`
      <div class="lifecycle-phase phase-requirement ${m===0?"active":""}">
        <div class="phase-header">
          <span class="phase-icon">📋</span>
          <span class="phase-label">Requirements</span>
          <select class="level-select" id="level-select" title="Pipeline Level">${N}</select>
          <button class="phase-edit-btn" id="req-edit-btn" title="Edit">&#9998;</button>
        </div>
        <div class="phase-body" id="req-body-view">
          ${L}
          ${b}
        </div>
        <div class="phase-body hidden" id="req-body-edit">
          <textarea id="req-textarea" rows="8">${(s.description||"").replace(/</g,"&lt;")}</textarea>
          <div class="attachment-drop-zone" id="attachment-drop-zone">
            <span>📎 Drop images here or click to attach</span>
            <input type="file" id="attachment-input" accept="image/*" multiple hidden />
          </div>
          ${b?`<div id="edit-attachments">${b}</div>`:""}
          <div class="phase-edit-actions">
            <button class="phase-save-btn" id="req-save-btn">Save</button>
            <button class="phase-cancel-btn" id="req-cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    `,j=X("Plan","🗺️","phase-plan",s.plan,m===1&&!s.plan);let B="";s.decision_log&&(B=X("Decision Log","🧭","phase-decision-log",s.decision_log,!1));const H=C(s.plan_review_comments),ie=Ce(H);let ce="";(ie||m===2)&&(ce=`
        <div class="lifecycle-phase phase-plan-review ${m===2?"active":""}">
          <div class="phase-header">
            <span class="phase-icon">🔍</span>
            <span class="phase-label">Plan Review</span>
            ${s.plan_review_count>0?`<span class="review-count">${s.plan_review_count} review(s)</span>`:""}
          </div>
          <div class="phase-body">${ie||'<span class="phase-empty">Awaiting plan review</span>'}</div>
        </div>
      `);const Pe=X("Implementation","🔨","phase-impl",s.implementation_notes,m===3&&!s.implementation_notes),xe=C(s.review_comments),de=Ce(xe);let le="";(de||m===4)&&(le=`
        <div class="lifecycle-phase phase-review ${m===4?"active":""}">
          <div class="phase-header">
            <span class="phase-icon">📝</span>
            <span class="phase-label">Implementation Review</span>
            ${s.impl_review_count>0?`<span class="review-count">${s.impl_review_count} review(s)</span>`:""}
          </div>
          <div class="phase-body">${de||'<span class="phase-empty">Awaiting implementation review</span>'}</div>
        </div>
      `);const De=C(s.test_results),re=at(De);let pe="";(re||m===5)&&(pe=`
        <div class="lifecycle-phase phase-test ${m===5?"active":""}">
          <div class="phase-header">
            <span class="phase-icon">🧪</span>
            <span class="phase-label">Test Results</span>
          </div>
          <div class="phase-body">${re||'<span class="phase-empty">Awaiting test execution</span>'}</div>
        </div>
      `);const Z=C(s.agent_log);let me="";if(Z.length>0){let r=function(E){if(!E)return{name:"",model:null};const M=E.toLowerCase();for(const Q of $){const A=M.lastIndexOf(Q);if(A>0){let q=A;for(;q>0&&(E[q-1]==="-"||E[q-1]==="_");)q--;return{name:E.slice(0,q),model:E.slice(A)}}}return{name:E,model:null}};var a=r;const $=["opus","sonnet","haiku","gemini","copilot","gpt"],I=Z.map(E=>{var $e;const{name:M,model:Q}=r(E.agent||""),A=E.model||Q,q=A?`<span class="badge model-tag model-${d(A.toLowerCase())}">${d(A)}</span>`:"";return`
          <div class="agent-log-entry">
            <span class="agent-log-time">${d(($e=E.timestamp)==null?void 0:$e.slice(0,16))}</span>
            <span class="badge agent-tag">${d(M||E.agent)}</span>
            ${q}
            <span class="agent-log-msg">${d(E.message)}</span>
          </div>
        `}).join("");me=`
        <details class="lifecycle-phase phase-agent-log">
          <summary class="phase-header">
            <span class="phase-icon">🤖</span>
            <span class="phase-label">Agent Log</span>
            <span class="review-count">${Z.length} entries</span>
          </summary>
          <div class="phase-body agent-log-body">${I}</div>
        </details>
      `}const ue=C(s.notes),Oe=ue.map(r=>{var $;return`
      <div class="note-entry">
        <div class="note-header">
          <span class="note-author">${d(r.author||"user")}</span>
          <span class="note-time">${d(($=r.timestamp)==null?void 0:$.slice(0,16).replace("T"," "))}</span>
          <button class="note-delete" data-note-id="${d(String(r.id))}" title="Delete">&times;</button>
        </div>
        <div class="note-text">${F(r.text||"")}</div>
      </div>
    `}).join(""),Ne=`
      <div class="notes-section">
        <div class="notes-header">
          <span>Notes</span>
          <span class="notes-count">${ue.length}</span>
        </div>
        <div class="notes-list">${Oe}</div>
        <form class="note-form" id="note-form">
          <textarea id="note-input" rows="2" placeholder="Add a note... (supports markdown)"></textarea>
          <button type="submit" class="note-submit">Add Note</button>
        </form>
      </div>
    `;o.innerHTML=`
      <h1>#${s.id} ${d(s.title)}</h1>
      <div class="modal-meta">${u}</div>
      ${p}
      ${v}
      <div class="lifecycle-sections">
        ${T}
        ${j}
        ${B}
        ${ce}
        ${Pe}
        ${le}
        ${pe}
        ${me}
      </div>
      ${Ne}
      <div class="modal-danger-zone">
        <button class="delete-task-btn" id="delete-task-btn">Delete Card</button>
      </div>
    `,st(o);const ve=document.getElementById("level-select");ve.addEventListener("change",async()=>{const r=parseInt(ve.value);await fetch(`/api/task/${e}?project=${encodeURIComponent(s.project)}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({level:r})}),R(e,s.project)}),document.getElementById("delete-task-btn").addEventListener("click",async()=>{confirm(`Delete card #${s.id} "${s.title}"?`)&&(await fetch(`/api/task/${e}?project=${encodeURIComponent(s.project)}`,{method:"DELETE"}),document.getElementById("modal-overlay").classList.add("hidden"),O())});const He=document.getElementById("req-edit-btn"),ge=document.getElementById("req-body-view"),he=document.getElementById("req-body-edit"),G=document.getElementById("req-textarea"),fe=document.getElementById("req-save-btn"),ke=document.getElementById("req-cancel-btn");He.addEventListener("click",()=>{ge.classList.add("hidden"),he.classList.remove("hidden"),G.focus()}),ke.addEventListener("click",()=>{G.value=s.description||"",he.classList.add("hidden"),ge.classList.remove("hidden")}),fe.addEventListener("click",async()=>{const r=G.value;fe.textContent="Saving...",await fetch(`/api/task/${e}?project=${encodeURIComponent(s.project)}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({description:r})}),R(e,s.project)});const _=document.getElementById("attachment-drop-zone"),k=document.getElementById("attachment-input");_&&k&&(_.addEventListener("click",()=>k.click()),_.addEventListener("dragover",r=>{r.preventDefault(),_.classList.add("drop-active")}),_.addEventListener("dragleave",()=>{_.classList.remove("drop-active")}),_.addEventListener("drop",async r=>{var I;r.preventDefault(),_.classList.remove("drop-active");const $=(I=r.dataTransfer)==null?void 0:I.files;$&&await ne(e,$,s.project)}),k.addEventListener("change",async()=>{k.files&&await ne(e,k.files,s.project)})),o.querySelectorAll(".attachment-remove").forEach(r=>{r.addEventListener("click",async $=>{$.stopPropagation();const I=r,E=I.dataset.id,M=I.dataset.name;await fetch(`/api/task/${E}/attachment/${encodeURIComponent(M)}?project=${encodeURIComponent(s.project)}`,{method:"DELETE"}),R(e,s.project)})});const Me=document.getElementById("note-form"),ye=document.getElementById("note-input");Me.addEventListener("submit",async r=>{r.preventDefault();const $=ye.value.trim();$&&(ye.disabled=!0,await fetch(`/api/task/${e}/note?project=${encodeURIComponent(s.project)}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:$})}),R(e,s.project))}),o.querySelectorAll(".note-delete").forEach(r=>{r.addEventListener("click",async $=>{$.stopPropagation();const I=r.dataset.noteId;await fetch(`/api/task/${e}/note/${I}?project=${encodeURIComponent(s.project)}`,{method:"DELETE"}),R(e,s.project)})})}catch{o.innerHTML='<div style="color:#ef4444">Failed to load</div>'}}async function Y(){const e=document.getElementById("board"),t=S?`?project=${encodeURIComponent(S)}`:"";try{const o=await(await fetch(`/api/board${t}`)).json();Te(o.projects),e.innerHTML=ee.map(l=>ze(l.key,l.label,l.icon,o[l.key])).join("");const a=o.todo.length+o.plan.length+o.plan_review.length+o.impl.length+o.impl_review.length+o.test.length+o.done.length;document.getElementById("count-summary").textContent=`${o.done.length}/${a} completed`,e.querySelectorAll(".card").forEach(l=>{l.addEventListener("click",g=>{const s=g.target.closest(".card-copy-btn");if(s){g.stopPropagation(),navigator.clipboard.writeText(s.dataset.copy).then(()=>{const u=s.textContent;s.textContent="✓",setTimeout(()=>{s.textContent=u},1e3)});return}const i=parseInt(l.dataset.id),p=l.dataset.project;R(i,p)})}),it(),W();const c=document.getElementById("add-card-btn");c&&c.addEventListener("click",l=>{l.stopPropagation(),document.getElementById("add-card-overlay").classList.remove("hidden"),document.getElementById("add-title").focus()})}catch(n){console.error("loadBoard failed:",n),e.innerHTML=`
      <div style="grid-column:1/-1;display:flex;align-items:center;justify-content:center;color:#ef4444;font-size:0.9rem;padding:48px">
        Cannot find .claude/kanban.db
      </div>
    `}}async function V(){const e=document.getElementById("list-view"),t=S?`?project=${encodeURIComponent(S)}`:"";try{const o=await(await fetch(`/api/board${t}`)).json();Te(o.projects);const a=[];for(const i of ee)for(const p of o[i.key])a.push(p);const c=x==="default"?[...a].sort((i,p)=>p.id-i.id):Se(a),l=c.length,g=c.filter(i=>i.status==="done").length;document.getElementById("count-summary").textContent=`${g}/${l} completed`;const s=c.map(i=>{var f,m;const p=Re(i.priority),h=ae(i.tags).map(v=>`<span class="tag">${d(v)}</span>`).join("");return`
        <tr class="status-${d(i.status)}" data-id="${i.id}" data-project="${d(i.project)}" data-completed-at="${d(i.completed_at)}">
          <td class="col-id">#${i.id}</td>
          <td class="col-title">${d(i.title)}</td>
          <td>
            <select class="list-status-select" data-id="${i.id}" data-field="status">
              ${ee.map(v=>`<option value="${v.key}" ${v.key===i.status?"selected":""}>${v.icon} ${v.label}</option>`).join("")}
            </select>
          </td>
          <td>
            <select class="list-level-select" data-id="${i.id}" data-field="level">
              ${[1,2,3].map(v=>`<option value="${v}" ${v===i.level?"selected":""}>L${v}</option>`).join("")}
            </select>
          </td>
          <td>
            <select class="list-priority-select ${p}" data-id="${i.id}" data-field="priority">
              ${["high","medium","low"].map(v=>`<option value="${v}" ${v===i.priority?"selected":""}>${v[0].toUpperCase()+v.slice(1)}</option>`).join("")}
            </select>
          </td>
          <td class="list-date">${d(i.project)}</td>
          <td>${h}</td>
          <td class="list-date">${((f=i.created_at)==null?void 0:f.slice(0,10))||""}</td>
          <td class="list-date">${((m=i.completed_at)==null?void 0:m.slice(0,10))||""}</td>
        </tr>
      `}).join("");e.innerHTML=`
      <table class="list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Level</th>
            <th>Priority</th>
            <th>Project</th>
            <th>Tags</th>
            <th>Created</th>
            <th>Completed</th>
          </tr>
        </thead>
        <tbody>${s}</tbody>
      </table>
    `,e.querySelectorAll("select").forEach(i=>{i.addEventListener("change",async p=>{p.stopPropagation();const u=i,h=u.dataset.id,f=u.dataset.field;let m=u.value;f==="level"&&(m=parseInt(m));const v=u.closest("tr"),y=(v==null?void 0:v.dataset.project)||"",b=await fetch(`/api/task/${h}?project=${encodeURIComponent(y)}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({[f]:m})});if(!b.ok){const L=await b.json().catch(()=>({}));L.error&&oe(L.error),V();return}V()})}),e.querySelectorAll(".col-title").forEach(i=>{i.addEventListener("click",p=>{p.stopPropagation();const u=i.closest("tr"),h=parseInt(u.dataset.id),f=u.dataset.project;R(h,f)})}),W()}catch(n){console.error("loadListView failed:",n),e.innerHTML=`
      <div style="display:flex;align-items:center;justify-content:center;color:#ef4444;font-size:0.9rem;padding:48px">
        Failed to load task list
      </div>
    `}}function Te(e){const t=document.getElementById("project-filter");if(e.length<=1){t.innerHTML=e[0]?`<span class="project-label">${d(e[0])}</span>`:"";return}const n=e.map(o=>`<option value="${d(o)}" ${o===S?"selected":""}>${d(o)}</option>`).join("");t.innerHTML=`
    <select id="project-select">
      <option value="">All Projects</option>
      ${n}
    </select>
  `,document.getElementById("project-select").addEventListener("change",o=>{S=o.target.value||null,O()})}function je(e,t){const n=[...e.querySelectorAll(".card:not(.dragging)")];for(const o of n){const a=o.getBoundingClientRect(),c=a.top+a.height/2;if(t<c)return o}return null}function z(){document.querySelectorAll(".drop-indicator").forEach(e=>e.remove())}function ot(e,t){z();const n=document.createElement("div");n.className="drop-indicator",t?e.insertBefore(n,t):e.appendChild(n)}function it(){const e=document.querySelectorAll(".card"),t=document.querySelectorAll(".column-body");e.forEach(n=>{n.addEventListener("dragstart",o=>{const a=o,c=n;a.dataTransfer.setData("text/plain",`${c.dataset.project}:${c.dataset.id}`),c.classList.add("dragging"),te=!0}),n.addEventListener("dragend",()=>{n.classList.remove("dragging"),z(),te=!1})}),t.forEach(n=>{n.addEventListener("dragover",o=>{o.preventDefault();const a=n;a.classList.add("drag-over");const c=je(a,o.clientY);ot(a,c)}),n.addEventListener("dragleave",o=>{const a=n;a.contains(o.relatedTarget)||(a.classList.remove("drag-over"),z())}),n.addEventListener("drop",async o=>{o.preventDefault();const a=n;a.classList.remove("drag-over"),z();const c=o,l=c.dataTransfer.getData("text/plain"),g=l.lastIndexOf(":"),s=g>=0?l.slice(0,g):"",i=parseInt(g>=0?l.slice(g+1):l),p=a.dataset.column,u=je(a,c.clientY),h=[...a.querySelectorAll(".card:not(.dragging)")];let f=null,m=null;if(u){m=parseInt(u.dataset.id);const y=h.indexOf(u);y>0&&(f=parseInt(h[y-1].dataset.id))}else h.length>0&&(f=parseInt(h[h.length-1].dataset.id));const v=await fetch(`/api/task/${i}/reorder?project=${encodeURIComponent(s)}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:p,afterId:f,beforeId:m})});if(!v.ok){const y=await v.json().catch(()=>({}));y.error&&oe(y.error)}Y()})})}function oe(e){const t=document.querySelector(".toast");t&&t.remove();const n=document.createElement("div");n.className="toast",n.textContent=e,document.body.appendChild(n),setTimeout(()=>n.remove(),3e3)}fetch("/api/info").then(e=>e.json()).then(e=>{e.projectName&&(document.title=`Kanban · ${e.projectName}`,document.querySelector("header h1").textContent=`Kanban · ${e.projectName}`)}).catch(()=>{});function Ae(e){se=e;const t=document.getElementById("board"),n=document.getElementById("list-view"),o=document.getElementById("tab-board"),a=document.getElementById("tab-list");e==="board"?(t.classList.remove("hidden"),n.classList.add("hidden"),o.classList.add("active"),a.classList.remove("active"),Y()):(t.classList.add("hidden"),n.classList.remove("hidden"),o.classList.remove("active"),a.classList.add("active"),V())}function O(){se==="board"?Y():V()}Y();document.getElementById("tab-board").addEventListener("click",()=>Ae("board"));document.getElementById("tab-list").addEventListener("click",()=>Ae("list"));setInterval(()=>{if(te)return;const e=!document.getElementById("modal-overlay").classList.contains("hidden"),t=!document.getElementById("add-card-overlay").classList.contains("hidden");!e&&!t&&O()},1e4);document.getElementById("refresh-btn").addEventListener("click",O);document.getElementById("search-input").addEventListener("input",e=>{_e=e.target.value.trim(),W()});document.getElementById("sort-select").addEventListener("change",e=>{x=e.target.value,O()});document.getElementById("hide-done-btn").addEventListener("click",()=>{D=!D,document.getElementById("hide-done-btn").classList.toggle("active",D),W()});document.getElementById("modal-close").addEventListener("click",()=>{document.getElementById("modal-overlay").classList.add("hidden")});document.getElementById("modal-overlay").addEventListener("click",e=>{e.target===e.currentTarget&&document.getElementById("modal-overlay").classList.add("hidden")});document.addEventListener("keydown",e=>{e.key==="Escape"&&(document.getElementById("modal-overlay").classList.add("hidden"),document.getElementById("add-card-overlay").classList.add("hidden"))});const K=document.getElementById("add-card-overlay");let w=[];function J(){const e=document.getElementById("add-attachment-preview");if(w.length===0){e.innerHTML="";return}e.innerHTML=w.map((t,n)=>`
    <div class="attachment-thumb">
      <img src="${URL.createObjectURL(t)}" alt="${t.name}" />
      <button class="attachment-remove" data-idx="${n}" title="Remove" type="button">&times;</button>
      <span class="attachment-name">${t.name}</span>
    </div>
  `).join(""),e.querySelectorAll(".attachment-remove").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation();const o=parseInt(t.dataset.idx);w.splice(o,1),J()})})}function qe(e){for(const t of Array.from(e))t.type.startsWith("image/")&&w.push(t);J()}document.getElementById("add-card-close").addEventListener("click",()=>{K.classList.add("hidden"),w=[],J()});K.addEventListener("click",e=>{e.target===e.currentTarget&&(K.classList.add("hidden"),w=[],J())});const P=document.getElementById("add-attachment-zone"),U=document.getElementById("add-attachment-input");P.addEventListener("click",()=>U.click());P.addEventListener("dragover",e=>{e.preventDefault(),P.classList.add("drop-active")});P.addEventListener("dragleave",()=>{P.classList.remove("drop-active")});P.addEventListener("drop",e=>{var n;e.preventDefault(),P.classList.remove("drop-active");const t=(n=e.dataTransfer)==null?void 0:n.files;t&&qe(t)});U.addEventListener("change",()=>{U.files&&qe(U.files),U.value=""});document.getElementById("add-card-form").addEventListener("submit",async e=>{e.preventDefault();const t=document.getElementById("add-title").value.trim();if(!t)return;const n=document.getElementById("add-priority").value,o=parseInt(document.getElementById("add-level").value)||3,a=document.getElementById("add-description").value.trim()||null,c=document.getElementById("add-tags").value.trim(),l=c?c.split(",").map(u=>u.trim()).filter(Boolean):null,g=S;if(!g){oe("Select a project first");return}const s=document.querySelector("#add-card-form .form-submit");s.textContent=w.length>0?"Creating...":"Add Card",s.disabled=!0;const p=await(await fetch("/api/task",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:t,priority:n,level:o,description:a,tags:l,project:g})})).json();w.length>0&&p.id&&await ne(p.id,w,g),w=[],s.textContent="Add Card",s.disabled=!1,document.getElementById("add-card-form").reset(),J(),K.classList.add("hidden"),O()});
