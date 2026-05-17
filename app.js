
let step = 0;
let answers = {};

// ✅ Boroughs
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

// ✅ Benefit Messages
const benefitMessages = {
  "Universal Credit": "Thank you — this helps us understand your current situation.",
  "Income Support": "You may be prioritised for support based on your circumstances.",
  "Employment and Support Allowance (ESA)": "We understand you may be managing health-related challenges.",
  "Jobseeker’s Allowance (JSA)": "We recognise you are actively seeking work.",
  "Housing Benefit": "We understand housing costs can be challenging.",
  "Personal Independence Payment (PIP)": "We understand additional support needs.",
  "Disability Living Allowance (DLA)": "We understand additional care needs.",
  "Carer’s Allowance": "Caring responsibilities can be demanding — we recognise this.",
  "Awaiting benefit decision": "That’s completely okay — decisions can take time.",
  "Other": "Thank you — this helps us understand your situation."
};

// ✅ Progress bar
function progressUI() {
  const total = 7;
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

// ✅ Reusable rejection screen
function rejectionScreen(title, message, extra = "") {
  return `
    <div class="card">
      <div class="icon">⚠️</div>

      <h3 class="result-warning">${title}</h3>

      <p>${message}</p>

      ${extra ? `<div class="alert">${extra}</div>` : ""}

      <button class="btn secondary" onclick="window.location.href='mailto:info@basbutton class="back" onclick="reset()">← Start again</button>
    </div>
  `;
}

function render() {
  const el = document.getElementById("app");

  // ✅ FAIL STATES
  if (step === "boroughFail") {
    el.innerHTML = rejectionScreen(
      "Support in your area is different",
      `We don’t currently deliver AngelBox in ${answers.borough}.`
    );
    return;
  }

  if (step === "residencyFail") {
    el.innerHTML = rejectionScreen(
      "We may not be able to support at this stage",
      "Some residency types fall outside our criteria."
    );
    return;
  }

  if (step === "incomeFail") {
    el.innerHTML = rejectionScreen(
      "We may not be able to support",
      "Our service prioritises households below £10,500 income."
    );
    return;
  }

  if (step === "dueDateFail") {
    el.innerHTML = rejectionScreen(
      "It may be a bit early to apply",
      "Your baby is due in more than 2 months.",
      "Applications may be processed closer to your due date."
    );
    return;
  }

  if (step === "evidenceFail") {
    el.innerHTML = rejectionScreen(
      "We may not be able to proceed",
      "We require evidence to assess applications fairly."
    );
    return;
  }

  // ✅ STEP 0 — Borough
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

  // ✅ STEP 1 — Residency
  else if (step === 1) {
    el.innerHTML = `
      <div class="card">
        ${progressUI()}

        <p>What is your residency status in the UK?</p>

        <select id="residency">
          <option value="">Select</option>
          <option value="uk">UK citizen or settled</option>
          <option value="asylum">Asylum seeker or refugee</option>
          <option value="limited">Limited leave</option>
          <option value="student">Student visa</option>
          <option value="visitor">Visitor visa</option>
          <option value="spouse">Spouse visa</option>
          <option value="fiance">Fiancé visa</option>
        </select>

        <button class="btn primary" onclick="nextResidency()">Continue</button>
        <button class="back" onclick="back()">← Go back</button>
      </div>`;
  }

  // ✅ STEP 2 — Employment
  else if (step === 2) {
    el.innerHTML = `
      <div class="card">
        ${progressUI()}

        <p>What is your current work situation?</p>

        <select id="employment">
          <option value="">Select</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Self-employed</option>
          <option>Contract work</option>
          <option>Not working</option>
        </select>

        <button class="btn primary" onclick="nextEmployment()">Continue</button>
        <button class="back" onclick="back()">← Go back</button>
      </div>`;
  }

  // ✅ STEP 3 — Income
  else if (step === 3) {
    el.innerHTML = `
      <div class="card">
        ${progressUI()}

        <p>Is your household income above £10,500 per year?</p>

        <button class="btn primary" onclick="handleIncome('no')">No</button>
        <button class="btn secondary" onclick="handleIncome('yes')">Yes</button>

        <button class="back" onclick="back()">← Go back</button>
      </div>`;
  }

  // ✅ STEP 4 — Benefits question
  else if (step === 4) {
    el.innerHTML = `
      <div class="card">
        ${progressUI()}

        <p>Are you currently receiving benefits?</p>

        <button class="btn primary" onclick="handleBenefits('yes')">Yes</button>
        <button class="btn secondary" onclick="handleBenefits('no')">No</button>

        <button class="back" onclick="back()">← Go back</button>
      </div>`;
  }

  // ✅ Benefits dropdown
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
          <option>Jobseeker’s Allowance (JSA)</option>
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

  // ✅ Benefit message
  else if (step === "benefitMessage") {
    el.innerHTML = `
      <div class="card">
        ${progressUI()}

        <p class="reassurance">
          ${answers.benefitMessage}
        </p>

      </div>
    `;

    // ✅ Auto move after 2 seconds
    setTimeout(() => {
      step = 5;
      render();
    }, 1500);

    return;
  }

  // ✅ STEP 5 — Due date
  else if (step === 5) {
    el.innerHTML = `
      <div class="card">
        ${progressUI()}

        <p>When is your baby due (or date of birth)?</p>

        <input type="date" id="dueDate">

        <button class="btn primary" onclick="handleDueDate()">Continue</button>
        <button class="back" onclick="back()">← Go back</button>
      </div>`;
  }

  // ✅ STEP 6 — Evidence
  else if (step === 6) {
    el.innerHTML = `
      <div class="card">
        ${progressUI()}

        <p>Can you provide evidence if required?</p>

        <button class="btn primary" onclick="handleEvidence('yes')">Yes</button>
        <button class="btn secondary" onclick="handleEvidence('no')">No</button>

        <button class="back" onclick="back()">← Go back</button>
      </div>`;
  }

  // ✅ FINAL RESULT
  else if (step === 7) {
    el.innerHTML = `
      <div class="card">
        <div class="icon">✅</div>

        <h3 class="result-success">
          You may be eligible for AngelBox support
        </h3>

        <p>
          Based on the information you’ve provided, your application meets our initial eligibility criteria.
        </p>

        <p style="font-weight:600;">
          Please scroll down the page to start your application.
        </p>

        <button class="back" onclick="reset()">← Start again</button>
      </div>
    `;
  }
}

// ✅ HANDLERS

function nextBorough() {
  const val = document.getElementById("borough").value;
  if (!val) return alert("Select a borough");

  answers.borough = val;

  if (!supportedBoroughs.includes(val)) step = "boroughFail";
  else step = 1;

  render();
}

function nextResidency() {
  const val = document.getElementById("residency").value;
  answers.residency = val;

  const excluded = ["student","visitor","spouse","fiance"];
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

function handleBenefits(val) {
  answers.benefits = val;
  step = val === "yes" ? "benefitsList" : 5;
  render();
}

function autoSelectBenefit() {
  const val = document.getElementById("benefits").value;
  if (!val) return;

  answers.benefitsType = val;
  answers.benefitMessage = benefitMessages[val] || benefitMessages["Other"];

  step = "benefitMessage";
  render();
}

function handleDueDate() {
  const input = document.getElementById("dueDate").value;
  if (!input) return alert("Enter a date");

  const diff = (new Date(input) - new Date()) / (1000*60*60*24);

  if (diff > 60) step = "dueDateFail";
  else {
    answers.childTiming = "eligible";
    step = 6;
  }

  render();
}

function handleEvidence(val) {
  answers.evidence = val;
  step = val === "no" ? "evidenceFail" : 7;
  render();
}

function back() { step--; render(); }
function reset() { step = 0; answers = {}; render(); }

render();
