// Học Tiếng Anh — Flashcard Lớp 1–5 — app logic
// Globals from data.js: window.data = { days: [{ id, level, theme, themeEn, cards: [...] }] }
// Mỗi card: { emoji, word, ipa, meaning }

(function () {
  const STORAGE_KEY = "htt-en:flashcard:state";

  const defaultState = {
    currentDay: 1,
    currentCardIndex: 0,
    ratings: {}, // key: `${dayId}-${cardIdx}` → "easy" | "medium" | "hard"
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

  // ---------- DOM ----------
  const $ = (id) => document.getElementById(id);
  const els = {
    statEasy: $("stat-easy"),
    statMedium: $("stat-medium"),
    statHard: $("stat-hard"),
    dayLabel: $("day-label"),
    dayThemeEn: $("day-theme-en"),
    dayThemeVi: $("day-theme-vi"),
    topicName: $("topic-name"),
    cardProgress: $("card-progress"),
    dayPrev: $("day-prev"),
    dayNext: $("day-next"),
    openPicker: $("open-picker"),
    flashcard: $("flashcard"),
    frontWord: $("front-word"),
    frontIpa: $("front-ipa"),
    backEmoji: $("back-emoji"),
    backMeaning: $("back-meaning"),
    cardPrev: $("card-prev"),
    cardNext: $("card-next"),
    emptyState: $("empty-state"),
    picker: $("picker"),
    pickerOverlay: $("picker-overlay"),
    pickerClose: $("picker-close"),
    pickerGrid: $("picker-grid"),
  };

  // ---------- Helpers ----------
  function currentDayData() {
    return data.days[state.currentDay - 1];
  }
  function currentCard() {
    const d = currentDayData();
    if (!d || !d.cards.length) return null;
    return d.cards[state.currentCardIndex] || null;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
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

  // ---------- IndexedDB (recordings) ----------
  const DB_NAME = "htt-en-rec-flashcard";
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

  function recordingId(day, idx, slot) {
    return `${day}-${idx}-${slot}`;
  }

  // ---------- MediaRecorder ----------
  let activeRecorder = null;
  let sharedStream = null;

  async function getMicStream() {
    if (sharedStream && sharedStream.getTracks().some((t) => t.readyState === "live")) {
      return sharedStream;
    }
    sharedStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return sharedStream;
  }

  function setRecButtonState(slot, recording) {
    document.querySelectorAll(`.rec-btn[data-slot="${slot}"]`).forEach((btn) => {
      btn.classList.toggle("is-recording", recording);
      const mic = btn.querySelector(".rec-icon-mic");
      const stop = btn.querySelector(".rec-icon-stop");
      if (mic) mic.classList.toggle("hidden", recording);
      if (stop) stop.classList.toggle("hidden", !recording);
      btn.title = recording ? "Dừng thu" : "Thu âm giọng bạn";
    });
  }

  function setPlayButtonVisible(slot, visible) {
    document.querySelectorAll(`.play-rec-btn[data-slot="${slot}"]`).forEach((btn) => {
      btn.classList.toggle("hidden", !visible);
    });
  }

  async function refreshRecButtons() {
    const day = state.currentDay;
    const idx = state.currentCardIndex;
    for (const slot of ["word"]) {
      try {
        const rec = await getRecording(recordingId(day, idx, slot));
        setPlayButtonVisible(slot, !!rec);
      } catch {
        setPlayButtonVisible(slot, false);
      }
    }
  }

  function pickRecorderMime() {
    if (!window.MediaRecorder || !MediaRecorder.isTypeSupported) return "";
    const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
    for (const c of candidates) {
      if (MediaRecorder.isTypeSupported(c)) return c;
    }
    return "";
  }

  async function startRecording(slot) {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      alert("Trình duyệt không hỗ trợ thu âm.");
      return;
    }
    if (activeRecorder) {
      await stopRecording();
    }
    let stream;
    try {
      stream = await getMicStream();
    } catch (err) {
      alert("Cần cấp quyền truy cập micro để thu âm.");
      return;
    }
    const mimeType = pickRecorderMime();
    const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    const day = state.currentDay;
    const idx = state.currentCardIndex;
    const savedPromise = new Promise((resolve) => {
      recorder.onstop = async () => {
        try {
          const type = recorder.mimeType || "audio/webm";
          const blob = new Blob(chunks, { type });
          await putRecording(recordingId(day, idx, slot), blob, type);
        } catch (err) {
          console.error("Lưu bản thu thất bại:", err);
        } finally {
          if (day === state.currentDay && idx === state.currentCardIndex) {
            setPlayButtonVisible(slot, true);
          }
          resolve();
        }
      };
    });
    activeRecorder = { recorder, slot, chunks, stream, day, idx, savedPromise };
    setRecButtonState(slot, true);
    recorder.start();
  }

  async function stopRecording() {
    if (!activeRecorder) return;
    const { recorder, slot, savedPromise } = activeRecorder;
    activeRecorder = null;
    setRecButtonState(slot, false);
    if (recorder.state !== "inactive") {
      try { recorder.stop(); } catch {}
    }
    await savedPromise;
  }

  // ---------- Playback (bản thu của user) ----------
  let activePlayback = null;

  function setPlayBtnState(slot, isPlaying) {
    document.querySelectorAll(`.play-rec-btn[data-slot="${slot}"]`).forEach((btn) => {
      btn.classList.toggle("is-playing", isPlaying);
      const p = btn.querySelector(".play-icon-play");
      const ps = btn.querySelector(".play-icon-pause");
      if (p) p.classList.toggle("hidden", isPlaying);
      if (ps) ps.classList.toggle("hidden", !isPlaying);
      btn.title = isPlaying ? "Tạm dừng" : "Nghe lại bản thu";
    });
  }

  function stopPlayback() {
    if (!activePlayback) return;
    const { audio, slot, url } = activePlayback;
    activePlayback = null;
    try { audio.pause(); } catch {}
    try { URL.revokeObjectURL(url); } catch {}
    setPlayBtnState(slot, false);
  }

  async function playRecording(slot) {
    if (activePlayback && activePlayback.slot === slot) {
      const a = activePlayback.audio;
      if (a.paused) {
        try {
          await a.play();
          setPlayBtnState(slot, true);
        } catch {
          stopPlayback();
        }
      } else {
        a.pause();
        setPlayBtnState(slot, false);
      }
      return;
    }
    if (activePlayback) stopPlayback();

    const id = recordingId(state.currentDay, state.currentCardIndex, slot);
    let rec;
    try { rec = await getRecording(id); } catch { rec = null; }
    if (!rec || !rec.blob) return;
    const url = URL.createObjectURL(rec.blob);
    const audio = new Audio(url);
    activePlayback = { audio, slot, url };
    setPlayBtnState(slot, true);
    const cleanup = () => { if (activePlayback && activePlayback.audio === audio) stopPlayback(); };
    audio.onended = cleanup;
    audio.onerror = cleanup;
    try {
      await audio.play();
    } catch {
      cleanup();
    }
  }

  // ---------- Renderers ----------
  function renderHeader() {
    let easy = 0, medium = 0, hard = 0;
    for (const v of Object.values(state.ratings)) {
      if (v === "easy") easy++;
      else if (v === "medium") medium++;
      else if (v === "hard") hard++;
    }
    els.statEasy.textContent = easy;
    els.statMedium.textContent = medium;
    els.statHard.textContent = hard;
  }

  function renderDayInfo() {
    const d = currentDayData();
    els.dayLabel.textContent = `${d.level || ""} · Chủ đề`;
    els.dayThemeEn.textContent = d.themeEn || "—";
    els.dayThemeVi.textContent = d.theme || "Chưa cập nhật";
    els.topicName.textContent = d.theme || "—";
    const total = d.cards.length;
    const shown = total ? Math.min(state.currentCardIndex + 1, total) : 0;
    els.cardProgress.textContent = `${shown} / ${total || 0}`;
  }

  function renderCard() {
    // Reset flip when changing card
    els.flashcard.classList.remove("is-flipped");

    const card = currentCard();
    if (!card) {
      els.flashcard.style.visibility = "hidden";
      els.emptyState.classList.remove("hidden");
      return;
    }
    els.flashcard.style.visibility = "visible";
    els.emptyState.classList.add("hidden");

    // Front
    els.frontWord.textContent = card.word;
    els.frontIpa.textContent = card.ipa || "";

    // Back
    els.backEmoji.textContent = card.emoji || "";
    els.backMeaning.textContent = card.meaning;

    // add subtle fade-in
    const inner = els.flashcard.querySelector(".card-inner");
    inner.classList.remove("fade-in");
    void inner.offsetWidth;
    inner.classList.add("fade-in");

    setPlayButtonVisible("word", false);
    refreshRecButtons();
  }

  function renderAll() {
    renderHeader();
    renderDayInfo();
    renderCard();
  }

  // ---------- Actions ----------
  async function leaveCurrentCard() {
    stopPlayback();
    if (activeRecorder) await stopRecording();
  }

  function flipCard() {
    if (!currentCard()) return;
    els.flashcard.classList.toggle("is-flipped");
  }
  async function goPrev() {
    if (state.currentCardIndex > 0) {
      await leaveCurrentCard();
      state.currentCardIndex--;
      saveState();
      renderDayInfo();
      renderCard();
    }
  }
  async function goNext() {
    const d = currentDayData();
    if (!d.cards.length) return;
    if (state.currentCardIndex < d.cards.length - 1) {
      await leaveCurrentCard();
      state.currentCardIndex++;
      saveState();
      renderDayInfo();
      renderCard();
    }
  }
  function rateCard(level) {
    if (!currentCard()) return;
    const key = `${state.currentDay}-${state.currentCardIndex}`;
    state.ratings[key] = level;
    saveState();
    renderHeader();
    // small delay so flip animation does not collide
    setTimeout(goNext, 180);
  }
  async function setDay(n) {
    if (n < 1 || n > data.days.length) return;
    await leaveCurrentCard();
    state.currentDay = n;
    state.currentCardIndex = 0;
    saveState();
    renderAll();
  }
  function dayPrevAction() { setDay(state.currentDay - 1); }
  function dayNextAction() { setDay(state.currentDay + 1); }

  // ---------- Modal ----------
  function buildPickerGrid() {
    // Nhóm chủ đề theo level ("Lớp 1" …), giữ thứ tự; mỗi ô là một nút tên chủ đề.
    const groups = [];
    data.days.forEach((d, idx) => {
      const key = d.level || "—";
      let g = groups.find((x) => x.level === key);
      if (!g) { g = { level: key, items: [] }; groups.push(g); }
      g.items.push({ d, flat: idx + 1 });
    });
    els.pickerGrid.innerHTML = groups.map((g) => {
      const cells = g.items.map(({ d, flat }) => {
        const isCurrent = flat === state.currentDay;
        const isEmpty = !d.cards.length;
        return `<button class="topic-cell ${isCurrent ? "is-current" : ""} ${isEmpty ? "is-empty" : ""}" data-day="${flat}">
            <span class="font-medium">${escapeHtml(d.theme || "")}</span>
            <span class="topic-en">${escapeHtml(d.themeEn || "")}</span>
          </button>`;
      });
      return `
        <div>
          <div class="flex items-baseline justify-between mb-3">
            <div class="text-brand-redSoft text-xs tracking-[0.18em] uppercase font-semibold">${escapeHtml(g.level)}</div>
            <div class="text-xs text-dim">${g.items.length} chủ đề</div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">${cells.join("")}</div>
        </div>`;
    }).join("");

    els.pickerGrid.querySelectorAll(".topic-cell").forEach((btn) => {
      btn.addEventListener("click", () => {
        const n = Number(btn.dataset.day);
        setDay(n);
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

  // ---------- Bindings ----------
  function bindEvents() {
    // card flip on click (front + back faces)
    els.flashcard.querySelectorAll(".card-face").forEach((face) => {
      face.addEventListener("click", (e) => {
        if (e.target.closest(".speaker, .rec-btn, .play-rec-btn")) return;
        flipCard();
      });
    });

    // speakers
    document.querySelectorAll(".speaker").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const targetId = btn.dataset.target;
        const el = document.getElementById(targetId);
        if (el) speak(el.textContent.trim());
      });
    });

    // record buttons
    document.querySelectorAll(".rec-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const slot = btn.dataset.slot;
        if (activeRecorder && activeRecorder.slot === slot) stopRecording();
        else startRecording(slot);
      });
    });

    // play recording buttons
    document.querySelectorAll(".play-rec-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        playRecording(btn.dataset.slot);
      });
    });

    // card nav
    els.cardPrev.addEventListener("click", goPrev);
    els.cardNext.addEventListener("click", goNext);

    // topic nav
    els.dayPrev.addEventListener("click", dayPrevAction);
    els.dayNext.addEventListener("click", dayNextAction);

    // open / close modal
    els.openPicker.addEventListener("click", openPicker);
    els.pickerClose.addEventListener("click", closePicker);
    els.pickerOverlay.addEventListener("click", closePicker);

    // rating
    document.querySelectorAll(".rate-btn").forEach((btn) => {
      btn.addEventListener("click", () => rateCard(btn.dataset.level));
    });

    // keyboard
    document.addEventListener("keydown", (e) => {
      // Don't intercept when typing
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;

      if (!els.picker.classList.contains("modal-hidden")) {
        if (e.key === "Escape") { e.preventDefault(); closePicker(); }
        return;
      }

      switch (e.key) {
        case " ":
        case "Spacebar":
          e.preventDefault();
          flipCard();
          break;
        case "ArrowLeft":
          e.preventDefault(); goPrev(); break;
        case "ArrowRight":
          e.preventDefault(); goNext(); break;
        case "p":
        case "P":
          e.preventDefault(); dayPrevAction(); break;
        case "n":
        case "N":
          e.preventDefault(); dayNextAction(); break;
        case "1":
          e.preventDefault(); rateCard("hard"); break;
        case "2":
          e.preventDefault(); rateCard("medium"); break;
        case "3":
          e.preventDefault(); rateCard("easy"); break;
        case "Escape":
          // no-op when no modal
          break;
      }
    });
  }

  // ---------- Init ----------
  function init() {
    // clamp state
    if (state.currentDay < 1 || state.currentDay > data.days.length) state.currentDay = 1;
    const d = currentDayData();
    if (!d.cards.length) state.currentCardIndex = 0;
    else if (state.currentCardIndex >= d.cards.length) state.currentCardIndex = 0;

    bindEvents();
    renderAll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
