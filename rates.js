/* 해마다 바뀌는 기준값 — 모든 도구가 여기서 읽는다 (2026-10-25)
   새해에는 아래 D에 그해 묶음을 더하고, 확인한 항목만 넣는다. 넣지 않은 항목은 지난해 값을 쓰고 화면에 「○년 값 사용」이라고 띄운다.
   값마다 src(근거 문서·쪽)를 꼭 적는다. 기준값 표 화면(rates/)이 이 파일로 그려지고, 해마다 확인 목록으로 쓴다.
   도구 쓰는 법: <head>에 <script src="../rates.js"></script>, 도구 코드에서
     var R=window.JT_RATES; var YEAR=R?R.year:2026; var X=R?R.v('wage.day'):{…예전 값…}; R&&R.use(['wage.day',…]);
   use()에 적은 항목이 제목 아래 「기준 연도」 줄에 나온다. 연도는 오늘 날짜의 해가 기본이고, 화면에서 바꿀 수 있다(이 브라우저에만 기억). */
(function () {
  var KEYS = {
    'wage.day':    { label: '자활급여 1일 기준급여 (실비 제외)', unit: '원', tools: ['work-hours', 'budget-plan'] },
    'wage.month':  { label: '유형별 표준소득액 (월, 1일 단가 × 26일)', unit: '원', tools: ['social-insurance', 'ref-income'] },
    'wage.extra':  { label: '실비·자격급여·반장수당 (1일)', unit: '원', tools: ['budget-plan'] },
    'biz.ratio':   { label: '사업비 비율 (인건비:사업비의 사업비 %)', unit: '%', tools: ['budget-plan', 'budget-check'] },
    'ins.np':      { label: '국민연금 요율 (본인·기관)', unit: '%', tools: ['social-insurance', 'budget-plan'] },
    'ins.hi':      { label: '건강보험 요율 (본인·기관)', unit: '%', tools: ['social-insurance', 'budget-plan'] },
    'ins.lt':      { label: '장기요양보험 요율 (본인·기관, 소득 대비)', unit: '%', tools: ['social-insurance', 'budget-plan'] },
    'ins.ei':      { label: '고용보험 요율 (본인·기관)', unit: '%', tools: ['social-insurance', 'budget-plan'] },
    'ins.wc':      { label: '산재보험 평균 요율 (기관)', unit: '%', tools: ['social-insurance', 'budget-plan'] },
    'np.limits':   { label: '국민연금 기준소득월액 하한·상한 (7월~이듬해 6월)', unit: '원', tools: ['social-insurance'], dated: true },
    'median':      { label: '기준 중위소득 (1~7인 월액, 8인 이상 1인 추가)', unit: '원', tools: ['ref-income'] },
    'select.rate': { label: '급여 선정기준 (중위소득 대비 %)', unit: '%', tools: ['ref-income'] },
    'asset.youthhope': { label: '청년희망키움통장 근로소득장려금 (비율·월 최대)', unit: '', tools: ['savings-account'] },
    'startup':     { label: '자활기업 한시적 인건비 (기본 월액·전문인력 월 최대)', unit: '원', tools: ['startup-wage'] },
    'holidays':    { label: '공휴일·대체공휴일', unit: '', tools: ['date-calc', 'budget-plan'] },
    'minwage':     { label: '최저임금 (시간급)', unit: '원', tools: [] },
    'eval.period': { label: '성과평가 안내서 적용 기간', unit: '', tools: ['eval-score', 'eval-check', 'edu-hours'] }
  };

  var H2026 = ['2026-01-01 신정', '2026-02-16 설날 연휴', '2026-02-17 설날', '2026-02-18 설날 연휴', '2026-03-01 삼일절', '2026-03-02 삼일절 대체공휴일', '2026-05-01 노동절', '2026-05-05 어린이날', '2026-05-24 부처님오신날', '2026-05-25 부처님오신날 대체공휴일', '2026-06-03 지방선거', '2026-06-06 현충일', '2026-07-17 제헌절', '2026-08-15 광복절', '2026-08-17 광복절 대체공휴일', '2026-09-24 추석 연휴', '2026-09-25 추석', '2026-09-26 추석 연휴', '2026-10-03 개천절', '2026-10-05 개천절 대체공휴일', '2026-10-09 한글날', '2026-12-25 성탄절'];

  /* 연도별 값. status: 확정 / 일부 확정 / 예상. 항목마다 v(값), src(근거) */
  var D = {
    2026: {
      status: '확정',
      note: '2026 자활사업 안내, 2026 국민기초생활보장 사업안내, 2026 자산형성지원 통장사업 안내, 각 공단 고시',
      items: {
        'wage.day': { v: { market: 62080, social: 53840, keep: 29940 }, src: '2026 자활사업 안내 75쪽' },
        'wage.month': { v: { market: 1614080, social: 1399840, keep: 778440, marketPart: 807040, socialPart: 699920 }, src: '2026 자활사업 안내 75쪽 (표준소득액)' },
        'wage.extra': { v: { sub: 4000, qual: 4000, lead: 6000, leadPart: 3000 }, src: '2026 자활사업 안내 75쪽(실비·자격), 96쪽(반장), 106쪽(시간제 반장)' },
        'biz.ratio': { v: { market: 30, social: 20, intern: 10, keep: 5, part: 20, gw: 30 }, src: '2026 자활사업 안내 92~96쪽' },
        'ins.np': { v: [4.75, 4.75], src: '국민연금법 (2026년 9.5%, 해마다 0.5%p 인상)' },
        'ins.hi': { v: [3.595, 3.595], src: '2026 건강보험료율 7.19% (건강보험정책심의위원회)' },
        'ins.lt': { v: [0.4724, 0.4724], src: '2026 장기요양보험료율: 건강보험료의 13.14% (소득 대비 0.9448%)' },
        'ins.ei': { v: [0.9, 1.15], src: '고용보험료율: 실업급여 0.9%씩 + 고용안정·직업능력개발 0.25%(150인 미만, 기관만)' },
        'ins.wc': { v: [0, 1.47], src: '2026 산재보험 평균 요율 1.47% (출퇴근재해 0.06% 포함, 고용노동부 고시)' },
        'median': { v: { list: [2564238, 4199292, 5359036, 6494738, 7556719, 8555952, 9515150], step: 959198 }, src: '2026 국민기초생활보장 사업안내 51~52쪽' },
        'select.rate': { v: { '생계급여': 32, '의료급여': 40, '주거급여': 48, '교육급여': 50 }, src: '2026 국민기초생활보장 사업안내 51~52쪽' },
        'asset.youthhope': { v: { rate: 0.45, max: 772000 }, src: '2026 자산형성지원 통장사업 안내 79쪽 (3인 생계급여 기준)' },
        'startup': { v: { base: 1700000, expertMax: 2770000 }, src: '2026 자활사업 안내 87·128~130쪽' },
        'holidays': { v: H2026, src: '관공서의 공휴일에 관한 규정 · 2026 월력요항 (제헌절 공휴일 재지정, 6/3 지방선거)' },
        'minwage': { v: { hour: 10320 }, src: '2026년 적용 최저임금 고시 (고용노동부)' },
        'eval.period': { v: '2025~2026', src: '2025~2026년 지역자활센터 성과평가 안내서' }
      }
    },
    /* 2027: 2026-10-25에 공식 발표로 확인한 것만. 자활급여 단가·실비·사업비 비율·장기요양·고용·산재·자산형성·한시적 인건비·성과평가는
       아직 없음 → 2026년 값을 쓰고 화면에 알림. (예산안: 자활급여 3.7% 인상안 — 국회 심의 중이라 넣지 않음. 고용보험 실업급여 0.9→1.0%는 정부안) */
    2027: {
      status: '일부 확정',
      note: '2026-10-25 확인: 기준 중위소득·선정기준·최저임금·국민연금 요율·건강보험료율·공휴일. 자활급여 단가 등은 2027 자활사업 안내(보통 1~2월) 뒤',
      items: {
        'median': { v: { list: [2736042, 4480645, 5718091, 6929885, 8063019, 9129201, 10152665], step: 1023464 }, src: '보건복지부 고시 제2026-157호 (2026-07-29, 2027.1.1 시행) · 8인 이상은 7인+(7인−6인)×(가구원−7)' },
        'select.rate': { v: { '생계급여': 32, '의료급여': 40, '주거급여': 48, '교육급여': 50 }, src: '보건복지부 고시 제2026-157호, 국토교통부 고시 제2026-455호(주거)' },
        'ins.np': { v: [5, 5], src: '국민연금법 (2027년 1천분의 100 = 10.0%, 2028년 10.5%)' },
        'ins.hi': { v: [3.595, 3.595], src: '2027 건강보험료율 7.19% 동결 — 제15차 건강보험정책심의위원회(2026-09-08) 의결 보도 기준, 복지부 원문 확인 필요' },
        'holidays': { v: ['2027-01-01 신정', '2027-02-06 설날 연휴', '2027-02-07 설날', '2027-02-08 설날 연휴', '2027-02-09 설날 대체공휴일', '2027-03-01 삼일절', '2027-05-01 노동절', '2027-05-03 노동절 대체공휴일', '2027-05-05 어린이날', '2027-05-13 부처님오신날', '2027-06-06 현충일', '2027-07-17 제헌절', '2027-07-19 제헌절 대체공휴일', '2027-08-15 광복절', '2027-08-16 광복절 대체공휴일', '2027-09-14 추석 연휴', '2027-09-15 추석', '2027-09-16 추석 연휴', '2027-10-03 개천절', '2027-10-04 개천절 대체공휴일', '2027-10-09 한글날', '2027-10-11 한글날 대체공휴일', '2027-12-25 성탄절', '2027-12-27 성탄절 대체공휴일'], src: '2027년도 월력요항 (우주항공청, 2026-06-29 발표) · 한국천문연구원 달력자료로 날짜 확인' },
        'minwage': { v: { hour: 10700 }, src: '2027년 적용 최저임금 고시 (고용노동부 고시 제2026-60호, 2026-08-05) · 월 209시간 2,236,300원' }
      }
    }
  };
  /* 날짜로 바뀌는 값 (해와 상관없이 적용일 기준) */
  var DATED = {
    'np.limits': [
      { from: '2025-07-01', v: { low: 400000, high: 6370000 }, src: '국민연금공단 고시 (2025.7~2026.6)' },
      { from: '2026-07-01', v: { low: 410000, high: 6590000 }, src: '국민연금공단 고시 (2026.7~2027.6)' }
    ]
  };

  var KEY = 'jahwal-tools.rates.year';
  var years = Object.keys(D).map(Number).sort();
  var now = new Date(), thisYear = now.getFullYear();
  function lsGet() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function lsSet(v) { try { if (v == null) localStorage.removeItem(KEY); else localStorage.setItem(KEY, String(v)); } catch (e) {} }
  var picked = parseInt(lsGet(), 10);
  /* 기본: 올해. 올해 묶음이 없으면 있는 해 중 가장 가까운 앞 해(없으면 첫 해) */
  function auto() { var y = years[0]; years.forEach(function (x) { if (x <= thisYear) y = x; }); return thisYear > years[years.length - 1] ? thisYear : (D[thisYear] ? thisYear : y); }
  var year = years.indexOf(picked) >= 0 ? picked : auto();

  function info(key, y) {
    y = y || year;
    if (DATED[key]) {
      var at = (y === thisYear) ? now : new Date(y, 0, 1);
      var hit = null; DATED[key].forEach(function (e) { if (new Date(e.from) <= at) hit = e; });
      if (!hit) hit = DATED[key][0];
      return { v: hit.v, year: +hit.from.slice(0, 4), src: hit.src, from: hit.from, dated: true };
    }
    for (var i = years.length - 1; i >= 0; i--) {
      var yy = years[i]; if (yy > y) continue;
      var it = D[yy].items[key]; if (it) return { v: it.v, year: yy, src: it.src, fallback: yy !== y };
    }
    return null;
  }
  function v(key, y) { var i = info(key, y); return i ? JSON.parse(JSON.stringify(i.v)) : null; }
  /* 공휴일: 고른 해와 앞뒤 해까지 모두 (기간 계산이 해를 넘을 수 있어서) */
  function holidays() {
    var out = [];
    years.forEach(function (y) { var it = D[y].items.holidays; if (it) out = out.concat(it.v); });
    return out;
  }
  function holidayYears() { return years.filter(function (y) { return !!D[y].items.holidays; }); }

  var used = [];
  function use(keys) { keys.forEach(function (k) { if (used.indexOf(k) < 0) used.push(k); }); if (document.readyState !== 'loading') banner(); }

  /* ---------- 제목 아래 「기준 연도」 줄 ---------- */
  var css = '.jt-rates{margin:2px 0 12px;padding:8px 12px;border-radius:12px;border:1.5px solid var(--line,#D5DCE8);background:var(--surface,#fff);font-size:14px;line-height:1.55;color:var(--text,#1A2233)}' +
    '.jt-rates .row{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px}' +
    '.jt-rates select{min-height:34px;padding:2px 8px;border-radius:8px;border:1.5px solid var(--line,#D5DCE8);background:var(--surface,#fff);color:inherit;font:inherit;font-weight:700}' +
    '.jt-rates .fb{margin:6px 0 0;padding:6px 10px;border-radius:8px;background:var(--amber-bg,#FFF1CC);border:1px solid var(--amber-line,#E5B93C);color:var(--text,#1A2233)}' +
    '.jt-rates details{margin-top:4px}.jt-rates summary{cursor:pointer;color:var(--muted,#5A6478);font-weight:600}' +
    '.jt-rates ul{margin:6px 0 0;padding-left:18px}.jt-rates li{margin:2px 0}.jt-rates small{color:var(--muted,#5A6478)}' +
    '.jt-rates a{color:inherit}' +
    '@media print{.jt-rates{display:none!important}}';
  var shown = null;
  function banner() {
    if (!used.length || !document.body) return;
    var h = document.querySelector('h1'); if (!h) return;
    if (!document.getElementById('jtRatesCss')) { var st = document.createElement('style'); st.id = 'jtRatesCss'; st.textContent = css; document.head.appendChild(st); }
    var box = shown || document.createElement('div'); box.className = 'jt-rates'; box.textContent = '';
    var row = document.createElement('div'); row.className = 'row';
    var lab = document.createElement('label'); lab.textContent = '기준 연도';
    var sel = document.createElement('select'); sel.setAttribute('aria-label', '기준 연도');
    var ys = years.slice(); if (ys.indexOf(year) < 0) ys.push(year);
    ys.forEach(function (y) { var o = document.createElement('option'); o.value = y; o.textContent = y + '년' + (D[y] ? (D[y].status !== '확정' ? ' (' + D[y].status + ')' : '') : ' (값 없음)'); sel.appendChild(o); });
    sel.value = String(year);
    sel.addEventListener('change', function () { var y = +sel.value; lsSet(y === auto() ? null : y); location.reload(); });
    lab.appendChild(document.createTextNode(' ')); lab.appendChild(sel); row.appendChild(lab);
    var st2 = document.createElement('span'); st2.innerHTML = (year === auto() ? '<small>오늘 날짜 기준 자동</small>' : '<small>직접 고름 · </small>') + ' <a href="' + base() + 'rates/index.html">기준값 표 보기</a>';
    row.appendChild(st2); box.appendChild(row);
    var fb = used.map(function (k) { var i = info(k); return i && i.fallback ? (KEYS[k] ? KEYS[k].label : k) + ' → ' + i.year + '년 값' : null; }).filter(Boolean);
    if (fb.length) { var p = document.createElement('p'); p.className = 'fb'; p.textContent = year + '년 값이 아직 확인되지 않아 지난해 값을 쓰는 항목: ' + fb.join(', ') + '. 새해 지침이 나오면 바뀝니다. 지금은 화면에서 직접 고쳐 쓰세요.'; box.appendChild(p); }
    var det = document.createElement('details'); var sm = document.createElement('summary'); sm.textContent = '이 화면이 쓰는 기준값과 근거 (' + used.length + '가지)'; det.appendChild(sm);
    var ul = document.createElement('ul');
    used.forEach(function (k) { var i = info(k); if (!i) return; var li = document.createElement('li'); li.innerHTML = '<b>' + esc(KEYS[k] ? KEYS[k].label : k) + '</b>: ' + esc(fmt(k, i.v)) + ' <small>(' + esc(i.dated ? i.from + '부터' : i.year + '년') + ' · ' + esc(i.src) + ')</small>'; ul.appendChild(li); });
    det.appendChild(ul); box.appendChild(det);
    if (!shown) {
      var after = h; var nx = h.nextElementSibling;
      while (nx && /\b(jt-vid|jt-rm-wrap)\b/.test(nx.className || '')) { after = nx; nx = nx.nextElementSibling; }
      after.insertAdjacentElement('afterend', box); shown = box;
    }
  }
  /* 사이트 안이면 상대 주소, 내려받은 사본(file:·srcdoc)이면 사이트 주소로 */
  function base() { if (!/^https?:$/.test(location.protocol)) return 'https://jahwalktg.github.io/jahwal-tools/'; var p = location.pathname; return /\/[^/]+\/(index\.html)?$/.test(p) ? '../' : './'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function n(x) { return typeof x === 'number' ? x.toLocaleString('ko-KR') : String(x); }
  var NAMES = { market: '시장진입형', social: '사회서비스형', keep: '근로유지형', intern: '인턴·도우미형', part: '시간제', gw: 'Gateway', marketPart: '시간제(시장)', socialPart: '시간제(사회)', sub: '실비', qual: '자격급여', lead: '반장수당', leadPart: '시간제 반장', low: '하한', high: '상한', rate: '비율', max: '월 최대', base: '기본 월액', expertMax: '전문인력 월 최대', hour: '시간급' };
  function fmt(k, val) {
    if (k === 'holidays') { return val.length + '일 (' + val.slice(0, 3).map(function (s) { return s.slice(5, 10).replace('-', '/') + ' ' + s.slice(11); }).join(', ') + ' …)'; }
    if (k === 'median') { return '1인 ' + n(val.list[0]) + ' · 4인 ' + n(val.list[3]) + ' … (8인 이상 1인당 +' + n(val.step) + ')'; }
    if (Array.isArray(val)) return '본인 ' + val[0] + '% · 기관 ' + val[1] + '%';
    if (val && typeof val === 'object') return Object.keys(val).map(function (x) { var u = KEYS[k] && KEYS[k].unit === '%' ? '%' : ''; var vv = val[x]; if (x === 'rate' && vv < 1) { vv = Math.round(vv * 100) + '%'; } return (NAMES[x] || x) + ' ' + n(vv) + u; }).join(' · ');
    return String(val);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', banner); else banner();

  window.JT_RATES = { year: year, years: years, thisYear: thisYear, keys: KEYS, data: D, dated: DATED, info: info, v: v, use: use, holidays: holidays, holidayYears: holidayYears, fmt: fmt, setYear: function (y) { lsSet(y); } };
})();
