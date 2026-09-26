const state = {
  role: localStorage.getItem("ccRole") || "trainee",
  page: "Dashboard",
  user: JSON.parse(localStorage.getItem("ccUser") || '{"name":"Amit Maity","email":"amit@moes.gov.in"}')
};

const navConfig = {
 trainee: [
  ["MAIN","Dashboard","⌂"],["","My Courses","▣"],["","Learning Library","▤"],["","Assessments","✓"],["","Certificates","◇"],
  ["MY PROFILE","Professional Profile","◯"],["","Competency Map","◎"],["","Feedback","✦"],["","Notifications","◌"]
 ],
 trainer: [
  ["MAIN","Dashboard","⌂"],["","My Courses","▣"],["","Questionnaires","✓"],["","Trainer Library","▤"],
  ["MANAGE","Participants","◉"],["","Performance","◒"],["Competency Mapping","◎"],["","My Profile","◯"],["","Notifications","◌"]
 ],
 admin: [
  ["OVERVIEW","Dashboard","⌂"],["","User Approvals","♙"],["","User & Roles","◉"],["","Courses","▣"],["","Enrollments","↗"],
  ["ANALYTICS","Assessments","✓"],["","Certifications","◇"],["","Participation","◒"],["","Competency Mapping","◎"],
  ["PUBLISH","Announcements","✦"],["","Achievements","★"],["","Learning Content","▤"],["","Notifications","◌"]
 ]
};

function roleName(){return state.role.charAt(0).toUpperCase()+state.role.slice(1)}
function demoToast(msg){const t=document.getElementById("toast");if(!t)return;t.textContent=msg;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),2500)}
function roleBg(){return state.role==="trainee"?"assets/trainee-bg.svg":state.role==="trainer"?"assets/trainer-bg.svg":"assets/admin-bg.svg"}

function bootLogin(){
 const tabs=document.querySelectorAll(".role-tab");
 if(!tabs.length)return;
 tabs.forEach(b=>b.onclick=()=>{tabs.forEach(x=>x.classList.remove("active"));b.classList.add("active");document.getElementById("role").value=b.dataset.role});
 document.getElementById("togglePassword").onclick=()=>{const p=document.getElementById("password");p.type=p.type==="password"?"text":"password";document.getElementById("togglePassword").textContent=p.type==="password"?"Show":"Hide"};
 document.getElementById("loginForm").onsubmit=e=>{
  e.preventDefault();
  const email=document.getElementById("email").value.trim();
  if(!email){return}
  state.role=document.getElementById("role").value;
  state.user={name:email.split("@")[0].replace(/[._-]/g," ").replace(/\b\w/g,x=>x.toUpperCase()),email};
  localStorage.setItem("ccRole",state.role);localStorage.setItem("ccUser",JSON.stringify(state.user));
  location.href="dashboard.html";
 };
 document.getElementById("signupLink").onclick=e=>{e.preventDefault();document.getElementById("signupModal").classList.add("open")};
 document.querySelectorAll("[data-close]").forEach(x=>x.onclick=()=>x.closest(".modal").classList.remove("open"));
 document.getElementById("signupForm").onsubmit=e=>{e.preventDefault();document.getElementById("signupModal").classList.remove("open");demoToast("Registration submitted for admin approval.");};
}
function navHTML(){
 let last="";
 return navConfig[state.role].map(([section,label,ico])=>{
  let s=section?`<div class="nav-section">${section}</div>`:"";
  return s+`<a href="#" class="${state.page===label?"active":""}" data-page="${label}"><span class="nav-ico">${ico}</span><span class="nav-label">${label}</span>${label==="User Approvals"?"<span class=nav-badge>4</span>":""}</a>`;
 }).join("");
}
function setupShell(){
 const nav=document.getElementById("nav"); if(!nav)return;
 document.getElementById("roleBg").style.backgroundImage=`url('${roleBg()}')`;
 document.getElementById("sideRole").textContent=roleName()+" workspace";
 document.getElementById("userName").textContent=state.user.name;
 document.getElementById("userRole").textContent=roleName();
 document.getElementById("avatar").textContent=state.user.name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase();
 nav.innerHTML=navHTML();
 nav.querySelectorAll("a").forEach(a=>a.onclick=e=>{e.preventDefault();showPage(a.dataset.page)});
 document.getElementById("menuBtn").onclick=()=>document.getElementById("sidebar").classList.toggle("open");
 document.getElementById("globalSearch").oninput=e=>{if(e.target.value.length>2)demoToast(`Searching for “${e.target.value}”…`)};
 document.getElementById("dateLine").textContent=new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"}).toUpperCase();
 render();
}

