(() => {
  'use strict';
  const KEY = 'bao-ve-app-v1';
  const ROUTE = ['Cổng chính', 'Bãi giữ xe', 'Sảnh tòa nhà', 'Phòng điện – kỹ thuật', 'Tầng thượng', 'Cổng sau'];
  const LEVELS = { low: 'Mức nhẹ', mid: 'Mức vừa', high: 'Khẩn cấp' };

  const defaults = () => ({ guard: '', shiftStart: null, round: ROUTE.map(() => null), incidents: [], visitors: [] });
  let state = load();

  function load() {
    try { return Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY))); }
    catch { return defaults(); }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }

  const $ = (id) => document.getElementById(id);
  const hhmm = (iso) => new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let toastTimer;
  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  // Đồng hồ
  function tick() {
    const now = new Date();
    $('clock').textContent = now.toLocaleTimeString('vi-VN', { hour12: false });
    $('date').textContent = now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  setInterval(tick, 1000); tick();

  // Ca trực
  function renderShift() {
    const on = !!state.shiftStart;
    $('guardName').value = state.guard;
    $('guardName').disabled = on;
    $('shiftBtn').textContent = on ? 'Bàn giao ca' : 'Nhận ca';
    $('shiftBtn').className = 'btn ' + (on ? 'end' : 'primary');
    $('shiftInfo').textContent = on ? `${state.guard} – nhận ca lúc ${hhmm(state.shiftStart)}` : 'Chưa nhận ca';
  }
  $('shiftBtn').addEventListener('click', () => {
    if (!state.shiftStart) {
      const name = $('guardName').value.trim();
      if (!name) { toast('Nhập họ tên trước khi nhận ca'); $('guardName').focus(); return; }
      state.guard = name; state.shiftStart = new Date().toISOString();
      toast('Đã nhận ca');
    } else {
      const s = `${state.incidents.length} sự cố, ${state.visitors.length} lượt khách, ${state.round.filter(Boolean).length}/${ROUTE.length} điểm tuần tra`;
      if (!confirm(`Bàn giao ca?\nTổng kết: ${s}.\nNhật ký ca này sẽ được xóa.`)) return;
      state = defaults();
      toast('Đã bàn giao ca');
    }
    save(); renderAll();
  });

  // Tuần tra
  function renderPatrol() {
    const done = state.round.filter(Boolean).length;
    const pct = Math.round((done / ROUTE.length) * 100);
    $('bar').style.width = pct + '%';
    document.querySelector('.progress').setAttribute('aria-valuenow', pct);
    $('progressText').textContent = done === ROUTE.length ? 'Đã hoàn thành vòng tuần tra.' : `Đã qua ${done}/${ROUTE.length} điểm.`;
    $('checkpoints').innerHTML = ROUTE.map((name, i) => {
      const t = state.round[i];
      return `<li class="cp ${t ? 'done' : ''}">
        <span class="name">${name}</span>
        ${t ? `<span class="time">${hhmm(t)}</span>` : `<button class="btn" data-cp="${i}">Điểm danh</button>`}
      </li>`;
    }).join('');
  }
  $('checkpoints').addEventListener('click', (e) => {
    const i = e.target.dataset.cp;
    if (i === undefined) return;
    if (!state.shiftStart) { toast('Hãy nhận ca trước'); return; }
    state.round[i] = new Date().toISOString();
    save(); renderPatrol();
    toast(`Đã điểm danh: ${ROUTE[i]}`);
  });
  $('resetRound').addEventListener('click', () => {
    state.round = ROUTE.map(() => null);
    save(); renderPatrol(); toast('Bắt đầu vòng tuần tra mới');
  });

  // Sự cố
  function renderIncidents() {
    $('cntInc').textContent = state.incidents.length;
    $('incList').innerHTML = state.incidents.length ? state.incidents.map((x, i) => `
      <li class="entry ${x.level}">
        <strong>${esc(x.type)} – ${esc(x.place)}</strong>
        <small>${hhmm(x.time)} · ${LEVELS[x.level]}</small>
        <p>${esc(x.desc)}</p>
        <div class="actions"><button class="btn ghost" data-del-inc="${i}">Xóa</button></div>
      </li>`).join('') : '<li class="empty">Chưa có sự cố nào trong ca.</li>';
  }
  $('incForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!state.shiftStart) { toast('Hãy nhận ca trước'); return; }
    state.incidents.unshift({
      type: $('incType').value, place: $('incPlace').value.trim(),
      level: $('incLevel').value, desc: $('incDesc').value.trim(), time: new Date().toISOString()
    });
    e.target.reset(); save(); renderIncidents(); toast('Đã ghi sự cố');
  });
  $('incList').addEventListener('click', (e) => {
    const i = e.target.dataset.delInc;
    if (i === undefined || !confirm('Xóa sự cố này?')) return;
    state.incidents.splice(i, 1); save(); renderIncidents();
  });

  // Khách ra vào
  function renderVisitors() {
    $('cntVis').textContent = state.visitors.length;
    $('visList').innerHTML = state.visitors.length ? state.visitors.map((v, i) => `
      <li class="entry vis">
        <strong>${esc(v.name)}${v.id ? ' · ' + esc(v.id) : ''}</strong>
        <small>Gặp: ${esc(v.to)}</small>
        <p>Vào ${hhmm(v.in)}${v.out ? ` – ra ${hhmm(v.out)}` : ' – đang ở trong'}</p>
        ${v.out ? '' : `<div class="actions"><button class="btn ghost" data-out="${i}">Ghi khách ra</button></div>`}
      </li>`).join('') : '<li class="empty">Chưa có khách nào trong ca.</li>';
  }
  $('visForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!state.shiftStart) { toast('Hãy nhận ca trước'); return; }
    state.visitors.unshift({
      name: $('visName').value.trim(), id: $('visId').value.trim(),
      to: $('visTo').value.trim(), in: new Date().toISOString(), out: null
    });
    e.target.reset(); save(); renderVisitors(); toast('Đã ghi khách vào');
  });
  $('visList').addEventListener('click', (e) => {
    const i = e.target.dataset.out;
    if (i === undefined) return;
    state.visitors[i].out = new Date().toISOString();
    save(); renderVisitors(); toast('Đã ghi khách ra');
  });

  // Tab
  document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => {
      const active = t === tab;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active);
      $('tab-' + t.dataset.tab).hidden = !active;
    });
  }));

  function renderAll() { renderShift(); renderPatrol(); renderIncidents(); renderVisitors(); }
  renderAll();
})();
