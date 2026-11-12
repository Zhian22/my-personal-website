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

 // MY FRIENDS: private browser-local directory; entries are never uploaded to GitHub.
 const friendsList=document.getElementById('friends-list');
 if(friendsList){
   const key='mpw-private-friends-v1';
   let friends=[];try{friends=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(friends))friends=[];}catch(e){friends=[];}
   const save=()=>localStorage.setItem(key,JSON.stringify(friends));
   const initials=name=>name.trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase();
   const render=()=>{
     friendsList.innerHTML='';
     const q=(document.getElementById('friends-search')?.value||'').toLowerCase();
     const filtered=friends.filter(f=>f.name.toLowerCase().includes(q));
     if(!filtered.length){const empty=document.createElement('div');empty.className='friend-empty';empty.textContent=friends.length?'No matching friends. Try another name.':'Your private directory is ready. Add a contact using their exact Zoom display name and a Zoom link. Your entries stay in this browser and are not published to GitHub.';friendsList.append(empty);}
     filtered.forEach(f=>{
       const card=document.createElement('article');card.className='friend-card';
       const avatar=document.createElement('div');avatar.className='friend-avatar';
       if(f.photo){const img=document.createElement('img');img.src=f.photo;img.alt=f.name+' profile';img.referrerPolicy='no-referrer';img.onerror=()=>{avatar.textContent=initials(f.name);};avatar.append(img);}else avatar.textContent=initials(f.name)||'♡';
       const name=document.createElement('div');name.className='friend-name';name.textContent=f.name;
       const meta=document.createElement('div');meta.className='friend-meta';meta.textContent='Zoom contact';
       const actions=document.createElement('div');actions.className='friend-actions';
       const open=document.createElement('a');open.className='friend-open';open.textContent='Open Zoom';open.href=f.link||'https://zoom.us/signin';open.target='_blank';open.rel='noopener noreferrer';
       const remove=document.createElement('button');remove.className='friend-remove';remove.textContent='Remove';remove.addEventListener('click',()=>{friends=friends.filter(x=>x.id!==f.id);save();render();});
       actions.append(open,remove);card.append(avatar,name,meta,actions);friendsList.append(card);
     });
   };
   document.getElementById('friend-add')?.addEventListener('click',()=>{
     const name=document.getElementById('friend-name'),photo=document.getElementById('friend-photo'),link=document.getElementById('friend-link');
     if(!name.value.trim()){name.focus();return;}
     let safeLink='';try{if(link.value.trim()){const u=new URL(link.value.trim());if(u.protocol==='https:'&&/(^|\.)zoom\.us$/i.test(u.hostname))safeLink=u.href;}}catch(e){}
     let safePhoto='';try{if(photo.value.trim()){const u=new URL(photo.value.trim());if(u.protocol==='https:')safePhoto=u.href;}}catch(e){}
     friends.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,7),name:name.value.trim(),photo:safePhoto,link:safeLink});
     save();name.value='';photo.value='';link.value='';render();
   });
   document.getElementById('friends-search')?.addEventListener('input',render);
   render();
 }
\n // Christmas ID tracker persistence
 const stationList=document.getElementById('station-list');
 if(stationList){
   const key='mpw-stations';let stations=JSON.parse(localStorage.getItem(key)||'[]');
   const render=()=>{stationList.innerHTML='';stations.forEach((s,i)=>{const li=document.createElement('li');const span=document.createElement('span');span.textContent=s;const b=document.createElement('button');b.textContent='Remove';b.addEventListener('click',()=>{stations.splice(i,1);save();render()});li.append(span,b);stationList.append(li)})};
   const save=()=>localStorage.setItem(key,JSON.stringify(stations));render();
   document.getElementById('add-station').addEventListener('click',()=>{const inp=document.getElementById('station-input');if(inp.value.trim()){stations.push(inp.value.trim());inp.value='';save();render()}});
 }
});