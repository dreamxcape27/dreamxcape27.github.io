const body = document.body;
const panels = [...document.querySelectorAll(".question-panel")];
const progressLabel = document.querySelector("#progress-label");
const progressCount = document.querySelector("#progress-count");
const progressBar = document.querySelector("#progress-bar");
const flash = document.querySelector("#screen-flash");
const normalTitle = document.querySelector("#normal-title");
const normalHelp = document.querySelector("#normal-help");
const normalAnswers = document.querySelector("#normal-answers");
let normalQuestionIndex = 0;
const normalResponses = [];
const cognitionTitle = document.querySelector("#cognition-title");
const cognitionHelp = document.querySelector("#cognition-help");
const cognitionAnswers = document.querySelector("#cognition-answers");
let cognitionQuestionIndex = 0;
let anomalyTimer;
let participantName = "X";
let aliasName = "X";
let correctedName = "X";
let companionChoiceLocked = false;
let presenceChoiceLocked = false;

const cognitionQuestions = [
  {
    number: 6,
    title: "过去两周内，您是否会忘记刚刚放下的物品在哪里？",
    help: "例如钥匙、手机、眼镜或其他日常用品。",
    answers: ["从不", "很少", "有时", "经常", "几乎每天"]
  },
  {
    number: 7,
    title: "进入一个熟悉的房间后，您是否会短暂忘记自己为什么来到这里？",
    help: "请根据这种情况在近期出现的频率作答。",
    answers: ["从未发生", "很少发生", "有时发生", "经常发生", "几乎总是"]
  },
  {
    number: 9,
    title: "当同时收到多条消息或通知时，您能否轻松分辨它们的来源？",
    help: "例如区分工作消息、私人对话与系统通知。",
    answers: ["总是可以", "大多时候可以", "有时会混淆", "经常混淆", "很难分辨"]
  },
  {
    number: 11,
    title: "您在熟悉的环境中定位方向时，是否会感到困难？",
    help: "请仅考虑近期与往常相比出现的变化。",
    answers: ["完全不会", "很少", "偶尔", "经常", "几乎总是"]
  }
];

const normalQuestions = [
  {
    title: "过去两周内，您的睡眠质量如何？",
    help: "请综合考虑入睡速度、夜间醒来次数与醒后感受。",
    answers: ["非常好", "比较好", "一般", "比较差", "非常差"]
  },
  {
    title: "过去两周内，您有多少时候感到精力不足？",
    help: "请以大多数日常活动时的感受为准。",
    answers: ["从不", "偶尔", "有时", "经常", "几乎总是"]
  },
  {
    title: "您是否曾因注意力不集中，而难以完成原本熟悉的事情？",
    help: "例如阅读、回复消息、处理工作或完成家务。",
    answers: ["从未发生", "很少发生", "有时发生", "经常发生", "每天都会发生"]
  },
  {
    title: "当计划被打乱或遇到意外时，您通常需要多久才能恢复平静？",
    help: "请选择最接近您通常反应的选项。",
    answers: ["几分钟内", "半小时内", "几小时内", "需要一整天", "通常需要更久"]
  }
];

function showPanel(id, focusSelector) {
  panels.forEach((panel) => {
    const active = panel.id === id;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  window.setTimeout(() => document.querySelector(focusSelector)?.focus(), 220);
}

function setError(id, message) {
  document.querySelector(id).textContent = message;
}

function updateProgress(questionNumber, label = "近期状态") {
  progressLabel.textContent = label;
  progressCount.textContent = `${String(questionNumber).padStart(2, "0")} / 24`;
  progressBar.style.width = `${(questionNumber / 24) * 100}%`;
}

function playIdentityGlitch() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const master = context.createGain();
  const oscillator = context.createOscillator();
  const noise = context.createBufferSource();
  const noiseFilter = context.createBiquadFilter();
  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * 0.34), context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
  noise.buffer = buffer;
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = 780;
  noiseFilter.Q.value = 0.7;
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(74, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(42, context.currentTime + 0.32);
  master.gain.setValueAtTime(0.0001, context.currentTime);
  master.gain.exponentialRampToValueAtTime(0.055, context.currentTime + 0.018);
  master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.34);
  oscillator.connect(master);
  noise.connect(noiseFilter).connect(master);
  master.connect(context.destination);
  oscillator.start();
  noise.start();
  oscillator.stop(context.currentTime + 0.35);
  noise.stop(context.currentTime + 0.35);
  window.setTimeout(() => context.close(), 500);
}

