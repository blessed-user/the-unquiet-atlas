import { playComplete, playFound, playHint, playMiss, setSound, soundEnabled } from './audio.js';
import { buildDifferenceMasks, drawExposure } from './render-scene.js';
import { DIFFICULTIES, SCENES, difficultyById } from './scenes.js';

const byId = (id) => document.getElementById(id);
const params = new URLSearchParams(window.location.search);
const shotName = params.get('shot');

const dom = {
  archive: byId('archive'),
  sceneTitle: byId('scene-title'),
  sceneCaption: byId('scene-caption'),
  sceneDate: byId('scene-date'),
  scenePlace: byId('scene-place'),
  catalogCode: byId('catalog-code'),
  statusNote: byId('status-note'),
  remaining: byId('remaining'),
  leftCode: byId('left-code'),
  rightCode: byId('right-code'),
  evidence: byId('evidence-text'),
  fieldNote: byId('field-note'),
  timer: byId('timer'),
  timeMeter: byId('time-meter'),
  timeInstrument: document.querySelector('.time-instrument'),
  accuracy: byId('accuracy'),
  mistakes: byId('mistakes'),
  score: byId('score'),
  streak: byId('streak'),
  hintButton: byId('hint-button'),
  hintCount: byId('hint-count'),
  pauseButton: byId('pause-button'),
  soundButton: byId('sound-button'),
  restartButton: byId('restart-button'),
  comparison: byId('comparison'),
  curtain: byId('case-curtain'),
  curtainCode: byId('curtain-code'),
  curtainTitle: byId('curtain-title'),
  curtainText: byId('curtain-text'),
  curtainAccuracy: byId('curtain-accuracy'),
  curtainTime: byId('curtain-time'),
  curtainScore: byId('curtain-score'),
  continueButton: byId('continue-button'),
  toast: byId('toast'),
  liveStatus: byId('live-status'),
  canvases: [byId('left-photo'), byId('right-photo')],
  frames: [...document.querySelectorAll('.photo-frame')],
  loupes: [...document.querySelectorAll('.loupe')],
  missMarks: [...document.querySelectorAll('.miss-mark')],
  routeStops: [...document.querySelectorAll('.route-stop')],
  difficultyInputs: [...document.querySelectorAll('input[name="difficulty"]')],
};

const storedDifficulty = (() => {
  try {
    return window.localStorage.getItem('field-notes-difficulty');
  } catch {
    return null;
  }
})();

const state = {
  sceneIndex: 0,
  difficulty: difficultyById(params.get('difficulty') ?? storedDifficulty),
  found: new Set(),
  hintIndex: null,
  hintsLeft: 2,
  mistakes: 0,
  streak: 0,
  score: 0,
  scoreAtSceneStart: 0,
  elapsed: 0,
  paused: false,
  sceneComplete: false,
  caseComplete: false,
  unlocked: 0,
  lastFrame: performance.now(),
  lastFind: 0,
  reticle: { x: 400, y: 250, visible: false },
  masks: [],
  shot: Boolean(shotName),
};

let toastTimer = null;
let hintTimer = null;
const differenceMaskCache = new Map();

function currentScene() {
  return SCENES[state.sceneIndex];
}

function sceneLimit() {
  return Math.round(currentScene().duration * state.difficulty.timeScale);
}

function activeDifferences() {
  return currentScene().differences.slice(0, state.difficulty.differenceCount);
}

function caseDifferenceTotal() {
  return state.difficulty.differenceCount * SCENES.length;
}

