// ===== 时光留影 Web 版 - 主逻辑 =====

// ---------- 路由 ----------
const routes = {
  "home": { title: "修复照片", render: renderHome },
  "compare": { title: "前后对比", render: renderCompare },
  "pricing": { title: "会员中心", render: renderPricing },
  "history": { title: "修复记录", render: renderHistory },
  "profile": { title: "我的", render: renderProfile },
  "result": { title: "修复结果", render: renderResult },
};

let state = {
  currentPage: "home",
  isVip: false,
  usedToday: 0,
  dailyLimit: 1,
  currentImage: null,
  resultImage: null,
  records: [],
  processing: false,
  effects: [],
  isLoggedIn: localStorage.getItem("shiguang_logged") === "true",
  nickname: localStorage.getItem("shiguang_nick") || "",
};

function navigate(page) {
  state.currentPage = page;
  document.querySelectorAll(".page").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
  const pageEl = document.getElementById("page-" + page);
  if (pageEl) pageEl.classList.add("active");
  const navLink = document.querySelector(`.nav-link[data-page="${page}"]`);
  if (navLink) navLink.classList.add("active");
  renderPage(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderPage(page) {
  const fn = routes[page]?.render;
  if (fn) fn();
  // 更新导航标题
  document.title = "时光留影 - " + (routes[page]?.title || "AI老照片修复");
}

// ---------- Toast ----------
function showToast(msg, type = "success") {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = "toast " + type + " show";
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove("show"), 2500);
}

// ===== 首页 =====
function renderHome() {
  const el = document.getElementById("page-home");
  const freeCount = Math.max(0, state.dailyLimit - state.usedToday);
  el.querySelector(".free-count").textContent = freeCount;
  el.querySelector(".daily-limit").textContent = state.dailyLimit;
}

function setupUpload() {
  const zone = document.getElementById("upload-zone");
  const input = document.getElementById("file-input");

  zone.addEventListener("click", () => input.click());
  zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("dragover"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("dragover");
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
  });
  input.addEventListener("change", (e) => {
    if (e.target.files.length > 0) handleFile(e.target.files[0]);
  });
}

function handleFile(file) {
  if (!file.type.startsWith("image/")) {
    showToast("请选择图片文件", "error");
    return;
  }
  if (file.size > 20 * 1024 * 1024) {
    showToast("图片不能超过 20MB", "error");
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    state.currentImage = e.target.result;
    navigate("result");
  };
  reader.readAsDataURL(file);
}

// ===== 结果页 + 处理 =====
function renderResult() {
  const el = document.getElementById("page-result");
  if (state.processing) {
    el.innerHTML = `
      <div class="container">
        <div class="processing">
          <div class="spinner"></div>
          <h3>正在用 AI 修复您的照片...</h3>
          <p>正在进行：去模糊 → 超清化 → 智能上色</p>
          <div class="progress-steps">
            <div class="step" id="step-sr"><span class="dot"></span> 去模糊 & 超分辨率</div>
            <div class="step" id="step-face"><span class="dot"></span> 人脸增强</div>
            <div class="step" id="step-color"><span class="dot"></span> 智能上色</div>
            <div class="step" id="step-fix"><span class="dot"></span> 划痕修复</div>
          </div>
        </div>
      </div>`;
    startProcessing();
  } else if (state.resultImage) {
    renderResultContent();
  } else {
    el.innerHTML = `
      <div class="container">
        <div class="empty-state">
          <div class="icon">📸</div>
          <p>没有待处理的照片，请先上传</p>
          <button class="btn btn-primary" onclick="navigate('home')">去上传照片</button>
        </div>
      </div>`;
  }
}

function startProcessing() {
  const steps = ["step-sr", "step-face", "step-color", "step-fix"];
  let i = 0;
  const interval = setInterval(() => {
    if (i > 0) {
      document.getElementById(steps[i-1])?.classList.remove("active");
      document.getElementById(steps[i-1])?.classList.add("done");
    }
    if (i < steps.length) {
      document.getElementById(steps[i])?.classList.add("active");
      i++;
    }
    if (i > steps.length) {
      clearInterval(interval);
      state.processing = false;
      state.resultImage = state.currentImage; // In demo, use original as "result"
      state.effects = ["去模糊 ✓", "超清化 ✓", "色彩增强 ✓"];
      renderResultContent();
      showToast("修复完成！");
    }
  }, 1000);
}

