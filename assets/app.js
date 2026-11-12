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
});