function playKnocking() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const master = context.createGain();
  master.gain.value = 0.12;
  master.connect(context.destination);
  [0, 0.34, 0.7].forEach((offset, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 72 - index * 4;
    gain.gain.setValueAtTime(0.0001, context.currentTime + offset);
    gain.gain.exponentialRampToValueAtTime(0.9, context.currentTime + offset + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + offset + 0.13);
    oscillator.connect(gain).connect(master);
    oscillator.start(context.currentTime + offset);
    oscillator.stop(context.currentTime + offset + 0.14);
  });
  window.setTimeout(() => context.close(), 1100);
}

function renderCognitionQuestion(index) {
  cognitionQuestionIndex = index;
  const question = cognitionQuestions[index];
  updateProgress(question.number, "认知与感知");
  cognitionTitle.textContent = question.title;
  cognitionHelp.textContent = question.help;
  cognitionAnswers.replaceChildren();
  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = answer;
    button.addEventListener("click", () => advanceCognition(button));
    cognitionAnswers.append(button);
  });
}

function advanceCognition(button) {
  if (cognitionAnswers.classList.contains("is-locked")) return;
  cognitionAnswers.classList.add("is-locked");
  button.classList.add("is-selected");
  window.setTimeout(() => {
    cognitionAnswers.classList.remove("is-locked");
    if (cognitionQuestionIndex === 0) {
      renderCognitionQuestion(1);
      return;
    }
    if (cognitionQuestionIndex === 1) {
      updateProgress(8, "认知与感知");
      showPanel("door-panel", "#door-answers button");
      return;
    }
    if (cognitionQuestionIndex === 2) {
      startPerceptionAnomaly();
      return;
    }
    if (cognitionQuestionIndex === 3) {
      startSectionFourIntro();
    }
  }, 260);
}

const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

async function rewriteText(element, replacement) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.classList.add("is-being-edited");
  if (reducedMotion) {
    await wait(500);
    element.textContent = replacement;
    element.classList.remove("is-being-edited");
    return;
  }
  while (element.textContent.length > 0) {
    element.textContent = element.textContent.slice(0, -1);
    await wait(14);
  }
  await wait(170);
  for (const character of replacement) {
    element.textContent += character;
    await wait(105);
  }
  element.classList.remove("is-being-edited");
}

async function startSectionFourIntro() {
  updateProgress(12, "个体内在体验");
  showPanel("section-four-intro-panel", "#section-four-title");
  await wait(2400);
  await rewriteText(document.querySelector("#intro-copy-two"), "不要听他们的。");
  await wait(500);
  await rewriteText(document.querySelector("#intro-copy-one"), "不要看。");
  await wait(650);
  await rewriteText(document.querySelector("#intro-copy-three"), "不要离开。我会陪着你。");
  document.querySelector("#section-four-title").textContent = "别让他们看见";
  document.querySelector("#section-four-kicker").textContent = "请继续阅读";
  document.querySelector("#auto-continue").innerHTML = "<span></span>已确认";
  await wait(1100);
  enterCompanionMode();
}

function enterCompanionMode() {
  body.classList.add("companion-mode");
  progressLabel.textContent = "";
  progressCount.textContent = "？ / ???";
  progressBar.style.width = "67%";
  document.querySelector(".assessment-header .study-code").textContent = "DX-??";
  document.querySelector("#connection-status").innerHTML = "<i></i>CONNECTED";
  showPanel("companion-question-panel", ".companion-answers button");
}

