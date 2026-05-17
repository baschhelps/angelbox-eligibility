
let step = 0;
let answers = {};

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

function progressUI() {
  const total = 8;
  const percent = Math.round((step / total) * 100);

  return `
    <div class="progress-wrapper">
      <div>Step ${step} of ${total}</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${percent}%"></div>
      </div>
    </div>`;
}

function rejectionScreen(title, message, extra = "") {
  return `
    <div class="card">
      <div class="icon">⚠️</div>
      <h3 class="result-warning">${title}</h3>
      <p>${message}</p>

      ${extra ? `<div class="alert">${extra}</div>` : ""}

      <p>If you believe your situation should still be considered, please contact us.</p>

      <button class="btn secondary" onclick="window.location.href='mailto

      <button class="back" onclick="reset()">← Start again</button>
    </div>`;
}

function render() {
  const el = document.getElementById("app");

  // STEP 0 — BOROUGH
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

  // STEP 1 — RESIDENCY
  else if (step === 1) {
    el.innerHTML = `
      <div class="card">
        ${progressUI()}

        <p>What is your current residency status in the UK?</p>

        <select id="residency">
          <option value="">Select</option>
          <option value="uk">UK citizen or settled</option>
          <option value="asylum">Asylum seeker or refugee</option>
          <option value="limited">Limited leave to remain</option>
          <option value="student">Student visa</option>
          <option value="visitor">Visitor visa</option>
          <option value="spouse">Spouse visa</option>
          <option value="fiance">Fiancé visa</option>
        </select>

        <button class="btn primary" onclick="nextResidency()">Continue</button>
        <button class="back" onclick="back()">← Go back</button>
      </div>`;
  }

  // STEP 2 — EMPLOYMENT
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
          <option>Not currently working</option>
        </select>

        <button class="btn primary" onclick="nextEmployment()">Continue</button>
        <button class="back" onclick="back()">← Go back</button>
      </div>`;
  }

  // STEP 3 — INCOME
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

  // STEP 4 — BENEFITS
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

  // BENEFITS LIST
  else if (step === "benefitsList") {
    el.innerHTML = `
      <div class="card">
        ${progressUI()}

        <p>Which benefits are you receiving?</p>

        <select id="benefits">
          <option value="">Select</option>
          <option>Universal Credit</option>
          <option>Income Support</option>
          <option>ESA</option>
          <option>JSA</option>
          <option>Child Tax Credit</option>
          <option>Housing Benefit</option>
          <option>PIP</option>
          <option>DLA</option>
          <option>Other</option>
        </select>

        <button class="btn primary" onclick="saveBenefits()">Continue</button>
        <button class="back" onclick="back()">← Go back</button>
      </div>`;
  }

  // STEP — DUE DATE
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

  // STEP — EVIDENCE
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

    const eligible =
      supportedBoroughs.includes(answers.borough) &&
      answers.residency &&
      answers.income === "no" &&
      answers.director !== "yes" &&
      answers.childTiming === "eligible" &&
      answers.evidence === "yes";

    el.innerHTML = `
      <div class="card">

        ${
          eligible
          ? `
          <div class="icon">✅</div>

          <h3 class="result-success">
            You may be eligible for AngelBox support
          </h3>

          <p>
            Based on the information you’ve provided, your application meets our initial eligibility criteria.
          </p>

          <p class="reassurance">
            You're now ready to continue to the next step of your application.
          </p>

          <p style="margin-top:20px; font-weight:600;">
            Please scroll down the page to start your application.
          </p>
          `
          : rejectionScreen(
              "We may need more information",
              "We cannot confirm eligibility at this stage."
            )
        }

        <button class="back" onclick="reset()">← Start again</button>

      </div>`;
  }
}

/* HANDLERS */

function nextBorough() {
  const val = document.getElementById("borough").value;
  if (!val) return alert("Please select a borough");

  answers.borough = val;

  if (!supportedBoroughs.includes(val)) {
    document.getElementById("app").innerHTML = rejectionScreen(
      "Support in your area is different",
      `We don’t currently deliver AngelBox in ${val}.`
    );
    return;
  }

  step = 1;
  render();
}

function nextResidency() {
  const val = document.getElementById("residency").value;
  answers.residency = val;

  const excluded = ["student","visitor","spouse","fiance"];
  if (excluded.includes(val)) {
    document.getElementById("app").innerHTML = rejectionScreen(
      "We may not be able to support",
      "Some visa conditions require higher income support than our threshold."
    );
    return;
  }

  step++;
  render();
}

function nextEmployment() {
  answers.employment = document.getElementById("employment").value;
  step++;
  render();
}

function handleIncome(val) {
  answers.income = val;

  if (val === "yes") {
    document.getElementById("app").innerHTML = rejectionScreen(
      "We may not be able to support",
      "Our service prioritises households below £10,500 income."
    );
    return;
  }

  step++;
  render();
}

function handleBenefits(val) {
  answers.benefits = val;

  if (val === "yes") step = "benefitsList";
  else step++;

  render();
}

function saveBenefits() {
  answers.benefitsType = document.getElementById("benefits").value;
  step++;
  render();
}

function handleDueDate() {
  const input = document.getElementById("dueDate").value;
  const due = new Date(input);
  const today = new Date();

  const diff = (due - today) / (1000 * 60 * 60 * 24);

  if (diff > 60) {
    document.getElementById("app").innerHTML = rejectionScreen(
      "It may be too early to apply",
      "Applications are prioritised closer to your due date."
    );
    return;
  }

  answers.childTiming = "eligible";
  step++;
  render();
}

function handleEvidence(val) {
  answers.evidence = val;

  if (val === "no") {
    document.getElementById("app").innerHTML = rejectionScreen(
      "We may not be able to proceed",
      "We require evidence to assess applications fairly."
    );
    return;
  }

  step++;
  render();
}

function back() { step--; render(); }
function reset() { step=0; answers={}; render(); }

render();
