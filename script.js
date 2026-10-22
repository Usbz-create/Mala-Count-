// ---- Settings you can change ----
const BEADS_PER_MALA = 108;     // only used once, to convert old bead counts to malas
const SECONDS_PER_MALA = 180;   // used for the "time left" estimate
const DEFAULT_TARGET = 1200;    // in malas

// v5 stores malas. Old keys (v3/v4) stored beads and are only read for the one-time conversion.
const KEYS = { saved: 'malaSavedM', session: 'malaSessionM', target: 'malaTarget' };

const $ = (id) => document.getElementById(id);
const counterBtn = $('counter');
const overlay = $('overlay');
const modalText = $('modalText');
const modalInput = $('modalInput');
const modalError = $('modalError');

function read(key) {
    try {
        const v = parseInt(localStorage.getItem(key), 10);
        return isNaN(v) ? null : v;
    } catch (e) { return null; }
}
function write(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
}

// saved   = malas counted in earlier sessions
// session = malas counted since this page was opened
let saved = read(KEYS.saved);
let session = read(KEYS.session) || 0;

if (saved === null) {
    // First time on v5: convert the old bead total into whole malas
    const oldBeads = (read('malaSaved') !== null ? read('malaSaved') : (read('malaCount') || 0))
                   + (read('malaSession') || 0);
    saved = Math.floor(oldBeads / BEADS_PER_MALA);
}
let target = read(KEYS.target) || DEFAULT_TARGET;

// Starting fresh: last visit's session is added to the total
saved += session;
session = 0;
write(KEYS.saved, saved);
write(KEYS.session, session);

let mode = null;
let statusTimer = null;

function timeText(malas) {
    const totalMin = Math.round(malas * SECONDS_PER_MALA / 60);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return h === 0 ? m + ' min' : h + ' h ' + m + ' min';
}

function render() {
    const total = saved + session;
    const left = Math.max(0, target - total);
    const pct = Math.min(100, (total / target) * 100);

    counterBtn.textContent = session;
    $('statTotal').textContent = total.toLocaleString();
    $('statTarget').textContent = target.toLocaleString();
    $('statLeft').textContent = left === 0 ? 'Target reached' : left.toLocaleString();
    $('statTime').textContent = left === 0 ? '0 min' : timeText(left);
    $('bar').style.width = pct + '%';
    $('barText').textContent = pct.toFixed(1) + '%';

    write(KEYS.saved, saved);
    write(KEYS.session, session);
    write(KEYS.target, target);
}

function showStatus(text) {
    const el = $('status');
    el.textContent = text;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(function () { el.textContent = ''; }, 2500);
}

function openModal(newMode) {
    mode = newMode;
    modalError.textContent = '';
    modalInput.hidden = false;
    if (mode === 'total') {
        modalText.textContent = 'Enter the total malas counted so far';
        modalInput.value = saved + session;
    } else if (mode === 'target') {
        modalText.textContent = 'Enter the target number of malas';
        modalInput.value = target;
    } else {
        modalText.textContent = 'Reset this session to 0? Your saved total stays.';
        modalInput.hidden = true;
    }
    overlay.hidden = false;
    if (mode !== 'reset') {
        try {
            modalInput.focus();
            modalInput.select();
        } catch (e) {}
    }
}

function closeModal() {
    overlay.hidden = true;
    mode = null;
}

counterBtn.addEventListener('click', function () {
    session = session + 1;
    render();
});

$('save').addEventListener('click', function () {
    if (session === 0) {
        showStatus('Nothing new to save');
        return;
    }
    saved += session;
    session = 0;
    render();
    showStatus('Saved');
});

$('reset').addEventListener('click', function () {
    if (session === 0) return;
    openModal('reset');
});
$('setTotal').addEventListener('click', function () { openModal('total'); });
$('setTarget').addEventListener('click', function () { openModal('target'); });
$('modalCancel').addEventListener('click', closeModal);

$('modalOk').addEventListener('click', function () {
    if (mode === 'reset') {
        session = 0;
    } else {
        const value = parseInt(modalInput.value, 10);
        const min = mode === 'target' ? 1 : 0;
        if (isNaN(value) || value < min) {
            modalError.textContent = 'Please enter a whole number';
            return;
        }
        if (mode === 'total') {
            saved = value;
            session = 0;
        } else {
            target = value;
        }
    }
    render();
    closeModal();
});

modalInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') $('modalOk').click();
});

render();