function flashCoercion() {
  flash.classList.remove("coercion-flash");
  void flash.offsetWidth;
  flash.classList.add("coercion-flash");
  window.setTimeout(() => flash.classList.remove("coercion-flash"), 460);
}

function acceptCompanion() {
  if (companionChoiceLocked) return;
  companionChoiceLocked = true;
  const dialog = document.querySelector("#companion-dialog");
  document.querySelector("#permission-user").textContent = participantName;
  dialog.hidden = false;
  window.setTimeout(() => dialog.classList.add("is-visible"), 20);
  window.setTimeout(() => {
    dialog.classList.remove("is-visible");
    window.setTimeout(() => {
      dialog.hidden = true;
      progressCount.textContent = "13 / 12";
      progressBar.style.width = "84%";
      showPanel("presence-question-panel", "#presence-question-panel button");
    }, 260);
  }, 2600);
}

document.querySelectorAll("#companion-answers button").forEach((button) => {
  button.addEventListener("click", () => {
    if (companionChoiceLocked || button.classList.contains("is-being-corrected")) return;
    if (button.textContent.trim() === "喜欢") {
      button.classList.add("is-selected");
      acceptCompanion();
      return;
    }
    flashCoercion();
    button.classList.add("is-being-corrected");
    window.setTimeout(() => {
      button.textContent = "喜欢";
      button.classList.remove("is-being-corrected");
      button.classList.add("is-forced-like");
    }, 170);
  });
});

function beginTurnaround() {
  if (presenceChoiceLocked) return;
  presenceChoiceLocked = true;
  body.classList.add("turnaround-mode");
  progressLabel.textContent = "";
  progressCount.textContent = "";
  progressBar.style.width = "100%";
  showPanel("turnaround-panel", "#turnaround-title");
  window.setTimeout(() => {
    body.classList.remove("turnaround-mode");
    runIdentityRewrite();
  }, 3000);
}

document.querySelectorAll("#presence-answers button").forEach((button) => {
  button.addEventListener("click", () => {
    if (presenceChoiceLocked || button.classList.contains("is-being-corrected")) return;
    if (button.textContent.trim() === "我不是一个人") {
      button.classList.add("is-selected");
      window.setTimeout(beginTurnaround, 220);
      return;
    }
    flashCoercion();
    button.classList.add("is-being-corrected");
    window.setTimeout(() => {
      button.textContent = "我不是一个人";
      button.classList.remove("is-being-corrected");
      button.classList.add("is-forced-like");
    }, 170);
  });
});

async function runIdentityRewrite() {
  progressCount.textContent = "?? / ??";
  progressBar.style.width = "48%";
  const title = document.querySelector("#identity-rewrite-title");
  showPanel("identity-rewrite-panel", "#identity-rewrite-title");
  await wait(2400);
  await rewriteText(title, "你想让我成为谁？");
  const choices = document.querySelector("#name-answers");
  choices.replaceChildren();
  [participantName, aliasName, correctedName].forEach((name) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = name || "X";
    button.addEventListener("click", () => beginMeetingQuestion(button));
    choices.append(button);
  });
  choices.hidden = false;
  choices.classList.add("is-revealed");
  choices.querySelector("button")?.focus();
}

function beginMeetingQuestion(button) {
  if (button.classList.contains("is-selected")) return;
  button.classList.add("is-selected");
  progressCount.textContent = "27 / 00";
  progressBar.style.width = "73%";
  showPanel("meeting-panel", "#meeting-title");
  window.setTimeout(() => {
    document.querySelector('#meeting-answers [data-answer="yes"]').classList.add("is-auto-selected");
    window.setTimeout(showCameraRequest, 750);
  }, 3400);
}

