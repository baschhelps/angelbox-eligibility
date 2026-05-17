
let step = 0;
let answers = {};

// ✅ FULL borough list restored
const supportedBoroughs = [
  "Westminster","Camden","Hillingdon","Hounslow",
  "Ealing","Hammersmith and Fulham","Brent","Kensington and Chelsea"
];

const allBoroughs = [
  "Barking and Dagenham","Barnet","Bexley","Brent","Bromley",
  "Camden","Croydon","Ealing","Enfield","Greenwich","Hackney",
  "Hammersmith and Fulham","Haringey","Harrow","Havering",
  "Hillingdon","Hounslow","Islington","Kensington and Chelsea",
  "Kingston upon Thames","Lambeth","Lewisham","Merton","Newham",
  "Redbridge","Richmond upon Thames","Southwark","Sutton",
  "Tower Hamlets","Waltham Forest","Wandsworth","Westminster"
];

// ✅ BENEFIT MESSAGES (restored tone)
const benefitMessages = {
  "Universal Credit": "Thank you — this helps us understand your current situation.",
  "Income Support": "You may be prioritised for support based on your circumstances.",
  "Employment and Support Allowance (ESA)": 
    "We understand you may be managing health-related challenges.",
  "Housing Benefit": 
    "We understand housing costs can be challenging.",
  "Personal Independence Payment (PIP)": 
    "We understand additional support needs.",
  "Disability Living Allowance (DLA)": 
    "We understand additional care needs.",
  "Carer’s Allowance": 
    "Caring responsibilities can be demanding.",
  "Awaiting benefit decision": 
    "That’s completely okay — decisions can take time.",
  "Other": 
    "Thank you — this helps us understand your situation."
};

// ✅ REASSURANCE (restored quality tone)
function reassurance() {
  if (step === 1) return "This will only take a minute.";
  if (step === 2) return "You're doing the right thing by checking.";
  if (step === 3) return "This helps us understand your situation.";
  if (step === 4) return "We ask this to ensure fair support decisions.";
  if (step === 5) return "This helps us better understand your financial circumstances.";
  if (step === 6) return "This helps us provide support at the right time.";
  if (step === 7) return "You're almost done.";
  return "";
}

// ✅ Progress
function progressUI() {
  const total = 8;
  const percent = Math.round((Math.min(step, total) / total) * 100);

  return `
    <div class="progress-wrapper">
      <div class="progress-text">Step ${Math.min(step, total)} of ${total}</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${percent}%"></div>
      </div>
    </div>
  `;
}

// ✅ Rejection
function rejectionScreen(title, message, extra = "") {
  return `
    <div class="card">
      <div class="icon">⚠️</div>

      <h3 class="result-warning">${title}</h3>

      <p>${message}</p>

      ${extra ? `<div class="alert">${extra}</div>` : ""}

      <button class="btn secondary" onclick="window.location.href='mailto:info@baschclass="reassurance">
        We’re here to guide you — please get in touch if you're unsure.
      </p>

      <button class="back" onclick="reset()">← Start again</button>
    </div>
  `;
}

