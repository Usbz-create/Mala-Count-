const counterBtn = document.getElementById('counter');
const resetBtn = document.getElementById('reset');
const setBtn = document.getElementById('setcount');
const STORAGE_KEY = 'malaCount';

let count = 0;

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

counterBtn.addEventListener('click', function () {
    count = count + 1;
    render();
});

resetBtn.addEventListener('click', function () {
    if (count === 0) return;
    if (confirm('Reset the count to 0?')) {
        count = 0;
        render();
    }
});

setBtn.addEventListener('click', function () {
    const input = prompt('Enter the current count:', count);
    if (input === null) return; // cancelled
    const value = parseInt(input.trim(), 10);
    if (isNaN(value) || value < 0) {
        alert('Please enter a number like 22356');
        return;
    }
    count = value;
    render();
});

render();
