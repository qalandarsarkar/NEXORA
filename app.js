// Ensure DOM is fully loaded before running logic
document.addEventListener('DOMContentLoaded', () => {
    
    /* ===== STARS BACKGROUND ===== */
    const stars = document.getElementById('stars');
    if (stars) {
        for (let i = 0; i < 80; i++) {
            let star = document.createElement('div');
            star.classList.add('star');
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 5 + 's';
            stars.appendChild(star);
        }
    }

    /* ===== GAME CORE LOGIC ===== */
    let coins = parseInt(localStorage.getItem('nexora_coins')) || 0;
    let energy = parseInt(localStorage.getItem('nexora_energy')) || 100;
    let maxEnergy = parseInt(localStorage.getItem('nexora_max_energy')) || 100;
    let tapValue = parseInt(localStorage.getItem('nexora_tap_value')) || 1;

    const coinsEl = document.getElementById('coins');
    const energyText = document.getElementById('energyText');
    const fill = document.getElementById('fill');
    const tapBtn = document.getElementById('tapBtn');
    const rank = document.getElementById('rank');
    const loadingScreen = document.getElementById('loadingScreen');

    function updateUI() {
        if (coinsEl) coinsEl.innerText = coins.toLocaleString();
        if (energyText) energyText.innerText = energy + '/' + maxEnergy;
        if (fill) fill.style.width = (energy / maxEnergy * 100) + '%';
        if (rank) {
            if (coins >= 10000) rank.innerText = 'Legend';
            else if (coins >= 5000) rank.innerText = 'Master';
            else if (coins >= 2000) rank.innerText = 'Pro';
            else if (coins >= 500) rank.innerText = 'Elite';
            else rank.innerText = 'Rookie';
        }
        localStorage.setItem('nexora_coins', coins);
        localStorage.setItem('nexora_energy', energy);
    }

    // Tap Event
    if (tapBtn) {
        tapBtn.addEventListener('click', (e) => {
            if (energy >= tapValue) {
                coins += tapValue;
                energy -= tapValue;
                updateUI();
            }
        });
    }

    // Regen Engine
    setInterval(() => {
        if (energy < maxEnergy) {
            energy++;
            updateUI();
        }
    }, 1500);

    // Initial Load - Force Remove Loading Screen
    setTimeout(() => {
        updateUI();
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.style.display = 'none', 500);
        }
    }, 1000);
});

// Screen Switcher
function switchScreen(screenId, element) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + screenId).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
}