// ✅ MAIN RENDER
function render() {
  const el = document.getElementById("app");

  // ✅ FAIL STATES
  if (step === "boroughFail") {
    el.innerHTML = rejectionScreen(
      "Support in your area is different",
      `We don’t currently deliver AngelBox in ${answers.borough}.`,
      "However, you may still be able to access local support services."
    );
    return;
  }

  if (step === "residencyFail") {
    el.innerHTML = rejectionScreen(
      "We may not be able to support at this stage",
      "Some residency types require a higher level of financial support.",
      "This may be above the level we use when prioritising support."
    );
    return;
  }

  if (step === "incomeFail") {
    el.innerHTML = rejectionScreen(
      "We may not be able to support at this stage",
      "Our service is designed to support families experiencing financial hardship."
    );
    return;
  }

  if (step === "directorFail") {
    el.innerHTML = rejectionScreen(
      "We may not be able to support at this stage",
      "For company directors, it can be difficult to fully understand financial circumstances.",
      "Income may be structured in different ways such as dividends, loans, or business expenses."
    );
    return;
  }

  if (step === "dueDateFail") {
    el.innerHTML = rejectionScreen(
      "It may be a bit early to apply",
      "Your baby is due in more than 2 months.",
      "We recommend applying closer to your due date so support can be provided at the right time."
    );
    return;
  }

  if (step === "evidenceFail") {
    el.innerHTML = rejectionScreen(
      "We may not be able to proceed",
      "We require evidence to fairly assess applications."
    );
    return;
  }

  // ✅ STEP 0 Borough
  if (step === 0) {
    el.innerHTML = `
    <div class="card">
      <p>Which London borough do you live in?</p>

      <select id="borough">
        <option value="">Select borough</option>
        ${allBoroughs.map(b => `<option>${b}</option>`).join("")}
      </select>

      <button class="btn primary" onclick="nextBorough()">Continue</button>
    </div>`;
  }

  // ✅ STEP 1 Residency
  else if (step === 1) {
    el.innerHTML = `
    <div class="card">
      ${progressUI()}
      <p class="reassurance">${reassurance()}</p>

      <p>What is your residency status in the UK?</p>

      <select id="residency">
        <option value="">Select</option>
        <option value="uk">UK citizen or settled</option>
        <option value="asylum">Asylum seeker or refugee</option>
        <option value="limited">Limited leave to remain</option>
        <option value="student">Student visa</option>
        <option value="visitor">Visitor visa</option>
        <option value="spouse">Spouse visa</option>
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
      <p class="reassurance">${reassurance()}</p>

      <p>What is your current work situation?</p>

      <select id="employment">
        <option value="">Select</option>
        <option>Full-time</option>
        <option>Part-time</option>
        <option>Self-employed</option>
        <option>Contract work</option>
        <option>Not currently working</option>
      </select>

      <button class="btn primary" onclick="nextEmployment()">Continue</button>
      <button class="back" onclick="back()">← Go back</button>
    </div>`;
  }

  // ✅ STEP 3 Income
  else if (step === 3) {
    el.innerHTML = `
    <div class="card">
      ${progressUI()}
      <p class="reassurance">${reassurance()}</p>

      <p>Is your household income above £10,500 per year?</p>

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
      <p class="reassurance">${reassurance()}</p>

      <p>Are you currently a company director?</p>

      <button class="btn primary" onclick="handleDirector('no')">No</button>
      <button class="btn secondary" onclick="handleDirector('yes')">Yes</button>

      <button class="back" onclick="back()">← Go back</button>
    </div>`;
  }

  // ✅ STEP 5 Benefits question
  else if (step === 5) {
    el.innerHTML = `
    <div class="card">
      ${progressUI()}
      <p class="reassurance">${reassurance()}</p>

      <p>Are you currently receiving benefits?</p>

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

      <p>Which benefits are you receiving?</p>

      <select id="benefits" onchange="autoSelectBenefit()">
        <option value="">Select</option>
        <option>Universal Credit</option>
        <option>Income Support</option>
        <option>Employment and Support Allowance (ESA)</option>
        <option>Housing Benefit</option>
        <option>Personal Independence Payment (PIP)</option>
        <option>Disability Living Allowance (DLA)</option>
        <option>Carer’s Allowance</option>
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

    setTimeout(() => {
      step = 6;
      render();
    }, 1500);

    return;
  }

  // ✅ STEP 6 Due date
  else if (step === 6) {
    el.innerHTML = `
    <div class="card">
      ${progressUI()}
      <p class="reassurance">${reassurance()}</p>

      <p>When is your baby due (or date of birth)?</p>

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
      <p class="reassurance">${reassurance()}</p>

      <p>Are you able to provide evidence if required?</p>

      <button class="btn primary" onclick="handleEvidence('yes')">Yes</button>
      <button class="btn secondary" onclick="handleEvidence('no')">No</button>

      <button class="back" onclick="back()">← Go back</button>
    </div>`;
  }

  // ✅ RESULT
  else if (step === 8) {
    el.innerHTML = `
    <div class="card">
      <div class="icon">✅</div>

      <h3 class="result-success">
        You may be eligible for AngelBox support
      </h3>

      <p>
        Based on your answers, your application meets our initial eligibility criteria.
      </p>

      <p style="font-weight:600;">
        Please scroll down to start your application.
      </p>

      <button class="back" onclick="reset()">← Start again</button>
    </div>`;
  }
}

// ✅ HANDLERS
function nextBorough() {
  const val = document.getElementById("borough").value;
  if (!val) return alert("Please select a borough");

  answers.borough = val;

  step = supportedBoroughs.includes(val) ? 1 : "boroughFail";

  render();
}

function nextResidency() {
  const val = document.getElementById("residency").value;
  if (!val) return alert("Please select your residency status");

  const excluded = ["student","visitor","spouse"];
  step = excluded.includes(val) ? "residencyFail" : 2;

  render();
}

function nextEmployment() {
  answers.employment = document.getElementById("employment").value;
  step = 3;
  render();
}

function handleIncome(val) {
  answers.income = val;
  step = val === "yes" ? "incomeFail" : 4;
  render();
}

function handleDirector(val) {
  answers.director = val;
  step = val === "yes" ? "directorFail" : 5;
  render();
}

function handleBenefits(val) {
  answers.benefits = val;
  step = val === "yes" ? "benefitsList" : 6;
  render();
}

function autoSelectBenefit() {
  const val = document.getElementById("benefits").value;
  if (!val) return;

  answers.benefitMessage = benefitMessages[val] || benefitMessages["Other"];
  step = "benefitMessage";

  render();
}

function handleDueDate() {
  const val = document.getElementById("dueDate").value;
  if (!val) return alert("Please enter a date");

  const diff = (new Date(val) - new Date()) / (1000 * 60 * 60 * 24);

  step = diff > 60 ? "dueDateFail" : 7;

  render();
}

function handleEvidence(val) {
  step = val === "no" ? "evidenceFail" : 8;
  render();
}

function back() {
  if (typeof step === "number" && step > 0) step--;
  render();
}

function reset() {
  step = 0;
  answers = {};
  render();
}

render();