function formatClock(seconds, allowOvertime = true) {
  const overtime = seconds < 0;
  const absolute = Math.max(0, Math.floor(Math.abs(seconds)));
  const minutes = Math.floor(absolute / 60);
  const remainder = absolute % 60;
  return `${overtime && allowOvertime ? '+' : ''}${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

function accuracyValue() {
  const marks = state.found.size + state.mistakes;
  return marks === 0 ? 100 : Math.round((state.found.size / marks) * 100);
}

function announce(message) {
  dom.liveStatus.textContent = '';
  window.setTimeout(() => {
    dom.liveStatus.textContent = message;
  }, 20);
}

function toast(message) {
  window.clearTimeout(toastTimer);
  dom.toast.textContent = message;
  dom.toast.classList.add('is-visible');
  toastTimer = window.setTimeout(() => dom.toast.classList.remove('is-visible'), 2200);
}

function saveDifficulty() {
  try {
    window.localStorage.setItem('field-notes-difficulty', state.difficulty.id);
  } catch {
    // Private browsing may keep the setting for this visit only.
  }
}

function viewState() {
  return {
    found: state.found,
    hintIndex: state.hintIndex,
    reticle: state.reticle,
    differenceCount: state.difficulty.differenceCount,
  };
}

function renderPhotos() {
  const scene = currentScene();
  drawExposure(dom.canvases[0], scene, false, viewState());
  drawExposure(dom.canvases[1], scene, true, viewState());
}

function renderRoute() {
  dom.routeStops.forEach((button, index) => {
    const available = index <= state.unlocked || state.shot;
    button.disabled = !available;
    button.classList.toggle('is-current', index === state.sceneIndex);
    button.classList.toggle('is-complete', index < state.unlocked || (state.caseComplete && index === SCENES.length - 1));
    if (index === state.sceneIndex) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
}

function renderMetadata() {
  const scene = currentScene();
  const remaining = activeDifferences().length - state.found.size;
  dom.catalogCode.textContent = scene.code;
  dom.sceneTitle.textContent = scene.title;
  dom.sceneCaption.textContent = scene.caption;
  dom.sceneDate.textContent = scene.date;
  dom.scenePlace.textContent = scene.place;
  dom.leftCode.textContent = scene.exposure;
  dom.rightCode.textContent = `${scene.exposure}R`;
  dom.remaining.textContent = String(remaining);
  dom.fieldNote.textContent = scene.note;
  dom.statusNote.textContent = `${state.difficulty.label} mode / ${state.difficulty.differenceCount} differences / ${state.difficulty.hints} clue ${state.difficulty.hints === 1 ? 'seal' : 'seals'} / ${formatClock(sceneLimit(), false)}`;
  dom.hintCount.textContent = `${state.hintsLeft} ${state.hintsLeft === 1 ? 'seal' : 'seals'}`;
  dom.hintButton.disabled = state.hintsLeft === 0 || remaining === 0 || state.paused;
  dom.pauseButton.querySelector('span:nth-child(2)').textContent = state.paused ? 'Resume case' : 'Pause case';
  dom.soundButton.querySelector('span:nth-child(2)').textContent = soundEnabled() ? 'Sound on' : 'Sound off';
  dom.soundButton.setAttribute('aria-pressed', String(soundEnabled()));
  dom.difficultyInputs.forEach((input) => {
    input.checked = input.value === state.difficulty.id;
  });
  renderRoute();
}

function renderInstruments() {
  const left = sceneLimit() - state.elapsed;
  const ratio = Math.max(0, Math.min(1, left / sceneLimit()));
  dom.timer.textContent = formatClock(left);
  dom.timeMeter.style.transform = `scaleX(${ratio})`;
  dom.timeInstrument.classList.toggle('is-low', ratio < 0.25);
  dom.accuracy.textContent = `${accuracyValue()}%`;
  dom.mistakes.textContent = `${state.mistakes} false ${state.mistakes === 1 ? 'mark' : 'marks'}`;
  dom.score.textContent = String(state.score).padStart(5, '0');
  dom.streak.textContent = state.streak >= 4 ? `${state.streak} clean finds / exacting` : state.streak >= 2 ? `${state.streak} clean finds / steady` : 'Steady hand';
}

function renderAll() {
  renderMetadata();
  renderInstruments();
  renderPhotos();
}

function masksForScene(scene, refresh = false) {
  if (refresh || !differenceMaskCache.has(scene.id)) differenceMaskCache.set(scene.id, buildDifferenceMasks(scene));
  return differenceMaskCache.get(scene.id);
}

function closeCurtain() {
  dom.curtain.hidden = true;
}

function loadScene(index, options = {}) {
  state.sceneIndex = Math.max(0, Math.min(SCENES.length - 1, index));
  state.found = new Set((options.found ?? []).filter((foundIndex) => foundIndex < state.difficulty.differenceCount));
  state.hintIndex = null;
  state.hintsLeft = options.hintsLeft ?? state.difficulty.hints;
  state.mistakes = options.mistakes ?? 0;
  state.streak = options.streak ?? 0;
  state.elapsed = options.elapsed ?? 0;
  state.scoreAtSceneStart = options.scoreAtSceneStart ?? state.score;
  state.paused = false;
  state.sceneComplete = false;
  state.reticle = { x: 400, y: 250, visible: false };
  state.masks = masksForScene(currentScene());
  state.lastFrame = performance.now();
  document.body.classList.remove('is-paused');
  closeCurtain();
  dom.evidence.textContent = state.found.size > 0
    ? currentScene().differences[[...state.found].at(-1)].evidence
    : 'No observations logged yet.';
  renderAll();
}

function resetCase(difficulty = state.difficulty) {
  state.difficulty = difficulty;
  state.score = 0;
  state.scoreAtSceneStart = 0;
  state.unlocked = 0;
  state.caseComplete = false;
  saveDifficulty();
  loadScene(0);
}

function scoreForFind() {
  const timeBonus = Math.max(0, sceneLimit() - state.elapsed) * 1.7;
  const precisionPenalty = state.mistakes * state.difficulty.missPenalty;
  const streakBonus = Math.min(state.streak, 5) * 38;
  return Math.max(90, Math.round((360 + timeBonus + streakBonus - precisionPenalty) * state.difficulty.scoreScale));
}

function completeScene() {
  state.sceneComplete = true;
  state.paused = true;
  state.unlocked = Math.max(state.unlocked, Math.min(SCENES.length - 1, state.sceneIndex + 1));
  state.caseComplete = state.sceneIndex === SCENES.length - 1;
  playComplete();
  renderRoute();
  const scene = currentScene();
  const timeLeft = sceneLimit() - state.elapsed;
  dom.curtainCode.textContent = state.caseComplete ? 'Expedition archive restored' : `${scene.code} / Sheet reconciled`;
  dom.curtainTitle.textContent = state.caseComplete ? 'The atlas is quiet.' : 'The record holds.';
  dom.curtainText.textContent = state.caseComplete
    ? `All ${caseDifferenceTotal()} active observations are filed. The recovered expedition can be read again.`
    : scene.complete;
  dom.curtainAccuracy.textContent = `${accuracyValue()}%`;
  dom.curtainTime.textContent = formatClock(timeLeft);
  dom.curtainScore.textContent = String(state.score).padStart(5, '0');
  dom.continueButton.textContent = state.caseComplete ? 'Review archive from the beginning' : 'Open next contact sheet';
  window.setTimeout(() => {
    dom.curtain.hidden = false;
    dom.continueButton.focus();
  }, state.shot ? 0 : 650);
  announce(state.caseComplete ? `Case complete. All ${caseDifferenceTotal()} observations filed.` : `${scene.title} complete. Continue to the next contact sheet.`);
}

function maskContains(mask, x, y, tolerance) {
  const centerX = Math.round(x);
  const centerY = Math.round(y);
  for (let offsetY = -tolerance; offsetY <= tolerance; offsetY += 1) {
    const sampleY = centerY + offsetY;
    if (sampleY < 0 || sampleY >= 500) continue;
    for (let offsetX = -tolerance; offsetX <= tolerance; offsetX += 1) {
      if (offsetX * offsetX + offsetY * offsetY > tolerance * tolerance) continue;
      const sampleX = centerX + offsetX;
      if (sampleX < 0 || sampleX >= 800) continue;
      if (mask[sampleY * 800 + sampleX] === 1) return true;
    }
  }
  return false;
}

function nearestDifference(x, y) {
  for (let index = 0; index < activeDifferences().length; index += 1) {
    if (state.found.has(index)) continue;
    if (maskContains(state.masks[index].pixels, x, y, state.difficulty.pixelTolerance)) return index;
  }
  return null;
}

function showMiss(x, y) {
  const left = `${(x / 800) * 100}%`;
  const top = `${(y / 500) * 100}%`;
  dom.missMarks.forEach((mark) => {
    mark.classList.remove('is-visible');
    void mark.offsetWidth;
    mark.style.left = left;
    mark.style.top = top;
    mark.classList.add('is-visible');
  });
}

function markAt(x, y) {
  if (state.paused || state.sceneComplete || state.shot) return;
  const index = nearestDifference(x, y);
  if (index === null) {
    state.mistakes += 1;
    state.streak = 0;
    state.score = Math.max(0, state.score - state.difficulty.missPenalty);
    showMiss(x, y);
    playMiss();
    toast('No discrepancy logged. Compare the surrounding shapes.');
    announce(`False mark. Accuracy ${accuracyValue()} percent.`);
    renderInstruments();
    return;
  }

  const difference = currentScene().differences[index];
  const now = performance.now();
  state.streak = now - state.lastFind < 9000 ? state.streak + 1 : 1;
  state.lastFind = now;
  state.found.add(index);
  state.hintIndex = null;
  const gained = scoreForFind();
  state.score += gained;
  dom.evidence.textContent = difference.evidence;
  playFound(state.streak);
  toast(`${difference.label} logged / +${gained}`);
  announce(`${difference.label} found. ${activeDifferences().length - state.found.size} remaining.`);
  renderAll();
  if (state.found.size === activeDifferences().length) completeScene();
}

function pointFromEvent(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(800, ((event.clientX - rect.left) / rect.width) * 800)),
    y: Math.max(0, Math.min(500, ((event.clientY - rect.top) / rect.height) * 500)),
  };
}

function positionLoupes(x, y, hinting = false) {
  const left = `${(x / 800) * 100}%`;
  const top = `${(y / 500) * 100}%`;
  dom.loupes.forEach((loupe) => {
    loupe.style.left = left;
    loupe.style.top = top;
    loupe.classList.toggle('is-hinting', hinting);
  });
}

function inspectWithPointer(canvas, event) {
  const point = pointFromEvent(canvas, event);
  state.reticle.visible = false;
  positionLoupes(point.x, point.y);
  dom.comparison.classList.add('is-inspecting');
}

function requestHint() {
  if (state.paused || state.sceneComplete || state.shot || state.hintsLeft <= 0) return;
  const available = activeDifferences()
    .map((difference, index) => ({ difference, index }))
    .filter(({ index }) => !state.found.has(index));
  if (available.length === 0) return;
  window.clearTimeout(hintTimer);
  const pick = available[(state.sceneIndex * 3 + state.found.size * 2 + state.mistakes) % available.length];
  state.hintsLeft -= 1;
  state.hintIndex = pick.index;
  state.streak = 0;
  positionLoupes(pick.difference.x, pick.difference.y, true);
  dom.comparison.classList.add('is-inspecting');
  dom.evidence.textContent = `Inspection clue: ${pick.difference.evidence.replace(/^The |^A |^An /, '')}`;
  playHint();
  toast('Inspection loupe placed for three seconds.');
  announce(`Hint used. Inspect near ${pick.difference.label.toLowerCase()}. ${state.hintsLeft} hints left.`);
  renderAll();
  hintTimer = window.setTimeout(() => {
    state.hintIndex = null;
    dom.comparison.classList.remove('is-inspecting');
    dom.loupes.forEach((loupe) => loupe.classList.remove('is-hinting'));
    renderPhotos();
  }, 3200);
}

function togglePause() {
  if (state.sceneComplete || state.shot) return;
  state.paused = !state.paused;
  state.lastFrame = performance.now();
  document.body.classList.toggle('is-paused', state.paused);
  renderMetadata();
  announce(state.paused ? 'Case paused.' : 'Case resumed.');
}

function moveReticle(dx, dy) {
  state.reticle.x = Math.max(15, Math.min(785, state.reticle.x + dx));
  state.reticle.y = Math.max(15, Math.min(485, state.reticle.y + dy));
  state.reticle.visible = true;
  positionLoupes(state.reticle.x, state.reticle.y);
  dom.comparison.classList.add('is-inspecting');
  renderPhotos();
}

function handleKeyboard(event) {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  const key = event.key.toLowerCase();
  const onCanvas = dom.canvases.includes(document.activeElement);
  if (onCanvas && ['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'enter', ' '].includes(key)) {
    event.preventDefault();
    const step = event.shiftKey ? 7 : 19;
    if (key === 'arrowleft') moveReticle(-step, 0);
    else if (key === 'arrowright') moveReticle(step, 0);
    else if (key === 'arrowup') moveReticle(0, -step);
    else if (key === 'arrowdown') moveReticle(0, step);
    else markAt(state.reticle.x, state.reticle.y);
    return;
  }
  if (event.target instanceof HTMLInputElement) return;
  if (key === 'h') requestHint();
  else if (key === 'p') togglePause();
  else if (key === 'm') {
    setSound(!soundEnabled());
    renderMetadata();
    toast(soundEnabled() ? 'Archive audio restored.' : 'Archive audio muted.');
  } else if (key === 'r') {
    state.score = state.scoreAtSceneStart;
    loadScene(state.sceneIndex);
    toast('Contact sheet restarted.');
  }
}

function nextFromCurtain() {
  if (state.caseComplete) {
    resetCase(state.difficulty);
    return;
  }
  state.paused = false;
  loadScene(state.sceneIndex + 1);
}

function stageShot(name) {
  const shots = {
    specimen: { index: 0, found: [0, 2], elapsed: 67, mistakes: 1, score: 2480, difficulty: 'medium' },
    market: { index: 1, found: [1], elapsed: 73, mistakes: 0, score: 6120, difficulty: 'easy' },
    weather: { index: 2, found: [0, 3, 5, 6], elapsed: 82, mistakes: 1, score: 11340, difficulty: 'hard' },
    ferry: { index: 3, found: [0, 2], elapsed: 69, mistakes: 0, score: 14980, difficulty: 'medium' },
    camp: { index: 4, found: [0, 2, 5, 8], elapsed: 77, mistakes: 1, score: 19420, difficulty: 'hard' },
  };
  const shot = shots[name] ?? shots.specimen;
  state.difficulty = DIFFICULTIES[params.get('difficulty')] ?? DIFFICULTIES[shot.difficulty];
  state.score = shot.score;
  state.unlocked = SCENES.length - 1;
  loadScene(shot.index, {
    found: shot.found,
    elapsed: shot.elapsed,
    mistakes: shot.mistakes,
    hintsLeft: Math.max(0, state.difficulty.hints - 1),
    streak: 2,
    scoreAtSceneStart: shot.score - 1900,
  });
  positionLoupes(418, 236);
  dom.comparison.classList.add('is-inspecting');
  document.body.dataset.shot = name;
}

dom.canvases.forEach((canvas) => {
  canvas.addEventListener('pointermove', (event) => inspectWithPointer(canvas, event));
  canvas.addEventListener('pointerdown', () => canvas.focus());
  canvas.addEventListener('click', (event) => {
    const point = pointFromEvent(canvas, event);
    state.reticle = { ...point, visible: false };
    markAt(point.x, point.y);
  });
});

dom.comparison.addEventListener('pointerleave', () => {
  if (state.hintIndex === null && !state.reticle.visible) dom.comparison.classList.remove('is-inspecting');
});

dom.hintButton.addEventListener('click', requestHint);
dom.pauseButton.addEventListener('click', togglePause);
dom.soundButton.addEventListener('click', () => {
  setSound(!soundEnabled());
  renderMetadata();
  toast(soundEnabled() ? 'Archive audio restored.' : 'Archive audio muted.');
});
dom.restartButton.addEventListener('click', () => {
  if (state.shot) return;
  state.score = state.scoreAtSceneStart;
  loadScene(state.sceneIndex);
  toast('Contact sheet restarted.');
});
dom.continueButton.addEventListener('click', nextFromCurtain);
dom.routeStops.forEach((button, index) => {
  button.addEventListener('click', () => {
    if (index <= state.unlocked && index !== state.sceneIndex && !state.shot) {
      state.scoreAtSceneStart = state.score;
      loadScene(index);
    }
  });
});
dom.difficultyInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (!input.checked || state.shot) return;
    resetCase(difficultyById(input.value));
    toast(`${state.difficulty.label} mode selected. The expedition restarted.`);
    announce(`${state.difficulty.label} difficulty selected.`);
  });
});
document.addEventListener('keydown', handleKeyboard);
document.addEventListener('visibilitychange', () => {
  if (document.hidden && !state.paused && !state.sceneComplete && !state.shot) togglePause();
});

function frame(now) {
  const delta = Math.min(0.25, (now - state.lastFrame) / 1000);
  state.lastFrame = now;
  if (!state.paused && !state.sceneComplete && !state.shot) {
    state.elapsed += delta;
    renderInstruments();
  }
  window.requestAnimationFrame(frame);
}

if (shotName) stageShot(shotName);
else resetCase(state.difficulty);

document.fonts.ready.then(() => {
  state.masks = masksForScene(currentScene(), true);
  renderAll();
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      window.__shotReady = true;
    });
  });
});

window.fieldNotes = Object.freeze({
  stage: stageShot,
  state: () => ({
    scene: currentScene().id,
    difficulty: state.difficulty.id,
    found: [...state.found],
    score: state.score,
  }),
});

window.requestAnimationFrame(frame);
