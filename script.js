// SETARA — منطق نسخه‌ی اولیه
// برای افزودن مرحله‌ها، آرایه‌ی questions را ویرایش کن.
setTimeout(() => {
  document.getElementById('splash').classList.add('hide');
}, 3000);
const questions = [
  {
    title: "کدام اعداد عضو مجموعه‌ی A هستند؟",
    description: "همه‌ی اعضای مجموعه را انتخاب کن، سپس پاسخ را بررسی کن.",
    setText: "A = {۱، ۳، ۵}",
    options: [1, 2, 3, 4, 5],
    answer: [1, 3, 5],
    lesson: "مجموعه، گروهی از اعضای مشخص است. اگر عددی در مجموعه قرار داشته باشد، می‌گوییم عضو آن مجموعه است.",
    hint: "به تعریف مجموعه نگاه کن: فقط عددهایی را انتخاب کن که در A = {۱، ۳، ۵} نوشته شده‌اند.",
    explanation: "درست است! اعضای A فقط ۱، ۳ و ۵ هستند. عددهای ۲ و ۴ عضو این مجموعه نیستند."
  },
  {
    title: "کدام گزینه عضو مجموعه‌ی B است؟",
    description: "این بار مجموعه‌ی دیگری داریم. اعضای درست را انتخاب کن.",
    setText: "B = {۲، ۴}",
    options: [1, 2, 3, 4, 5],
    answer: [2, 4],
    lesson: "عضویت به تعریف همان مجموعه بستگی دارد. یک عدد ممکن است عضو B باشد، اما عضو A نباشد.",
    hint: "فقط عددهایی را انتخاب کن که در B = {۲، ۴} دیده می‌شوند.",
    explanation: "آفرین! اعضای B عددهای ۲ و ۴ هستند."
  },
  {
    title: "اعضای مجموعه‌ی C را پیدا کن.",
    description: "آخرین پرسش این مأموریت؛ با دقت انتخاب کن.",
    setText: "C = {۱، ۲، ۴، ۵}",
    options: [1, 2, 3, 4, 5],
    answer: [1, 2, 4, 5],
    lesson: "مجموعه‌ها می‌توانند هر تعداد عضو داشته باشند. مهم این است که دقیقاً اعضای تعریف‌شده را انتخاب کنی.",
    hint: "در C همه‌ی عددها به‌جز ۳ نوشته شده‌اند.",
    explanation: "درست است! اعضای C برابر با ۱، ۲، ۴ و ۵ هستند."
  }
];

const $ = (selector) => document.querySelector(selector);
const homeScreen = $("#home-screen");
const missionScreen = $("#mission-screen");
const resultScreen = $("#result-screen");
const optionsEl = $("#answer-options");
const feedbackEl = $("#feedback");

let currentQuestion = 0;
let selected = new Set();
let sessionScore = 0;
let questionChecked = false;
let hintUsed = false;

const faNumber = (number) => new Intl.NumberFormat("fa-IR").format(number);
const sameSet = (a, b) => a.length === b.length && a.every(value => b.includes(value));

function showScreen(screen) {
  [homeScreen, missionScreen, resultScreen].forEach(item => item.classList.add("hidden"));
  screen.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateScore() {
  $("#total-score").textContent = faNumber(Number(localStorage.getItem("setara-total-score") || 0));
  $("#session-score").textContent = faNumber(sessionScore);
  $("#score-fill").style.width = `${Math.min(sessionScore / (questions.length * 100) * 100, 100)}%`;
}

function renderQuestion() {
  const question = questions[currentQuestion];
  selected = new Set();
  questionChecked = false;
  hintUsed = false;

  $("#question-number").textContent = `پرسش ${faNumber(currentQuestion + 1).padStart(2, "۰")}`;
  $("#progress-label").textContent = `${faNumber(currentQuestion + 1)} از ${faNumber(questions.length)}`;
  $("#progress-fill").style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  $("#question-title").textContent = question.title;
  $("#question-description").textContent = question.description;
  $("#set-definition").textContent = question.setText;
  $("#lesson-text").textContent = question.lesson;
  optionsEl.replaceChildren();

  question.options.forEach(value => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.textContent = faNumber(value);
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", `عدد ${value}`);
    button.addEventListener("click", () => {
      if (questionChecked) return;
      if (selected.has(value)) selected.delete(value);
      else selected.add(value);
      button.classList.toggle("selected", selected.has(value));
      button.setAttribute("aria-pressed", String(selected.has(value)));
    });
    optionsEl.append(button);
  });

  feedbackEl.textContent = "";
  feedbackEl.className = "feedback hidden";
  $("#check-button").classList.remove("hidden");
  $("#next-button").classList.add("hidden");
  $("#hint-button").disabled = false;
  updateScore();
}

function checkAnswer() {
  if (questionChecked) return;
  const question = questions[currentQuestion];
  if (selected.size === 0) {
    feedbackEl.textContent = "اول دست‌کم یک گزینه انتخاب کن.";
    feedbackEl.className = "feedback bad";
    return;
  }

  const correct = sameSet([...selected], question.answer);
  questionChecked = true;
  [...optionsEl.children].forEach((button, index) => {
    const value = question.options[index];
    if (question.answer.includes(value)) button.classList.add("correct");
    else if (selected.has(value)) button.classList.add("wrong");
  });

  if (correct) {
    const gained = hintUsed ? 70 : 100;
    sessionScore += gained;
    const total = Number(localStorage.getItem("setara-total-score") || 0) + gained;
    localStorage.setItem("setara-total-score", String(total));
    feedbackEl.textContent = `${question.explanation} ${faNumber(gained)} امتیاز گرفتی.`;
    feedbackEl.className = "feedback good";
  } else {
    feedbackEl.textContent = "هنوز دقیق نیست. پاسخ درست با حاشیه‌ی سبز مشخص شده؛ توضیح را بخوان و در تلاش بعدی بهتر عمل کن.";
    feedbackEl.className = "feedback bad";
  }

  $("#check-button").classList.add("hidden");
  $("#next-button").classList.remove("hidden");
  $("#next-button").textContent = currentQuestion === questions.length - 1 ? "دیدن نتیجه ←" : "مرحله‌ی بعد ←";
  $("#hint-button").disabled = true;
  updateScore();
}

function showHint() {
  if (hintUsed || questionChecked) return;
  hintUsed = true;
  feedbackEl.textContent = `راهنمایی: ${questions[currentQuestion].hint}`;
  feedbackEl.className = "feedback";
}

function nextQuestion() {
  if (!questionChecked) return;
  if (currentQuestion < questions.length - 1) {
    currentQuestion += 1;
    renderQuestion();
  } else {
    $("#final-score").textContent = faNumber(sessionScore);
    showScreen(resultScreen);
  }
}

function startGame() {
  currentQuestion = 0;
  sessionScore = 0;
  renderQuestion();
  showScreen(missionScreen);
}

$("#start-button").addEventListener("click", startGame);
$("#restart-button").addEventListener("click", startGame);
$("#check-button").addEventListener("click", checkAnswer);
$("#hint-button").addEventListener("click", showHint);
$("#next-button").addEventListener("click", nextQuestion);
$("#back-button").addEventListener("click", () => showScreen(homeScreen));

const helpDialog = $("#how-dialog");
$("#how-button").addEventListener("click", () => helpDialog.showModal());
$("#close-help").addEventListener("click", () => helpDialog.close());
$("#got-it-button").addEventListener("click", () => helpDialog.close());

updateScore();
