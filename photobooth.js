// Hoosier Daddy Photobooth engine.
// Everything runs in the visitor's browser. Nothing is uploaded or stored:
// no server, no cookies, no localStorage. The camera stops the moment a photo
// is taken, and the photo only lives in this tab until it's closed.
(() => {
  "use strict";

  const S = SETTINGS;
  const $ = (id) => document.getElementById(id);

  const stage = $("stage");
  const ctx = stage.getContext("2d");
  const cameraBtn = $("camera-btn");
  const snapBtn = $("snap-btn");
  const zoomWrap = $("zoom-wrap");
  const zoomInput = $("zoom");
  const countdownEl = $("countdown");
  const flashEl = $("flash");
  const resultEl = $("result");
  const resultImg = $("result-img");
  const liveControls = $("live-controls");
  const saveBtn = $("save-btn");
  const shareBtn = $("share-btn");
  const retakeBtn = $("retake-btn");
  const shareTip = $("share-tip");
  const errorEl = $("camera-error");

  const MAX_SIDE = 1280; // keep photos a sensible size for phones
  const video = document.createElement("video");
  video.playsInline = true;
  video.muted = true;
  video.setAttribute("playsinline", "");

  let stream = null;
  let current = null;      // the chosen cutout from settings
  let bg = null;           // prepared background canvas for the current cutout
  let zoom = S.defaultZoom || 1.8;
  let photoUrl = null;
  let photoBlob = null;
  let busy = false;
  const bgCache = new Map();

  // ---------- page text + colors from settings ----------
  document.title = titleCase(S.title);
  $("site-title").textContent = S.title;
  $("site-tagline").textContent = S.tagline;
  const root = document.documentElement.style;
  if (S.colors) {
    if (S.colors.crimson) root.setProperty("--crimson", S.colors.crimson);
    if (S.colors.cream) root.setProperty("--cream", S.colors.cream);
    if (S.colors.creamDark) root.setProperty("--cream-dark", S.colors.creamDark);
    if (S.colors.ink) root.setProperty("--ink", S.colors.ink);
    if (S.colors.hot) root.setProperty("--hot", S.colors.hot);
    if (S.colors.sky) root.setProperty("--sky", S.colors.sky);
  }
  const C = Object.assign({ crimson: "#990000", cream: "#EEEDEB", ink: "#1a0a0a", hot: "#ff2d6f" }, S.colors);
  zoomInput.value = zoom;

  function titleCase(s) {
    return s.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase());
  }

  // ---------- picker ----------
  function buildPicker() {
    const shelves = $("shelves");
    const groups = [];
    for (const c of S.cutouts) {
      let g = groups.find((x) => x.name === c.group);
      if (!g) groups.push((g = { name: c.group, items: [] }));
      g.items.push(c);
    }
    for (const g of groups) {
      const shelf = document.createElement("div");
      shelf.className = "shelf";
      const h = document.createElement("h3");
      h.textContent = g.name;
      const cards = document.createElement("div");
      cards.className = "cards";
      for (const c of g.items) {
        const b = document.createElement("button");
        b.className = "card";
        b.type = "button";
        b.dataset.id = c.id;
        b.setAttribute("aria-pressed", "false");
        const img = document.createElement("img");
        img.className = "thumb";
        img.alt = "";
        img.loading = "lazy";
        img.src = c.image ? c.image : cartoon(c, 300).toDataURL("image/png");
        img.onerror = () => { img.src = cartoon(c, 300).toDataURL("image/png"); };
        const n = document.createElement("span");
        n.className = "card-name";
        n.textContent = c.name;
        const cap = document.createElement("span");
        cap.className = "card-cap";
        cap.textContent = c.image ? c.caption : "Cartoon stand-in";
        b.append(img, n, cap);
        if (!c.image) {
          const needs = document.createElement("span");
          needs.className = "needs";
          needs.textContent = "PHOTO NEEDED";
          b.append(needs);
        }
        b.addEventListener("click", () => {
          choose(c);
          if (window.innerWidth < 900) $("booth-panel").scrollIntoView({ behavior: "smooth", block: "start" });
        });
        cards.append(b);
      }
      shelf.append(h, cards);
      shelves.append(shelf);
    }
  }

  async function choose(c) {
    current = c;
    $("now-name").textContent = c.name;
    document.querySelectorAll(".card").forEach((el) => el.setAttribute("aria-pressed", String(el.dataset.id === c.id)));
    bg = await loadBackground(c);
    if (current !== c) return; // picked something else while loading
    stage.width = bg.width;
    stage.height = bg.height;
  }

  // ---------- backgrounds ----------
  function loadBackground(c) {
    if (bgCache.has(c.id)) return Promise.resolve(bgCache.get(c.id));
    return new Promise((resolve) => {
      const done = (canvas) => { bgCache.set(c.id, canvas); resolve(canvas); };
      if (!c.image) return done(cartoon(c, 900));
      const img = new Image();
      img.crossOrigin = "anonymous"; // needed so the final photo can be saved
      img.onload = () => {
        const s = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
        const cv = document.createElement("canvas");
        cv.width = Math.round(img.naturalWidth * s);
        cv.height = Math.round(img.naturalHeight * s);
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        done(cv);
      };
      img.onerror = () => done(cartoon(c, 900));
      img.src = c.image;
    });
  }

  // Cartoon stand-in for anyone without a photo yet. Crimson jersey, cream
  // trim, retro sunburst. Its face spot matches face {x:.5,y:.27,rx:.17,ry:.16}.
  function cartoon(c, width) {
    const W = width, H = Math.round(width * 4 / 3);
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const g = cv.getContext("2d");
    const u = W / 900;

    // sunburst
    g.fillStyle = C.cream;
    g.fillRect(0, 0, W, H);
    g.save();
    g.translate(W / 2, H * 0.3);
    g.fillStyle = "#e7c9c9";
    for (let i = 0; i < 24; i += 2) {
      g.beginPath();
      g.moveTo(0, 0);
      g.arc(0, 0, H * 1.2, (i / 24) * Math.PI * 2, ((i + 1) / 24) * Math.PI * 2);
      g.closePath();
      g.fill();
    }
    g.restore();

    // basketball in the corner
    g.save();
    g.translate(W * 0.84, H * 0.86);
    g.fillStyle = "#e8761b";
    g.strokeStyle = C.ink;
    g.lineWidth = 8 * u;
    g.beginPath(); g.arc(0, 0, 120 * u, 0, Math.PI * 2); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(-120 * u, 0); g.lineTo(120 * u, 0); g.stroke();
    g.beginPath(); g.moveTo(0, -120 * u); g.lineTo(0, 120 * u); g.stroke();
    g.beginPath(); g.arc(-150 * u, 0, 110 * u, -0.8, 0.8); g.stroke();
    g.beginPath(); g.arc(150 * u, 0, 110 * u, Math.PI - 0.8, Math.PI + 0.8); g.stroke();
    g.restore();

    g.lineWidth = 8 * u;
    g.strokeStyle = C.ink;

    // neck
    g.fillStyle = "#c98f6b";
    g.fillRect(W / 2 - 70 * u, 440 * u, 140 * u, 140 * u);
    g.strokeRect(W / 2 - 70 * u, 440 * u, 140 * u, 140 * u);

    // jersey body (tank top)
    g.fillStyle = C.crimson;
    g.beginPath();
    g.moveTo(W / 2 - 330 * u, H);
    g.lineTo(W / 2 - 300 * u, 640 * u);
    g.quadraticCurveTo(W / 2 - 280 * u, 560 * u, W / 2 - 200 * u, 540 * u);
    g.quadraticCurveTo(W / 2, 700 * u, W / 2 + 200 * u, 540 * u);
    g.quadraticCurveTo(W / 2 + 280 * u, 560 * u, W / 2 + 300 * u, 640 * u);
    g.lineTo(W / 2 + 330 * u, H);
    g.closePath();
    g.fill(); g.stroke();
    // cream collar trim
    g.strokeStyle = C.cream;
    g.lineWidth = 14 * u;
    g.beginPath();
    g.moveTo(W / 2 - 190 * u, 552 * u);
    g.quadraticCurveTo(W / 2, 690 * u, W / 2 + 190 * u, 552 * u);
    g.stroke();

    // INDIANA + number
    g.fillStyle = C.cream;
    g.strokeStyle = C.ink;
    g.lineWidth = 6 * u;
    g.textAlign = "center";
    g.textBaseline = "alphabetic";
    g.font = `900 ${78 * u}px "Bungee", Impact, "Arial Black", sans-serif`;
    g.strokeText("INDIANA", W / 2, 790 * u);
    g.fillText("INDIANA", W / 2, 790 * u);
    g.font = `900 ${260 * u}px "Bungee", Impact, "Arial Black", sans-serif`;
    g.strokeText(c.jersey || "1", W / 2, 1060 * u);
    g.fillText(c.jersey || "1", W / 2, 1060 * u);

    // hair/head shape behind the face hole
    g.fillStyle = "#3a2318";
    g.strokeStyle = C.ink;
    g.beginPath();
    g.ellipse(W / 2, 300 * u, 190 * u, 230 * u, 0, 0, Math.PI * 2);
    g.fill(); g.stroke();

    return cv;
  }

  // ---------- drawing ----------
  function faceBox() {
    const f = current.face;
    return { x: f.x * stage.width, y: f.y * stage.height, rx: f.rx * stage.width, ry: f.ry * stage.height };
  }

  const faceCanvas = document.createElement("canvas");
  const fctx = faceCanvas.getContext("2d");

  function drawFace(target, tctx) {
    const { x, y, rx, ry } = faceBox();
    const w = Math.max(2, Math.round(rx * 2));
    const h = Math.max(2, Math.round(ry * 2));
    faceCanvas.width = w;
    faceCanvas.height = h;

    // crop the CENTER of the camera to the oval's shape, zoomed in
    const vw = video.videoWidth, vh = video.videoHeight;
    const aspect = w / h;
    let ch = Math.min(vh, vw / aspect) / zoom;
    let cw = ch * aspect;
    const sx = (vw - cw) / 2, sy = (vh - ch) / 2;

    fctx.save();
    fctx.translate(w, 0);
    fctx.scale(-1, 1); // mirror, like a mirror
    fctx.drawImage(video, sx, sy, cw, ch, 0, 0, w, h);
    fctx.restore();

    // feather the edge into an oval
    fctx.save();
    fctx.globalCompositeOperation = "destination-in";
    fctx.setTransform(1, 0, 0, h / w, 0, 0);
    const r = w / 2;
    const grad = fctx.createRadialGradient(r, r, 0, r, r, r);
    grad.addColorStop(0, "rgba(0,0,0,1)");
    grad.addColorStop(0.8, "rgba(0,0,0,1)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    fctx.fillStyle = grad;
    fctx.fillRect(0, 0, w, w);
    fctx.restore();

    tctx.drawImage(faceCanvas, x - rx, y - ry);
  }

  function drawPlaceholderOval() {
    const { x, y, rx, ry } = faceBox();
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,.88)";
    ctx.strokeStyle = C.crimson;
    ctx.lineWidth = Math.max(3, stage.width / 160);
    ctx.setLineDash([ctx.lineWidth * 3, ctx.lineWidth * 2]);
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = C.crimson;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const fs = Math.max(10, rx * 0.27);
    ctx.font = `900 ${fs}px "Bungee", Impact, sans-serif`;
    ctx.fillText("YOUR FACE", x, y - fs * 0.55);
    ctx.fillText("HERE!", x, y + fs * 0.55);
    ctx.restore();
  }

  function loop() {
    if (bg && current && stage.width) {
      ctx.drawImage(bg, 0, 0);
      if (stream && video.readyState >= 2 && video.videoWidth) drawFace(stage, ctx);
      else drawPlaceholderOval();
    }
    requestAnimationFrame(loop);
  }

  // ---------- camera ----------
  async function startCamera() {
    errorEl.hidden = true;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showError(location.protocol === "file:"
        ? "The camera only works when the site is opened from its https:// web address, not from a file on your computer."
        : "This browser can't use the camera. Try Safari or Chrome.");
      return;
    }
    cameraBtn.disabled = true;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      video.srcObject = stream;
      await video.play();
      cameraBtn.hidden = true;
      snapBtn.hidden = false;
      zoomWrap.hidden = false;
    } catch (err) {
      stream = null;
      showError(err && err.name === "NotAllowedError"
        ? "Camera permission was blocked. Tap the camera icon in the address bar to allow it, then try again. (School/work laptops sometimes block cameras for websites.)"
        : "Couldn't start the camera: " + (err && err.message ? err.message : err));
    } finally {
      cameraBtn.disabled = false;
    }
  }

  function stopCamera() {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    stream = null;
    video.srcObject = null;
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }

  // ---------- snap ----------
  let audio = null;
  function beep(freq, ms) {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const o = audio.createOscillator();
      const gn = audio.createGain();
      o.type = "square";
      o.frequency.value = freq;
      gn.gain.value = 0.06;
      o.connect(gn).connect(audio.destination);
      o.start();
      o.stop(audio.currentTime + ms / 1000);
    } catch (_) { /* sound is optional */ }
  }

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  async function snap() {
    if (busy || !stream || !bg) return;
    busy = true;
    snapBtn.disabled = true;
    countdownEl.hidden = false;
    for (let n = S.countdownSeconds || 3; n > 0; n--) {
      countdownEl.classList.remove("pop");
      countdownEl.innerHTML = `<span>${n}</span>`;
      void countdownEl.offsetWidth;
      countdownEl.classList.add("pop");
      beep(660, 120);
      await wait(1000);
    }
    countdownEl.hidden = true;
    beep(1320, 220);
    flashEl.classList.remove("go");
    void flashEl.offsetWidth;
    flashEl.classList.add("go");

    const photo = compose();
    stopCamera(); // camera off the instant the photo is taken

    photo.toBlob((blob) => {
      busy = false;
      snapBtn.disabled = false;
      if (!blob) { showError("Couldn't make the picture. Try another legend."); return; }
      showResult(blob);
    }, "image/jpeg", 0.92);
  }

  function compose() {
    const W = stage.width, H = stage.height;
    const band = Math.round(Math.max(70, W * 0.13));
    const out = document.createElement("canvas");
    out.width = W;
    out.height = H + band;
    const o = out.getContext("2d");
    o.drawImage(bg, 0, 0);
    drawFace(out, o);

    // banner: crimson with cream checker edge
    o.fillStyle = C.crimson;
    o.fillRect(0, H, W, band);
    const sq = Math.max(6, Math.round(band / 9));
    for (let i = 0; i * sq < W; i++) {
      o.fillStyle = i % 2 ? C.cream : C.ink;
      o.fillRect(i * sq, H, sq, sq);
    }
    o.textAlign = "center";
    o.textBaseline = "middle";
    o.fillStyle = C.cream;
    o.strokeStyle = C.ink;
    let big = Math.round(band * 0.36);
    o.font = `900 ${big}px "Bungee", Impact, "Arial Black", sans-serif`;
    const nameLine = `ME AS ${current.name.toUpperCase()}`;
    while (o.measureText(nameLine).width > W * 0.92 && big > 10) {
      big -= 1;
      o.font = `900 ${big}px "Bungee", Impact, "Arial Black", sans-serif`;
    }
    o.lineWidth = Math.max(2, big / 8);
    const y1 = H + sq + (band - sq) * 0.38;
    o.strokeText(nameLine, W / 2, y1);
    o.fillText(nameLine, W / 2, y1);
    let small = Math.round(band * 0.2);
    o.font = `${small}px "VT323", "Courier New", monospace`;
    while (o.measureText(S.bannerText).width > W * 0.94 && small > 8) {
      small -= 1;
      o.font = `${small}px "VT323", "Courier New", monospace`;
    }
    o.fillText(S.bannerText, W / 2, H + sq + (band - sq) * 0.78);
    return out;
  }

  function showResult(blob) {
    photoBlob = blob;
    photoUrl = URL.createObjectURL(blob);
    resultImg.src = photoUrl;
    saveBtn.href = photoUrl;
    saveBtn.download = `${S.downloadName || "photobooth"}-${current.id}.jpg`;

    const file = new File([blob], saveBtn.download, { type: "image/jpeg" });
    const canShare = !!(navigator.canShare && navigator.canShare({ files: [file] }));
    shareBtn.hidden = !canShare;
    shareTip.textContent = canShare
      ? "Tap Share to send it to your group chat, Instagram or AirDrop."
      : "Tap Save to download it, then post it wherever you want.";

    liveControls.hidden = true;
    $("booth-panel").querySelector(".tv").hidden = true;
    resultEl.hidden = false;
    resultEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function share() {
    if (!photoBlob) return;
    const file = new File([photoBlob], saveBtn.download, { type: "image/jpeg" });
    try {
      await navigator.share({ files: [file], title: titleCase(S.title), text: S.shareText });
    } catch (err) {
      if (err && err.name !== "AbortError") shareTip.textContent = "Sharing didn't work here, so tap Save instead.";
    }
  }

  function retake() {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    photoUrl = null;
    photoBlob = null;
    resultImg.removeAttribute("src");
    resultEl.hidden = true;
    liveControls.hidden = false;
    $("booth-panel").querySelector(".tv").hidden = false;
    startCamera();
  }

  // ---------- wire up ----------
  cameraBtn.addEventListener("click", startCamera);
  snapBtn.addEventListener("click", snap);
  shareBtn.addEventListener("click", share);
  retakeBtn.addEventListener("click", retake);
  zoomInput.addEventListener("input", () => { zoom = parseFloat(zoomInput.value) || 1; });
  window.addEventListener("pagehide", stopCamera);

  buildPicker();
  // start on Cignetti, or the first cutout
  const start = S.cutouts.find((c) => c.id === "cignetti") || S.cutouts[0];
  // wait for fonts so the cartoon jerseys and banner use the retro font
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve())
    .then(() => { bgCache.clear(); return choose(current || start); })
    .catch(() => choose(start));
  choose(start);
  requestAnimationFrame(loop);
})();