function showCameraRequest() {
  const dialog = document.querySelector("#camera-dialog");
  const cursor = document.querySelector("#fake-cursor");
  const allowButton = document.querySelector("#allow-camera");
  dialog.hidden = false;
  document.querySelector("#camera-user").textContent = "蟄�" + Math.floor(Math.random() * 90 + 10) + "繧ｿ";
  window.setTimeout(() => {
    dialog.classList.add("is-visible");
    cursor.classList.add("is-visible");
    cursor.style.left = `${window.innerWidth * 0.54}px`;
    cursor.style.top = `${window.innerHeight - 22}px`;
    window.setTimeout(() => {
      const target = allowButton.getBoundingClientRect();
      cursor.classList.add("is-moving");
      cursor.style.left = `${target.left + target.width * 0.58}px`;
      cursor.style.top = `${target.top + target.height * 0.55}px`;
    }, 180);
  }, 20);
  window.setTimeout(() => {
    allowButton.classList.add("is-auto-approved");
    cursor.classList.add("is-clicking");
  }, 2850);
  window.setTimeout(() => {
    dialog.classList.remove("is-visible");
    window.setTimeout(() => {
      dialog.hidden = true;
      cursor.className = "fake-cursor";
      body.classList.add("seen-mode");
      progressLabel.textContent = "";
      progressCount.textContent = "LIVE";
      progressBar.style.width = "100%";
      document.querySelector("#connection-status").innerHTML = "<i></i>ACTIVE";
      showPanel("seen-panel", "#seen-title");
      window.setTimeout(startForeverSequence, 3000);
    }, 260);
  }, 3500);
}

function buildBarrage() {
  const layer = document.querySelector("#barrage-layer");
  const phrases = [
    "喜欢喜欢喜欢喜欢喜欢",
    "愿意愿意愿意愿意愿意",
    "我看到你了    我听到你了",
    "快开门啊    快开门啊",
    "我想见你我想见你我想见你",
    "像喜欢海豹一样喜欢你",
    "天天出现在我的梦里吧",
    "不要离开    不要离开",
    "dreamxcape dreamxcape dreamxcape"
  ];
  layer.replaceChildren();
  phrases.forEach((phrase, index) => {
    const line = document.createElement("span");
    line.textContent = phrase;
    line.style.setProperty("--row", `${7 + index * 10.5}%`);
    line.style.setProperty("--duration", `${8.5 + (index % 4) * 1.7}s`);
    line.style.setProperty("--delay", `${-index * 1.25}s`);
    line.style.setProperty("--tilt", `${index % 2 === 0 ? -2 : 2.5}deg`);
    line.className = index % 3 === 0 ? "barrage-line is-large" : "barrage-line";
    layer.append(line);
  });
}

function placeCursorAtBottom() {
  const cursor = document.querySelector("#fake-cursor");
  cursor.className = "fake-cursor is-visible";
  cursor.style.transition = "none";
  cursor.style.left = `${window.innerWidth * 0.48}px`;
  cursor.style.top = `${window.innerHeight - 24}px`;
  return cursor;
}

async function moveCursor(cursor, target, duration) {
  const bounds = target.getBoundingClientRect();
  await wait(40);
  cursor.style.transition = `left ${duration}ms cubic-bezier(.36,.04,.16,1), top ${duration}ms cubic-bezier(.36,.04,.16,1)`;
  cursor.style.left = `${bounds.left + bounds.width * 0.54}px`;
  cursor.style.top = `${bounds.top + bounds.height * 0.55}px`;
  await wait(duration + 80);
}

async function typeForcedConsent(input) {
  let committed = "";
  const parts = [{ pinyin: "wo", character: "我" }, { pinyin: "yuan", character: "愿" }, { pinyin: "yi", character: "意" }];
  for (const part of parts) {
    for (const character of part.pinyin) {
      input.value += character;
      await wait(190);
    }
    await wait(260);
    committed += part.character;
    input.value = committed;
    await wait(230);
  }
  input.value += "。";
}

