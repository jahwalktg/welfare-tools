/* 사용법 영상 연결 — 유튜브 「자활 실무 연구소」 재생목록 「자활업무도구사용법」 (지역자활센터 업무 도구와 화면이 같아 같은 영상을 씁니다)
   사회복지판으로 따로 찍은 영상은 재생목록 「사회복지 업무 도구 사용법」(WLIST) — V의 w1~w6.
   새 영상을 올리면 아래 V(편 번호 → 유튜브 주소 끝 11글자)와 MAP(화면 → 편 번호)에 한 줄씩만 더한다.
   도구 화면: 첫 제목(h1) 아래에 「▶ 사용법 영상」 단추 / 첫 화면: 카드마다 단추.
   영상은 화면 안에 넣지 않고 새 창으로 유튜브를 연다(이 사이트는 아무것도 보내지 않는다는 약속 그대로). */
(function () {
  var LIST = 'PLd5eK_bDlbRI';
  var WLIST = 'PLXJUgDGeey5Q';   // 사회복지 업무 도구 사용법 (w로 시작하는 편)
  var V = {
    1: 'yYLwfGYMItE', 2: 'CQTsNzvuQOA', 3: '5JtHIEJxa8o', 4: '0NruNNiDanw', 5: '3Q3U1YewgRU',
    6: '68ifdO0U4WQ', 7: 'tB-3roNoajM', 8: '93S5LNYC9bY', 9: 'Lkq07U01U5A', 10: 'BvEy5jwQgww',
    11: 'AylBNTFEj18', 12: 'ZatuqgvoFSg', 13: 'TVqw0gcRIeM', 14: 'lNE6bBdmoSc', 15: '7eUOJSkDR9U',
    16: 'em9Rh0gx3-A', 17: 'MHbNJ-NhqoM', 18: 'UoETsbk1Nc8', 19: 'LfUoyjmvsew', 20: 'ZROSIbxbV30',
    21: 'ti6S-t1m4tA', 22: 'sHiJ41q93Dk', 23: 'F6Ip4DkHmRg', 24: 'PWrmSzceZx8', 25: 'Ea0ozqSYZqE',
    26: 'p8YX3bZm39s', 27: '5BsT79LDjJE', 28: 'SWowkwG_a0U', 29: 'Sfs-nvWKp5Y', 30: '6GpargX0m9U',
    31: 'zI_8Vmpm-tg', 32: 'hgMVmRI79to', 33: 'stkTREd_6bY', 34: 'ZxKsqFk6wKk', 35: 'KvXl0wsgqqY',
    36: 'GF58dYqhTcI', 37: 'fVvm6276zi8', 38: 'qFi13sVuMl0', 39: 'yXMu2jj2OY8', 40: 'mo7eEpIMhys',
    41: 'uWKFY68kw0Q', 42: '8qjfvtA2CvY', 43: '5-TIxQKFiUg', 44: '1E0MTuJGzW8', 45: 'BBIu_--n2TU', 46: 'TSuUaPVpwd0',
    w1: 'RG0YwzxThNI', w2: 'iYDE_sVX1LA', w3: 'BUVJK8DZATM', w4: 'PuyHWPnQ41E', w5: 'YBQI7aseP3g', w6: 'Yyk6vnWdz1k'
  };
  /* 화면(폴더 이름, 첫 화면 카드는 data-id) → [편, 단추에 붙일 짧은 이름, 첫 화면 카드용 더 짧은 이름] — 이름은 한 화면에 영상이 여럿일 때만 */
  var MAP = {
    'qr': [[2]], 'labels': [[3]],
    'forms': [[4, '서식 찾기'], [5, '채워서 받기']], 'forms-sit': [[4]], 'forms-fill': [[5]],
    'file-tools': [[6]],
    'safety': [[7, '표지 인쇄', '표지'], [8, '게시물·공식 자료', '게시물']], 'safety-pack': [[7]], 'safety-post': [[8]], 'safety-links': [[8]],
    'cert-print': [[9]], 'list-compare': [[10]], 'mask-privacy': [[11, '사진·문서', '사진'], [40, '글 가리기', '글']], 'form-overlay': [[12]], 'attendance': [[13]],
    'quote-calculator': [[14]], 'cost-calculator': [[15]], 'margin-calculator': [[16]], 'vat-reverse': [[17]],
    'work-hours': [[18]], 'edu-hours': [[19]], 'eval-score': [[20]], 'eval-check': [[45]], 'participant-guide': [[46]], 'social-insurance': [[21]],
    'savings-account': [[22]], 'budget-plan': [[23]], 'budget-check': [[24]], 'startup-wage': [[25]],
    'press': [[26]], 'newsletter': [[27]], 'greeting': [[28]], 'map': [[29]], 'prompt-directions': [[29]],
    'excel': [[30]], 'shortcuts': [[31]], 'repeat-checklist': [[32]], 'deadline-board': [[33]], 'leave-tracker': [[34]],
    'group-maker': [[35]], 'random-pick': [[35]], 'survey-tally': [[36]], 'show-vote': [[36]],
    'ai-howto': [[37]], 'prompt-guide': [[37]], 'prompt-minutes': [[37]], 'prompt-notice': [[37]],
    'prompt-participant': [[37]], 'prompt-survey': [[37]], 'form-prompt': [[37]],
    'meeting-timer': [[38]], 'break-timer': [[38]], 'focus-timer': [[38]], 'break-reminder': [[38]],
    'ref-guide': [[39]], 'ref-links': [[39]], 'ref-sites': [[39]], 'ref-income': [[39]],
    'style-card': [['w1']], 'doc-remake': [['w2']], 'easy-notice': [['w3']], 'work-board': [['w4']], 'search': [['w5']], 'phone': [['w6']],
    'face-mask': [[41]], 'date-calc': [[42]], 'rates': [[43]]   // 44 = 「내 기관에 맞게 다시 만들기」 창(remake.js), 43은 첫 화면 찾기 칸에도
  };
  function url(n) { return 'https://www.youtube.com/watch?v=' + V[n] + '&list=' + (/^w/.test(n) ? WLIST : LIST); }
  window.JT_VIDEOS = { list: LIST, playlist: 'https://www.youtube.com/playlist?list=' + LIST, wplaylist: 'https://www.youtube.com/playlist?list=' + WLIST, url: url, map: MAP, start: url(1) };

  var css = '.jt-vid{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 10px}' +
    '.jt-vid a{display:inline-flex;align-items:center;gap:6px;min-height:36px;padding:0 12px;border-radius:999px;border:1.5px solid var(--line,#D5DCE8);background:var(--surface,#fff);color:var(--text,#1A2233);text-decoration:none;font-size:14px;font-weight:700;line-height:1.2}' +
    '.jt-vid a:hover{border-color:#E0322B}' +
    '.jt-vid a::before{content:"";width:0;height:0;border-left:9px solid #E0322B;border-top:6px solid transparent;border-bottom:6px solid transparent}' +
    '.jt-vid a small{font-weight:500;font-size:12px;color:var(--muted,#5A6478)}' +
    '.card{min-width:0}.card .jt-vid{margin:0;flex-wrap:wrap}.card .jt-vid a{min-height:34px;padding:0 10px;font-size:13px;white-space:nowrap}' +
    '@media print{.jt-vid{display:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function box(list, home) {
    var p = document.createElement('p'); p.className = 'jt-vid';
    list.forEach(function (it) {
      var a = document.createElement('a');
      a.href = url(it[0]); a.target = '_blank'; a.rel = 'noopener';
      a.title = '유튜브에서 사용법 영상 보기 (새 창)';
      a.innerHTML = home && it[1] ? '영상 · ' + (it[2] || it[1]) : '사용법 영상' + (it[1] ? ' · ' + it[1] : '') + (home ? '' : ' <small>유튜브</small>');
      p.appendChild(a);
    });
    return p;
  }

  function run() {
    var cards = document.querySelectorAll('.card[data-id]');
    if (cards.length) {            // 첫 화면: 카드마다 「열기」 아래
      cards.forEach(function (c) {
        var m = MAP[c.getAttribute('data-id')]; if (!m || c.querySelector('.jt-vid')) return;
        var open = c.querySelector('a.open'); var b = box(m.length > 1 ? m : [[m[0][0]]], true);
        if (open) open.insertAdjacentElement('afterend', b); else c.appendChild(b);
      });
      var fh = document.querySelector('#finder .fd-h');   // 첫 화면 찾기 칸: 도구 찾기·내 도구함 영상
      if (fh && !fh.parentNode.querySelector('.jt-vid')) fh.insertAdjacentElement('afterend', box([[43, '도구 찾기·내 도구함']]));
      return;
    }
    var seg = location.pathname.split('/').filter(Boolean);
    var last = seg[seg.length - 1] || '';
    var dir = /\.html?$/.test(last) ? seg[seg.length - 2] : last;
    var m = MAP[dir]; if (!m) return;
    var h = document.querySelector('h1'); if (!h) return;
    var nx = h.nextElementSibling; if (nx && nx.classList.contains('jt-vid')) return;   // 다시 만들기 창의 영상 단추(remake.js)와는 따로 센다
    h.insertAdjacentElement('afterend', box(m));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