function renderResultContent() {
  const el = document.getElementById("page-result");
  const canDownload = state.isVip || state.usedToday < state.dailyLimit;
  el.innerHTML = `
    <div class="container">
      <div class="result-area">
        <div class="result-image">
          <img src="${state.resultImage}" alt="修复结果" id="result-img">
        </div>
        <div class="effect-tags">
          ${state.effects.map(e => `<span class="effect-tag">${e}</span>`).join("")}
        </div>
        <div class="result-actions">
          <button class="btn btn-primary" onclick="navigate('compare')">📊 前后对比</button>
          ${canDownload
            ? `<button class="btn btn-accent" onclick="downloadResult()">⬇️ 下载高清原图</button>`
            : `<button class="btn btn-warm" onclick="navigate('pricing')">🔓 付费解锁高清下载</button>`
          }
        </div>
        ${!canDownload ? `<p style="text-align:center;color:var(--text-muted);font-size:13px;">今日免费次数已用完，开通会员无限使用</p>" : ""}
      </div>
    </div>`;
  // Save to history
  if (state.currentImage && state.resultImage) {
    state.records.unshift({
      id: Date.now(),
      thumb: state.resultImage,
      date: new Date().toLocaleDateString("zh-CN"),
      effects: state.effects.join(" + "),
      isVip: state.isVip
    });
  }
}

// ===== 对比页 =====
function renderCompare() {
  const el = document.getElementById("page-compare");
  if (!state.currentImage || !state.resultImage) {
    el.innerHTML = `<div class="container"><div class="empty-state"><div class="icon">📸</div><p>请先修复一张照片</p><button class="btn btn-primary" onclick="navigate('home')">去上传</button></div></div>`;
    return;
  }
  el.innerHTML = `
    <div class="container">
      <h2 style="text-align:center;margin-bottom:24px;">📊 修复前后对比</h2>
      <div class="compare-container" id="compare-container">
        <img src="${state.currentImage}" alt="修复前">
        <div class="compare-overlay" id="compare-overlay" style="width:50%">
          <img src="${state.resultImage}" alt="修复后">
        </div>
        <div class="compare-slider" id="compare-slider"></div>
        <div class="compare-handle" id="compare-handle">⇔</div>
      </div>
      <div class="compare-labels">
        <span>📷 修复前</span>
        <span>✨ 修复后</span>
      </div>
      <div style="text-align:center;">
        <button class="btn btn-accent" onclick="downloadResult()">⬇️ 下载修复版</button>
        <button class="btn btn-outline" onclick="navigate('home')" style="margin-left:12px;">🔄 重新上传</button>
      </div>
    </div>`;
  initCompareSlider();
}

function initCompareSlider() {
  const container = document.getElementById("compare-container");
  const overlay = document.getElementById("compare-overlay");
  const slider = document.getElementById("compare-slider");
  const handle = document.getElementById("compare-handle");
  if (!container) return;

  let isDragging = false;
  function update(x) {
    const rect = container.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    overlay.style.width = pct + "%";
    slider.style.left = pct + "%";
    handle.style.left = pct + "%";
  }
  handle.addEventListener("mousedown", () => isDragging = true);
  handle.addEventListener("touchstart", () => isDragging = true);
  document.addEventListener("mousemove", (e) => { if (isDragging) { update(e.clientX); } });
  document.addEventListener("touchmove", (e) => { if (isDragging) { update(e.touches[0].clientX); } });
  document.addEventListener("mouseup", () => isDragging = false);
  document.addEventListener("touchend", () => isDragging = false);
}

// ===== 套餐页 =====
function renderPricing() {
  const el = document.getElementById("page-pricing");
  // Already has static HTML
}

function selectPlan(plan) {
  document.querySelectorAll(".plan-card").forEach(c => c.classList.remove("active"));
  const card = document.querySelector(`.plan-card[data-plan="${plan}"]`);
  if (card) card.classList.add("active");
}

async function handlePayment(plan) {
  if (!state.isLoggedIn) {
    // Auto-login for demo
    state.isLoggedIn = true;
    state.nickname = "用户_" + Math.random().toString(36).slice(2, 6);
    localStorage.setItem("shiguang_logged", "true");
    localStorage.setItem("shiguang_nick", state.nickname);
  }
  showToast("正在创建订单...");
  await new Promise(r => setTimeout(r, 800));
  showToast("支付成功！🎉 欢迎成为会员");
  state.isVip = true;
  setTimeout(() => navigate("profile"), 1000);
}

function buySingle() {
  if (!state.isLoggedIn) {
    state.isLoggedIn = true;
    state.nickname = "用户_" + Math.random().toString(36).slice(2, 6);
    localStorage.setItem("shiguang_logged", "true");
    localStorage.setItem("shiguang_nick", state.nickname);
  }
  showToast("支付成功！¥3.9 可下载当前照片");
}

// ===== 历史页 =====
function renderHistory() {
  const el = document.getElementById("page-history");
  if (state.records.length === 0) {
    el.querySelector(".record-list").innerHTML = `
      <div class="empty-state">
        <div class="icon">📸</div>
        <p>还没有修复记录</p>
        <button class="btn btn-primary" onclick="navigate('home')">去修复第一张照片</button>
      </div>`;
    return;
  }
  el.querySelector(".record-count").textContent = state.records.length;
  el.querySelector(".record-list").innerHTML = state.records.map(r => `
    <div class="record-item">
      <div class="record-thumb"><img src="${r.thumb}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;"></div>
      <div class="record-info">
        <div class="date">${r.date}</div>
        <div class="effects">${r.effects}</div>
      </div>
      ${r.isVip ? '<span style="font-size:12px;background:rgba(253,203,110,0.15);color:#FDCB6E;padding:4px 12px;border-radius:10px;">VIP</span>' : ""}
    </div>
  `).join("");
}

// ===== 个人中心 =====
function renderProfile() {
  const el = document.getElementById("page-profile");
  el.querySelector(".nickname").textContent = state.nickname || "未登录";
  el.querySelector(".vip-badge").textContent = state.isVip ? "🌟 VIP 会员" : "普通用户";
  el.querySelector(".vip-badge").className = "badge " + (state.isVip ? "badge-vip" : "badge-normal");
  el.querySelector(".restore-count").textContent = state.records.length;
  el.querySelector(".saved-count").textContent = state.records.filter(r => r.isVip).length || state.records.length;
}

function login() {
  state.isLoggedIn = true;
  state.nickname = "用户_" + Math.random().toString(36).slice(2, 6);
  localStorage.setItem("shiguang_logged", "true");
  localStorage.setItem("shiguang_nick", state.nickname);
  renderProfile();
  showToast("登录成功！");
}

function shareApp() {
  if (navigator.share) {
    navigator.share({ title: "时光留影", text: "AI 老照片修复，让记忆重新清晰", url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href);
    showToast("链接已复制，快去分享吧！");
  }
}

function showAbout() {
  document.getElementById("modal-about").classList.add("show");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("show");
}

function downloadResult() {
  if (!state.resultImage) { showToast("没有可下载的图片", "error"); return; }
  const a = document.createElement("a");
  a.href = state.resultImage;
  a.download = "时光留影_修复_" + Date.now() + ".jpg";
  a.click();
  showToast("已开始下载！");
}

// ===== 初始化 =====
document.addEventListener("DOMContentLoaded", () => {
  setupUpload();
  navigate("home");
  // Update free count display
  renderHome();
});

// ===== 暴露到全局供 HTML onclick 使用 =====
window.navigate = navigate;
window.selectPlan = selectPlan;
window.handlePayment = handlePayment;
window.buySingle = buySingle;
window.login = login;
window.shareApp = shareApp;
window.showAbout = showAbout;
window.closeModal = closeModal;
window.downloadResult = downloadResult;
