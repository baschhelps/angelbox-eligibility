
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
  "Kingston","Lambeth","Lewisham","Merton","Newham",
  "Redbridge","Richmond","Southwark","Sutton",
  "Tower Hamlets","Waltham Forest","Wandsworth","Westminster"
];

function progressUI() {
  const total = 7;
  const percent = Math.round((step / total) * 100);

  return `
    <div class="progress-wrapper">
      <div>Step ${step} of ${total}</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${percent}%"></div>
      </div>
    </div>`;
}

function render() {
  const el = document.getElementById("app");

  // STEP 0 Borough
  if (step === 0) {
    el.innerHTML = `
      <div class="card">
        <p>Which London borough do you live in?</p>
        <select id="borough">
          <option value="">Select</option>
          ${allBoroughs.map(b => `<option>${b}</option>`).join("")}
        </select>
        <button class="btn primary" onclick="nextBorough()">Continue</button>
      </div>`;
  }

  else if (step === 1) {
    el.innerHTML = `
      <div class="card">
        ${progressUI()}
        <p>Do you have access to public support in the UK?</p>
        <p class="reassurance">
          This usually excludes student, visitor, fiancé or spouse visas.
        </p>
        <button class="btn primary" onclick="residency('yes')">Yes</button>
        <button class="btn secondary" onclick="residency('no')">No</button>
        <button class="back" onclick="back()">← Back</button>
      </div>`;
  }

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
        <button class="back" onclick="back()">← Back</button>
      </div>`;
  }

  else if (step === 3) {
    el.innerHTML = `
      <div class="card">
        ${progressUI()}
        <p>Is your household income above £10,500 per year?</p>
        <button class="btn primary" onclick="income('no')">No</button>
        <button class="btn secondary" onclick="income('yes')">Yes</button>
        <button class="back" onclick="back()">← Back</button>
      </div>`;
  }

  else if (step === 4) {
    el.innerHTML = `
      <div class="card">
        ${progressUI()}
        <p>Are you a company director?</p>
        <button class="btn primary" onclick="director('no')">No</button>
        <button class="btn secondary" onclick="director('yes')">Yes</button>
        <button class="back" onclick="back()">← Back</button>
      </div>`;
  }

  else if (step === 5) {
    el.innerHTML = `
      <div class="card">
        ${progressUI()}
        <p>Does your child need essential support?</p>
        <button class="btn primary" onclick="setAnswer('need','yes')">Yes</button>
        <button class="btn secondary" onclick="setAnswer('need','no')">No</button>
        <button class="back" onclick="back()">← Back</button>
      </div>`;
  }

  else if (step === 6) {
    el.innerHTML = `
      <div class="card">
        ${progressUI()}
        <p>Are you experiencing financial hardship?</p>
        <button class="btn primary" onclick="setAnswer('crisis','yes')">Yes</button>
        <button class="btn secondary" onclick="setAnswer('crisis','no')">No</button>
        <button class="back" onclick="back()">← Back</button>
      </div>`;
  }

  else {
    const eligible =
      supportedBoroughs.includes(answers.borough) &&
      answers.residency === "yes" &&
      answers.income === "no" &&
      answers.director === "no" &&
      answers.need === "yes" &&
      answers.crisis === "yes";

    el.innerHTML = `
      <div class="card">

        ${
          eligible
          ? `
            <h3 style="color:#15803d;">You appear eligible for support</h3>
            <p>Please continue to complete your request.</p>

            https://baschhelps.org/angelbox-portal">
              <button class="btn primary">Continue</button>
            </a>
          `
          : `
            <h3>We may need more information</h3>
            <p>Please contact our team.</p>
            <p><b>info@baschhelps.org</b></p>
          `
        }

        <button class="back" onclick="reset()">Start again</button>
      </div>`;
  }
}

// ✅ Handlers
function nextBorough() {
  const val = document.getElementById("borough").value;
  if (!val) return alert("Select borough");

  answers.borough = val;

  if (!supportedBoroughs.includes(val)) {
    step = "fallback";
  } else {
    step = 1;
  }

  render();
}

function residency(val) {
  answers.residency = val;
  step = val === "no" ? "residencyFail" : 2;
  render();
}

function nextEmployment() {
  answers.employment = document.getElementById("employment").value;
  step = 3;
  render();
}

function income(val) {
  answers.income = val;
  step = val === "yes" ? "incomeFail" : 4;
  render();
}

function director(val) {
  answers.director = val;
  step = val === "yes" ? "incomeFail" : 5;
  render();
}

function setAnswer(key,val) {
  answers[key] = val;
  step++;
  render();
}

function back() {
  step--;
  render();
}

function reset() {
  step = 0;
  answers = {};
  render();
}

render();
