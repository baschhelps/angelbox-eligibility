
let step = 0;
let answers = {};

// ✅ Boroughs
const supportedBoroughs = [
  "Westminster","Camden","Hillingdon","Hounslow",
  "Ealing","Hammersmith and Fulham","Brent","Kensington and Chelsea"
];

const allBoroughs = [
  "Camden","Westminster","Ealing","Brent","Hounslow","Hillingdon"
];

// ✅ Benefit Messages
const benefitMessages = {
  "Universal Credit": "Thank you — this helps us understand your current situation.",
  "Income Support": "You may be prioritised for support based on your circumstances.",
  "ESA": "We understand you may be managing health-related challenges.",
  "Housing Benefit": "We understand housing costs can be challenging.",
  "PIP": "We understand additional support needs.",
  "Awaiting benefit decision": "That’s completely okay — decisions can take time.",
  "Other": "Thank you — this helps us understand your situation."
};

// ✅ REASSURANCE PER STEP
function reassurance() {
  if (step === 1) return "This will only take a minute.";
  if (step === 2) return "You're doing the right thing by checking.";
  if (step === 3) return "This helps us assess eligibility fairly.";
  if (step === 4) return "We ask this to ensure fair support decisions.";
  if (step === 5) return "This helps us understand your financial context.";
  if (step === 6) return "We provide support at the right time.";
  if (step === 7) return "Final step — you're almost there.";
  return "";
}

// ✅ Progress
function progressUI() {
  const total = 8;
  const percent = Math.round((step / total) * 100);

  return `
  <div class="progress-wrapper">
    <div class="progress-text">Step ${step} of ${total}</div>
    <div class="progress-bar">
      <div class="progress-fill" style="width:${percent}%"></div>
    </div>
  </div>`;
}

// ✅ Rejection
function rejectionScreen(title, msg, extra="") {
  return `
  <div class="card">
    <div class="icon">⚠️</div>
    <h3 class="result-warning">${title}</h3>
    <p>${msg}</p>

    ${extra ? `<div class="alert">${extra}</div>` : ""}

    <button class="btn secondary"
      onclick="window.location.href='mailto:info@baschhelps.org'ick="reset()">← Start again</button>
  </div>`;
}

