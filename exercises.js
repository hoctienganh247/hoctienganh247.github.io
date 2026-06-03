// Học Tiếng Anh — Bài tập ôn luyện Lớp 1–5 — logic
// Dùng chung dữ liệu với flashcard: window.data = { days: [{ id, level, theme, themeEn, cards:[{emoji,word,ipa,meaning}] }] }
// 3 dạng bài tập: match (nối từ–hình), fill (điền chữ thiếu), choice (trắc nghiệm).

(function () {
  const STORAGE_KEY = "htt-en:exercises:state";

  const defaultState = {
    currentDay: 1,
    mode: "match", // "match" | "fill" | "choice"
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
    els.dayLabel.textContent = `${d.level || ""} · Chủ đề`;
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

  function renderExercise() {
    resetResult();
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
    generateExercise();
    renderExercise();
  }

  // ---------- Topic picker modal ----------
  function buildPickerGrid() {
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