function showPage(page){state.page=page;const nav=document.getElementById("nav");if(nav){nav.innerHTML=navHTML();nav.querySelectorAll("a").forEach(a=>a.onclick=e=>{e.preventDefault();showPage(a.dataset.page)});document.getElementById("sidebar").classList.remove("open")}render()}

function render(){
 const title=document.getElementById("pageTitle"); if(title)title.textContent=state.page;
 const page=document.getElementById("page");if(!page)return;
 const views={
  "Dashboard": dashboard,
  "My Courses": courses,
  "Learning Library": library,
  "Trainer Library": library,
  "Assessments": assessments,
  "Questionnaires": questionnaires,
  "Certificates": certificates,
  "Professional Profile": profile,
  "My Profile": profile,
  "Competency Map": competency,
  "Feedback": feedback,
  "Participants": participants,
  "Performance": performance,
  "User Approvals": approvals,
  "User & Roles": users,
  "Courses": adminCourses,
  "Enrollments": enrollments,
  "Certifications": certificates,
  "Participation": participation,
  "Announcements": publishing,
  "Achievements": publishing,
  "Learning Content": library,
  "Notifications": notifications,
  "Help": help
 };
 page.innerHTML=(views[state.page]||dashboard)();
}

function dashboard(){
 if(state.role==="trainee") return traineeDash();
 if(state.role==="trainer") return trainerDash();
 return adminDash();
}
function traineeDash(){return `
<section class="hero"><p class="eyebrow">GOOD EVENING, ${state.user.name.split(" ")[0].toUpperCase()}</p><h2>Keep building your capabilities.</h2><p>Your learning journey is moving forward. Complete the next assessment to strengthen your competency profile.</p><div class="hero-actions"><button onclick="showPage('My Courses')">Continue learning →</button><button onclick="showPage('Competency Map')">View competency map</button></div></section>
<div class="stats">
 ${stat("▣","Active Courses","06","+2 this month")} ${stat("✓","Learning Hours","28.5h","+12%")} ${stat("◎","Competency Score","78%","+6%")} ${stat("◇","Certificates","04","+1 new")}
</div>
<div class="section-grid"><div class="card"><div class="card-head"><h3>Continue learning</h3><button class="link-btn" onclick="showPage('My Courses')">View all</button></div><div class="course-list">
${course("🌊","Ocean Observation & Data","Dr. S. Banerjee",72)}${course("☁","Climate Data Fundamentals","Dr. R. Sen",48)}${course("🛰","Remote Sensing for Earth Science","A. Mukherjee",31)}</div></div>
<div class="card"><div class="card-head"><h3>Upcoming</h3><button class="link-btn" onclick="showPage('Assessments')">Assessments</button></div>${event("26","SEP","Ocean Data MCQ","Due today · 20 questions")}${event("29","SEP","Climate Workshop","10:30 AM · Virtual")}${event("03","OCT","Remote Sensing Quiz","10 questions")}</div></div>
<div class="section-grid"><div class="card"><div class="card-head"><h3>Latest from MoES</h3><span class="tag">OFFICIAL</span></div>${notice("✦","National Capacity Building Week","New learning resources have been added to the Earth Science library.","2 hours ago")}${notice("★","Achievement unlocked","You completed your first competency pathway.","Yesterday")}</div><div class="card"><div class="card-head"><h3>Recommended for you</h3></div><div class="feature-grid" style="grid-template-columns:1fr">${miniFeature("◎","GIS for Coastal Planning","Build practical mapping skills.")}${miniFeature("◈","Scientific Communication","Improve technical presentation skills.")}</div></div></div>`}
function trainerDash(){return `
<section class="hero"><p class="eyebrow">TRAINER WORKSPACE</p><h2>Good evening, ${state.user.name.split(" ")[0]}.</h2><p>Manage your learning content, questionnaires and trainee performance from one organized workspace.</p><div class="hero-actions"><button onclick="showPage('Questionnaires')">Create questionnaire →</button><button onclick="showPage('Trainer Library')">Open trainer library</button></div></section>
<div class="stats">${stat("▣","Active Courses","08","+2 this month")}${stat("◉","Trainees","184","+18%")}${stat("✓","Avg. Score","82%","+4.8%")}${stat("▤","Resources","67","+9 added")}</div>
<div class="section-grid"><div class="card"><div class="card-head"><h3>Course performance</h3><button class="link-btn" onclick="showPage('Performance')">Full report</button></div>${metric("Ocean Observation & Data","62 trainees","88% avg.")}${metric("Climate Data Fundamentals","48 trainees","82% avg.")}${metric("Remote Sensing","74 trainees","79% avg.")}${metric("Scientific Communication","32 trainees","91% avg.")}</div><div class="card"><div class="card-head"><h3>Pending actions</h3></div>${notice("✓","Questionnaire closes today","Ocean Data Assessment · 26 Sep","Due 11:59 PM")}${notice("◉","Review trainee performance","12 trainees need feedback","This week")}${notice("▤","New resource upload","Lecture 04 is awaiting publish","Today")}</div></div>
<div class="card" style="margin-top:17px"><div class="card-head"><h3>Recent trainee performance</h3><button class="link-btn" onclick="showPage('Participants')">View participants</button></div>${table(["Trainee","Course","Progress","Score","Status"],[["Amit Maity","Ocean Observation","82%","91%","On track"],["Priya Das","Climate Data","76%","86%","On track"],["Rahul Roy","Remote Sensing","51%","64%","Needs support"],["Sneha Paul","Ocean Observation","93%","95%","Excellent"]])}</div>`}
function adminDash(){return `
<section class="hero"><p class="eyebrow">ADMINISTRATION & GOVERNANCE</p><h2>Capacity Connect command centre.</h2><p>Monitor learning operations, approve users, manage roles, publish organizational knowledge and track competency development.</p><div class="hero-actions"><button onclick="showPage('User Approvals')">Review 4 approvals →</button><button onclick="showPage('Announcements')">Publish update</button></div></section>
<div class="stats">${stat("◉","Total Users","1,284","+8.2%")}${stat("▣","Active Courses","42","+5")}${stat("✓","Assessments","116","+14")}${stat("◎","Completion","76.4%","+3.6%")}</div>
<div class="section-grid"><div class="card"><div class="card-head"><h3>Learning activity</h3><span class="muted">Last 6 months</span></div><div class="chart">${[38,52,44,68,72,88].map((v,i)=>`<div class=col><i style="height:${v}%"></i><small>${["Apr","May","Jun","Jul","Aug","Sep"][i]}</small></div>`).join("")}</div></div><div class="card"><div class="card-head"><h3>User distribution</h3></div>${metric("Trainees","1,092","85%")}${metric("Trainers","168","13%")}${metric("Admins","24","2%")}${metric("Pending approval","4","Review")}</div></div>
<div class="section-grid"><div class="card"><div class="card-head"><h3>Recent registrations</h3><button class="link-btn" onclick="showPage('User Approvals')">Review all</button></div>${table(["Name","Organisation","Requested role","Date","Action"],[["Dr. Neha Sharma","NCPOR","Trainer","Today","Approve"],["Arjun Das","IMD","Trainee","Today","Approve"],["Maya Roy","NIOT","Trainee","Yesterday","Approve"]])}</div><div class="card"><div class="card-head"><h3>Publishing queue</h3></div>${notice("✦","2 announcements","Awaiting publication","Admin")}${notice("★","3 achievements","Ready to feature","Admin")}${notice("▤","7 resources","New content this week","Admin")}</div></div>`}

