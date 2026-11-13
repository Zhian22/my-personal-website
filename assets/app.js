document.addEventListener('DOMContentLoaded',()=>{
 const now=new Date();
 const today=document.getElementById('today');
 if(today) today.textContent=now.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'});
 document.querySelectorAll('.year').forEach(el=>el.textContent=new Date().getFullYear());
 const countdown=document.getElementById('countdown');
 if(countdown){const target=new Date('2026-12-18T00:00:00');const diff=Math.ceil((target-new Date(new Date().toDateString()))/86400000);countdown.textContent=diff>0?diff:diff===0?'Today!':'0';}
 // Exam checklist persistence
 const examList=document.getElementById('exam-list');
 if(examList){
   const key='mpw-exam-items'; let items=JSON.parse(localStorage.getItem(key)||'null')||Array.from(examList.querySelectorAll('label')).map(x=>({text:x.textContent.trim(),done:false}));
   const render=()=>{examList.innerHTML='';items.forEach((it,i)=>{const l=document.createElement('label');const cb=document.createElement('input');cb.type='checkbox';cb.checked=it.done;cb.addEventListener('change',()=>{items[i].done=cb.checked;save();render()});l.append(cb,document.createTextNode(it.text));examList.append(l)});const c=document.getElementById('exam-count');if(c)c.textContent=items.filter(x=>x.done).length+' completed';};
   const save=()=>localStorage.setItem(key,JSON.stringify(items));render();
   document.getElementById('add-exam').addEventListener('click',()=>{const inp=document.getElementById('new-exam');if(inp.value.trim()){items.push({text:inp.value.trim(),done:false});inp.value='';save();render()}});
 }
 // Goals persistence
 const goalList=document.getElementById('goal-list');
 if(goalList){
   const key='mpw-goals';let goals=JSON.parse(localStorage.getItem(key)||'[]');
   const render=()=>{goalList.innerHTML='';if(!goals.length){const e=document.createElement('div');e.className='empty';e.textContent='No goals yet. Add your first goal below.';goalList.append(e)}goals.forEach((g,i)=>{const row=document.createElement('div');row.className='goal-item'+(g.done?' done':'');const cb=document.createElement('input');cb.type='checkbox';cb.checked=g.done;cb.addEventListener('change',()=>{goals[i].done=cb.checked;save();render()});const s=document.createElement('span');s.textContent=g.text;const del=document.createElement('button');del.textContent='×';del.setAttribute('aria-label','Delete goal');del.addEventListener('click',()=>{goals.splice(i,1);save();render()});row.append(cb,s,del);goalList.append(row)});const c=document.getElementById('goal-count');if(c)c.textContent=goals.length+' goals'};
   const save=()=>localStorage.setItem(key,JSON.stringify(goals));render();
   document.getElementById('add-goal').addEventListener('click',()=>{const inp=document.getElementById('new-goal');if(inp.value.trim()){goals.push({text:inp.value.trim(),done:false});inp.value='';save();render()}});
 }

 // Messenger-style MY FRIENDS directory: contacts remain private in browser storage.
 const friendsList=document.getElementById('friends-list');
 if(friendsList){
   const key='mpw-private-friends-v1';let friends=[];try{friends=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(friends))friends=[];}catch(e){}
   let selectedId=null;const save=()=>localStorage.setItem(key,JSON.stringify(friends));const initials=name=>name.trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase();const zoomUrl=f=>f.link||'https://zoom.us/signin';
   const makeAvatar=f=>{const el=document.createElement('div');el.className='friend-avatar';if(f.photo){const img=document.createElement('img');img.src=f.photo;img.alt=f.name+' profile';img.referrerPolicy='no-referrer';img.onerror=()=>{el.textContent=initials(f.name);};el.append(img);}else el.textContent=initials(f.name)||'♡';return el;};
   const showSelected=()=>{const f=friends.find(x=>x.id===selectedId);const empty=document.getElementById('chat-empty'),active=document.getElementById('chat-active');if(!f){empty.hidden=false;active.hidden=true;return;}empty.hidden=true;active.hidden=false;const av=document.getElementById('chat-avatar');av.innerHTML='';if(f.photo){const img=document.createElement('img');img.src=f.photo;img.alt=f.name+' profile';img.onerror=()=>{av.textContent=initials(f.name);};av.append(img);}else av.textContent=initials(f.name)||'♡';document.getElementById('chat-name').textContent=f.name;document.getElementById('chat-intro-name').textContent=f.name;document.getElementById('chat-zoom').href=zoomUrl(f);document.getElementById('chat-start').href=zoomUrl(f);};
   const render=()=>{friendsList.innerHTML='';const q=(document.getElementById('friends-search')?.value||'').toLowerCase();const filtered=friends.filter(f=>f.name.toLowerCase().includes(q));if(!filtered.length){const empty=document.createElement('div');empty.className='friend-empty';empty.textContent=friends.length?'No matching friends.':'No friends added yet. Use the form below to add your first Zoom contact.';friendsList.append(empty);}filtered.forEach(f=>{const row=document.createElement('div');row.className='messenger-friend'+(f.id===selectedId?' selected':'');row.setAttribute('role','button');row.tabIndex=0;row.append(makeAvatar(f));const copy=document.createElement('div');copy.className='messenger-friend-copy';const name=document.createElement('strong');name.textContent=f.name;const sub=document.createElement('small');sub.textContent='Zoom contact';copy.append(name,sub);row.append(copy);const open=document.createElement('a');open.className='friend-open-mini';open.textContent='↗';open.href=zoomUrl(f);open.target='_blank';open.rel='noopener noreferrer';open.setAttribute('aria-label','Open Zoom for '+f.name);open.addEventListener('click',e=>e.stopPropagation());row.append(open);const select=()=>{selectedId=f.id;render();showSelected();};row.addEventListener('click',select);row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select();}});friendsList.append(row);});if(selectedId&&!friends.some(x=>x.id===selectedId))selectedId=null;showSelected();};
   document.getElementById('friend-add')?.addEventListener('click',()=>{const name=document.getElementById('friend-name'),photo=document.getElementById('friend-photo'),link=document.getElementById('friend-link');if(!name.value.trim()){name.focus();return;}let safeLink='';try{if(link.value.trim()){const u=new URL(link.value.trim());if(u.protocol==='https:'&&/(^|\.)zoom\.us$/i.test(u.hostname))safeLink=u.href;}}catch(e){}let safePhoto='';try{if(photo.value.trim()){const u=new URL(photo.value.trim());if(u.protocol==='https:')safePhoto=u.href;}}catch(e){}const friend={id:Date.now().toString(36)+Math.random().toString(36).slice(2,7),name:name.value.trim(),photo:safePhoto,link:safeLink};friends.push(friend);selectedId=friend.id;save();name.value='';photo.value='';link.value='';render();});
   document.getElementById('friends-search')?.addEventListener('input',render);render();
 }

 // Christmas ID tracker persistence
 const stationList=document.getElementById('station-list');
 if(stationList){
   const key='mpw-stations';let stations=JSON.parse(localStorage.getItem(key)||'[]');
   const render=()=>{stationList.innerHTML='';stations.forEach((s,i)=>{const li=document.createElement('li');const span=document.createElement('span');span.textContent=s;const b=document.createElement('button');b.textContent='Remove';b.addEventListener('click',()=>{stations.splice(i,1);save();render()});li.append(span,b);stationList.append(li)})};
   const save=()=>localStorage.setItem(key,JSON.stringify(stations));render();
   document.getElementById('add-station').addEventListener('click',()=>{const inp=document.getElementById('station-input');if(inp.value.trim()){stations.push(inp.value.trim());inp.value='';save();render()}});
 }

 // Global site tools: theme preference, quick search, accessible mobile navigation.
 const main=document.querySelector('main');
 if(main){const skip=document.createElement('a');skip.className='skip-link';skip.href='#main-content';skip.textContent='Skip to main content';document.body.prepend(skip);main.id='main-content';}
 const topbar=document.querySelector('.topbar');
 if(topbar){
   const tools=document.createElement('div');tools.className='global-tools';
   const menu=document.createElement('button');menu.type='button';menu.className='global-tool mobile-menu-toggle';menu.textContent='☰ Menu';menu.setAttribute('aria-label','Open navigation menu');menu.setAttribute('aria-expanded','false');
   menu.addEventListener('click',()=>{const open=document.body.classList.toggle('nav-open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'✕ Close':'☰ Menu';});
   const theme=document.createElement('button');theme.type='button';theme.className='global-tool';theme.id='theme-toggle';
   document.body.dataset.theme=localStorage.getItem('mpw-theme')||'light';
   const paintTheme=()=>{theme.textContent=document.body.dataset.theme==='dark'?'☀ Light':'◐ Dark';theme.setAttribute('aria-label',document.body.dataset.theme==='dark'?'Switch to light theme':'Switch to dark theme');};
   theme.addEventListener('click',()=>{document.body.dataset.theme=document.body.dataset.theme==='dark'?'light':'dark';localStorage.setItem('mpw-theme',document.body.dataset.theme);paintTheme();});paintTheme();
   const search=document.createElement('button');search.type='button';search.className='global-tool';search.textContent='⌕ Search';search.setAttribute('aria-label','Search this website');
   tools.append(menu,search,theme);topbar.append(tools);
   const dialog=document.createElement('dialog');dialog.className='site-search-dialog';dialog.setAttribute('aria-label','Search website');
   dialog.innerHTML='<div class="search-dialog-inner"><div class="search-dialog-head"><strong>Search your workspace</strong><button type="button" aria-label="Close search">Close ✕</button></div><input class="site-search-input" type="search" placeholder="Search courses, pages or units…" aria-label="Search pages and units"><div class="site-search-results" aria-live="polite"></div><p class="search-hint">Tip: Press / or Ctrl/⌘ + K to open search. Press Escape to close.</p></div>';
   document.body.append(dialog);
   const input=dialog.querySelector('input'),results=dialog.querySelector('.site-search-results');
   const destinations=[['Overview','Your personal dashboard','index.html'],['German Learning','German lessons and study areas','german.html'],['Deutsch 3 A2.2','39-unit course index','deutsch3.html'],['Exam Center','Review checklist and exam preparation','exams.html'],['Trackers','Vacation and Christmas ID trackers','trackers.html'],['Goals & Projects','Personal goals and action list','goals.html'],['MY FRIENDS','Friends directory','friends.html'],['MY APPS','App library','apps.html']];
   const unitNames=['Ihren Feierabend beschreiben','Ihre Wohngegend beschreiben','Über Aktivitäten von gestern sprechen','Über Freizeit heute und früher sprechen','Sagen, wo Sie früher gearbeitet haben','Über Ihr Studium sprechen','Über Stellenanzeigen sprechen','Ihre Routine am Morgen beschreiben','Sagen, was Sie jeden Tag tun','Wiederholung','Ihre Routine am Abend beschreiben','Über Lesestoff sprechen','Jemandem gratulieren','Sich freuen und Danke sagen','Sich verabreden','Sagen, wie Sie sich fühlen und wie krank Sie sind','Sagen, was gut für die Gesundheit ist','Über tägliches Essen und Trinken sprechen','Sagen, wie Sie fit bleiben','Wiederholung','Sagen, was man als Tourist macht','Über Sehenswürdigkeiten sprechen','Sich in einer Stadt zurechtfinden','Empfehlen, was ein Tourist machen kann','Einen Termin vereinbaren, absagen oder verschieben','Eine Besprechung organisieren','Ein Geschäftsessen planen','Sagen, wo Sie Urlaub verbringen und was Sie mitnehmen','Über das Wetter sprechen','Wiederholung','Sagen, was Sie im Urlaub machen','Aufgaben beschreiben','Projekte und Zeitpläne besprechen','Über Feedback und Mitarbeitermotivation sprechen','Eine Veranstaltung beschreiben','Sagen, was Sie vorhaben','Eine Sportveranstaltung beschreiben','Karten vorbestellen und Tickets kaufen','Über typische Imbisse sprechen'];
   unitNames.forEach((name,i)=>destinations.push(['Einheit '+(i+1),name,'unit.html?unit='+(i+1)]));
   const renderResults=()=>{const q=input.value.trim().toLocaleLowerCase();results.innerHTML='';const matches=destinations.filter(x=>(x[0]+' '+x[1]).toLocaleLowerCase().includes(q)).slice(0,12);if(!matches.length){const p=document.createElement('p');p.textContent='No matching pages. Try another word.';results.append(p);return;}matches.forEach(item=>{const a=document.createElement('a');a.href=item[2];const label=document.createElement('span');label.textContent=item[0];const detail=document.createElement('small');detail.textContent=item[1];a.append(label,detail);results.append(a);});};
   search.addEventListener('click',()=>{dialog.showModal();input.value='';renderResults();input.focus();});
   input.addEventListener('input',renderResults);
   dialog.querySelector('.search-dialog-head button').addEventListener('click',()=>dialog.close());
   dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
   document.addEventListener('keydown',e=>{if((e.key==='k'&&(e.metaKey||e.ctrlKey))||e.key==='/'){if(e.target.matches('input,textarea,select'))return;e.preventDefault();if(!dialog.open){dialog.showModal();input.focus();}}});
   results.addEventListener('click',e=>{if(e.target.closest('a'))dialog.close();});
 }

});