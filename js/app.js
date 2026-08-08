/**
 * app.js
 * ------------------------------------------------------------
 * このファイルが「エンジン」部分です。data.js の中身を読み取って、
 * 画面のHTML要素を組み立てたり、入力内容を保存したりします。
 *
 * SE初心者向けメモ：
 * ・このファイルは data.js の「中身」には一切触れていません
 *   （"イラストを知ってもらいたい" のような具体的な文言は出てきません）。
 *   これが「データと表示ロジックの分離」です。
 * ・保存には localStorage というブラウザ標準の仕組みを使っています。
 *   これは「このブラウザ・この端末にだけ」保存される簡易的な保存場所です。
 *   詳しくは README.md の「保存の仕組みについて」を読んでみてください。
 * ------------------------------------------------------------
 */

// STORAGE_PREFIX: localStorageは「アプリ全体で1つの大きな引き出し」のような
// ものなので、他のサイトのデータと混ざらないように、キーの頭に必ずこの文字列を
// つけます（名前空間、と呼ばれる考え方です）。
const STORAGE_PREFIX = "vision-board:";

/* ---------------------------------------------------------
 * 1. localStorage を安全に読み書きするための小さなヘルパー関数群
 *    （try/catch で囲むのは、プライベートブラウジング中など
 *     localStorageが使えない環境でもエラーで画面が壊れないようにするためです）
 * --------------------------------------------------------- */
function storageGet(key, fallback) {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    return raw === null ? fallback : raw;
  } catch (e) {
    return fallback;
  }
}

function storageSet(key, value) {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, value);
    return true;
  } catch (e) {
    return false;
  }
}

// statusList や table のように「配列（リスト）」を保存したい場合は、
// JSON.stringify で文字列に変換してから保存し、読み込むときに JSON.parse で
// 元の配列に戻します（localStorageは文字列しか保存できないため）。
function storageGetJSON(key, fallback) {
  const raw = storageGet(key, null);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}
function storageSetJSON(key, value) {
  return storageSet(key, JSON.stringify(value));
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

/* ---------------------------------------------------------
 * 2. 画面に「保存しました」を一瞬だけ表示するインジケーター
 * --------------------------------------------------------- */
let flashTimer;
function flash(msg) {
  const indicator = document.getElementById("saveIndicator");
  if (!indicator) return;
  indicator.textContent = msg;
  indicator.classList.add("show");
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => indicator.classList.remove("show"), 1500);
}

// デバウンス：入力のたびに毎回保存すると無駄が多いので、
// 「入力が止まってから400ミリ秒後」にまとめて保存する、というテクニックです。
function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

