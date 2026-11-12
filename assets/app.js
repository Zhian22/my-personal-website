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
 // Christmas ID tracker persistence
 const stationList=document.getElementById('station-list');
 if(stationList){
   const key='mpw-stations';let stations=JSON.parse(localStorage.getItem(key)||'[]');
   const render=()=>{stationList.innerHTML='';stations.forEach((s,i)=>{const li=document.createElement('li');const span=document.createElement('span');span.textContent=s;const b=document.createElement('button');b.textContent='Remove';b.addEventListener('click',()=>{stations.splice(i,1);save();render()});li.append(span,b);stationList.append(li)})};
   const save=()=>localStorage.setItem(key,JSON.stringify(stations));render();
   document.getElementById('add-station').addEventListener('click',()=>{const inp=document.getElementById('station-input');if(inp.value.trim()){stations.push(inp.value.trim());inp.value='';save();render()}});
 }
});