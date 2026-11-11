/* 「내 기관에 맞게 다시 만들기」 — 도구 파일 + AI에 붙일 주문서
   도구 화면 제목 아래(사용법 영상 단추 옆)에 단추를 붙인다. 누르면 창에서
   ① 우리 기관에서 다른 점을 고르고 적음 ② 이 도구 파일 받기(굿균 그림은 빈 그림, drop.js는 파일 안에)
   ③ 주문서 복사 → AI 대화창에 파일과 함께 올리면 AI가 고친 파일을 돌려준다.
   아무것도 인터넷으로 보내지 않는다(파일 받기는 이 사이트의 같은 파일을 다시 읽을 뿐).
   새 도구를 넣으려면 아래 T에 한 묶음 더한다: name, does(하는 일), now(지금 규칙·기본값), items([바꿀 점, 예시]), note(주의, 선택). */
(function () {
  var SITE = 'https://jahwalktg.github.io/welfare-tools/';
  var T = {
    'easy-notice': {
      name: '쉬운 안내문 만들기',
      does: '안내문을 붙이면 긴 문장·어려운 말·낙인이 될 수 있는 말을 표시하고, 눌러서 쉬운 말로 바꿉니다. 큰 글자 인쇄와 AI 주문서 복사.',
      now: ['긴 문장 기준: 40자 넘으면 노랑, 60자 넘으면 빨강(화면에서 고칠 수 있음)', '공문·기안 점검 모드: 항목 기호 순서, 날짜·시각·금액 표기, 붙임·끝 표시(행정업무의 운영 및 혁신에 관한 규정과 시행규칙 기준)', '사전 215개(국립국어원 자료에서 확인한 것과 현장 말을 꼬리표로 구분)', '점수·등급 없음, 표시 개수만'],
      items: [['우리 기관 낱말', '예: 우리 기관에서 자주 쓰는 어려운 말과 바꿀 말 목록을 처음부터 넣기'], ['긴 문장 기준', '예: 어르신 안내문은 30자·45자'], ['인쇄 모양', '예: 기관 로고 자리, 아래쪽에 문의 전화 크게'], ['표시 종류', '예: 숫자로 적은 날짜·시각 표시는 빼기']],
      note: '실제 이용자 이름·연락처가 든 안내문은 AI에 올리지 마세요.'
    },
    'work-board': {
      name: '업무 정리판 — 인수인계서·업무분장표',
      does: '맡은 업무를 한 번 적으면 인수인계서, 업무분장표, 한 해 달력이 함께 나옵니다.',
      now: ['업무 칸: 업무·주기·시기·담당·부담당·하는 일·파일 위치·관련 기관·주의할 점·진행 중인 일', '인수인계서는 네 부분(한눈에 · 업무별 자세히 · 진행 중인 일 · 확인)', '이 브라우저에만 저장, 파일로 내보내기·불러오기'],
      items: [['우리 기관 인수인계 서식', '예: 서식의 칸 순서대로, 결재란 네 칸'], ['업무 칸 더하기', '예: 예산 과목, 관련 규정, 걸리는 시간'], ['업무분장표 모양', '예: 팀별로 묶기, 직급 칸 더하기'], ['달력', '예: 회계연도 기준으로 3월부터']],
      note: '실제 직원 이름은 AI에 적지 마세요. 직함으로 적으면 됩니다.'
    },
    'phone': {
      name: '전화 응대판',
      does: '기관 이름·부서를 넣으면 기본 멘트 여덟 가지가 만들어지고, 고쳐서 전화기 옆 한 장(A4)과 전화 메모지(4장·6장)를 인쇄합니다.',
      now: ['기본 멘트 8개: 첫 인사·담당자가 없을 때·돌려 드릴 때·메모 받을 때·잘 못 들었을 때·기다리시게 할 때·답을 모를 때·끝 인사', '우리 기관 매뉴얼 칸 4개(통화가 길어질 때·언성이 높아질 때·같은 전화가 반복될 때·감당하기 어려울 때)는 빈칸이고 기관이 채움', '내선 번호표 12줄까지, 글자 크기 3단계, 메모지 4장·6장', '기관 정보와 고친 멘트만 그 브라우저에 저장'],
      items: [['우리 기관 멘트를 처음부터 넣기', '예: 첫 인사를 「행복을 나누는 ○○복지관입니다」로'], ['상황 카드 더하기', '예: 후원 문의, 프로그램 신청 문의, 자원봉사 문의'], ['메모지 칸', '예: 「처리 결과」 칸 더하기, 기관 로고 자리'], ['내선 번호표', '예: 우리 부서·내선을 처음부터 넣기, 「담당 업무」 칸 더하기'], ['인쇄 모양', '예: 가로 방향, 매뉴얼 칸을 더 크게, A5 두 장']],
      note: '폭언·반복 민원의 대응 절차는 AI가 지어내게 하지 말고, 기관 매뉴얼에 있는 문장만 옮겨 적으세요. 전화하신 분과 직원의 이름·번호는 주문서에 적지 마세요.'
    },
    'eval-folders': {
      name: '평가 서류철·폴더 만들기',
      does: '평가 지표 목록(번호·이름·영역)을 붙여 넣으면 지표마다 빈 PC 폴더 묶음(zip), 서류철 옆면·인덱스 탭 라벨, 목차 표지, 매달 30분 점검표를 만듭니다. 지표의 내용·배점은 다루지 않습니다.',
      now: ['폴더 이름: 번호_이름 / 번호만 / 영역 폴더 아래, 길이 30·40·60·100글자, 쓸 수 없는 글자는 ·나 -로 바꿈', '하위 폴더: 없음 / 연도별 / 1_계획·2_실행·3_평가·환류 / 직접 적기, 지표 폴더마다 「이 폴더에 넣을 것.txt」', '라벨: 옆면 2×7칸·인덱스 탭 5×12칸이 기본(여백 8mm, 간격 2mm), 영역별 색 8가지, 글자 크기 자동 맞춤', '점검표: 지표 × 12달, 매달 마지막 주 30분. 목록은 그 브라우저에만 저장'],
      items: [['우리 기관 하위 폴더', '예: 1_규정, 2_회의록, 3_사진, 4_결과보고가 기본으로'], ['우리가 쓰는 라벨지', '예: 등 라벨 3×8칸, 위 여백 13mm, 칸 사이 2mm'], ['점검 주기', '예: 매달 대신 분기 4칸, 또는 둘째 주 수요일'], ['표지·라벨에 넣을 것', '예: 기관 로고 자리, 담당 부서 칸, 보존 기간']],
      note: '지표 이름과 번호는 그해 평가 매뉴얼에서 직접 가져오세요. AI에게 지표 내용을 지어내게 하지 마세요.'
    },
    'leave-tracker': {
      name: '휴가 관리기',
      does: '직원 이름과 입사일로 연차가 자동 계산되고, 휴가를 기록하면 남은 날을 보여 줍니다.',
      now: ['근로기준법 기준: 1년 미만 매월 1일(최대 11일), 1년 이상 15일, 3년차부터 2년마다 1일 더해 최대 25일', '기준: 입사일 또는 회계연도(1월 1일~12월 31일)', '휴가 사유는 적지 않게 안내, 기록은 그 브라우저에만'],
      items: [['연차 기준', '예: 회계연도 기준, 입사 첫해는 비례 계산'], ['특별휴가 종류와 일수', '예: 경조사(결혼 5일·조사 3~5일), 병가 연 30일, 공가'], ['반차 단위', '예: 반차 0.5일, 반반차 0.25일'], ['칸 더하기', '예: 부서·직급 칸, 대체휴무']],
      note: '실제 직원 이름·입사일은 AI에 적지 마세요. 고친 파일을 기관에서 열어 그때 넣으면 됩니다.'
    },
    'repeat-checklist': {
      name: '할 일 체크리스트',
      does: '매일·매주·매달 반복하는 업무를 등록하면 오늘 할 일과 밀린 일을 보여 주고 체크합니다.',
      now: ['처음 목록 7개: 출석 확인·프로그램 일지·공문 확인(매일), 직원회의 자료(월)·주간 실적(금), 월 실적보고(1일, 5일 전부터), 지출 결의서 마감(말일, 3일 전부터)'],
      items: [['우리 기관 반복 업무 목록', '예: 매주 화 사례회의, 매달 25일 급여 마감, 매달 10일 운영보고'], ['공휴일 처리', '예: 마감일이 쉬는 날이면 앞 근무일로'], ['담당자 칸', '예: 업무마다 담당 이름(직함)'], ['분기·연 단위 업무', '예: 분기 보조금 정산, 연 1회 사업계획·후원금 결과보고']]
    },
    'date-calc': {
      name: '날짜·기간·만 나이 계산기',
      does: '만 나이와 자격 연령, 기간의 일수·개월 수·평일 수, N개월·평일 N일 뒤 날짜를 계산하고, 명단에 만 나이를 붙여 대상자를 고릅니다.',
      now: ['나이 기준 칩(근거 문서 표시, 화면에서 고칠 수 있음)', '공휴일 2026년 + 2027년(예상), 화면에서 고칠 수 있음', '기간은 첫날·끝날 포함이 기본'],
      items: [['나이 기준 더하기·고치기', '예: 만 65세 이상 노인, 만 18세 미만 아동, 만 50세 이상 중장년'], ['기관 휴무일', '예: 창립기념일 매년 5월 20일'], ['기간 기본 방식', '예: 첫날 빼기가 기본'], ['명단 결과 칸', '예: 부서 칸 기준으로 묶어 보기']]
    },
    'labels': {
      name: '우편 주소 라벨 인쇄',
      does: '명단(엑셀·붙여넣기)으로 A4 스티커 용지나 시판 라벨지에 주소 라벨을 인쇄합니다.',
      now: ['용지: A4 칸 나누기(가로·세로 칸 수·여백·간격, 자르는 선) 또는 시판 규격 7가지', '이름 뒤 「님」 기본, 보내는 곳 줄 선택, 인쇄 밀림 보정'],
      items: [['우리가 쓰는 라벨지', '예: 3×8칸 24칸, 위 여백 13mm, 칸 사이 2mm'], ['보내는 곳 기본값', '예: 기관 이름·주소·우편번호·전화'], ['이름 뒤 기본', '예: 「귀하」'], ['글자 크기·글꼴', '예: 이름 14pt 굵게']],
      note: '「우편번호 채우기」는 원래 사이트 주소에서만 동작합니다(인증키가 사이트 주소에 묶여 있음). 고친 파일에서는 우편번호를 엑셀에 미리 넣어 두세요.'
    },
    'greeting': {
      name: '인사장·초대장 만들기',
      does: '새해·송년·설·추석·감사 인사장과 초대장을 디자인을 골라 그림(PNG)으로 만들고, 받는 분 이름을 넣어 여러 장을 한 번에 받습니다.',
      now: ['종류 6가지, 디자인 8가지, 종류마다 기본 인사말 2~4개', '글꼴 고딕·명조·손글씨, 크기 정사각·세로·가로 엽서'],
      items: [['기관 이름·로고 기본', '예: 아래쪽에 ○○복지관과 로고가 늘 들어가게'], ['우리 기관 인사말', '예: 기관장 인사 문구 3가지'], ['기관 색', '예: 주황 #F28C28 바탕 디자인 하나 더'], ['자주 쓰는 초대장 기본 내용', '예: 장소·오시는 길·회신 전화']]
    },
    'safety': {
      name: '안전 표지·게시물',
      does: '산업안전보건법 시행규칙 기준 안전보건표지 43종, 사업장 꾸러미, 비상연락망·경영방침 등 게시물을 인쇄합니다.',
      now: ['표지 43종(별표 6~9 기준으로 직접 그림), 사업장 꾸러미 8종(사무실·청소·세차·식당·조립가공·편의점·목욕탕·배송)', '게시물 7종: 경영방침·비상연락망·대피 안내·위험성평가·MSDS·작업 전 점검표·아차사고 제보'],
      items: [['우리 사업장 꾸러미', '예: 「급식실」 — 하는 일·쓰는 약품·필요한 표지'], ['비상연락망 기본값', '예: 기관 대표번호, 가까운 병원(번호), 담당은 직함으로'], ['경영방침 문구', '예: 우리 기관 안전보건 방침과 목표'], ['위험성평가 예시', '예: 우리 사업장 위험요인·감소대책 더하기']],
      note: '개인 휴대폰 번호는 AI에 적지 말고, 고친 파일에서 직접 넣으세요.'
    }
  };

  var seg = location.pathname.split('/').filter(Boolean);
  var last = seg[seg.length - 1] || '';
  var dir = /\.html?$/.test(last) ? seg[seg.length - 2] : last;
  var C = T[dir];
  if (!C) return;

  var css = '.jt-rm-btn{display:inline-flex;align-items:center;gap:6px;min-height:36px;padding:0 12px;border-radius:999px;border:1.5px solid var(--line,#D5DCE8);background:var(--surface,#fff);color:var(--text,#1A2233);font:inherit;font-size:14px;font-weight:700;cursor:pointer}' +
    '.jt-rm-btn:hover{border-color:var(--blue,#1A6EFF)}.jt-rm-wrap{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 10px}' +
    '.jt-rm{position:fixed;inset:0;z-index:1000;background:rgba(10,18,40,.55);display:flex;align-items:flex-start;justify-content:center;padding:16px;overflow-y:auto}' +
    '.jt-rm[hidden]{display:none}' +
    '.jt-rm .box{width:100%;max-width:760px;background:var(--surface,#fff);color:var(--text,#1A2233);border-radius:16px;padding:18px;border:1.5px solid var(--line,#D5DCE8);box-shadow:0 10px 40px rgba(0,0,0,.25)}' +
    '.jt-rm h2{margin:0 0 6px;font-size:21px}.jt-rm h3{margin:16px 0 6px;font-size:17px}' +
    '.jt-rm p,.jt-rm li{font-size:15px;line-height:1.6}.jt-rm .muted{color:var(--muted,#5A6478)}' +
    '.jt-rm ol.steps{margin:6px 0 0;padding-left:22px}' +
    '.jt-rm .it{display:grid;grid-template-columns:auto 1fr;gap:4px 10px;align-items:start;padding:8px 0;border-top:1px solid var(--line,#D5DCE8)}' +
    '.jt-rm .it input[type=checkbox]{width:20px;height:20px;margin-top:3px}' +
    '.jt-rm .it b{font-size:15px}.jt-rm .it input[type=text]{grid-column:2;width:100%;min-height:40px;padding:6px 10px;border-radius:8px;border:1.5px solid var(--line,#D5DCE8);background:var(--surface,#fff);color:inherit;font:inherit;font-size:15px}' +
    '.jt-rm textarea{width:100%;min-height:80px;padding:8px 10px;border-radius:8px;border:1.5px solid var(--line,#D5DCE8);background:var(--surface,#fff);color:inherit;font:inherit;font-size:15px}' +
    '.jt-rm textarea.pr{min-height:220px;font-size:14px;line-height:1.55}' +
    '.jt-rm .org{width:100%;min-height:42px;padding:6px 10px;border-radius:8px;border:1.5px solid var(--line,#D5DCE8);background:var(--surface,#fff);color:inherit;font:inherit}' +
    '.jt-rm .acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}' +
    '.jt-rm .acts button{min-height:44px;padding:0 14px;border-radius:10px;border:1.5px solid var(--line,#D5DCE8);background:var(--surface,#fff);color:inherit;font:inherit;font-weight:700;cursor:pointer}' +
    '.jt-rm .acts button.main{background:var(--blue,#1A6EFF);border-color:var(--blue,#1A6EFF);color:var(--btn-text,#fff)}' +
    '.jt-rm .warn{margin:10px 0 0;padding:10px 12px;border-radius:10px;background:var(--amber-bg,#FFF1CC);border:1.5px solid var(--amber-line,#E5B93C);font-size:14px}' +
    '.jt-rm .ok{font-size:14px;font-weight:700;color:var(--green,#1F8A4C);min-height:20px;margin:8px 0 0}' +
    '@media print{.jt-rm,.jt-rm-btn,.jt-rm-wrap{display:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var KEY = 'welfare-tools.remake.org';
  function lsGet() { try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } }
  function lsSet(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  var fileName = C.name.replace(/[\\/:*?"<>|·]/g, '_').replace(/\s+/g, '_') + '_우리기관용.html';

  /* ---------- 창 ---------- */
  var M = el('div', 'jt-rm'); M.hidden = true; M.setAttribute('role', 'dialog'); M.setAttribute('aria-modal', 'true'); M.setAttribute('aria-label', '내 기관에 맞게 다시 만들기');
  var B = el('div', 'box'); M.appendChild(B);
  B.appendChild(el('h2', null, '내 기관에 맞게 다시 만들기'));
  B.appendChild(el('p', 'muted', '이 도구 파일과 주문서를 AI(Claude·ChatGPT·Gemini 등)에 함께 올리면, AI가 우리 기관 규칙으로 고친 파일을 돌려줍니다. 고친 파일은 기관 PC나 공유 폴더에 두고 더블클릭해서 씁니다. 이 사이트는 바뀌지 않고, 이 창은 아무것도 인터넷으로 보내지 않습니다.'));
  var steps = el('ol', 'steps', '<li>아래에서 <b>우리 기관에서 다른 점</b>을 고르고 짧게 적습니다.</li><li><b>「이 도구 파일 받기」</b>와 <b>「주문서 복사」</b>를 누릅니다.</li><li>AI 대화창에 받은 파일을 올리고 주문서를 붙여 넣습니다.</li><li>AI가 돌려준 파일을 <b>.html</b>로 저장해 열고, AI가 알려 준 확인 예시로 맞는지 봅니다.</li>');
  B.appendChild(steps);
  if (window.JT_VIDEOS) { var vp = el('p', 'jt-vid', '<a href="' + window.JT_VIDEOS.url(44) + '" target="_blank" rel="noopener" title="유튜브에서 사용법 영상 보기 (새 창)">사용법 영상 <small>유튜브</small></a>'); B.appendChild(vp); }
  if (C.note) B.appendChild(el('p', 'warn', esc(C.note)));
  B.appendChild(el('h3', null, '우리 기관 이름 (선택)'));
  var org = el('input', 'org'); org.type = 'text'; org.placeholder = '예: ○○복지관 — 화면 제목·인쇄물에 들어갑니다'; org.value = lsGet(); B.appendChild(org);
  B.appendChild(el('h3', null, '바꿀 점 고르기'));
  var itemBox = el('div'); B.appendChild(itemBox);
  var rows = C.items.map(function (it) {
    var r = el('label', 'it'); var cb = el('input'); cb.type = 'checkbox';
    var t = el('b', null, esc(it[0])); var inp = el('input'); inp.type = 'text'; inp.placeholder = it[1];
    inp.addEventListener('input', function () { cb.checked = inp.value.trim() !== '' || cb.checked; build(); });
    cb.addEventListener('change', build);
    r.appendChild(cb); r.appendChild(t); r.appendChild(inp); itemBox.appendChild(r);
    return { name: it[0], ex: it[1], cb: cb, inp: inp };
  });
  B.appendChild(el('h3', null, '그 밖에 바꾸고 싶은 점'));
  var etc = el('textarea'); etc.placeholder = '예: 버튼 글자를 더 크게, 인쇄할 때 기관 로고가 위에 나오게'; B.appendChild(etc);
  B.appendChild(el('p', 'warn', '이용자·직원의 실제 이름, 연락처, 주민번호는 주문서에 적지 마세요. 규칙과 숫자만 적고, 사람 정보는 고친 파일을 기관에서 열어 넣습니다.'));
  B.appendChild(el('h3', null, '주문서 (고쳐도 됩니다)'));
  var pr = el('textarea', 'pr'); pr.spellcheck = false; B.appendChild(pr);
  var acts = el('div', 'acts');
  var bFile = el('button', 'main', '이 도구 파일 받기'); bFile.type = 'button';
  var bCopy = el('button', 'main', '주문서 복사'); bCopy.type = 'button';
  var bClose = el('button', null, '닫기'); bClose.type = 'button';
  acts.appendChild(bFile); acts.appendChild(bCopy); acts.appendChild(bClose); B.appendChild(acts);
  var okMsg = el('p', 'ok'); okMsg.setAttribute('role', 'status'); B.appendChild(okMsg);
  B.appendChild(el('p', 'muted', '답이 길어 중간에 끊기면 AI에 「이어서」라고 쓰세요. 파일 올리기가 안 되는 AI라면 받은 파일을 메모장으로 열어 전체를 복사해 주문서 아래에 붙이세요. 받는 파일은 크기를 줄이려고 캐릭터 그림을 빈 그림으로 바꿔 둡니다.'));
  document.body.appendChild(M);

  function build() {
    var o = org.value.trim(); lsSet(o);
    var pick = rows.filter(function (r) { return r.cb.checked; });
    var L = [];
    L.push('당신은 HTML·JavaScript 파일을 고치는 개발 도우미입니다. 첨부한 「' + fileName + '」은 무료 공개 도구 「사회복지사 업무 도구」(' + SITE + ')의 「' + C.name + '」 화면입니다. 이 파일을 ' + (o ? '「' + o + '」' : '우리 기관') + '에 맞게 고쳐 주세요.');
    L.push('');
    L.push('[이 도구가 하는 일]');
    L.push(C.does);
    L.push('');
    L.push('[지금 들어 있는 규칙·기본값]');
    C.now.forEach(function (x) { L.push('- ' + x); });
    L.push('');
    L.push('[우리 기관에 맞게 바꿀 점]');
    if (o) L.push('- 기관 이름: 화면 제목과 인쇄물의 기관 이름을 「' + o + '」로');
    if (!pick.length && !etc.value.trim() && !o) L.push('- (아직 고르지 않음 — 위 창에서 고르거나 여기에 직접 적어 주세요)');
    pick.forEach(function (r, i) { var v = r.inp.value.trim(); L.push((i + 1) + '. ' + r.name + ': ' + (v || '(우리 기관 방식으로 — 고치기 전에 어떻게 할지 저에게 물어봐 주세요)')); });
    if (etc.value.trim()) { L.push('- 그 밖에: ' + etc.value.trim().replace(/\n+/g, ' / ')); }
    L.push('');
    L.push('[꼭 지켜 주세요]');
    L.push('1. 결과는 지금처럼 HTML 파일 하나로, 더블클릭하면 인터넷 창에서 바로 열려야 합니다.');
    L.push('2. 입력한 내용을 인터넷으로 보내는 코드를 넣지 마세요. 원래 있던 외부 라이브러리 주소(cdnjs·jsdelivr 등)는 그대로 두세요.');
    L.push('3. 위에서 바꾸라고 한 곳 말고는 화면·계산·문구를 바꾸지 마세요. 파일 앞쪽 공통 함수와 빈 그림 자리도 그대로 두세요.');
    L.push('4. 예시 자료에 실제 사람 이름·연락처·주민번호를 넣지 마세요(가상 이름과 ○○ 사용).');
    L.push('5. 화면 글은 한국어 쉬운 말로 쓰세요.');
    L.push('6. 바꿀 점이 분명하지 않으면 고치기 전에 질문을 3개 안에서 먼저 하세요.');
    L.push('7. 코드를 줄이거나 「…생략」으로 빼지 말고 파일 전체를 주세요. 길어서 끊기면 제가 「이어서」라고 하겠습니다.');
    L.push('');
    L.push('[돌려줄 것]');
    L.push('1. 고친 HTML 파일 전체 (파일로 줄 수 있으면 파일로, 안 되면 코드 블록 하나로)');
    L.push('2. 바꾼 곳 목록 (무엇을 → 어떻게)');
    L.push('3. 제가 넣어 볼 확인 예시 2~3개와 그때 나와야 할 결과');
    pr.value = L.join('\n');
  }
  org.addEventListener('input', build);
  etc.addEventListener('input', build);

  function open() { build(); okMsg.textContent = ''; M.hidden = false; document.documentElement.style.overflow = 'hidden'; setTimeout(function () { org.focus(); }, 30); }
  function close() { M.hidden = true; document.documentElement.style.overflow = ''; if (btn) btn.focus(); }
  bClose.addEventListener('click', close);
  M.addEventListener('click', function (e) { if (e.target === M) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !M.hidden) close(); });

  bCopy.addEventListener('click', function () {
    var t = pr.value;
    function fb() { pr.select(); try { document.execCommand('copy'); } catch (e) {} }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(t).catch(fb); else fb();
    okMsg.textContent = '주문서를 복사했습니다. AI 대화창에 파일을 올리고 붙여 넣으세요.';
  });

  /* 이 도구 파일: 같은 주소의 원본을 다시 읽어 정리 */
  var TINY = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  function abs(p) { return SITE + p.replace(/^\.\.\//, ''); }
  bFile.addEventListener('click', function () {
    okMsg.textContent = '파일을 준비하는 중…';
    var page = location.href.split('#')[0].split('?')[0];
    Promise.all([
      fetch(page, { cache: 'no-store' }).then(function (r) { if (!r.ok) throw 0; return r.text(); }),
      fetch('../drop.js', { cache: 'no-store' }).then(function (r) { return r.ok ? r.text() : ''; }).catch(function () { return ''; }),
      fetch('../rates.js', { cache: 'no-store' }).then(function (r) { return r.ok ? r.text() : ''; }).catch(function () { return ''; })
    ]).then(function (res) {
      var h = res[0], drop = res[1], rates = res[2];
      h = h.replace(/data:image\/[a-z+]+;base64,[A-Za-z0-9+\/=]{2000,}/g, TINY);
      h = h.replace(/<script src="\.\.\/drop\.js"><\/script>/, drop ? '<script>\n' + drop.replace(/<\/script/gi, '<\\/script') + '\n</script>' : '');
      h = h.replace(/<script src="\.\.\/rates\.js"><\/script>/, rates ? '<script>\n' + rates.replace(/<\/script/gi, '<\\/script') + '\n</script>' : '');
      h = h.replace(/<script src="\.\.\/(videos|remake)\.js"><\/script>\s*/g, '');
      h = h.replace(/(href|src)="(\.\.\/[^"#]*)/g, function (m, a, p) { return a + '="' + abs(p); });
      h = h.replace(/<html([^>]*)>/i, '<html$1>\n<!-- 원본: ' + page.replace(/^https?:\/\/[^/]+\//, SITE) + ' · 받은 날 ' + new Date().toISOString().slice(0, 10) + ' · 「내 기관에 맞게 다시 만들기」용 사본(캐릭터 그림은 빈 그림으로 바꿈) -->');
      var blob = new Blob([h], { type: 'text/html;charset=utf-8' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fileName;
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 3000);
      okMsg.textContent = '「' + fileName + '」을 받았습니다 (' + Math.round(blob.size / 1024) + 'KB). 이제 주문서를 복사하세요.';
    }).catch(function () {
      okMsg.textContent = '파일을 읽지 못했습니다. 이 화면에서 Ctrl+S(다른 이름으로 저장 › 웹 페이지, HTML만)로 저장해도 됩니다.';
    });
  });

  /* ---------- 단추 ---------- */
  var btn = el('button', 'jt-rm-btn', '🛠 내 기관에 맞게 다시 만들기'); btn.type = 'button';
  btn.title = '이 도구를 우리 기관 규칙으로 고쳐 쓰기 — AI에 붙일 주문서와 도구 파일';
  btn.addEventListener('click', open);
  function place() {
    var row = document.querySelector('.jt-vid');
    if (row) { row.appendChild(btn); return; }
    var h = document.querySelector('h1'); if (!h) return;
    var w = el('p', 'jt-rm-wrap'); w.appendChild(btn); h.insertAdjacentElement('afterend', w);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', place); else place();
  window.JT_REMAKE = { tools: T, open: open };
})();
