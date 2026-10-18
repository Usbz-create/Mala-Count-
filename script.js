const counterBtn = document.getElementById('counter');
const resetBtn = document.getElementById('reset');
const setBtn = document.getElementById('setcount');
const overlay = document.getElementById('overlay');
const modalText = document.getElementById('modalText');
const modalInput = document.getElementById('modalInput');
const modalError = document.getElementById('modalError');
const modalOk = document.getElementById('modalOk');
const modalCancel = document.getElementById('modalCancel');
const STORAGE_KEY = 'malaCount';

let count = 0;
let mode = null; // 'set' or 'reset'

// Load the saved count (so a refresh doesn't lose progress)
try {
    count = parseInt(localStorage.getItem(STORAGE_KEY), 10) || 0;
} catch (e) {}

function render() {
    counterBtn.textContent = count;
    try {
        localStorage.setItem(STORAGE_KEY, count);
    } catch (e) {}
}

function openModal(newMode) {
    mode = newMode;
    modalError.textContent = '';
    if (mode === 'set') {
        modalText.textContent = 'Enter the current count';
        modalInput.hidden = false;
        modalInput.value = count;
    } else {
        modalText.textContent = 'Reset the count to 0?';
        modalInput.hidden = true;
    }
    overlay.hidden = false;
    if (mode === 'set') {
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
    count = count + 1;
    render();
});

resetBtn.addEventListener('click', function () {
    if (count === 0) return;
    openModal('reset');
});

setBtn.addEventListener('click', function () {
    openModal('set');
});

modalCancel.addEventListener('click', closeModal);

modalOk.addEventListener('click', function () {
    if (mode === 'set') {
        const value = parseInt(modalInput.value, 10);
        if (isNaN(value) || value < 0) {
            modalError.textContent = 'Please enter a number like 22356';
            return;
        }
        count = value;
    } else if (mode === 'reset') {
        count = 0;
    }
    render();
    closeModal();
});

modalInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') modalOk.click();
});

render();
