/* 사회복지사 업무 도구 — 파일 끌어다 놓기 공통 (2026-10-13)
   각 화면의 숨은 <input type="file">을 그대로 두고, 그 입력이 있는 영역(버튼 근처)과 화면 전체에 끌어다 놓기를 더한다.
   놓인 파일은 input.files에 넣고 change를 일으키므로, 화면마다 있던 「change → 읽기」 코드가 그대로 동작한다.
   화면 어디에 놓아도 파일 종류(accept)에 맞는 입력이 하나뿐이면 그 입력으로 간다. */
(function () {
  'use strict';
  var inputs = Array.prototype.slice.call(document.querySelectorAll('input[type="file"]'));
  if (!inputs.length) return;

  var style = document.createElement('style');
  style.textContent = [
    '.dz-hint{display:block;margin:6px 0 0;font-size:14px;color:#5B6885}',
    '.dz-on{outline:3px dashed #1A6EFF;outline-offset:4px;border-radius:12px;background:#E8F0FF}',
    'body.dz-page::after{content:attr(data-dz);position:fixed;inset:12px;border:4px dashed #1A6EFF;border-radius:20px;background:rgba(26,110,255,.10);display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;font-size:26px;font-weight:700;color:#1A6EFF;pointer-events:none;z-index:9999}',
    '.dz-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#1A2B50;color:#fff;padding:10px 16px;border-radius:12px;font-weight:600;z-index:10000;max-width:calc(100% - 32px);font-size:15px}'
  ].join('');
  document.head.appendChild(style);

  var toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'dz-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.style.display = 'block';
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.style.display = 'none'; }, 3000);
  }
  function acceptList(input) { return (input.getAttribute('accept') || '').split(',').map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean); }
  function accepts(input, file) {
    var acc = acceptList(input); if (!acc.length) return true;
    var name = (file.name || '').toLowerCase(), type = (file.type || '').toLowerCase();
    return acc.some(function (a) { return a.charAt(0) === '.' ? name.slice(-a.length) === a : a.slice(-2) === '/*' ? type.indexOf(a.slice(0, -1)) === 0 : type === a; });
  }
  function kinds(input) {
    var acc = acceptList(input).filter(function (a) { return a.charAt(0) === '.'; }).map(function (a) { return a.slice(1).toUpperCase(); });
    if (acceptList(input).some(function (a) { return a.indexOf('image/') === 0; })) acc.push('그림');
    return acc.length ? acc.join('·') : '파일';
  }
  function give(input, files) {
    try { var dt = new DataTransfer(); for (var i = 0; i < files.length; i++) dt.items.add(files[i]); input.files = dt.files; }
    catch (e) { toast('이 브라우저에서는 끌어다 놓기가 안 됩니다. 버튼으로 골라 주세요.'); return; }
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function hasFiles(e) { var t = e.dataTransfer && e.dataTransfer.types; return !!t && Array.prototype.indexOf.call(t, 'Files') >= 0; }

  /* 입력마다: 부모 영역이 놓는 곳. 안내 글 한 줄을 입력 바로 뒤에 */
  inputs.forEach(function (input) {
    var zone = input.parentElement; if (!zone) return;
    var hint = document.createElement('span'); hint.className = 'dz-hint';
    hint.textContent = '파일을 이 근처에 끌어다 놓아도 됩니다 (' + kinds(input) + ').';
    input.insertAdjacentElement('afterend', hint);
    var depth = 0;
    zone.addEventListener('dragenter', function (e) { if (!hasFiles(e)) return; depth++; zone.classList.add('dz-on'); });
    zone.addEventListener('dragover', function (e) { if (!hasFiles(e)) return; e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
    zone.addEventListener('dragleave', function () { if (--depth <= 0) { depth = 0; zone.classList.remove('dz-on'); } });
    zone.addEventListener('drop', function (e) {
      if (!hasFiles(e)) return;
      e.preventDefault(); e.stopPropagation(); depth = 0; zone.classList.remove('dz-on'); pageOff();
      var f = e.dataTransfer.files; if (!f.length) return;
      if (!accepts(input, f[0])) { toast('이 칸에는 ' + kinds(input) + ' 파일만 넣을 수 있습니다: ' + f[0].name); return; }
      give(input, f);
    });
  });

  /* 화면 전체: 종류에 맞는 입력이 하나뿐이면 그 입력으로. 아니면 안내만 */
  var pageDepth = 0;
  function pageOff() { pageDepth = 0; document.body.classList.remove('dz-page'); }
  function candidatesByType(items) {
    var type = items && items[0] ? (items[0].type || '').toLowerCase() : '';
    return inputs.filter(function (i) {
      var acc = acceptList(i); if (!acc.length) return true;
      if (!type) return true; // 끌고 올 때는 종류를 모를 수 있음 → 일단 후보
      return acc.some(function (a) { return a.charAt(0) === '.' ? true : a.slice(-2) === '/*' ? type.indexOf(a.slice(0, -1)) === 0 : type === a; });
    });
  }
  document.addEventListener('dragenter', function (e) {
    if (!hasFiles(e)) return; pageDepth++;
    var c = candidatesByType(e.dataTransfer.items);
    if (!c.length) return;
    document.body.setAttribute('data-dz', c.length === 1 ? '파일을 놓으면 바로 열립니다' : '받을 수 있는 칸이 여러 개입니다 — 해당 버튼 근처에 놓아 주세요');
    document.body.classList.add('dz-page');
  });
  document.addEventListener('dragover', function (e) { if (hasFiles(e)) e.preventDefault(); });
  document.addEventListener('dragleave', function () { if (--pageDepth <= 0) pageOff(); });
  document.addEventListener('drop', function (e) {
    if (!hasFiles(e)) return;
    e.preventDefault(); pageOff();
    var f = e.dataTransfer.files; if (!f.length) return;
    var c = inputs.filter(function (i) { return accepts(i, f[0]); });
    if (c.length === 1) give(c[0], f);
    else if (!c.length) toast('이 화면에서 받을 수 있는 파일이 아닙니다: ' + f[0].name);
    else toast('받을 수 있는 칸이 여러 개입니다. 해당 버튼 근처에 놓아 주세요.');
  });
})();
