// Học Tiếng Anh — Bài tập ôn luyện theo chủ đề — logic
// Dùng chung dữ liệu với flashcard: window.data = { days: [{ id, theme, themeEn, cards:[{emoji,word,ipa,meaning}] }] }
// 3 dạng bài tập: match (nối từ–hình), fill (điền chữ thiếu), choice (trắc nghiệm).

(function () {
  const STORAGE_KEY = "htt-en:exercises:state";

  const defaultState = {
    currentDay: 1,
    mode: "match", // "match" | "fill" | "choice" | "dialogue"
    showTranslation: false, // hội thoại: hiện/ẩn bản dịch tiếng Việt cho cả bài
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...defaultState };
      const parsed = JSON.parse(raw);
      return { ...defaultState, ...parsed };
    } catch {
      return { ...defaultState };
    }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  const state = loadState();

  // ---------- Config ----------
  const MATCH_COUNT = 8;
  const FILL_COUNT = 10;
  const CHOICE_COUNT = 10;

  const MODE_TITLE = {
    match: "Nối từ với hình đúng",
    fill: "Điền chữ còn thiếu",
    choice: "Chọn từ đúng với hình",
    dialogue: "Luyện hội thoại",
  };

  // ---------- DOM ----------
  const $ = (id) => document.getElementById(id);
  const els = {
    statCorrect: $("stat-correct"),
    statWrong: $("stat-wrong"),
    statTotal: $("stat-total"),
    dayLabel: $("day-label"),
    dayThemeEn: $("day-theme-en"),
    dayThemeVi: $("day-theme-vi"),
    dayPrev: $("day-prev"),
    dayNext: $("day-next"),
    openPicker: $("open-picker"),
    modeTabs: $("mode-tabs"),
    exerciseTitle: $("exercise-title"),
    exerciseArea: $("exercise-area"),
    resultBadge: $("result-badge"),
    actionBar: $("action-bar"),
    tipBar: $("tip-bar"),
    btnCheck: $("btn-check"),
    btnReset: $("btn-reset"),
    picker: $("picker"),
    pickerOverlay: $("picker-overlay"),
    pickerClose: $("picker-close"),
    pickerGrid: $("picker-grid"),
  };

  // ---------- Helpers ----------
  function currentDayData() {
    return data.days[state.currentDay - 1];
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function sample(arr, n) {
    return shuffle(arr).slice(0, Math.min(n, arr.length));
  }

  // ---------- Speech ----------
  function speak(text) {
    if (!("speechSynthesis" in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = "en-US";
      utt.rate = 0.85;
      utt.pitch = 1;
      window.speechSynthesis.speak(utt);
    } catch {}
  }

  // Phát 1 câu rồi gọi onDone (dùng cho "phát cả đoạn")
  function speakThen(text, onDone) {
    if (!("speechSynthesis" in window) || !text) { onDone && onDone(); return; }
    try {
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = "en-US";
      utt.rate = 0.85;
      utt.pitch = 1;
      utt.onend = () => onDone && onDone();
      utt.onerror = () => onDone && onDone();
      window.speechSynthesis.speak(utt);
    } catch { onDone && onDone(); }
  }

  // ---------- Phát cả đoạn hội thoại ----------
  let playAllActive = false;

  function highlightDlgLine(i) {
    els.exerciseArea.querySelectorAll(".dlg-row.is-speaking").forEach((r) => r.classList.remove("is-speaking"));
    if (i == null) return;
    const row = els.exerciseArea.querySelector(`.dlg-row[data-i="${i}"]`);
    if (row) {
      row.classList.add("is-speaking");
      try { row.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch {}
    }
  }

  function updatePlayAllBtn() {
    const btn = $("dlg-play-all");
    if (!btn) return;
    btn.classList.toggle("is-playing", playAllActive);
    const label = btn.querySelector(".dlg-play-all-label");
    if (label) label.textContent = playAllActive ? "Dừng" : "Phát cả đoạn";
  }

  function stopPlayAll() {
    playAllActive = false;
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch {}
    highlightDlgLine(null);
    updatePlayAllBtn();
  }

  function startPlayAll() {
    const lines = (gen && gen.lines) || [];
    if (!lines.length) return;
    stopPlayback();
    if (activeRecorder) stopRecording();
    playAllActive = true;
    updatePlayAllBtn();
    let i = 0;
    const step = () => {
      if (!playAllActive) return;
      if (i >= lines.length) { stopPlayAll(); return; }
      highlightDlgLine(i);
      speakThen(lines[i].en, () => {
        if (!playAllActive) return;
        i++;
        setTimeout(step, 350); // khoảng nghỉ ngắn giữa các câu
      });
    };
    step();
  }

  // ---------- IndexedDB (bản thu của học sinh) ----------
  const DB_NAME = "htt-en-rec-exercises";
  const DB_VERSION = 1;
  const DB_STORE = "recordings";
  let _dbPromise = null;

  function openRecDB() {
    if (_dbPromise) return _dbPromise;
    _dbPromise = new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) { reject(new Error("IndexedDB not supported")); return; }
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(DB_STORE)) {
          db.createObjectStore(DB_STORE, { keyPath: "id" });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return _dbPromise;
  }
  async function putRecording(id, blob, mimeType) {
    const db = await openRecDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, "readwrite");
      tx.objectStore(DB_STORE).put({ id, blob, mimeType, createdAt: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
  async function getRecording(id) {
    const db = await openRecDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, "readonly");
      const req = tx.objectStore(DB_STORE).get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }
  // mỗi câu hội thoại 1 bản thu: id = dlg-<day>-<lineIndex>
  function dlgRecId(i) { return `dlg-${state.currentDay}-${i}`; }

  // ---------- MediaRecorder ----------
  let activeRecorder = null;
  let sharedStream = null;

  async function getMicStream() {
    if (sharedStream && sharedStream.getTracks().some((t) => t.readyState === "live")) return sharedStream;
    sharedStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return sharedStream;
  }
  function pickRecorderMime() {
    if (!window.MediaRecorder || !MediaRecorder.isTypeSupported) return "";
    const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
    for (const c of candidates) { if (MediaRecorder.isTypeSupported(c)) return c; }
    return "";
  }
  function setDlgRecState(i, recording) {
    const btn = els.exerciseArea.querySelector(`.dlg-rec[data-i="${i}"]`);
    if (!btn) return;
    btn.classList.toggle("is-recording", recording);
    const mic = btn.querySelector(".rec-icon-mic");
    const stop = btn.querySelector(".rec-icon-stop");
    if (mic) mic.classList.toggle("hidden", recording);
    if (stop) stop.classList.toggle("hidden", !recording);
    btn.title = recording ? "Dừng thu" : "Thu âm giọng bạn";
  }
  function setDlgPlayVisible(i, visible) {
    const btn = els.exerciseArea.querySelector(`.dlg-play[data-i="${i}"]`);
    if (btn) btn.classList.toggle("hidden", !visible);
  }

  async function startRecording(i) {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      alert("Trình duyệt không hỗ trợ thu âm.");
      return;
    }
    stopPlayAll();
    stopPlayback();
    if (activeRecorder) await stopRecording();
    let stream;
    try { stream = await getMicStream(); }
    catch { alert("Cần cấp quyền truy cập micro để thu âm."); return; }

    const mimeType = pickRecorderMime();
    const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    const day = state.currentDay;
    const savedPromise = new Promise((resolve) => {
      recorder.onstop = async () => {
        try {
          const type = recorder.mimeType || "audio/webm";
          const blob = new Blob(chunks, { type });
          await putRecording(`dlg-${day}-${i}`, blob, type);
        } catch (err) {
          console.error("Lưu bản thu thất bại:", err);
        } finally {
          if (day === state.currentDay && state.mode === "dialogue") setDlgPlayVisible(i, true);
          resolve();
        }
      };
    });
    activeRecorder = { recorder, i, day, chunks, stream, savedPromise };
    setDlgRecState(i, true);
    recorder.start();
  }
  async function stopRecording() {
    if (!activeRecorder) return;
    const { recorder, i, savedPromise } = activeRecorder;
    activeRecorder = null;
    setDlgRecState(i, false);
    if (recorder.state !== "inactive") { try { recorder.stop(); } catch {} }
    await savedPromise;
  }

  // ---------- Phát lại bản thu ----------
  let activePlayback = null;

  function setDlgPlayState(i, isPlaying) {
    const btn = els.exerciseArea.querySelector(`.dlg-play[data-i="${i}"]`);
    if (!btn) return;
    btn.classList.toggle("is-playing", isPlaying);
    const p = btn.querySelector(".play-icon-play");
    const ps = btn.querySelector(".play-icon-pause");
    if (p) p.classList.toggle("hidden", isPlaying);
    if (ps) ps.classList.toggle("hidden", !isPlaying);
    btn.title = isPlaying ? "Tạm dừng" : "Nghe lại bản thu";
  }
  function stopPlayback() {
    if (!activePlayback) return;
    const { audio, i, url } = activePlayback;
    activePlayback = null;
    try { audio.pause(); } catch {}
    try { URL.revokeObjectURL(url); } catch {}
    setDlgPlayState(i, false);
  }
  async function playRecording(i) {
    if (activePlayback && activePlayback.i === i) {
      const a = activePlayback.audio;
      if (a.paused) { try { await a.play(); setDlgPlayState(i, true); } catch { stopPlayback(); } }
      else { a.pause(); setDlgPlayState(i, false); }
      return;
    }
    if (activePlayback) stopPlayback();
    stopPlayAll();
    let rec;
    try { rec = await getRecording(dlgRecId(i)); } catch { rec = null; }
    if (!rec || !rec.blob) return;
    const url = URL.createObjectURL(rec.blob);
    const audio = new Audio(url);
    activePlayback = { audio, i, url };
    setDlgPlayState(i, true);
    const cleanup = () => { if (activePlayback && activePlayback.audio === audio) stopPlayback(); };
    audio.onended = cleanup;
    audio.onerror = cleanup;
    try { await audio.play(); } catch { cleanup(); }
  }

  // Hiện nút "nghe lại" cho các câu đã có bản thu
  async function refreshDlgRecButtons(lineCount) {
    for (let i = 0; i < lineCount; i++) {
      try {
        const rec = await getRecording(dlgRecId(i));
        setDlgPlayVisible(i, !!rec);
      } catch { setDlgPlayVisible(i, false); }
    }
  }

  // Dừng mọi media của hội thoại (khi đổi chủ đề / mode / render lại)
  function stopDialogueMedia() {
    stopPlayAll();
    stopPlayback();
    if (activeRecorder) stopRecording();
  }

  // ---------- Exercise generation ----------
  // gen giữ dữ liệu cố định của bài tập hiện tại để render lại không bị xáo trộn.
  let gen = null;
  let checked = false;

  // chỉ blank chữ cái (a-z), trả về index trong word
  function pickBlankIndex(word) {
    const letterIdx = [];
    for (let i = 0; i < word.length; i++) {
      if (/[a-zA-Z]/.test(word[i])) letterIdx.push(i);
    }
    if (!letterIdx.length) return 0;
    return letterIdx[Math.floor(Math.random() * letterIdx.length)];
  }

  function generateExercise() {
    checked = false;
    const cards = (currentDayData() && currentDayData().cards) || [];
    if (state.mode === "match") {
      const items = sample(cards, MATCH_COUNT).map((c, i) => ({ id: i, word: c.word, emoji: c.emoji }));
      gen = {
        items,
        wordOrder: shuffle(items.map((it) => it.id)),
        picOrder: shuffle(items.map((it) => it.id)),
        pairs: {}, // wordId -> picId
        selected: null, // { type:"word"|"pic", id }
      };
    } else if (state.mode === "fill") {
      const items = sample(cards, FILL_COUNT).map((c) => {
        const blankIndex = pickBlankIndex(c.word);
        return {
          word: c.word,
          emoji: c.emoji,
          meaning: c.meaning,
          blankIndex,
          missing: c.word[blankIndex],
        };
      });
      gen = { items };
    } else if (state.mode === "dialogue") {
      const dlg = (window.dialogues && window.dialogues[state.currentDay - 1]) || null;
      gen = {
        lines: (dlg && dlg.lines) || [],
        vocab: (dlg && dlg.vocab) || "",
      };
    } else { // choice
      const picked = sample(cards, CHOICE_COUNT);
      const items = picked.map((c) => {
        const distractors = sample(cards.filter((x) => x.word !== c.word), 3).map((x) => x.word);
        const options = shuffle([c.word, ...distractors]);
        return { word: c.word, emoji: c.emoji, meaning: c.meaning, options, selected: null };
      });
      gen = { items };
    }
  }

  // ---------- Renderers ----------
  function renderDayInfo() {
    const d = currentDayData();
    els.dayLabel.textContent = "Chủ đề";
    els.dayThemeEn.textContent = d.themeEn || "—";
    els.dayThemeVi.textContent = d.theme || "Chưa cập nhật";
  }

  function renderModeTabs() {
    els.modeTabs.querySelectorAll(".mode-tab").forEach((btn) => {
      btn.classList.toggle("is-current", btn.dataset.mode === state.mode);
    });
    els.exerciseTitle.textContent = MODE_TITLE[state.mode] || "Bài tập";
  }

  function resetResult() {
    els.resultBadge.classList.add("hidden");
    els.resultBadge.className = "hidden text-sm font-medium px-3 py-1.5 rounded-lg border";
  }

  // Mode hội thoại không chấm điểm -> ẩn nút Kiểm tra/Làm lại, badge & dòng mẹo chung.
  function applyModeChrome() {
    const isDialogue = state.mode === "dialogue";
    if (els.actionBar) els.actionBar.classList.toggle("hidden", isDialogue);
    if (els.tipBar) els.tipBar.classList.toggle("hidden", isDialogue);
    if (isDialogue) resetResult();
  }

  function renderExercise() {
    resetResult();
    applyModeChrome();

    if (state.mode === "dialogue") { renderDialogue(); return; }

    const d = currentDayData();
    if (!d || !d.cards.length) {
      els.exerciseArea.innerHTML =
        `<div class="rounded-2xl bg-card2 border border-line shadow-card flex flex-col items-center justify-center text-center px-6 py-16">
           <div class="text-5xl text-neutral-700">📭</div>
           <div class="mt-3 text-neutral-300 font-medium">Chưa có dữ liệu cho chủ đề này</div>
           <div class="mt-1 text-sm text-dim">Bổ sung từ vựng vào <code class="text-neutral-300">data.js</code>.</div>
         </div>`;
      return;
    }
    if (state.mode === "match") renderMatch();
    else if (state.mode === "fill") renderFill();
    else renderChoice();
  }

  // ----- Mode: Match -----
  function renderMatch() {
    const words = gen.wordOrder.map((id) => {
      const it = gen.items.find((x) => x.id === id);
      return `<button class="ex-item ex-word" data-id="${id}">
                <span>${escapeHtml(it.word)}</span>
              </button>`;
    }).join("");
    const pics = gen.picOrder.map((id) => {
      const it = gen.items.find((x) => x.id === id);
      return `<button class="ex-item ex-pic" data-id="${id}">
                <span class="ex-emoji">${escapeHtml(it.emoji)}</span>
              </button>`;
    }).join("");

    els.exerciseArea.innerHTML =
      `<p class="text-sm text-dim mb-4">Bấm một từ rồi bấm hình tương ứng để nối. Bấm lại vào mục đã nối để bỏ.</p>
       <div id="match-wrap" class="relative">
         <svg id="match-svg" class="match-svg" preserveAspectRatio="none"></svg>
         <div class="grid grid-cols-2 gap-x-10 sm:gap-x-24">
           <div id="match-words" class="flex flex-col gap-3 items-stretch">${words}</div>
           <div id="match-pics" class="flex flex-col gap-3 items-stretch">${pics}</div>
         </div>
       </div>`;

    els.exerciseArea.querySelectorAll(".ex-word").forEach((btn) => {
      btn.addEventListener("click", () => onMatchClick("word", Number(btn.dataset.id), btn));
    });
    els.exerciseArea.querySelectorAll(".ex-pic").forEach((btn) => {
      btn.addEventListener("click", () => onMatchClick("pic", Number(btn.dataset.id), btn));
    });

    drawMatchLines();
  }

  function matchEl(type, id) {
    return els.exerciseArea.querySelector(`.ex-${type}[data-id="${id}"]`);
  }

  function clearMatchSelectionHighlight() {
    els.exerciseArea.querySelectorAll(".ex-item.is-selected").forEach((b) => b.classList.remove("is-selected"));
  }

  function onMatchClick(type, id) {
    if (checked) return; // không cho sửa sau khi đã chấm
    speakById(id);

    // bấm vào mục đã nối -> bỏ nối
    const isPaired = (type === "word")
      ? Object.prototype.hasOwnProperty.call(gen.pairs, id)
      : Object.values(gen.pairs).includes(id);
    if (isPaired) {
      if (type === "word") delete gen.pairs[id];
      else {
        for (const w of Object.keys(gen.pairs)) {
          if (gen.pairs[w] === id) delete gen.pairs[w];
        }
      }
      gen.selected = null;
      clearMatchSelectionHighlight();
      drawMatchLines();
      return;
    }

    if (!gen.selected) {
      gen.selected = { type, id };
    } else if (gen.selected.type === type) {
      gen.selected = { type, id }; // đổi lựa chọn cùng cột
    } else {
      // ghép cặp word <-> pic
      const wordId = type === "word" ? id : gen.selected.id;
      const picId = type === "pic" ? id : gen.selected.id;
      gen.pairs[wordId] = picId;
      gen.selected = null;
    }

    clearMatchSelectionHighlight();
    if (gen.selected) {
      const el = matchEl(gen.selected.type, gen.selected.id);
      if (el) el.classList.add("is-selected");
    }
    drawMatchLines();
  }

  function speakById(id) {
    const it = gen.items.find((x) => x.id === id);
    if (it) speak(it.word);
  }

  function drawMatchLines() {
    const svg = $("match-svg");
    const wrap = $("match-wrap");
    if (!svg || !wrap) return;
    const wrapRect = wrap.getBoundingClientRect();
    svg.setAttribute("width", wrapRect.width);
    svg.setAttribute("height", wrapRect.height);
    svg.setAttribute("viewBox", `0 0 ${wrapRect.width} ${wrapRect.height}`);

    let lines = "";
    for (const wordId of Object.keys(gen.pairs)) {
      const picId = gen.pairs[wordId];
      const wEl = matchEl("word", wordId);
      const pEl = matchEl("pic", picId);
      if (!wEl || !pEl) continue;
      const wr = wEl.getBoundingClientRect();
      const pr = pEl.getBoundingClientRect();
      const x1 = wr.right - wrapRect.left;
      const y1 = wr.top + wr.height / 2 - wrapRect.top;
      const x2 = pr.left - wrapRect.left;
      const y2 = pr.top + pr.height / 2 - wrapRect.top;

      let color = "#9ca3af";
      if (checked) color = Number(wordId) === Number(picId) ? "#22c55e" : "#ef4444";
      lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
                  stroke="${color}" stroke-width="2.5" stroke-linecap="round"
                  stroke-dasharray="${checked ? "0" : "2 7"}" />`;
    }
    svg.innerHTML = lines;
  }

  // ----- Mode: Fill -----
  function renderFill() {
    const rows = gen.items.map((it, i) => {
      const before = escapeHtml(it.word.slice(0, it.blankIndex));
      const after = escapeHtml(it.word.slice(it.blankIndex + 1));
      return `<div class="ex-fill-row" data-i="${i}">
                <span class="ex-emoji-sm">${escapeHtml(it.emoji)}</span>
                <span class="ex-fill-word">
                  <span>${before}</span><input class="ex-blank" maxlength="1" autocomplete="off" spellcheck="false" data-i="${i}" /><span>${after}</span>
                </span>
                <span class="ex-fill-meaning">${escapeHtml(it.meaning || "")}</span>
              </div>`;
    }).join("");
    els.exerciseArea.innerHTML =
      `<p class="text-sm text-dim mb-4">Điền chữ cái còn thiếu vào ô trống cho đúng từ tiếng Anh.</p>
       <div class="grid sm:grid-cols-2 gap-3">${rows}</div>`;

    els.exerciseArea.querySelectorAll(".ex-blank").forEach((inp) => {
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); checkAnswers(); }
      });
    });
  }

  // ----- Mode: Choice -----
  function renderChoice() {
    const cards = gen.items.map((it, i) => {
      const opts = it.options.map((w) =>
        `<button class="ex-choice-opt" data-i="${i}" data-word="${escapeHtml(w)}">${escapeHtml(w)}</button>`
      ).join("");
      return `<div class="ex-choice-card" data-i="${i}">
                <div class="ex-emoji">${escapeHtml(it.emoji)}</div>
                <div class="ex-choice-opts">${opts}</div>
              </div>`;
    }).join("");
    els.exerciseArea.innerHTML =
      `<p class="text-sm text-dim mb-4">Chọn từ tiếng Anh đúng với mỗi hình.</p>
       <div class="grid sm:grid-cols-2 gap-4">${cards}</div>`;

    els.exerciseArea.querySelectorAll(".ex-choice-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (checked) return;
        const i = Number(btn.dataset.i);
        gen.items[i].selected = btn.dataset.word;
        speak(btn.dataset.word);
        // cập nhật highlight trong cùng card
        els.exerciseArea
          .querySelectorAll(`.ex-choice-opt[data-i="${i}"]`)
          .forEach((b) => b.classList.toggle("is-selected", b === btn));
      });
    });
  }

  // ----- Mode: Dialogue (luyện đọc, không chấm điểm) -----
  const ICON = {
    speaker: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
    rec: `<svg class="rec-icon-mic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><line x1="12" y1="18" x2="12" y2="22"/></svg><svg class="rec-icon-stop hidden" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>`,
    play: `<svg class="play-icon-play" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 4 20 12 6 20 6 4"/></svg><svg class="play-icon-pause hidden" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`,
    playAll: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  };

  function renderDialogue() {
    stopDialogueMedia();
    const lines = (gen && gen.lines) || [];
    if (!lines.length) {
      els.exerciseArea.innerHTML =
        `<div class="rounded-2xl bg-card2 border border-line shadow-card flex flex-col items-center justify-center text-center px-6 py-16">
           <div class="text-5xl text-neutral-700">💬</div>
           <div class="mt-3 text-neutral-300 font-medium">Chưa có hội thoại cho chủ đề này</div>
           <div class="mt-1 text-sm text-dim">Bổ sung vào <code class="text-neutral-300">dialogues.js</code>.</div>
         </div>`;
      return;
    }

    const showAll = !!state.showTranslation;
    const rows = lines.map((ln, i) => {
      const side = ln.s === "A" ? "dlg-a" : "dlg-b";
      return `<div class="dlg-row ${side}" data-i="${i}">
                <div class="dlg-bubble">
                  <div class="dlg-head">
                    <span class="dlg-speaker">${escapeHtml(ln.s)}</span>
                    <div class="dlg-tools">
                      <button class="dlg-tool dlg-speak" data-i="${i}" title="Nghe phát âm">${ICON.speaker}</button>
                      <button class="dlg-tool dlg-rec" data-i="${i}" title="Thu âm giọng bạn">${ICON.rec}</button>
                      <button class="dlg-tool dlg-play hidden" data-i="${i}" title="Nghe lại bản thu">${ICON.play}</button>
                    </div>
                  </div>
                  <button class="dlg-en" data-i="${i}" title="Bấm để hiện/ẩn bản dịch">${escapeHtml(ln.en)}</button>
                  <div class="dlg-vi">${escapeHtml(ln.vi)}</div>
                </div>
              </div>`;
    }).join("");

    els.exerciseArea.innerHTML =
      `<div class="flex items-center justify-between gap-3 mb-3 flex-wrap">
         <button id="dlg-play-all" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-red text-white hover:bg-brand-redSoft transition text-sm font-medium">
           ${ICON.playAll}<span class="dlg-play-all-label">Phát cả đoạn</span>
         </button>
         <button id="dlg-toggle" class="px-4 py-2 rounded-xl bg-card border border-line hover:bg-white/5 transition text-sm font-medium ${showAll ? "text-brand-redSoft" : ""}">
           ${showAll ? "Ẩn bản dịch" : "Hiện bản dịch"}
         </button>
       </div>
       <p class="text-xs text-dim mb-4">Bấm 🔊 nghe từng câu · 🎤 thu âm giọng bạn rồi nghe lại · bấm vào câu để hiện/ẩn bản dịch.</p>
       <div id="dlg-wrap" class="dlg-wrap ${showAll ? "show-all" : ""} flex flex-col gap-3">${rows}</div>
       ${gen.vocab ? `<div class="mt-6 pt-4 border-t border-line text-sm"><span class="text-dim">Từ vựng: </span><span class="text-neutral-200">${escapeHtml(gen.vocab)}</span></div>` : ""}`;

    $("dlg-play-all").addEventListener("click", () => {
      if (playAllActive) stopPlayAll();
      else startPlayAll();
    });

    $("dlg-toggle").addEventListener("click", () => {
      state.showTranslation = !state.showTranslation;
      saveState();
      // chỉ bật/tắt class, không render lại để không mất bản thu / trạng thái
      const wrap = $("dlg-wrap");
      if (wrap) wrap.classList.toggle("show-all", state.showTranslation);
      const tg = $("dlg-toggle");
      if (tg) {
        tg.textContent = state.showTranslation ? "Ẩn bản dịch" : "Hiện bản dịch";
        tg.classList.toggle("text-brand-redSoft", state.showTranslation);
      }
    });

    els.exerciseArea.querySelectorAll(".dlg-en").forEach((btn) => {
      btn.addEventListener("click", () => {
        const row = btn.closest(".dlg-row");
        if (row) row.classList.toggle("is-open");
      });
    });
    els.exerciseArea.querySelectorAll(".dlg-speak").forEach((btn) => {
      btn.addEventListener("click", () => {
        stopPlayAll();
        speak(lines[Number(btn.dataset.i)].en);
      });
    });
    els.exerciseArea.querySelectorAll(".dlg-rec").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.i);
        if (activeRecorder && activeRecorder.i === i) stopRecording();
        else startRecording(i);
      });
    });
    els.exerciseArea.querySelectorAll(".dlg-play").forEach((btn) => {
      btn.addEventListener("click", () => playRecording(Number(btn.dataset.i)));
    });

    updatePlayAllBtn();
    refreshDlgRecButtons(lines.length);
  }

  // ---------- Check / Score ----------
  function showResult(correct, total) {
    els.statCorrect.textContent = correct;
    els.statWrong.textContent = total - correct;
    els.statTotal.textContent = total;
    const pass = total > 0 && correct === total;
    els.resultBadge.textContent = `Đúng ${correct}/${total}`;
    els.resultBadge.className =
      "text-sm font-medium px-3 py-1.5 rounded-lg border " +
      (pass ? "border-ok/60 text-ok bg-ok/10" : "border-warn/60 text-warn bg-warn/10");
  }

  function checkAnswers() {
    if (state.mode === "dialogue") return; // hội thoại không chấm điểm
    if (!gen || !gen.items || !gen.items.length) return;
    checked = true;
    let correct = 0;
    const total = gen.items.length;

    if (state.mode === "match") {
      els.exerciseArea.querySelectorAll(".ex-item").forEach((el) => {
        el.classList.remove("is-selected");
      });
      gen.items.forEach((it) => {
        const wEl = matchEl("word", it.id);
        const pEl = matchEl("pic", it.id);
        const pairedPic = gen.pairs[it.id];
        const ok = pairedPic !== undefined && Number(pairedPic) === it.id;
        if (ok) correct++;
        const cls = ok ? "is-correct" : "is-wrong";
        if (wEl) wEl.classList.add(cls);
        if (pEl) pEl.classList.add(ok ? "is-correct" : "is-wrong");
      });
      drawMatchLines();
    } else if (state.mode === "fill") {
      gen.items.forEach((it, i) => {
        const inp = els.exerciseArea.querySelector(`.ex-blank[data-i="${i}"]`);
        const val = (inp && inp.value || "").trim().toLowerCase();
        const ok = val === String(it.missing).toLowerCase();
        if (ok) correct++;
        if (inp) {
          inp.classList.remove("is-correct", "is-wrong");
          inp.classList.add(ok ? "is-correct" : "is-wrong");
          inp.disabled = true;
          if (!ok) inp.value = it.missing; // hiện đáp án đúng
        }
      });
    } else { // choice
      gen.items.forEach((it, i) => {
        const ok = it.selected === it.word;
        if (ok) correct++;
        els.exerciseArea.querySelectorAll(`.ex-choice-opt[data-i="${i}"]`).forEach((b) => {
          b.classList.remove("is-selected");
          if (b.dataset.word === it.word) b.classList.add("is-correct");
          else if (b.dataset.word === it.selected) b.classList.add("is-wrong");
          b.disabled = true;
        });
      });
    }

    showResult(correct, total);
  }

  function resetExercise() {
    stopDialogueMedia();
    generateExercise();
    renderExercise();
  }

  // ---------- Topic picker modal ----------
  function buildPickerGrid() {
    // Lưới phẳng tất cả chủ đề (không phân lớp).
    const cells = data.days.map((d, idx) => {
      const flat = idx + 1;
      const isCurrent = flat === state.currentDay;
      const isEmpty = !d.cards.length;
      return `<button class="topic-cell ${isCurrent ? "is-current" : ""} ${isEmpty ? "is-empty" : ""}" data-day="${flat}">
          <span class="font-medium">${escapeHtml(d.theme || "")}</span>
          <span class="topic-en">${escapeHtml(d.themeEn || "")}</span>
        </button>`;
    });
    els.pickerGrid.innerHTML =
      `<div class="grid grid-cols-2 sm:grid-cols-3 gap-2">${cells.join("")}</div>`;

    els.pickerGrid.querySelectorAll(".topic-cell").forEach((btn) => {
      btn.addEventListener("click", () => {
        setDay(Number(btn.dataset.day));
        closePicker();
      });
    });
  }
  function openPicker() {
    buildPickerGrid();
    els.picker.classList.remove("modal-hidden");
  }
  function closePicker() {
    els.picker.classList.add("modal-hidden");
  }

  // ---------- Actions ----------
  function setDay(n) {
    if (n < 1 || n > data.days.length) return;
    state.currentDay = n;
    saveState();
    renderDayInfo();
    resetExercise();
  }
  function setMode(mode) {
    if (!MODE_TITLE[mode] || mode === state.mode) {
      if (mode === state.mode) { renderModeTabs(); return; }
      return;
    }
    state.mode = mode;
    saveState();
    renderModeTabs();
    resetExercise();
  }

  // ---------- Bindings ----------
  function bindEvents() {
    els.dayPrev.addEventListener("click", () => setDay(state.currentDay - 1));
    els.dayNext.addEventListener("click", () => setDay(state.currentDay + 1));
    els.openPicker.addEventListener("click", openPicker);
    els.pickerClose.addEventListener("click", closePicker);
    els.pickerOverlay.addEventListener("click", closePicker);

    els.modeTabs.querySelectorAll(".mode-tab").forEach((btn) => {
      btn.addEventListener("click", () => setMode(btn.dataset.mode));
    });

    els.btnCheck.addEventListener("click", checkAnswers);
    els.btnReset.addEventListener("click", resetExercise);

    window.addEventListener("resize", () => {
      if (state.mode === "match") drawMatchLines();
    });

    document.addEventListener("keydown", (e) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if (!els.picker.classList.contains("modal-hidden")) {
        if (e.key === "Escape") { e.preventDefault(); closePicker(); }
        return;
      }
      switch (e.key) {
        case "p": case "P": e.preventDefault(); setDay(state.currentDay - 1); break;
        case "n": case "N": e.preventDefault(); setDay(state.currentDay + 1); break;
        case "Enter": e.preventDefault(); checkAnswers(); break;
      }
    });
  }

  // ---------- Init ----------
  function init() {
    if (state.currentDay < 1 || state.currentDay > data.days.length) state.currentDay = 1;
    if (!MODE_TITLE[state.mode]) state.mode = "match";

    bindEvents();
    renderDayInfo();
    renderModeTabs();
    resetExercise();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