function stat(icon,label,value,delta){return `<div class=stat><div class=stat-icon>${icon}</div><small>${label}</small><strong>${value}<em>${delta}</em></strong></div>`}
function course(icon,title,trainer,pct){return `<div class=course><div class=course-thumb>${icon}</div><div><h4>${title}</h4><p>${trainer}</p><div class=progress><i style="width:${pct}%"></i></div></div><span class=pct>${pct}%</span></div>`}
function event(day,mon,title,desc){return `<div class=event><div class=date-box><b>${day}</b><small>${mon}</small></div><div><h4>${title}</h4><p>${desc}</p></div></div>`}
function notice(icon,title,desc,time){return `<div class=notice><div class=notice-icon>${icon}</div><div><h4>${title}</h4><p>${desc}</p><p class=muted>${time}</p></div></div>`}
function miniFeature(icon,title,text){return `<div class=feature><div class=feature-icon>${icon}</div><h3>${title}</h3><p>${text}</p></div>`}
function metric(a,b,c){return `<div class=metric><b>${a}</b><span>${b} · <strong>${c}</strong></span></div>`}
function table(headers,rows){return `<div class=table-wrap><table class=table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((x,i)=>`<td>${i===r.length-1?`<span class="badge ${String(x).toLowerCase().includes("need")?"amber":"green"}">${x}</span>`:x}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`}

function courses(){return `<div class=card><div class=card-head><div><h3>Course catalogue</h3><span class=muted>Explore learning pathways and enroll in courses.</span></div><button class=primary-btn style="width:auto" onclick="demoToast('Course enrollment completed.')">+ Browse courses</button></div><div class=feature-grid>${miniFeature("🌊","Ocean Observation & Data","8 modules · Intermediate · 6h")}${miniFeature("☁","Climate Data Fundamentals","10 modules · Beginner · 8h")}${miniFeature("🛰","Remote Sensing","12 modules · Advanced · 12h")}${miniFeature("◈","Scientific Communication","6 modules · Beginner · 4h")}${miniFeature("◎","GIS for Coastal Planning","9 modules · Intermediate · 7h")}${miniFeature("◒","Data Visualization","7 modules · Intermediate · 5h")}</div></div>`}
function library(){return `<div class=card><div class=card-head><div><h3>${state.role==="trainer"?"Trainer Library":"Learning Library"}</h3><span class=muted>Recorded lectures, presentations, documents and reference resources.</span></div><button class=primary-btn style="width:auto" onclick="demoToast('${state.role==="trainer"?"Resource uploaded to draft library.":"Opening resource…"}')">${state.role==="trainer"?"+ Upload resource":"Browse library"}</button></div>${table(["Resource","Type","Subject","Owner","Updated"],[["Ocean Data — Lecture 04","Video","Ocean Science","Dr. S. Banerjee","Today"],["Climate Indicators 2026","PDF","Climate","Dr. R. Sen","Yesterday"],["Remote Sensing Field Guide","Presentation","Remote Sensing","A. Mukherjee","22 Sep"],["GIS Coastal Planning","Video","GIS","Dr. N. Das","20 Sep"]])}</div>`}
function assessments(){return `<div class=card><div class=card-head><h3>Subject-wise assessments</h3><span class=muted>MCQ assessments and competency scoring</span></div>${table(["Assessment","Subject","Questions","Deadline","Status"],[["Ocean Data Fundamentals","Ocean Science","20","Today, 11:59 PM","Available"],["Climate Data Basics","Climate","25","29 Sep","Available"],["Remote Sensing Concepts","Remote Sensing","30","03 Oct","Upcoming"],["GIS Foundations","GIS","20","07 Oct","Upcoming"]])}<button class=primary-btn style="width:auto;margin-top:15px" onclick="openAssessment()">Start Ocean Data MCQ →</button></div>`}
function questionnaires(){return `<div class=card><div class=card-head><div><h3>Questionnaire manager</h3><span class=muted>Create, schedule and monitor trainee questionnaires.</span></div><button class=primary-btn style="width:auto" onclick="openQuestionnaire()">+ Create questionnaire</button></div>${table(["Questionnaire","Course","Questions","Deadline","Responses"],[["Ocean Data Assessment","Ocean Observation","20","26 Sep, 11:59 PM","48 / 62"],["Climate Fundamentals","Climate Data","25","29 Sep","32 / 48"],["Remote Sensing Quiz","Remote Sensing","30","03 Oct","—"]])}</div>`}
function certificates(){return `<div class=card><div class=card-head><h3>Certificates & achievements</h3><span class=muted>Verified learning credentials</span></div><div class=feature-grid>${miniFeature("◇","Ocean Observation","Completed · 12 Sep 2026")}${miniFeature("★","Capacity Builder","Achievement · 05 Sep 2026")}${miniFeature("◇","Data Fundamentals","Completed · 18 Aug 2026")}</div></div>`}
function profile(){return `<div class=section-grid><div class=card><div class=profile-head><div class=big-avatar>${state.user.name.split(" ").map(x=>x[0]).join("").slice(0,2)}</div><div><h2>${state.user.name}</h2><p>${state.role==="trainer"?"Earth Science Trainer":"Capacity Building Trainee"} · Ministry / Organisation</p></div></div><h3 style="font-size:12px;margin-bottom:10px">Skills & interests</h3><div class=chips>${["Earth Science","Data Analysis","GIS","Scientific Communication","Climate","Remote Sensing"].map(x=>`<span class=chip>${x}</span>`).join("")}</div><button class=primary-btn style="margin-top:20px;width:auto" onclick="demoToast('Profile saved successfully.')">Edit profile</button></div><div class=card><div class=card-head><h3>Professional details</h3></div>${metric("Qualification","M.Sc. Earth Science","Verified")}${metric("Experience","6 years","Current")}${metric("Certificates","4","Verified")}${metric("Interests","Ocean & Climate","6 topics")}</div></div>`}
function competency(){return `<div class=section-grid><div class=card><div class=card-head><h3>Competency map</h3><span class=badge green>78% overall</span></div>${metric("Ocean Data","Advanced","91%")}${metric("Climate Analysis","Intermediate","76%")}${metric("Remote Sensing","Intermediate","72%")}${metric("GIS","Intermediate","69%")}${metric("Scientific Communication","Advanced","88%")}</div><div class=card><div class=card-head><h3>Recommended next steps</h3></div>${notice("◎","Advanced GIS","Recommended to close a 12% skill gap.","Priority 1")}${notice("✓","Remote Sensing Assessment","Take the next MCQ to validate competency.","Priority 2")}</div></div>`}
function feedback(){return `<div class=card><div class=card-head><h3>Course feedback</h3><span class=muted>Your feedback improves training quality.</span></div>${["Ocean Observation & Data","Climate Data Fundamentals","Remote Sensing"].map((x,i)=>`<div class=metric><b>${x}</b><button class=link-btn onclick="demoToast('Thank you — feedback form opened.')">${i===0?"Rate course →":"Give feedback →"}</button></div>`).join("")}</div>`}
function participants(){return `<div class=card><div class=card-head><h3>Trainee participation</h3><span class=muted>Monitor attendance, progress and assessment outcomes.</span></div>${table(["Trainee","Course","Participation","Progress","Score"],[["Amit Maity","Ocean Observation","96%","82%","91%"],["Priya Das","Climate Data","91%","76%","86%"],["Rahul Roy","Remote Sensing","62%","51%","64%"],["Sneha Paul","Ocean Observation","98%","93%","95%"]])}</div>`}
function performance(){return `<div class=kpi-grid>${["Completion rate","Average score","At-risk trainees"].map((x,i)=>`<div class=card><small class=muted>${x}</small><h2 style="font-size:27px;margin-top:7px">${["82%","84%","12"][i]}</h2><div class=progress style="margin-top:14px"><i style="width:${[82,84,32][i]}%"></i></div></div>`).join("")}</div><div class=card style="margin-top:17px"><div class=card-head><h3>Performance by course</h3></div>${table(["Course","Enrolled","Completed","Avg. score","At risk"],[["Ocean Observation","62","48","88%","3"],["Climate Data","48","34","82%","5"],["Remote Sensing","74","41","79%","4"]])}</div>`}
function approvals(){return `<div class=card><div class=card-head><h3>User approval queue</h3><span class=badge amber>4 pending</span></div>${table(["Applicant","Organisation","Requested role","Submitted","Decision"],[["Dr. Neha Sharma","NCPOR","Trainer","Today","Approve"],["Arjun Das","IMD","Trainee","Today","Approve"],["Maya Roy","NIOT","Trainee","Yesterday","Approve"],["Karan Sen","NIO","Trainer","Yesterday","Approve"]])}<button class=primary-btn style="width:auto;margin-top:15px" onclick="demoToast('Selected applicants approved.')">Approve selected</button></div>`}
function users(){return `<div class=card><div class=card-head><h3>User & role management</h3><button class=primary-btn style="width:auto" onclick="demoToast('User creation form opened.')">+ Add user</button></div>${table(["Name","Email","Role","Status","Last active"],[["Amit Maity","amit@moes.gov.in","Trainee","Active","Today"],["Dr. S. Banerjee","sbanerjee@moes.gov.in","Trainer","Active","Today"],["R. Mehta","rmehta@moes.gov.in","Admin","Active","Yesterday"]])}</div>`}
function adminCourses(){return `<div class=card><div class=card-head><h3>Course governance</h3><span class=muted>Monitor catalogue, owners and publication status.</span></div>${table(["Course","Owner","Enrolled","Completion","Status"],[["Ocean Observation & Data","Dr. S. Banerjee","62","77%","Published"],["Climate Data Fundamentals","Dr. R. Sen","48","71%","Published"],["Remote Sensing","A. Mukherjee","74","55%","Published"],["GIS Coastal Planning","Dr. N. Das","32","—","Draft"]])}</div>`}
function enrollments(){return `<div class=card><div class=card-head><h3>Enrollment analytics</h3></div><div class=stats>${stat("↗","This month","248","+18%")}${stat("✓","Completed","176","+11%")}${stat("◒","In progress","72","+7%")}${stat("!","Dropped","8","-2%")}</div></div>`}
function participation(){return `<div class=card><div class=card-head><h3>Participation statistics</h3></div>${table(["Department","Active trainees","Participation","Completion","Trend"],[["NCPOR","218","94%","81%","↑"],["NIOT","186","89%","76%","↑"],["IMD","245","86%","72%","→"],["INCOIS","203","91%","79%","↑"]])}</div>`}
function publishing(){return `<div class=section-grid><div class=card><div class=card-head><h3>Publish to homepage</h3><span class=muted>Announcements, achievements and learning content.</span></div><label>Content type<select><option>Announcement</option><option>Achievement</option><option>New learning content</option><option>Notification</option></select></label><label>Title<input placeholder="Enter publication title"></label><label>Message<textarea rows="5" placeholder="Write your update..."></textarea></label><button class=primary-btn onclick="demoToast('Publication saved and queued.')">Publish update →</button></div><div class=card><div class=card-head><h3>Recent publications</h3></div>${notice("✦","National Capacity Building Week","Published to all users.","Today")}${notice("★","Top learner — August","Achievement featured on homepage.","05 Sep")}</div></div>`}
function notifications(){return `<div class=card><div class=card-head><h3>Notifications</h3><span class=badge blue>3 new</span></div>${notice("✓","Assessment deadline","Ocean Data MCQ closes today at 11:59 PM.","2 hours ago")}${notice("✦","New resource available","Lecture 04 has been added to your library.","Today")}${notice("★","Achievement","You unlocked Capacity Builder.","Yesterday")}</div>`}
function help(){return `<div class=feature-grid>${miniFeature("◉","Help Centre","Find answers to common portal questions.")}${miniFeature("✉","Contact support","Reach the Capacity Connect support team.")}${miniFeature("▤","User guide","Learn how to use your role-based workspace.")}</div>`}
function openAssessment(){openModal(`<p class=eyebrow>ASSESSMENT · OCEAN SCIENCE</p><h2 style="margin:7px 0 16px">Ocean Data Fundamentals</h2><p class=muted>Question 1 of 20 · Choose the best answer.</p><h3 style="margin:20px 0 14px;font-size:14px">Which observation is most useful for identifying changes in ocean surface conditions?</h3>${["Satellite-derived sea surface temperature","Office attendance records","Course completion date","Printer usage"].map(x=>`<label class=check style="padding:11px;border:1px solid #e5e9ef;border-radius:10px;margin:7px 0"><input type=radio name=q> ${x}</label>`).join("")}<button class=primary-btn style="margin-top:14px" onclick="closeModal();demoToast('Answer saved — next question loaded.')">Save & continue →</button>`)}
function openQuestionnaire(){openModal(`<p class=eyebrow>QUESTIONNAIRE BUILDER</p><h2 style="margin:7px 0">Create questionnaire</h2><label>Title<input value="Ocean Data Assessment"></label><label>Deadline<input type=datetime-local></label><label>Questions<textarea rows=4 placeholder="Add question and answer options..."></textarea></label><button class=primary-btn onclick="closeModal();demoToast('Questionnaire saved as draft.')">Save questionnaire</button>`)}
function openModal(html){document.getElementById("modalContent").innerHTML=html;document.getElementById("genericModal").classList.add("open")}
function closeModal(){document.getElementById("genericModal").classList.remove("open")}
function logout(){localStorage.removeItem("ccRole");localStorage.removeItem("ccUser");location.href="index.html"}

document.addEventListener("DOMContentLoaded",()=>{bootLogin();if(document.body.classList.contains("app"))setupShell();document.querySelectorAll("[data-close]").forEach(x=>x.onclick=()=>x.closest(".modal").classList.remove("open"))});