// オートリサイズ：<textarea>の高さを中身の量に合わせて自動で伸び縮みさせます。
// 手順は「1. 一度高さをリセット → 2. 中身の実際の高さ(scrollHeight)を測る →
// 3. その高さぶんCSSのheightを指定する」という3ステップです。
// こうしないと、文章を削除したときに前の高さのまま伸びっぱなしになってしまいます。
function autosize(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

/* ---------------------------------------------------------
 * 3. DOM要素を作るための小さなヘルパー
 *    document.createElement を毎回書くと長くなるので簡略化しています。
 *    例）el("p", {class:"label"}, "こんにちは")
 *        → <p class="label">こんにちは</p>
 * --------------------------------------------------------- */
function el(tag, attrs, ...children) {
  const node = document.createElement(tag);
  if (attrs) {
    Object.keys(attrs).forEach((k) => {
      const v = attrs[k];
      if (v === undefined || v === null || v === false) return;
      if (k === "class") node.className = v;
      else node.setAttribute(k, v === true ? "" : v);
    });
  }
  children.flat().forEach((c) => {
    if (c === null || c === undefined) return;
    node.appendChild(
      typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c
    );
  });
  return node;
}

/* ===========================================================
 * 4. ブロックごとの描画関数
 *    data.js の blocks[].type に応じて、対応する関数を呼び分けます。
 * =========================================================== */

// --- 確定／未確定を切り替えられるリスト（今回追加した目玉機能） -------------
function buildStatusListEl(key, defaultItems) {
  const wrap = el("div", { class: "status-list" });
  let items = storageGetJSON(key, null);
  if (items === null) items = deepClone(defaultItems || []);

  function persist() {
    storageSetJSON(key, items);
    flash("保存しました");
  }

  function renderRows() {
    wrap.innerHTML = "";

    items.forEach((item, idx) => {
      const isConfirmed = item.status === "confirmed";

      // 確定／未確定 を切り替えるボタン
      const toggleBtn = el(
        "button",
        {
          type: "button",
          class: "status-toggle " + (isConfirmed ? "is-confirmed" : "is-undecided"),
          title: "クリックで確定／未確定を切り替え"
        },
        isConfirmed ? "確定" : "未確定"
      );
      toggleBtn.addEventListener("click", () => {
        item.status = isConfirmed ? "undecided" : "confirmed";
        persist();
        renderRows();
      });

      // 文言そのものを編集できる入力欄
      // <textarea>にして、入力量に応じて自動で高さが伸びるようにしています
      // （1行のinputだと長い文章が見切れてしまうため）
      const textInput = el("textarea", {
        class: "status-text",
        rows: "1",
        placeholder: "内容を入力"
      });
      textInput.value = item.text;
      textInput.addEventListener("input", () => autosize(textInput));
      textInput.addEventListener(
        "input",
        debounce((e) => {
          item.text = e.target.value;
          persist();
        }, 400)
      );

      // この項目を削除するボタン
      const removeBtn = el(
        "button",
        { type: "button", class: "remove-btn", title: "この項目を削除" },
        "×"
      );
      removeBtn.addEventListener("click", () => {
        items.splice(idx, 1);
        persist();
        renderRows();
      });

      wrap.appendChild(el("div", { class: "status-item" }, toggleBtn, textInput, removeBtn));
    });

    // ここまでで全行を wrap に挿入し終えています。
    // (再描画時は wrap は既に画面に貼り付いているので、ここで測れば正しい高さになります)
    wrap.querySelectorAll(".status-text").forEach(autosize);

    // 新しい項目を追加するボタん（未確定として追加されます）
    const addBtn = el("button", { type: "button", class: "add-btn" }, "＋ 項目を追加");
    addBtn.addEventListener("click", () => {
      items.push({ text: "", status: "undecided" });
      persist();
      renderRows();
      const inputs = wrap.querySelectorAll(".status-text");
      if (inputs.length) inputs[inputs.length - 1].focus();
    });
    wrap.appendChild(addBtn);
  }

  renderRows();
  return wrap;
}

function renderStatusList(block) {
  const box = el("div", { class: "block" });
  if (block.label) box.appendChild(el("p", { class: "label" }, block.label));
  box.appendChild(buildStatusListEl(block.key, block.items));
  return box;
}

// --- チェックリスト（完了/選択のON・OFFのみ。確定/未確定とは別物） ---------
function buildChecklistEl(key, defaultItems, columns) {
  const wrap = el("div", { class: "checklist" + (columns === 2 ? " two-col" : "") });
  let items = storageGetJSON(key, null);
  if (items === null) items = deepClone(defaultItems || []);

  function persist() {
    storageSetJSON(key, items);
    flash("保存しました");
  }

  function renderRows() {
    wrap.innerHTML = "";
    items.forEach((item, idx) => {
      const cb = el("input", { type: "checkbox" });
      cb.checked = !!item.checked;
      cb.addEventListener("change", () => {
        item.checked = cb.checked;
        persist();
      });

      let placeholder = "項目名";
      if (item.unclear) placeholder = "内容をご記入ください（元画像で判読できませんでした）";
      else if (item.placeholder) placeholder = "（自由記入）";

      const textInput = el("textarea", {
        class: "inline-text",
        rows: "1",
        placeholder: placeholder
      });
      textInput.value = item.text || "";
      textInput.addEventListener("input", () => autosize(textInput));
      textInput.addEventListener(
        "input",
        debounce((e) => {
          item.text = e.target.value;
          persist();
        }, 400)
      );

      const rowChildren = [cb, textInput];
      if (item.flag) rowChildren.push(el("span", { class: "flag" }, item.flag));

      const removeBtn = el(
        "button",
        { type: "button", class: "remove-btn", title: "削除" },
        "×"
      );
      removeBtn.addEventListener("click", () => {
        items.splice(idx, 1);
        persist();
        renderRows();
      });
      rowChildren.push(removeBtn);

      wrap.appendChild(el("div", { class: "checklist-item" }, ...rowChildren));
    });

    wrap.querySelectorAll(".inline-text").forEach(autosize);

    const addBtn = el("button", { type: "button", class: "add-btn" }, "＋ 項目を追加");
    addBtn.addEventListener("click", () => {
      items.push({ text: "", checked: false });
      persist();
      renderRows();
      const inputs = wrap.querySelectorAll(".inline-text");
      if (inputs.length) inputs[inputs.length - 1].focus();
    });
    wrap.appendChild(addBtn);
  }

  renderRows();
  return wrap;
}

function renderChecklist(block) {
  const box = el("div", { class: "block" });
  if (block.label) box.appendChild(el("p", { class: "label" }, block.label));
  box.appendChild(buildChecklistEl(block.key, block.items, block.columns));
  return box;
}

// --- 自由記入のテキストエリア ------------------------------------------
function renderTextarea(block) {
  const box = el("div", { class: "block" });
  if (block.label) box.appendChild(el("p", { class: "label" }, block.label));
  const ta = el("textarea", {
    class: "fill",
    rows: block.rows || 3,
    placeholder: "自由にご記入ください"
  });
  ta.value = storageGet(block.key, "");
  ta.addEventListener(
    "input",
    debounce((e) => {
      storageSet(block.key, e.target.value);
      flash("保存しました");
    }, 400)
  );
  box.appendChild(ta);
  return box;
}

// --- ラジオボタン（単一選択） -------------------------------------------
function renderRadioGroup(block) {
  const box = el("div", { class: "block" });
  if (block.label) box.appendChild(el("p", { class: "label" }, block.label));
  const row = el("div", { class: "radio-row" });
  const saved = storageGet(block.key, "");
  block.options.forEach((opt) => {
    const radio = el("input", { type: "radio", name: block.key });
    radio.checked = saved === opt.value;
    radio.addEventListener("change", () => {
      storageSet(block.key, opt.value);
      flash("保存しました");
    });
    row.appendChild(el("label", {}, radio, " " + opt.label));
  });
  box.appendChild(row);
  return box;
}

// --- 来場者体験(カスタマージャーニー)：3ステップの固定表示 ---------------
function renderJourney(block) {
  const wrap = el("div", { class: "journey" });
  block.steps.forEach((step) => {
    wrap.appendChild(
      el(
        "div",
        { class: "journey-step" },
        el("span", { class: "step-no" }, step.no),
        el("div", {}, el("strong", {}, step.title), el("p", {}, step.desc))
      )
    );
  });
  return wrap;
}

// --- 表（制作物リスト・リスク対策など） ---------------------------------
function renderTable(block) {
  const box = el("div", { class: "block" });
  if (block.label) box.appendChild(el("p", { class: "label" }, block.label));

  const table = el("table", { class: "fill-table" });
  const headRow = el("tr", {}, ...block.columns.map((c) => el("th", {}, c.label)), el("th", {}, ""));
  table.appendChild(el("thead", {}, headRow));
  const tbody = el("tbody", {});
  table.appendChild(tbody);

  let rows = storageGetJSON(block.key, null);
  if (rows === null) {
    rows = [];
    for (let i = 0; i < block.minRows; i++) {
      const r = {};
      block.columns.forEach((c) => (r[c.key] = ""));
      rows.push(r);
    }
  }

  function persist() {
    storageSetJSON(block.key, rows);
    flash("保存しました");
  }

  function renderRows() {
    tbody.innerHTML = "";
    rows.forEach((row, ridx) => {
      const tr = el("tr", {});
      block.columns.forEach((col) => {
        const input = el("textarea", { class: "cell-text", rows: "1" });
        input.value = row[col.key] || "";
        input.addEventListener("input", () => autosize(input));
        input.addEventListener(
          "input",
          debounce((e) => {
            row[col.key] = e.target.value;
            persist();
          }, 400)
        );
        tr.appendChild(el("td", {}, input));
      });
      const removeBtn = el(
        "button",
        { type: "button", class: "remove-btn", title: "この行を削除" },
        "×"
      );
      removeBtn.addEventListener("click", () => {
        rows.splice(ridx, 1);
        persist();
        renderRows();
      });
      tr.appendChild(el("td", { class: "row-remove" }, removeBtn));
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll(".cell-text").forEach(autosize);
  }
  renderRows();

  const addBtn = el("button", { type: "button", class: "add-btn" }, "＋ 行を追加");
  addBtn.addEventListener("click", () => {
    const r = {};
    block.columns.forEach((c) => (r[c.key] = ""));
    rows.push(r);
    persist();
    renderRows();
  });

  box.appendChild(el("div", { class: "table-wrap" }, table));
  box.appendChild(addBtn);
  return box;
}

// --- 行動計画ロードマップ(6カラム) ---------------------------------------
function renderRoadmap(block) {
  const wrap = el("div", { class: "roadmap" });
  block.columns.forEach((col) => {
    const colWrap = el("div", { class: "roadmap-col" });
    colWrap.appendChild(el("h3", {}, col.title));

    const defaultItems = col.items.map((t) => ({ text: t, checked: false }));
    colWrap.appendChild(buildChecklistEl("s12-" + col.key + "-items", defaultItems, 1));

    const extraKey = "s12-" + col.key + "-extra";
    const extraTa = el("textarea", { class: "fill", rows: 2, placeholder: "（自由記入）" });
    extraTa.value = storageGet(extraKey, "");
    extraTa.addEventListener(
      "input",
      debounce((e) => {
        storageSet(extraKey, e.target.value);
        flash("保存しました");
      }, 400)
    );
    colWrap.appendChild(extraTa);

    const dateKey = "s12-" + col.key + "-date";
    const dateInput = el("input", { type: "date" });
    dateInput.value = storageGet(dateKey, "");
    dateInput.addEventListener("change", (e) => {
      storageSet(dateKey, e.target.value);
      flash("保存しました");
    });
    colWrap.appendChild(el("label", { class: "date-label" }, "完了日", dateInput));

    wrap.appendChild(colWrap);
  });
  return wrap;
}

// --- 日付・短いテキストを並べる入力欄グリッド ----------------------------
function renderFieldGrid(block) {
  const box = el("div", { class: "block" });
  if (block.label) box.appendChild(el("p", { class: "label" }, block.label));
  const grid = el("div", { class: "field-grid cols-" + (block.columns || 2) });
  block.fields.forEach((f) => {
    const input = el("input", { type: f.type || "text" });
    input.value = storageGet(f.key, "");
    const evtName = f.type === "date" ? "change" : "input";
    const handler =
      evtName === "change"
        ? (e) => {
            storageSet(f.key, e.target.value);
            flash("保存しました");
          }
        : debounce((e) => {
            storageSet(f.key, e.target.value);
            flash("保存しました");
          }, 400);
    input.addEventListener(evtName, handler);
    grid.appendChild(el("label", {}, f.label, input));
  });
  box.appendChild(grid);
  return box;
}

// --- 「総予算：約　＿＿円」のような一行入力 -------------------------------
function renderFieldInline(block) {
  const box = el("div", { class: "field-inline" });
  box.appendChild(document.createTextNode(block.label));
  const input = el("input", { type: "text", inputmode: "numeric", placeholder: "金額" });
  input.value = storageGet(block.key, "");
  input.addEventListener(
    "input",
    debounce((e) => {
      storageSet(block.key, e.target.value);
      flash("保存しました");
    }, 400)
  );
  box.appendChild(input);
  if (block.suffix) box.appendChild(document.createTextNode(block.suffix));
  return box;
}

// block.type と実際に描画する関数の対応表
function renderBlock(block) {
  switch (block.type) {
    case "statusList":
      return renderStatusList(block);
    case "checklist":
      return renderChecklist(block);
    case "textarea":
      return renderTextarea(block);
    case "radioGroup":
      return renderRadioGroup(block);
    case "journey":
      return renderJourney(block);
    case "table":
      return renderTable(block);
    case "roadmap":
      return renderRoadmap(block);
    case "fieldGrid":
      return renderFieldGrid(block);
    case "fieldInline":
      return renderFieldInline(block);
    default:
      console.warn("未対応のblock.type:", block.type);
      return el("div", {});
  }
}

/* ===========================================================
 * 5. セクション（1〜18の各カード）の描画
 * =========================================================== */
function renderSection(section) {
  const article = el("article", { class: "card stage-" + section.stage, id: section.id });

  article.appendChild(
    el(
      "div",
      { class: "card-head" },
      el("span", { class: "icon" }, section.icon),
      el("h2", {}, el("span", { class: "num" }, section.num + "."), section.title),
      el("span", { class: "stage-tag" }, section.stageLabel)
    )
  );

  if (section.sub) article.appendChild(el("p", { class: "card-sub" }, section.sub));

  const blocks = section.blocks.map(renderBlock);

  if (section.layout === "col3") {
    const grid = el("div", { class: "col3" });
    blocks.forEach((b) => grid.appendChild(b));
    article.appendChild(grid);
  } else if (section.layout === "col2-last") {
    blocks.slice(0, -2).forEach((b) => article.appendChild(b));
    const grid = el("div", { class: "col2" });
    blocks.slice(-2).forEach((b) => grid.appendChild(b));
    article.appendChild(grid);
  } else {
    blocks.forEach((b) => article.appendChild(b));
  }

  return article;
}

/* ===========================================================
 * 6. 印刷ボタン
 *    以前チャット内プレビューで動かなかった理由と対策は README.md の
 *    「印刷ボタンについて」に詳しく書いています。ここでは
 *    window.print() を呼ぶだけのシンプルな実装にしています。
 * =========================================================== */
function wirePrint() {
  const btn = document.getElementById("printBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    window.print();
  });
}

/* ===========================================================
 * 7. localStorageが使えるかどうかを確認し、使えない場合は
 *    画面上部に注意書きを表示する
 * =========================================================== */
function checkStorage() {
  const banner = document.getElementById("storageWarning");
  if (!banner) return;
  try {
    const testKey = STORAGE_PREFIX + "__test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    banner.hidden = true;
  } catch (e) {
    banner.hidden = false;
  }
}

/* ===========================================================
 * 8. 初期化
 * =========================================================== */
function init() {
  const DATA = window.VISION_BOARD_DATA;

  // 基本情報
  document.getElementById("venue").textContent = DATA.meta.venue;
  document.getElementById("space").textContent = DATA.meta.space;

  const createdInput = document.getElementById("meta-created");
  createdInput.value = storageGet("meta-created", "");
  createdInput.addEventListener("change", (e) => {
    storageSet("meta-created", e.target.value);
    flash("保存しました");
  });

  const updatedInput = document.getElementById("meta-updated");
  updatedInput.value = storageGet("meta-updated", "");
  updatedInput.addEventListener("change", (e) => {
    storageSet("meta-updated", e.target.value);
    flash("保存しました");
  });

  // フロー凡例
  const legend = document.getElementById("flowLegend");
  DATA.flowStages.forEach((s, idx) => {
    legend.appendChild(el("span", { class: "chip stage-" + s.id }, s.label));
    if (idx < DATA.flowStages.length - 1) legend.appendChild(el("span", { class: "arrow" }, "→"));
  });

  // 階層表
  const hBody = document.getElementById("hierarchyTableBody");
  DATA.hierarchyTable.forEach((row) => {
    hBody.appendChild(el("tr", {}, el("td", {}, row.stage), el("td", {}, row.desc)));
  });

  // 設計ルール
  const rulesList = document.getElementById("rulesList");
  DATA.designRules.forEach((r) => rulesList.appendChild(el("li", {}, r)));

  // 18セクション
  const main = document.getElementById("sections");
  DATA.sections.forEach((s) => main.appendChild(renderSection(s)));

  // 補足：textareaの高さ(scrollHeight)は、実際に画面(DOM)に挿入された後で
  // ないと正しく測れません。ここまでの appendChild で全セクションが画面に
  // 挿入された「後」に、あらためて全てのtextareaの高さを計算し直しています。
  document.querySelectorAll("textarea.status-text, textarea.inline-text, textarea.cell-text").forEach(autosize);

  wirePrint();
  checkStorage();
}

document.addEventListener("DOMContentLoaded", init);
