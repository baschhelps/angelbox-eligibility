{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\froman\fcharset0 Times-Roman;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf0 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 let step = 0;\
let flow = null;\
let answers = \{\};\
\
const parent = [\
\'a0 \{ key: "location", text: "Do you live in an area supported by Basch Helps CIC?" \},\
\'a0 \{ key: "need", text: "Is your child in need of support?" \},\
\'a0 \{ key: "crisis", text: "Are you experiencing hardship?" \}\
];\
\
const professional = [\
\'a0 \{ key: "location", text: "Is the child located in a supported area?" \},\
\'a0 \{ key: "consent", text: "Do you have consent?" \},\
\'a0 \{ key: "need", text: "Is the child in need of support?" \},\
\'a0 \{ key: "crisis", text: "Is the family experiencing hardship?" \}\
];\
\
function getQuestions() \{\
\'a0 return flow === "parent" ? parent : professional;\
\}\
\
function render() \{\
\'a0 const el = document.getElementById("app");\
\'a0 const q = getQuestions();\
\'a0 const total = q.length;\
\
\'a0 if (step === 0) \{\
\'a0\'a0\'a0 el.innerHTML = `\
\'a0\'a0\'a0\'a0\'a0 <div class="card">\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0 <p>This checker helps assess eligibility.</p>\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0 <button class="btn primary" onclick="start('parent')">Parent</button>\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0 <button class="btn secondary" onclick="start('professional')">Professional</button>\
\'a0\'a0\'a0\'a0\'a0 </div>`;\
\'a0 \}\
\
\'a0 else if (step <= total) \{\
\'a0\'a0\'a0 el.innerHTML = `\
\'a0\'a0\'a0\'a0\'a0 <div class="card">\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0 <p>$\{q[step - 1].text\}</p>\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0 <button class="btn primary" onclick="answer('yes')">Yes</button>\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0 <button class="btn secondary" onclick="answer('no')">No</button>\
\'a0\'a0\'a0\'a0\'a0 </div>`;\
\'a0 \}\
\
\'a0 else \{\
\'a0\'a0\'a0 const crisis = answers.crisis === "yes";\
\
\'a0\'a0\'a0 el.innerHTML = `\
\'a0\'a0\'a0\'a0\'a0 <div class="card">\
\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0 $\{crisis ? `<div class="alert">URGENT CASE</div>` : ""\}\
\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0 <input id="name" placeholder="Name">\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0 <input id="email" placeholder="Email">\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0 <textarea id="details" placeholder="Situation"></textarea>\
\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0 <button class="btn primary" onclick="submitForm($\{crisis\})">\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0\'a0\'a0 Submit Request\
\'a0\'a0\'a0\'a0\'a0\'a0\'a0 </button>\
\
\'a0\'a0\'a0\'a0\'a0 </div>`;\
\'a0 \}\
\}\
\
function start(type) \{ flow = type; step = 1; render(); \}\
function answer(val) \{ answers[getQuestions()[step - 1].key] = val; step++; render(); \}\
\
function submitForm(crisis) \{\
\'a0 let data = new FormData();\
\'a0 data.append("priority", crisis ? "HIGH" : "Normal");\
\
\'a0 fetch("https://formsubmit.co/info@baschhelps.org", \{\
\'a0\'a0\'a0 method: "POST",\
\'a0\'a0\'a0 body: data\
\'a0 \});\
\
\'a0 alert("Submitted!");\
\}\
\
render();\
}
