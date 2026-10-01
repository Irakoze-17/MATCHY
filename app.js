const pages=[['Home','index.html','⌂'],['Community','community.html','◈'],['Match','match.html','✦'],['Discover','discover.html','◎'],['Spaces','spaces.html','▦'],['Friends','friends.html','♧'],['Messages','messages.html','◌'],['Library','library.html','▤'],['Profile','profile.html','◯'],['Settings','settings.html','⚙']];
const path=location.pathname.split('/').pop()||'index.html';
const isAuthPage=path==='auth.html';
const isLoggedIn=localStorage.getItem('matchyAuth')==='true';
const protectedPages=['index.html','community.html','match.html','discover.html','spaces.html','friends.html','messages.html','library.html','profile.html','settings.html','tutor.html'];
if(!isAuthPage && protectedPages.includes(path) && !isLoggedIn){location.replace('auth.html');}
if(isAuthPage && isLoggedIn){/* Stay on auth only when explicitly opened; forms can still be used. */}

function applyTheme(){
  const theme=localStorage.getItem('matchyTheme')||'light';
  document.documentElement.dataset.theme=theme;
  document.documentElement.style.colorScheme=theme;
}
applyTheme();

if(!isAuthPage){
  const active=path==='index.html'?'Home':(pages.find(p=>p[1]===path)||pages[0])[0];
  const profile=JSON.parse(localStorage.getItem('matchyProfile')||'{"name":"Student","username":"@student","avatar":"🦊"}');
  const sidebar=document.querySelector('.sidebar');
  const mobile=document.querySelector('.mobile-bar');
  const navHTML=pages.map(([name,url,icon])=>`<a href="${url}" class="${active===name?'active':''}"><span class="nav-icon">${icon}</span>${name}</a>`).join('');
  if(sidebar) sidebar.innerHTML=`<div class="brand"><img src="assets/matchy-logo.png" alt="Matchy"><div class="brand-name">Match<span>y</span></div></div><nav class="nav">${navHTML}</nav><a class="profile-mini" href="profile.html"><div class="avatar">${profile.avatar||'🦊'}</div><div><strong>${profile.name||'Student'}</strong><span>${profile.username||'@student'}</span></div></a>`;
  if(mobile) mobile.innerHTML=pages.slice(0,5).map(([name,url,icon])=>`<a href="${url}" class="${active===name?'active':''}"><span class="nav-icon">${icon}</span>${name}</a>`).join('');
}
function toast(msg){const t=document.querySelector('.toast');if(!t)return;t.textContent=msg;t.style.display='block';clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.style.display='none',2200)}
window.toast=toast;
function saveProfile(){const p={name:document.querySelector('#pname')?.value||'Student',username:document.querySelector('#pusername')?.value||'@student',avatar:document.querySelector('#pavatar')?.value||'🦊',bio:document.querySelector('#pbio')?.value||''};localStorage.setItem('matchyProfile',JSON.stringify(p));const a=JSON.parse(localStorage.getItem('matchyAccount')||'null');if(a){a.profile=p;localStorage.setItem('matchyAccount',JSON.stringify(a));}toast('Profile saved locally');}
window.saveProfile=saveProfile;
function wireTutor(){const form=document.querySelector('#tutorForm'),messages=document.querySelector('#tutorMessages');if(!form)return;const replies=['Good question. Before I give you the answer, what part of the problem do you already understand?','Let’s break it into smaller steps. What information are you given, and what are you being asked to find?','Try explaining the idea in your own words first. I’ll help you spot what is missing.','Think about a similar example you have solved before. Which rule or formula did you use?'];let n=0;function send(text){if(!text.trim())return;messages.insertAdjacentHTML('beforeend',`<div class="tutor-bubble me">${escapeHTML(text)}</div>`);setTimeout(()=>messages.insertAdjacentHTML('beforeend',`<div class="tutor-bubble ai">${replies[n++%replies.length]}</div>`),350);messages.scrollTop=messages.scrollHeight}form.addEventListener('submit',e=>{e.preventDefault();const i=form.querySelector('input');send(i.value);i.value=''});document.querySelectorAll('.quick-prompts button').forEach(b=>b.onclick=()=>send(b.textContent));}
function escapeHTML(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function wireSearch(){document.querySelectorAll('[data-search]').forEach(input=>input.addEventListener('input',()=>{const q=input.value.toLowerCase();document.querySelectorAll('[data-search-item]').forEach(x=>x.style.display=x.textContent.toLowerCase().includes(q)?'':'none')}))}
function wireDemoButtons(){document.querySelectorAll('[data-toast]').forEach(b=>b.addEventListener('click',()=>toast(b.dataset.toast)));document.querySelectorAll('.toggle').forEach(b=>b.addEventListener('click',()=>{b.classList.toggle('on');b.setAttribute('aria-pressed',b.classList.contains('on'));}));}
function wireTheme(){
  const light=document.querySelector('#themeLight'), dark=document.querySelector('#themeDark'); if(!light&&!dark)return;
  const current=localStorage.getItem('matchyTheme')||'light';
  const sync=()=>{const t=document.documentElement.dataset.theme||'light'; light?.classList.toggle('selected',t==='light');dark?.classList.toggle('selected',t==='dark');light?.setAttribute('aria-checked',t==='light');dark?.setAttribute('aria-checked',t==='dark');};
  light?.addEventListener('click',()=>{localStorage.setItem('matchyTheme','light');applyTheme();sync();toast('Light mode enabled');});
  dark?.addEventListener('click',()=>{localStorage.setItem('matchyTheme','dark');applyTheme();sync();toast('Dark mode enabled');});
  sync();
}
function signOut(){localStorage.removeItem('matchyAuth');location.href='auth.html';}
window.signOut=signOut;
document.addEventListener('DOMContentLoaded',()=>{wireTutor();wireSearch();wireDemoButtons();wireTheme();const profile=JSON.parse(localStorage.getItem('matchyProfile')||'{}');document.querySelectorAll('[data-profile-name]').forEach(x=>x.textContent=profile.name||'Student');});
