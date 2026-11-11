/* 첫 화면 「무엇을 하려고 하나요?」 — 하고 싶은 일로 찾기 · 내 업무로 보기 · 내 도구함(☆·최근)
   카드(.card[data-id])를 읽어서 그린다. 새 도구는 카드만 넣으면 이름·설명으로 찾아지고, 일의 말로도 찾히게 하려면 아래 KW에 한 줄.
   업무별 묶음은 ROLES. ☆·최근은 이 브라우저에만 저장(welfare-tools.mybox.v1). 아무것도 보내지 않는다. */
(function () {
  var KW = {
    'search': '지침 찾기 지침찾기 관리안내 사회복지시설 관리안내 사회복지관 업무처리 안내 서울시 처우개선 인건비 가이드라인 호봉 경력인정 수당 후원금 운영위원회 재무회계규칙 예산 결산 안전점검 책임보험 시설평가 쪽수 근거 작년 비교 개정 바뀐점 원문',
    'basic': '국기초 가늠표 국민기초생활보장 수급 가늠 소득인정액 생계급여 의료급여 주거급여 교육급여 기준중위소득 선정기준 부양의무자 근로소득공제 기본재산액 차상위 제도 복지제도 모의계산',
    'guide': '신입 안내서 처음 입사 신입 용어 사전 쉬운말 보조금 후원금 결산 예산 추경 이월금 품의 지출결의 4대보험 연차 취업규칙 인건비가이드라인 호봉 법정의무교육 운영위원회 시설평가 안전점검 희망이음 사례관리 한해달력 체크리스트 인수인계 품의서 견적서 지출결의서 결재 기안 수입결의 전월이월금 관항목 전용 예비비 법인전입금 클린카드 비지정후원금 임면보고 경력인정 책임보험 원천세 이직확인서 절차',
    'date-calc': '나이 만나이 생년월일 연령 기간 일수 개월수 평일수 공휴일 디데이 몇일 몇개월 계약기간 이용기간 18세 65세 청년 노인 아동 기한계산',
    'work-board': '인수인계 인수인계서 업무분장 업무분장표 업무매뉴얼 매뉴얼 업무목록 업무정리 담당 부담당 한해달력 연간일정 후임 전임 퇴사 이직 인계 소규모시설',
    'repeat-checklist': '할일 반복업무 체크리스트 매일 매주 매달 업무목록 루틴 보고기한',
    'leave-tracker': '연차 휴가 직원휴가 잔여연차 휴가관리 입사일',
    'list-compare': '명단대조 명단비교 중복찾기 빠진사람 누락 두명단 비교 대상자확인',
    'group-maker': '조편성 조나누기 모둠 팀나누기 교육조 프로그램조',
    'random-pick': '추첨 제비뽑기 룰렛 사다리 뽑기 경품',
    'survey-tally': '설문 만족도 집계 응답 결과 통계 설문지 프로그램만족도',
    'show-vote': '투표 거수 회의 안건 과반 의결 운영위원회',
    'form-overlay': '양식 덧쓰기 입력칸 종이양식 인쇄위치 틀',
    'mask-privacy': '개인정보 가리기 마스킹 비식별 이름가리기 주민번호 전화번호 상담기록 사례기록 ai에넣기전',
    'cert-print': '수료증 상장 명찰 이름표 명패 일괄인쇄 교육수료 자원봉사',
    'labels': '라벨 주소라벨 우편 발송 스티커 우편번호 봉투 연하장발송 후원자우편',
    'file-tools': 'pdf나누기 pdf합치기 수료증나누기 사진합치기 용량줄이기 파일이름 10mb 스캔',
    'attendance': '출석부 출석 서명 교육출석 출석집계 자필서명 프로그램출석',
    'press': '보도자료 언론 기사 홍보문 신문',
    'newsletter': '소식지 웹진 카드뉴스 sns 홍보물 사진배치 후원소식',
    'greeting': '연하장 송년 새해인사 초대장 추석 설 감사카드 인사장 후원감사',
    'map': '약도 오시는길 지도 위치안내 찾아오는길',
    'face-mask': '얼굴가리기 모자이크 초상권 사진동의 블러 홍보사진 이용자사진',
    'excel': '엑셀 함수 vlookup 수식 sumif countif 나이계산 오류 #n/a 복지관엑셀 엑셀양식 사무처리',
    'shortcuts': '단축키 캡처 복사 붙여넣기 한글단축키 엑셀단축키 키보드',
    'qr': 'qr 큐알 설문링크 와이파이 명함 신청서링크 프로그램신청',
    'safety': '안전표지 경고표지 금지표지 미끄럼주의 안전보건표지 표지판 급식실 비상연락망 경영방침 대피안내 msds 아차사고 안전게시물 점검대비 안전포스터 안전교육자료',
    'safety-post': '비상연락망 경영방침 대피안내 msds 아차사고 안전게시물 점검대비',
    'safety-links': '안전포스터 안전교육자료 산업안전 공단자료',
    'style-card': '스타일 카드 우리기관 기관스타일 말투 문체 틀 견본 양식 맞춤 hwpx 한글파일 챗gpt 제미나이 ai 프롬프트 주문서',
    'doc-remake': '문서 바꾸기 문서만들기 공모 신청서 양식채우기 작년문서 올해 계획서 결과보고 평가서 공문 기안 회의록 운영위원회 가정통신문 후원편지 감사편지 소식지 홍보글 채용공고 인수인계 업무매뉴얼 전화응대 대본 메모 초안 hwpx pdf 개인정보가리기 ai 챗gpt 제미나이 주문서 프롬프트 일지 홍보글 기사 영상대본 결과보고서재활용 기안문',
    'easy-notice': '쉬운 안내문 쉬운말 안내문 점검 어려운말 긴문장 순화 공공언어 가정통신문 공지 게시문 어르신 큰글자 인쇄 낙인 표현 다듬기 문장 고치기',
    'ai-howto': 'ai 인공지능 챗gpt 클로드 제미나이 주문서 프롬프트 사용법',
    'prompt-minutes': '회의록 회의정리 ai회의록 운영위원회회의록',
    'prompt-survey': '설문보고서 결과보고 만족도보고서',
    'prompt-notice': '공문 안내문 공문초안 가정통신문 안내장 이용자안내문 큰글씨',
    'prompt-directions': '오시는길 안내문 길안내',
    'prompt-guide': '지침질문 지침찾기 시설관리안내 재무회계규칙 노트북lm',
    'form-prompt': '양식입력 입력창만들기 ai양식',
    'meeting-timer': '회의시간 타이머 안건시간',
    'break-timer': '쉬는시간 휴식 교육재개 타이머',
    'focus-timer': '집중 뽀모도로 타이머',
    'break-reminder': '스트레칭 휴식알림 눈쉬기',
    'gangnam': '지역공동도구 다른지역 틀나눔 강남구 강남 이음도구 공동도구 게시판 키워드 찾습니다 나눔 일정 프로그램 제안 시연 협의 시설네트워크 연계 의뢰'
  };
  var ROLES = [
    ['case', '사례관리·상담', ['search', 'basic', 'guide', 'mask-privacy', 'date-calc', 'list-compare', 'doc-remake', 'easy-notice', 'prompt-notice', 'prompt-guide', 'repeat-checklist', 'gangnam']],
    ['prog', '프로그램·교육', ['attendance', 'cert-print', 'group-maker', 'random-pick', 'survey-tally', 'doc-remake', 'prompt-survey', 'break-timer', 'qr', 'file-tools', 'face-mask']],
    ['acct', '행정·회계', ['search', 'guide', 'work-board', 'repeat-checklist', 'leave-tracker', 'date-calc', 'excel', 'form-overlay', 'form-prompt', 'doc-remake', 'style-card', 'prompt-minutes', 'show-vote', 'shortcuts']],
    ['fund', '후원·홍보', ['newsletter', 'press', 'greeting', 'easy-notice', 'doc-remake', 'labels', 'face-mask', 'map', 'qr', 'prompt-directions']],
    ['fac', '총무·시설·안전', ['work-board', 'safety', 'safety-post', 'safety-links', 'repeat-checklist', 'leave-tracker', 'meeting-timer', 'labels']],
    ['new', '처음 왔어요', ['search', 'guide', 'work-board', 'style-card', 'ai-howto', 'repeat-checklist', 'mask-privacy', 'shortcuts', 'excel']]
  ];
  var QUICK = ['우리 기관 스타일', '문서 바꾸기', '지침 찾기', '인수인계', '신입 안내서', '국기초 가늠', '만 나이', '명단 대조', '개인정보 가리기', '수료증 나누기', '주소 라벨', '소식지', '안내문 쉬운 말', '안전표지', '회의록'];
  var KEY = 'welfare-tools.mybox.v1';

  var root = document.getElementById('finder'); if (!root) return;
  function load() { try { var o = JSON.parse(localStorage.getItem(KEY) || '{}'); return { star: Array.isArray(o.star) ? o.star : [], recent: Array.isArray(o.recent) ? o.recent : [] }; } catch (e) { return { star: [], recent: [] }; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(M)); } catch (e) {} }
  var M = load();
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function norm(s) { return String(s || '').toLowerCase().replace(/[\s·・,.()「」『』\-_/]+/g, ''); }

  /* 카드 읽기 */
  var T = {}, ORDER = [];
  document.querySelectorAll('section.group .card[data-id]').forEach(function (c) {
    var id = c.getAttribute('data-id'); if (T[id]) return;
    var g = c.closest('section.group'), gh = g && g.querySelector('h2');
    var a = c.querySelector('a.open'), p = c.querySelector('p');
    T[id] = { id: id, title: c.getAttribute('data-title') || (c.querySelector('h3') || {}).textContent || id, desc: p ? p.textContent.trim() : '', href: a ? a.getAttribute('href') : '#', group: gh ? gh.textContent.trim() : '', gid: g ? g.id : '', el: c };
    ORDER.push(id);
  });

  /* ---------- 화면 ---------- */
  root.innerHTML =
    '<h2 class="fd-h">무엇을 하려고 하나요?</h2>' +
    '<div class="fd-q"><input type="search" id="fdQ" placeholder="하고 싶은 일로 찾기 — 예: 만 나이, 명단 대조, 수료증 나누기, 후원 감사" aria-label="하고 싶은 일로 도구 찾기" autocomplete="off"></div>' +
    '<div class="fd-chips" id="fdQuick" aria-label="자주 찾는 일"></div>' +
    '<div class="fd-roles"><span class="fd-lbl">내 업무로 보기</span><div class="fd-chips" id="fdRoles"></div></div>' +
    '<div id="fdRes" class="fd-res" aria-live="polite"></div>' +
    '<div class="fd-box"><span class="fd-lbl">내 도구함</span><div id="fdMine" class="fd-mine"></div></div>';
  var Q = document.getElementById('fdQ'), RES = document.getElementById('fdRes'), MINE = document.getElementById('fdMine');
  var mode = null; /* 'q' 또는 역할 id */

  QUICK.forEach(function (q) { var b = document.createElement('button'); b.type = 'button'; b.textContent = q; b.addEventListener('click', function () { Q.value = q.replace(/·/g, ' '); run(); Q.focus(); }); document.getElementById('fdQuick').appendChild(b); });
  ROLES.forEach(function (r) {
    var b = document.createElement('button'); b.type = 'button'; b.textContent = r[1]; b.dataset.role = r[0];
    b.addEventListener('click', function () { if (mode === r[0]) { mode = null; draw([]); markRoles(); return; } mode = r[0]; Q.value = ''; draw(r[2].filter(function (id) { return T[id]; }).map(function (id) { return { id: id }; }), r[1] + ' 업무에 자주 쓰는 도구'); markRoles(); });
    document.getElementById('fdRoles').appendChild(b);
  });
  function markRoles() { document.querySelectorAll('#fdRoles button').forEach(function (b) { b.className = b.dataset.role === mode ? 'on' : ''; b.setAttribute('aria-pressed', b.dataset.role === mode ? 'true' : 'false'); }); }

  function search(q) {
    var toks = q.split(/\s+/).map(norm).filter(function (t) { return t.length >= 1; });
    if (!toks.length) return [];
    var out = [];
    ORDER.forEach(function (id) {
      var t = T[id], ti = norm(t.title), kw = (KW[id] || '').split(/\s+/).map(norm), de = norm(t.desc), sc = 0, why = [];
      for (var i = 0; i < toks.length; i++) {
        var k = toks[i], s = 0;
        if (ti.indexOf(k) >= 0) s = 6;
        var hit = kw.filter(function (w) { return w && (w.indexOf(k) >= 0 || (k.length >= 2 && k.indexOf(w) >= 0 && w.length >= 2)); });
        if (hit.length) { s = Math.max(s, hit.indexOf(k) >= 0 ? 5 : 4); why.push(hit.indexOf(k) >= 0 ? k : hit[0]); }
        if (!s && de.indexOf(k) >= 0) s = 1;
        if (!s) return; /* 낱말마다 어딘가에는 맞아야 함 */
        sc += s;
      }
      out.push({ id: id, sc: sc, why: why });
    });
    out.sort(function (a, b) { return b.sc - a.sc || ORDER.indexOf(a.id) - ORDER.indexOf(b.id); });
    return out.slice(0, 8);
  }
  function item(id, why) {
    var t = T[id]; var on = M.star.indexOf(id) >= 0;
    return '<li><a class="fd-go" href="' + esc(t.href) + '" data-id="' + esc(id) + '"><b>' + esc(t.title) + '</b><span class="fd-g">' + esc(t.group) + '</span><span class="fd-d">' + esc(t.desc.length > 70 ? t.desc.slice(0, 70) + '…' : t.desc) + '</span>' + (why && why.length ? '<span class="fd-w">찾은 말: ' + esc(why.join(', ')) + '</span>' : '') + '</a>' +
      '<button type="button" class="fd-star' + (on ? ' on' : '') + '" data-star="' + esc(id) + '" aria-pressed="' + on + '" title="' + (on ? '내 도구함에서 빼기' : '내 도구함에 넣기') + '">' + (on ? '★' : '☆') + '</button></li>';
  }
  function draw(list, head) {
    if (!list.length && !head) { RES.innerHTML = ''; return; }
    RES.innerHTML = (head ? '<p class="fd-head">' + esc(head) + '</p>' : '') + (list.length ? '<ul class="fd-list">' + list.map(function (x) { return item(x.id, x.why); }).join('') + '</ul>' :
      '<p class="fd-none">맞는 도구를 못 찾았어요. 다른 말로 찾아보거나 <a href="./toolmap/index.html">전체 도구 지도</a>를 보세요. 이런 도구가 있으면 좋겠다면 아래 「의견·문의」로 알려 주세요.</p>');
  }
  function run() { var q = Q.value.trim(); mode = null; markRoles(); if (!q) { draw([]); return; } var r = search(q); draw(r, r.length ? '「' + q + '」 — ' + r.length + '개' : null); if (!r.length) draw([], '「' + q + '」'); }
  var timer; Q.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(run, 150); });
  Q.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var a = RES.querySelector('a.fd-go'); if (a) { e.preventDefault(); a.click(); } } if (e.key === 'Escape') { Q.value = ''; run(); } });

  /* ☆ / 최근 */
  function toggleStar(id) { var i = M.star.indexOf(id); if (i >= 0) M.star.splice(i, 1); else M.star.unshift(id); save(); drawMine(); syncCardStars(); RES.querySelectorAll('[data-star="' + id + '"]').forEach(function (b) { var on = M.star.indexOf(id) >= 0; b.className = 'fd-star' + (on ? ' on' : ''); b.textContent = on ? '★' : '☆'; b.setAttribute('aria-pressed', on); }); }
  function touch(id) { if (!T[id]) return; M.recent = [id].concat(M.recent.filter(function (x) { return x !== id; })).slice(0, 6); save(); }
  function drawMine() {
    var star = M.star.filter(function (id) { return T[id]; }), rec = M.recent.filter(function (id) { return T[id] && star.indexOf(id) < 0; }).slice(0, 5);
    if (!star.length && !rec.length) { MINE.innerHTML = '<p class="fd-hint">카드의 ☆을 누르면 자주 쓰는 도구가 여기 모입니다. 최근 연 도구도 여기에 보여요. (이 브라우저에만 기억)</p>'; return; }
    function chip(id, kind) { return '<a class="fd-chip ' + kind + '" href="' + esc(T[id].href) + '" data-id="' + esc(id) + '">' + (kind === 'st' ? '★ ' : '') + esc(T[id].title) + '</a>'; }
    MINE.innerHTML = star.map(function (id) { return chip(id, 'st'); }).join('') + (rec.length ? '<span class="fd-sep">최근</span>' + rec.map(function (id) { return chip(id, 're'); }).join('') : '');
  }
  root.addEventListener('click', function (e) {
    var s = e.target.closest('[data-star]'); if (s) { e.preventDefault(); toggleStar(s.getAttribute('data-star')); return; }
    var a = e.target.closest('a[data-id]'); if (a) touch(a.getAttribute('data-id'));
  });
  /* 카드에 ☆ 단추 + 「열기」 누르면 최근에 */
  function syncCardStars() { ORDER.forEach(function (id) { var b = T[id].el.querySelector('.fd-cstar'); if (!b) return; var on = M.star.indexOf(id) >= 0; b.textContent = on ? '★' : '☆'; b.className = 'fd-cstar' + (on ? ' on' : ''); b.setAttribute('aria-pressed', on); b.title = on ? '내 도구함에서 빼기' : '내 도구함에 넣기'; }); }
  ORDER.forEach(function (id) {
    var c = T[id].el; if (c.querySelector('.fd-cstar')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'fd-cstar'; b.setAttribute('aria-label', T[id].title + ' 내 도구함에 넣기·빼기');
    b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); toggleStar(id); });
    c.appendChild(b);
    var a = c.querySelector('a.open'); if (a) a.addEventListener('click', function () { touch(id); });
  });
  syncCardStars(); drawMine();

  var css = '#finder{margin:4px 0 16px;padding:16px;border-radius:16px;border:1.5px solid var(--line,#D5DCE8);background:var(--surface,#fff)}' +
    '#finder .fd-h{margin:0 0 8px;font-size:20px}' +
    '#finder .fd-q input{width:100%;min-height:52px;padding:10px 14px;border-radius:12px;border:2px solid var(--blue,#1A6EFF);background:var(--surface,#fff);color:inherit;font:inherit;font-size:17px}' +
    '#finder .fd-chips{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 0}' +
    '#finder .fd-chips button{min-height:36px;padding:0 12px;border-radius:999px;border:1.5px solid var(--line,#D5DCE8);background:var(--surface,#fff);color:inherit;font:inherit;font-size:14px;font-weight:600;cursor:pointer}' +
    '#finder .fd-chips button.on{background:var(--blue,#1A6EFF);border-color:var(--blue,#1A6EFF);color:var(--btn-text,#fff)}' +
    '#finder .fd-roles{margin-top:10px}#finder .fd-lbl{display:block;font-size:13px;font-weight:700;color:var(--muted,#5A6478);margin:0 0 2px}' +
    '#finder .fd-res:empty{display:none}#finder .fd-res{margin-top:12px}' +
    '#finder .fd-head{margin:0 0 6px;font-weight:700;font-size:15px}' +
    '#finder .fd-list{list-style:none;margin:0;padding:0;display:grid;gap:8px;grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}' +
    '#finder .fd-list li{position:relative;border:1.5px solid var(--line,#D5DCE8);border-radius:12px;background:var(--bg,#F3F6FC)}' +
    '#finder .fd-go{display:flex;flex-direction:column;gap:2px;padding:10px 44px 10px 12px;color:inherit;text-decoration:none;min-height:64px}' +
    '#finder .fd-go:hover b{text-decoration:underline}#finder .fd-go b{font-size:16px}' +
    '#finder .fd-g{font-size:12px;font-weight:700;color:var(--blue,#1A6EFF)}#finder .fd-d{font-size:13px;color:var(--muted,#5A6478)}#finder .fd-w{font-size:12px;color:var(--muted,#5A6478)}' +
    '#finder .fd-star{position:absolute;top:6px;right:6px;width:36px;height:36px;border-radius:50%;border:0;background:transparent;color:var(--muted,#5A6478);font-size:20px;cursor:pointer}' +
    '#finder .fd-star.on{color:#E8A400}' +
    '#finder .fd-none,#finder .fd-hint{margin:0;font-size:14px;color:var(--muted,#5A6478)}#finder .fd-none a{color:inherit}' +
    '#finder .fd-box{margin-top:12px;padding-top:10px;border-top:1px dashed var(--line,#D5DCE8)}' +
    '#finder .fd-mine{display:flex;flex-wrap:wrap;gap:6px;align-items:center}' +
    '#finder .fd-chip{display:inline-flex;align-items:center;min-height:36px;padding:0 12px;border-radius:999px;border:1.5px solid var(--line,#D5DCE8);background:var(--bg,#F3F6FC);color:inherit;text-decoration:none;font-size:14px;font-weight:600}' +
    '#finder .fd-chip.st{border-color:#E8A400}#finder .fd-sep{font-size:12px;color:var(--muted,#5A6478);margin:0 2px 0 6px}' +
    '.card{position:relative}.fd-cstar{position:absolute;top:8px;right:8px;z-index:2;width:38px;height:38px;border-radius:50%;border:1.5px solid var(--line,#D5DCE8);background:var(--surface,#fff);color:var(--muted,#5A6478);font-size:19px;line-height:1;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.12)}' +
    '.fd-cstar.on{color:#E8A400;border-color:#E8A400}' +
    '@media (max-width:600px){#finder{padding:12px}#finder .fd-d{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}#finder .fd-go{min-height:0}}' +
    '@media print{#finder,.fd-cstar{display:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  window.JT_FINDER = { search: search, roles: ROLES, kw: KW };
})();