// ✅ MAIN RENDER
function render() {
  const el = document.getElementById("app");

  // ✅ FAIL STATES
  if (step === "boroughFail") {
    el.innerHTML = rejectionScreen(
      "Support in your area is different",
      `We don’t currently support ${answers.borough}.`
    );
    return;
  }

  if (step === "residencyFail") {
    el.innerHTML = rejectionScreen(
      "We may not be able to support",
      "Some visa types fall outside our criteria."
    );
    return;
  }

  if (step === "incomeFail") {
    el.innerHTML = rejectionScreen(
      "We may not be able to support",
      "Household income above £10,500 falls outside our threshold."
    );
    return;
  }

  if (step === "directorFail") {
    el.innerHTML = rejectionScreen(
      "We may not be able to support",
      "Company directors can have complex income structures.",
      "This makes it difficult to assess financial circumstances fairly."
    );
    return;
  }

  if (step === "dueDateFail") {
    el.innerHTML = rejectionScreen(
      "It may be too early to apply",
      "Support is prioritised closer to your due date."
    );
    return;
  }

  if (step === "evidenceFail") {
    el.innerHTML = rejectionScreen(
      "We may not be able to proceed",
      "Evidence is required to assess applications."
    );
    return;
  }

  // ✅ STEP 0
  if (step === 0) {
    el.innerHTML = `
    <div class="card">
      <p>Which London borough do you live in?</p>
      <select id="borough">
        <option value="">Select</option>
        ${allBoroughs.map(b=>`<option>${b}</option>`).join("")}
      </select>
      <button class="btn primary" onclick="nextBorough()">Continue</button>
    </div>`;
  }

  // ✅ STEP 1 Residency
  else if (step === 1) {
    el.innerHTML = `
    <div class="card">
      ${progressUI()}
      <p>${reassurance()}</p>

      <p>What is your residency status?</p>
      <select id="residency">
        <option value="">Select</option>
        <option value="uk">UK / ILR</option>
        <option value="asylum">Asylum seeker</option>
        <option value="limited">Limited leave</option>
        <option value="student">Student visa</option>
      </select>

      <button class="btn primary" onclick="nextResidency()">Continue</button>
      <button class="back" onclick="back()">← Go back</button>
    </div>`;
  }

  // ✅ STEP 2 Employment
  else if (step === 2) {
    el.innerHTML = `
    <div class="card">
      ${progressUI()}
      <p>${reassurance()}</p>

      <p>What is your work situation?</p>
      <select id="employment">
        <option value="">Select</option>
        <option>Full-time</option>
        <option>Part-time</option>
        <option>Self-employed</option>
        <option>Unemployed</option>
      </select>

      <button class="btn primary" onclick="nextEmployment()">Continue</button>
      <button class="back">← Go back</button>
    </div>`;
  }

  // ✅ STEP 3 Income
  else if (step === 3) {
    el.innerHTML = `
    <div class="card">
      ${progressUI()}
      <p>${reassurance()}</p>

      <p>Is your income above £10,500?</p>
      <button class="btn primary" onclick="handleIncome('no')">No</button>
      <button class="btn secondary" onclick="handleIncome('yes')">Yes</button>

      <button class="back" onclick="back()">← Go back</button>
    </div>`;
  }

  // ✅ STEP 4 Director
  else if (step === 4) {
    el.innerHTML = `
    <div class="card">
      ${progressUI()}
      <p>${reassurance()}</p>

      <p>Are you a company director?</p>

      <button class="btn primary" onclick="handleDirector('no')">No</button>
      <button class="btn secondary" onclick="handleDirector('yes')">Yes</button>

      <button class="back" onclick="back()">← Go back</button>
    </div>`;
  }

  // ✅ STEP 5 Benefits
  else if (step === 5) {
    el.innerHTML = `
    <div class="card">
      ${progressUI()}
      <p>${reassurance()}</p>

      <p>Are you receiving benefits?</p>

      <button class="btn primary" onclick="handleBenefits('yes')">Yes</button>
      <button class="btn secondary" onclick="handleBenefits('no')">No</button>

      <button class="back" onclick="back()">← Go back</button>
    </div>`;
  }

  // ✅ BENEFITS LIST
  else if (step === "benefitsList") {
    el.innerHTML = `
    <div class="card">
      ${progressUI()}
      <p>Which benefit?</p>

      <select id="benefits" onchange="autoBenefit()">
        <option value="">Select</option>
        <option>Universal Credit</option>
        <option>ESA</option>
        <option>Housing Benefit</option>
        <option>PIP</option>
        <option>Awaiting benefit decision</option>
        <option>Other</option>
      </select>

      <button class="back" onclick="back()">← Go back</button>
    </div>`;
  }

  // ✅ BENEFIT MESSAGE
  else if (step === "benefitMessage") {
    el.innerHTML = `
    <div class="card">
      ${progressUI()}
      <p class="reassurance">${answers.benefitMessage}</p>
    </div>`;

    setTimeout(()=>{
      step = 6;
      render();
    },1500);
    return;
  }

  // ✅ STEP 6 Due Date
  else if (step === 6) {
    el.innerHTML = `
    <div class="card">
      ${progressUI()}
      <p>${reassurance()}</p>

      <p>When is your baby due?</p>
      <input type="date" id="dueDate">

      <button class="btn primary" onclick="handleDueDate()">Continue</button>
      <button class="back" onclick="back()">← Go back</button>
    </div>`;
  }

  // ✅ STEP 7 Evidence
  else if (step === 7) {
    el.innerHTML = `
    <div class="card">
      ${progressUI()}
      <p>${reassurance()}</p>

      <p>Can you provide evidence?</p>

      <button class="btn primary" onclick="handleEvidence('yes')">Yes</button>
      <button class="btn secondary" onclick="handleEvidence('no')">No</button>

      <button class="back" onclick="back()">← Go back</button>
    </div>`;
  }

  // ✅ FINAL RESULT
  else if (step === 8) {
    el.innerHTML = `
    <div class="card">
      <div class="icon">✅</div>

      <h3>You may be eligible for support</h3>

      <p>You meet our initial criteria.</p>

      <p><b>Please scroll down to continue your application</b></p>

      <button class="back" onclick="reset()">Start again</button>
    </div>`;
  }
}

// ✅ HANDLERS
function nextBorough(){
  const val=document.getElementById("borough").value;
  if(!val)return alert("Select borough");
  answers.borough=val;
  step=supportedBoroughs.includes(val)?1:"boroughFail";
  render();
}

function nextResidency(){
  const val=document.getElementById("residency").value;
  if(!val)return alert("select residency");
  const excluded=["student"];
  step=excluded.includes(val)?"residencyFail":2;
  render();
}

function nextEmployment(){
  step=3;
  render();
}

function handleIncome(val){
  step=val==="yes"?"incomeFail":4;
  render();
}

function handleDirector(val){
  step=val==="yes"?"directorFail":5;
  render();
}

function handleBenefits(val){
  step=val==="yes"?"benefitsList":6;
  render();
}

function autoBenefit(){
  const val=document.getElementById("benefits").value;
  if(!val)return;
  answers.benefitMessage=benefitMessages[val]||benefitMessages["Other"];
  step="benefitMessage";
  render();
}

function handleDueDate(){
  const val=document.getElementById("dueDate").value;
  if(!val)return alert("enter date");
  const diff=(new Date(val)-new Date())/(1000*60*60*24);
  step=diff>60?"dueDateFail":7;
  render();
}

function handleEvidence(val){
  step=val==="no"?"evidenceFail":8;
  render();
}

function back(){step--;render();}
function reset(){step=0;answers={};render();}

render();
