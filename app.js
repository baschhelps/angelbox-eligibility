let step=0, flow=null, answers={};

const parent=[
 {key:'location',text:'Do you live in a supported area?'},
 {key:'need',text:'Does your child need support?'},
 {key:'crisis',text:'Are you experiencing hardship?'}
];

const pro=[
 {key:'location',text:'Is the child in a supported area?'},
 {key:'consent',text:'Do you have consent?'},
 {key:'need',text:'Does the child need support?'},
 {key:'crisis',text:'Is there hardship?'}
];

function getQ(){ return flow==='parent'?parent:pro; }

function render(){
 let el=document.getElementById('app');
 let q=getQ();
 let total=q.length;

 if(step===0){
  el.innerHTML=`<div class='card'>
   <button class='btn primary' onclick="start('parent')">Parent</button>
   <button class='btn secondary' onclick="start('pro')">Professional</button>
  </div>`;
 }
 else if(step<=total){
  el.innerHTML=`<div class='card'>
   <p>${q[step-1].text}</p>
   <button class='btn primary' onclick="answer('yes')">Yes</button>
   <button class='btn secondary' onclick="answer('no')">No</button>
  </div>`;
 }
 else{
  let crisis=answers.crisis==='yes';
  el.innerHTML=`<div class='card'>
   ${crisis?"<div class='alert'>Urgent case - contact info@baschhelps.org</div>":""}
   <input id='name' placeholder='Name'>
   <input id='email' placeholder='Email'>
   <textarea id='details' placeholder='Details'></textarea>
   <button class='btn primary' onclick='submitForm()'>Submit</button>
  </div>`;
 }
}

function start(f){flow=f==='pro'?'pro':'parent';step=1;render();}
function answer(a){answers[getQ()[step-1].key]=a;step++;render();}

function submitForm(){
 let data=new FormData();
 data.append('name',document.getElementById('name').value);
 data.append('email',document.getElementById('email').value);
 data.append('details',document.getElementById('details').value);
 fetch('https://formsubmit.co/info@baschhelps.org',{method:'POST',body:data});
 alert('Submitted');
}

render();