async function startForeverSequence() {
  body.classList.remove("seen-mode");
  body.classList.add("forever-mode");
  progressCount.textContent = "FOREVER";
  progressBar.style.width = "100%";
  buildBarrage();
  showPanel("forever-panel", "#forever-title");
  await wait(1900);
  const cursor = placeCursorAtBottom();
  const input = document.querySelector("#forever-answer");
  const submit = document.querySelector("#forever-submit");
  await moveCursor(cursor, input, 2100);
  cursor.classList.add("is-clicking");
  input.classList.add("is-controlled");
  await wait(160);
  cursor.classList.remove("is-clicking");
  await typeForcedConsent(input);
  await wait(600);
  await moveCursor(cursor, submit, 1550);
  cursor.classList.add("is-clicking");
  submit.classList.add("is-auto-submitted");
  await wait(180);
  beginFinalBlackout(cursor);
}

function beginFinalBlackout(cursor) {
  cursor.className = "fake-cursor";
  flash.classList.add("final-blackout");
  window.setTimeout(() => {
    body.classList.remove("forever-mode");
    body.classList.add("reboot-mode");
    showPanel("reboot-panel", "#reboot-title");
  }, 1950);
  window.setTimeout(() => flash.classList.remove("final-blackout"), 2200);
  window.setTimeout(() => {
    document.querySelector("#boot-log").insertAdjacentHTML("beforeend", "<p>STATUS 0x27 · 正在恢复会话…</p>");
  }, 2850);
  window.setTimeout(() => {
    document.querySelector("#boot-log").insertAdjacentHTML("beforeend", "<p class=\"boot-failure\">FATAL: RESTART FAILED</p>");
  }, 3900);
  window.setTimeout(showErrorPage, 5050);
}

function showErrorPage() {
  body.classList.remove("reboot-mode");
  body.classList.add("error-mode");
  showPanel("error-panel", "#error-title");
  window.setTimeout(() => {
    flashCoercion();
    document.querySelector("#error-title").textContent = "不要着急。";
    document.querySelector("#error-copy").textContent = "我们马上就要再见了。";
    document.querySelector("#error-copy").classList.add("return-message");
  }, 10000);
}

document.querySelectorAll("#camera-dialog button").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
});

function startPerceptionAnomaly() {
  const messages = ["你还记得它吗？", "你还认得我吗？", "你能看见我吗？"];
  const fragments = ["縺ｿ縺臥ｿ", "譁｢螟ｱ縺", "遉私ｒ繧ｿ", "蟄励ｲ還｣", "�� 00 27"];
  const title = document.querySelector("#perception-anomaly-title");
  const answerButtons = [...document.querySelectorAll("#anomaly-answers button")];
  progressLabel.textContent = "";
  progressCount.textContent = "10 / 24";
  progressBar.style.width = "41.6%";
  body.classList.add("perception-failure");
  showPanel("perception-anomaly-panel", "#perception-anomaly-title");
  let tick = 0;
  anomalyTimer = window.setInterval(() => {
    tick += 1;
    title.textContent = messages[tick % messages.length];
    answerButtons.forEach((button, index) => {
      button.textContent = fragments[(tick + index * 2) % fragments.length];
    });
    body.classList.toggle("anomaly-dim", tick % 3 === 0);
  }, 230);
  window.setTimeout(() => {
    window.clearInterval(anomalyTimer);
    body.classList.remove("perception-failure", "anomaly-dim");
    renderCognitionQuestion(3);
    showPanel("cognition-panel", "#cognition-answers button");
  }, 7000);
}

function renderNormalQuestion() {
  const question = normalQuestions[normalQuestionIndex];
  const questionNumber = normalQuestionIndex + 2;
  updateProgress(questionNumber);
  normalTitle.textContent = question.title;
  normalHelp.textContent = question.help;
  normalAnswers.replaceChildren();
  question.answers.forEach((answer, answerIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = answer;
    button.dataset.value = String(answerIndex);
    button.addEventListener("click", () => selectNormalAnswer(button, answerIndex));
    normalAnswers.append(button);
  });
}

