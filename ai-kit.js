/* AI 주문서 공통 — 「우리 기관 스타일 카드」 저장·붙이기, 파일에서 글 꺼내기(hwpx·docx·pdf·txt), 개인정보 가리기
   아무것도 인터넷으로 보내지 않는다. 카드는 이 브라우저(localStorage)에만 둔다.
   - 스타일 카드 화면(style-card/)과 문서 바꾸기 화면(doc-remake/)이 AIK.xxx 로 쓴다.
   - 기존 주문서 화면(prompt-*)은 맨 끝에 이 파일을 넣고 AIK.attach() 한 줄이면, 주문서 끝에 스타일 카드가 붙는다.
   전역은 AIK 하나. */
var AIK = (function () {
  'use strict';
  var KEY = 'welfare-tools.style.v1';
  var PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';

  /* ───── 스타일 카드 저장 ───── */
  function blank() { return { use: true, org: { type: '', call: '', tone: '', avoid: '', extra: '' }, cards: [] }; }
  function read() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!o || typeof o !== 'object') return blank();
      var b = blank(); b.use = o.use !== false;
      ['type', 'call', 'tone', 'avoid', 'extra'].forEach(function (k) { b.org[k] = String((o.org || {})[k] || '').slice(0, 400); });
      (Array.isArray(o.cards) ? o.cards : []).slice(0, 30).forEach(function (c) {
        if (c && c.text) b.cards.push({ id: String(c.id || ('c' + Math.random().toString(36).slice(2, 8))), name: String(c.name || '이름 없는 카드').slice(0, 40), text: String(c.text).slice(0, 12000) });
      });
      return b;
    } catch (e) { return blank(); }
  }
  function write(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); return true; } catch (e) { return false; } }
  function clear() { try { localStorage.removeItem(KEY); } catch (e) { } }
  function hasOrg(o) { o = o || read(); return ['type', 'call', 'tone', 'avoid', 'extra'].some(function (k) { return o.org[k].trim(); }); }

  /* 주문서 끝에 붙는 글. cardId 를 주면 그 문서 카드도 함께 */
  function block(cardId, o) {
    o = o || read(); var out = [];
    if (hasOrg(o)) {
      out.push('[우리 기관 스타일]');
      if (o.org.type.trim()) out.push('- 기관 종류: ' + o.org.type.trim());
      if (o.org.call.trim()) out.push('- 이용자를 부르는 말: ' + o.org.call.trim());
      if (o.org.tone.trim()) out.push('- 말투: ' + o.org.tone.trim());
      if (o.org.avoid.trim()) out.push('- 쓰지 않는 말: ' + o.org.avoid.trim());
      if (o.org.extra.trim()) out.push('- 그 밖에 지킬 것: ' + o.org.extra.trim());
    }
    var c = cardId ? o.cards.filter(function (x) { return x.id === cardId; })[0] : null;
    if (c) { if (out.length) out.push(''); out.push('[문서 스타일 카드: ' + c.name + ']'); out.push(c.text.trim()); }
    if (!out.length) return '';
    out.push(''); out.push('위 스타일(틀·말투·낱말)을 따라 써 주세요. 스타일을 맞추느라 사실(날짜·숫자·이름)을 바꾸거나 지어내면 안 됩니다.');
    return out.join('\n');
  }

  /* ───── 기존 주문서 화면에 붙이기 ─────
     화면의 주문서 칸(#prompt)과 「주문서 복사」(JT.copyText)에 스타일 글을 덧붙인다. */
  function attach(opt) {
    opt = opt || {};
    var ta = document.getElementById(opt.id || 'prompt'); if (!ta) return;
    var MARK = '\n\n――― 우리 기관 스타일 (스타일 카드에서 자동으로 붙음) ―――\n';
    var bar = document.createElement('p');
    bar.style.cssText = 'margin:8px 0;padding:8px 12px;border-radius:10px;border:1.5px solid var(--line,#D5DDEC);background:var(--blue-bg,#E8F0FF);font-size:14px;line-height:1.5';
    ta.parentNode.insertBefore(bar, ta);
    function tail() { var o = read(); if (!o.use) return ''; var b = block(null, o); return b ? MARK + b : ''; }
    function strip(v) { var i = v.indexOf(MARK); return i >= 0 ? v.slice(0, i) : v; }
    function sync() {
      var base = strip(ta.value), t = tail();
      if (ta.value !== base + t) ta.value = base + t;
      var o = read(), href = (opt.base || '../') + 'style-card/index.html';
      bar.textContent = '';
      var b = document.createElement('b'); bar.appendChild(b);
      if (!hasOrg(o)) { b.textContent = '우리 기관 스타일 카드가 아직 없어요. '; bar.appendChild(document.createTextNode('한 번 만들어 두면 모든 주문서 끝에 우리 기관 말투가 자동으로 붙습니다. ')); }
      else if (o.use) { b.textContent = '우리 기관 스타일이 주문서 끝에 붙어 있어요. '; }
      else { b.textContent = '우리 기관 스타일을 붙이지 않는 중입니다. '; }
      var a = document.createElement('a'); a.href = href; a.textContent = hasOrg(o) ? '카드 고치기' : '스타일 카드 만들기'; bar.appendChild(a);
      if (hasOrg(o)) {
        bar.appendChild(document.createTextNode(' · '));
        var bt = document.createElement('button'); bt.type = 'button'; bt.textContent = o.use ? '이번에는 빼기' : '다시 붙이기';
        bt.style.cssText = 'border:0;background:none;padding:0;color:var(--blue,#1A6EFF);text-decoration:underline;font:inherit;cursor:pointer';
        bt.addEventListener('click', function () { var x = read(); x.use = !x.use; write(x); sync(); });
        bar.appendChild(bt);
      }
    }
    if (window.JT && typeof JT.copyText === 'function' && !JT._aik) {
      var orig = JT.copyText; JT._aik = true;
      JT.copyText = function (text) { var a = [].slice.call(arguments); a[0] = strip(String(text)) + tail(); return orig.apply(JT, a); };
    }
    ['input', 'click', 'change'].forEach(function (ev) { document.addEventListener(ev, function () { setTimeout(sync, 0); }); });
    window.addEventListener('storage', sync); window.addEventListener('focus', sync);
    sync();
  }

  /* ───── 파일에서 글 꺼내기 ───── */
  function u16(b, o) { return b[o] | (b[o + 1] << 8); }
  function u32(b, o) { return (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0; }
  function inflateRaw(bytes) {
    if (typeof DecompressionStream === 'undefined') return Promise.reject(new Error('이 브라우저는 압축을 풀지 못합니다. 크롬·엣지 최신판에서 열어 주세요.'));
    var ds = new DecompressionStream('deflate-raw');
    return new Response(new Blob([bytes]).stream().pipeThrough(ds)).arrayBuffer().then(function (ab) { return new Uint8Array(ab); });
  }
  /* zip 안의 파일 목록 {이름: 읽는 함수} */
  function unzip(buf) {
    var b = new Uint8Array(buf), i = b.length - 22, files = {};
    while (i >= 0 && u32(b, i) !== 0x06054b50) i--;
    if (i < 0) throw new Error('zip 꼴이 아닙니다');
    var n = u16(b, i + 10), p = u32(b, i + 16), dec = new TextDecoder('utf-8');
    for (var k = 0; k < n && u32(b, p) === 0x02014b50; k++) {
      var method = u16(b, p + 10), csize = u32(b, p + 20), nl = u16(b, p + 28), el = u16(b, p + 30), cl = u16(b, p + 32), lo = u32(b, p + 42);
      var name = dec.decode(b.subarray(p + 46, p + 46 + nl));
      (function (method, csize, lo) {
        files[name] = function () {
          var s = lo + 30 + u16(b, lo + 26) + u16(b, lo + 28), data = b.subarray(s, s + csize);
          return method === 0 ? Promise.resolve(data) : inflateRaw(data);
        };
      })(method, csize, lo);
      p += 46 + nl + el + cl;
    }
    return files;
  }
  /* hwpx(section*.xml)·docx(document.xml) 공통: p·t·tbl·tr·tc 를 줄글과 「칸 | 칸」으로 */
  function xmlText(xml) {
    var doc = new DOMParser().parseFromString(xml, 'application/xml'), out = [];
    function kids(n, name) { var r = []; for (var c = n.firstChild; c; c = c.nextSibling) if (c.nodeType === 1 && c.localName === name) r.push(c); return r; }
    function eachP(n) { for (var c = n.firstChild; c; c = c.nextSibling) { if (c.nodeType !== 1) continue; if (c.localName === 'p') pText(c); else if (c.localName === 'tbl') tbl(c); else eachP(c); } }
    function cell(tc) { var save = out; out = []; eachP(tc); var t = out.join(' / '); out = save; return t; }
    function tbl(t) { (function rows(n) { for (var c = n.firstChild; c; c = c.nextSibling) { if (c.nodeType !== 1) continue; if (c.localName === 'tr') out.push(kids(c, 'tc').map(cell).join(' | ')); else if (c.localName !== 'tbl') rows(c); } })(t); }
    function pText(p) {
      var s = '';
      (function rec(n) {
        for (var c = n.firstChild; c; c = c.nextSibling) {
          if (c.nodeType !== 1) continue; var ln = c.localName;
          if (ln === 't') s += c.textContent;
          else if (ln === 'tbl') { if (s.trim()) out.push(s); s = ''; tbl(c); }
          else if (ln === 'lineBreak' || ln === 'br') s += '\n';
          else if (ln === 'tab') s += '\t';
          else if (ln === 'p') { if (s.trim()) out.push(s); s = ''; pText(c); }
          else rec(c);
        }
      })(p);
      if (s.trim()) out.push(s);
    }
    eachP(doc.documentElement);
    return out.join('\n');
  }
  function fromZip(buf, pick) {
    var files = unzip(buf), names = Object.keys(files).filter(pick).sort(function (a, b) { return a.localeCompare(b, undefined, { numeric: true }); });
    if (!names.length) return Promise.reject(new Error('문서 본문을 찾지 못했습니다'));
    var dec = new TextDecoder('utf-8');
    return Promise.all(names.map(function (n) { return files[n]().then(function (u) { return xmlText(dec.decode(u)); }); })).then(function (a) { return a.join('\n'); });
  }
  var pdfLib = null;
  function loadPdf() {
    if (pdfLib) return pdfLib;
    pdfLib = new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = PDFJS + 'pdf.min.js';
      s.onload = function () {
        fetch(PDFJS + 'pdf.worker.min.js').then(function (r) { return r.text(); }).then(function (t) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(new Blob([t], { type: 'text/javascript' })); res(window.pdfjsLib);
        }, rej);
      };
      s.onerror = function () { rej(new Error('PDF 읽기 도구를 불러오지 못했습니다(인터넷 연결 확인)')); };
      document.head.appendChild(s);
    });
    pdfLib.catch(function () { pdfLib = null; });
    return pdfLib;
  }
  function fromPdf(buf) {
    return loadPdf().then(function (lib) { return lib.getDocument({ data: buf }).promise; }).then(function (doc) {
      var ps = [];
      for (var i = 1; i <= doc.numPages; i++) ps.push(doc.getPage(i).then(function (pg) { return pg.getTextContent(); }).then(function (tc) {
        var s = '', last = null;
        tc.items.forEach(function (it) {
          if (last && Math.abs(last.transform[5] - it.transform[5]) > 2) s += '\n';
          else if (last && it.transform[4] - (last.transform[4] + last.width) > 8) s += ' ';
          s += it.str; last = it;
        });
        return s;
      }));
      return Promise.all(ps).then(function (a) { return a.join('\n\n'); });
    });
  }
  function fromTxt(buf) {
    try { return new TextDecoder('utf-8', { fatal: true }).decode(buf); }
    catch (e) { try { return new TextDecoder('euc-kr').decode(buf); } catch (e2) { return new TextDecoder('utf-8').decode(buf); } }
  }
  /* 파일 → {text, kind, note}. 못 읽으면 reject(Error(쉬운 말 안내)) */
  function readFile(file) {
    var name = (file.name || '').toLowerCase(), ext = name.slice(name.lastIndexOf('.') + 1);
    return new Promise(function (res, rej) {
      var fr = new FileReader();
      fr.onerror = function () { rej(new Error('파일을 읽지 못했습니다')); };
      fr.onload = function () {
        var buf = fr.result, p;
        try {
          if (ext === 'hwpx') p = fromZip(buf, function (n) { return /^Contents\/section\d+\.xml$/i.test(n); }).then(function (t) { return { text: t, kind: '한글(hwpx)' }; });
          else if (ext === 'docx') p = fromZip(buf, function (n) { return n === 'word/document.xml'; }).then(function (t) { return { text: t, kind: '워드(docx)' }; });
          else if (ext === 'pdf') p = fromPdf(buf).then(function (t) { return { text: t, kind: 'PDF', note: t.trim().length < 30 ? '글자가 거의 없습니다. 스캔한 그림 PDF면 글을 꺼낼 수 없어요. 이 경우 AI에 파일을 직접 올리세요.' : '' }; });
          else if (ext === 'txt' || ext === 'md' || ext === 'csv') p = Promise.resolve({ text: fromTxt(buf), kind: '글(txt)' });
          else if (ext === 'hwp') p = Promise.reject(new Error('옛 한글 파일(.hwp)은 여기서 글을 꺼낼 수 없습니다. 한글에서 「파일 → 다른 이름으로 저장하기 → 파일 형식: 한글 표준 문서(*.hwpx)」로 저장해 다시 넣어 주세요.'));
          else p = Promise.reject(new Error('이 화면이 읽는 파일은 hwpx · docx · pdf · txt 입니다. 다른 파일은 내용을 복사해 붙여 넣어 주세요.'));
        } catch (e) { p = Promise.reject(e); }
        p.then(function (r) { r.text = String(r.text || '').replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim(); r.name = file.name; res(r); },
          function (e) { rej(e instanceof Error ? e : new Error(String(e))); });
      };
      fr.readAsArrayBuffer(file);
    });
  }

  /* ───── 개인정보 가리기 ─────
     find(text, names) → [{kind, raw, label}] (나온 순서, 같은 글자는 한 번)
     apply(text, items, keep) → {text, map}   keep = 그대로 둘 raw 의 Set
     restore(text, map) → 되돌린 글 */
  var PATS = [
    ['주민번호', /\d{6}\s?-\s?[1-8]\d{6}/g],
    ['전화', /0\d{1,2}[-.)\s]\s?\d{3,4}[-.\s]\d{4}|01[016789]\d{7,8}/g],
    ['이메일', /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g],
    ['계좌', /\d{2,6}-\d{2,6}-\d{2,8}(?:-\d{1,6})?/g]
  ];
  var ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  function find(text, names) {
    var seen = {}, items = [], cnt = {};
    function add(kind, raw, at) { if (seen[raw]) return; seen[raw] = 1; items.push({ kind: kind, raw: raw, at: at }); }
    (names || []).forEach(function (nm) { nm = String(nm).trim(); if (nm.length < 2) return; var i = text.indexOf(nm); if (i >= 0) add('이름', nm, i); });
    var masked = text;
    PATS.forEach(function (p) {
      var m; p[1].lastIndex = 0;
      while ((m = p[1].exec(masked))) {
        if (p[0] === '계좌' && /^(19|20)\d{2}-\d{1,2}-\d{1,2}$/.test(m[0])) continue;   // 2026-03-05 같은 날짜는 계좌가 아님
        add(p[0], m[0], m.index);
      }
      masked = masked.replace(p[1], function (x) { return new Array(x.length + 1).join('\u0000'); });   // 앞 규칙이 잡은 자리는 뒤 규칙이 다시 잡지 않게
    });
    items.sort(function (a, b) { return a.at - b.at; });
    items.forEach(function (it) {
      cnt[it.kind] = (cnt[it.kind] || 0) + 1;
      it.label = it.kind === '이름' ? '이용자' + (cnt[it.kind] <= 26 ? ABC[cnt[it.kind] - 1] : cnt[it.kind]) : '[' + it.kind + cnt[it.kind] + ']';
    });
    return items;
  }
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function apply(text, items, keep) {
    var map = [], out = text;
    items.slice().sort(function (a, b) { return b.raw.length - a.raw.length; }).forEach(function (it) {
      if (keep && keep.has(it.raw)) return;
      out = out.replace(new RegExp(esc(it.raw), 'g'), it.label); map.push([it.label, it.raw]);
    });
    return { text: out, map: map };
  }
  function restore(text, map) {
    var out = text;
    (map || []).slice().sort(function (a, b) { return b[0].length - a[0].length; }).forEach(function (m) { out = out.replace(new RegExp(esc(m[0]), 'g'), m[1]); });
    return out;
  }

  /* ───── 숫자 대조 (입력 글 ↔ AI 답) ─────
     날짜·시간·금액·그 밖의 숫자를 뽑아, 답에만 있는 것과 입력에만 있는 것을 돌려준다 */
  function nums(text) {
    var out = {}, m, re = /\d[\d,]*(?:[.:\/-]\d+)*(?:\.\d+)?/g;
    while ((m = re.exec(text))) {
      var raw = m[0].replace(/[.:\/-]+$/, ''), key = raw.replace(/,/g, '');
      if (key.replace(/\D/g, '').length < 2 && !/[.:\/-]/.test(key)) continue;   // 한 자리 숫자(항목 번호 등)는 뺌
      if (!out[key]) out[key] = raw;
    }
    return out;
  }
  function compare(input, answer) {
    var a = nums(input), b = nums(answer), added = [], missing = [];
    Object.keys(b).forEach(function (k) { if (!a[k]) added.push(b[k]); });
    Object.keys(a).forEach(function (k) { if (!b[k]) missing.push(a[k]); });
    var todo = (answer.match(/\[확인 필요[^\]]*\]/g) || []);
    return { added: added, missing: missing, todo: todo };
  }

  function copy(text, el, msg) {
    function ok() { if (el) el.textContent = msg || '복사했습니다.'; }
    function fb() {
      try { var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); ok(); }
      catch (e) { if (el) el.textContent = '자동 복사가 막혀 있습니다. 글을 직접 긁어 복사하세요.'; }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fb); else fb();
  }

  return { KEY: KEY, read: read, write: write, clear: clear, hasOrg: hasOrg, block: block, attach: attach,
    readFile: readFile, xmlText: xmlText, find: find, apply: apply, restore: restore, nums: nums, compare: compare, copy: copy };
})();
