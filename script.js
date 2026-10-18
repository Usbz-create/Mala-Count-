const counterBtn = document.getElementById('counter');
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
render();