function selectNormalAnswer(button, value) {
  if (normalAnswers.classList.contains("is-locked")) return;
  normalAnswers.classList.add("is-locked");
  button.classList.add("is-selected");
  normalResponses[normalQuestionIndex] = value;
  window.setTimeout(() => {
    normalQuestionIndex += 1;
    if (normalQuestionIndex < normalQuestions.length) {
      renderNormalQuestion();
      normalAnswers.classList.remove("is-locked");
      normalTitle.focus({ preventScroll: true });
      return;
    }
    updateProgress(5);
    showPanel("section-complete-panel", "#continue-section");
  }, 280);
}

document.querySelector("#profile-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const age = Number(document.querySelector("#age").value);
  const gender = document.querySelector('input[name="gender"]:checked');
  const name = document.querySelector("#name").value.trim();
  setError("#age-error", age >= 12 && age <= 100 ? "" : "请输入有效年龄。");
  setError("#gender-error", gender ? "" : "请选择一项。");
  setError("#name-error", name ? "" : "请输入您的名字。");
  if (!(age >= 12 && age <= 100) || !gender || !name) return;
  participantName = name;
  showPanel("alias-panel", "#alias");
});

document.querySelector("#alias-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const alias = document.querySelector("#alias").value.trim();
  setError("#alias-error", alias ? "" : "请回答后继续。");
  if (!alias) return;
  aliasName = alias;
  body.classList.add("integrity-failure");
  flash.classList.add("pulse");
  window.setTimeout(() => flash.classList.remove("pulse"), 480);
  showPanel("rejection-panel", "#corrected-name");
});

document.querySelector("#rejection-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const corrected = document.querySelector("#corrected-name").value.trim();
  setError("#rejection-error", corrected ? "" : "请输入。");
  if (!corrected) return;
  correctedName = corrected;
  body.classList.add("resetting");
  window.setTimeout(() => {
    body.classList.remove("integrity-failure", "resetting");
    normalQuestionIndex = 0;
    renderNormalQuestion();
    showPanel("normal-panel", ".answer-list button");
  }, 360);
});

document.querySelector("#continue-section").addEventListener("click", () => {
  progressLabel.textContent = "";
  progressCount.textContent = "？ / 24";
  progressBar.style.width = "0";
  showPanel("identity-panel", "#identity-answers button");
});

document.querySelectorAll("#identity-answers button").forEach((button) => {
  button.addEventListener("click", () => {
    if (body.classList.contains("identity-transition")) return;
    body.classList.add("identity-transition");
    button.classList.add("is-selected");
    playIdentityGlitch();
    flash.classList.add("blackout");
    window.setTimeout(() => {
      updateProgress(6, "认知与感知");
      showPanel("cognition-entry-panel", "#begin-cognition");
    }, 310);
    window.setTimeout(() => {
      flash.classList.remove("blackout");
      body.classList.remove("identity-transition");
    }, 720);
  });
});

document.querySelector("#begin-cognition").addEventListener("click", () => {
  renderCognitionQuestion(0);
  showPanel("cognition-panel", "#cognition-answers button");
});

document.querySelectorAll("#door-answers button").forEach((button) => {
  button.addEventListener("click", () => {
    if (!document.querySelector("#door-confirmation").hidden) return;
    button.classList.add("is-selected");
    document.querySelector("#door-answers").classList.add("is-locked");
    document.querySelector("#door-confirmation").hidden = false;
    playKnocking();
    window.setTimeout(() => document.querySelector("#door-confirmation button")?.focus(), 250);
  });
});

document.querySelectorAll("#door-confirmation button").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.add("is-selected");
    window.setTimeout(() => {
      renderCognitionQuestion(2);
      showPanel("cognition-panel", "#cognition-answers button");
    }, 260);
  });
});
