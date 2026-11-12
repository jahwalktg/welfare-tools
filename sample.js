/* 가상 예시 단추 (2026-11-12) — 모든 도구 화면의 제목 아래 「🧪 가상 예시로 해 보기」.
   지어낸 자료를 칸마다 넣어, 결과가 어떻게 나오는지 먼저 보게 한다. 넣는 자료는 모두 가상(실제 사람·기관 아님).

   쓰는 법 (화면마다 둘 중 하나)
   1) 화면 스크립트에서  window.JT_SAMPLE = { fill: function () { ...칸 채우기... }, what: '가상 이용자 8명 명단' };
      - ask: false  → 이 단추가 「지금 내용 지울까요?」를 묻지 않음(fill 안에서 따로 물을 때)
      - go: '#result' → 넣은 뒤 그 자리로 화면을 옮김
   2) 이미 예시 단추가 있으면  <script src="../sample.js" data-click="#btnExample" data-what="가상 명단 7명"></script>
      (data-go 도 쓸 수 있음. 이때는 원래 단추가 알아서 묻는다고 보고 따로 묻지 않음)
   videos.js 다음 줄에 넣는다. 인쇄 때는 숨긴다. */
(function () {
  if (window.__jtSample) return; window.__jtSample = 1;
  var me = document.currentScript;
  var css = '.jt-sample{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:4px 0 12px}' +
    '.jt-sample button{display:inline-flex;align-items:center;gap:6px;min-height:40px;padding:0 16px;border-radius:999px;border:2px solid #7A5AF8;background:#F4F0FF;color:#3E2A99;font:inherit;font-size:15px;font-weight:800;cursor:pointer}' +
    '.jt-sample button:hover{background:#E9E1FF}.jt-sample button:focus-visible{outline:3px solid #7A5AF8;outline-offset:2px}' +
    '.jt-sample small{font-size:13px;color:var(--muted,#5A6478);line-height:1.4}' +
    '.jt-sample-toast{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:99999;max-width:min(560px,calc(100vw - 32px));padding:12px 18px;border-radius:14px;background:#2B1F66;color:#fff;font-size:15px;line-height:1.5;box-shadow:0 8px 28px rgba(0,0,0,.25)}' +
    '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .jt-sample button{background:rgba(122,90,248,.18);border-color:#9C84FF;color:#E2D8FF}}' +
    ':root[data-theme="dark"] .jt-sample button{background:rgba(122,90,248,.18);border-color:#9C84FF;color:#E2D8FF}' +
    '@media print{.jt-sample,.jt-sample-toast{display:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function cfg() {
    var c = window.JT_SAMPLE || null;
    var click = me && me.getAttribute('data-click');
    if (!c && click) c = { click: click, ask: false };
    if (!c) return null;
    if (me) {
      if (!c.what && me.getAttribute('data-what')) c.what = me.getAttribute('data-what');
      if (!c.go && me.getAttribute('data-go')) c.go = me.getAttribute('data-go');
    }
    return c;
  }
  var FIELDS = 'textarea, input:not([type]), input[type=text], input[type=number], input[type=date], input[type=time], input[type=tel], input[type=email], input[type=url]';
  var first = null;   // 화면이 처음 열렸을 때 칸마다 든 값(화면이 스스로 넣은 오늘 날짜·불러온 저장값 포함)
  function snap() { first = new Map(); document.querySelectorAll(FIELDS).forEach(function (e) { first.set(e, e.value); }); }
  function hasInput() {   // 처음 열렸을 때와 달라진 칸이 있나 = 사용자가 무언가 적었나
    var els = document.querySelectorAll(FIELDS);
    for (var i = 0; i < els.length; i++) {
      var e = els[i]; if (e.closest('.jt-sample') || e.readOnly || e.disabled) continue;
      if (!e.offsetParent) continue;
      var was = first && first.has(e) ? first.get(e) : e.defaultValue;
      if (e.value && e.value !== was) return true;
    }
    return false;
  }
  function toast(msg) {
    var t = document.createElement('div'); t.className = 'jt-sample-toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 5200);
  }
  function run(c) {
    if (c.ask !== false && hasInput() && !window.confirm('지금 적은 내용 대신 가상 예시를 넣을까요?\n(지금 적은 내용은 바뀌거나 지워질 수 있어요)')) return;
    try {
      if (c.click) { var b = document.querySelector(c.click); if (!b) return; b.click(); }
      else if (typeof c.fill === 'function') { if (c.fill() === false) return; }
    } catch (e) { console.error(e); toast('예시를 넣지 못했어요. 화면을 새로 고친 뒤 다시 눌러 주세요.'); return; }
    snap();   // 예시가 든 상태를 새 기준으로 — 다시 눌러도 묻지 않음
    toast('가상 예시를 넣었어요. 지어낸 자료이니 결과를 살펴본 뒤, 지우고 내 것으로 써 보세요.');
    if (c.go) setTimeout(function () { var g = document.querySelector(c.go); if (g) g.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 120);
  }
  function mount() {
    var c = cfg(); if (!c) return;
    if (document.querySelector('.jt-sample')) return;
    var h = document.querySelector('h1'); if (!h) return;
    var at = h; var nx = h.nextElementSibling;
    while (nx && nx.classList && nx.classList.contains('jt-vid')) { at = nx; nx = nx.nextElementSibling; }
    var p = document.createElement('p'); p.className = 'jt-sample';
    var b = document.createElement('button'); b.type = 'button'; b.textContent = '🧪 가상 예시로 해 보기';
    b.title = '지어낸 자료를 칸에 넣어 결과를 먼저 봅니다';
    b.addEventListener('click', function () { run(cfg() || c); });
    var s = document.createElement('small'); s.textContent = (c.what ? c.what + ' · ' : '') + '지어낸 자료예요';
    p.appendChild(b); p.appendChild(s);
    at.insertAdjacentElement('afterend', p);
    snap();
  }
  // videos.js(영상 단추)가 먼저 붙은 뒤에 붙도록 한 박자 늦게
  function later() { setTimeout(mount, 0); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', later); else later();
  window.JT_SAMPLE_MOUNT = mount;
})();
