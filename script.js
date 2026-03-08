let balance = 1000000;
let betAmount = 1000;
let betChoice = null;
let bettingTimer = 55;
let revealTimer = 10;
let betLocked = false;
let dice = [0, 0, 0];
let total = 0;
let resultText = "";

const balanceElem = document.getElementById('balance');
const choiceElem = document.getElementById('choice');
const timerElem = document.getElementById('timer');
const lockMessageElem = document.getElementById('lock-message');
const revealTimerElem = document.getElementById('reveal-timer');
const diceResultElem = document.getElementById('dice-result');
const resultTextElem = document.getElementById('result-text');

const bettingSection = document.getElementById('betting-section');
const revealingSection = document.getElementById('revealing-section');
const resultSection = document.getElementById('result-section');

const taiBtn = document.getElementById('tai-btn');
const xiuBtn = document.getElementById('xiu-btn');
const playAgainBtn = document.getElementById('play-again');

// Hàm random xúc xắc
function rollDice() {
    return Array.from({length: 3}, () => Math.floor(Math.random() * 6) + 1);
}

// Bắt đầu game
function startGame() {
    balanceElem.textContent = `Số dư: ${balance} VND`;
    choiceElem.textContent = '';
    lockMessageElem.textContent = '';
    betChoice = null;
    betLocked = false;
    bettingTimer = 55;
    revealTimer = 10;

    bettingSection.style.display = 'block';
    revealingSection.style.display = 'none';
    resultSection.style.display = 'none';

    taiBtn.disabled = false;
    xiuBtn.disabled = false;

    bettingInterval = setInterval(updateBettingTimer, 1000);
}

// Cập nhật timer đặt cược
function updateBettingTimer() {
    bettingTimer--;
    timerElem.textContent = `Đếm ngược đặt cược: ${bettingTimer} giây`;

    if (bettingTimer <= 3) {
        betLocked = true;
        lockMessageElem.textContent = 'Đặt cược đã khóa!';
        taiBtn.disabled = true;
        xiuBtn.disabled = true;
    }

    if (bettingTimer <= 0) {
        clearInterval(bettingInterval);
        if (!betChoice) betChoice = 'Tài'; // Mặc định
        startRevealing();
    }
}

// Giai đoạn mở bát
function startRevealing() {
    bettingSection.style.display = 'none';
    revealingSection.style.display = 'block';

    dice = rollDice();
    total = dice.reduce((a, b) => a + b, 0);

    if (dice[0] === dice[1] && dice[1] === dice[2]) {
        resultText = 'Ba giống! Nhà cái thắng.';
        balance -= betAmount;
    } else if ((betChoice === 'Tài' && total >= 11) || (betChoice === 'Xỉu' && total <= 10)) {
        resultText = 'Bạn thắng!';
        balance += betAmount;
    } else {
        resultText = 'Bạn thua!';
        balance -= betAmount;
    }

    revealInterval = setInterval(updateRevealTimer, 1000);
}

// Cập nhật timer mở bát (với nhấp nháy)
function updateRevealTimer() {
    revealTimer--;
    revealTimerElem.textContent = `Đang mở bát... (${revealTimer} giây)`;
    revealTimerElem.style.color = (revealTimer % 2 === 0) ? '#ff0000' : '#ffd700';

    if (revealTimer <= 0) {
        clearInterval(revealInterval);
        showResult();
    }
}

// Hiển thị kết quả
function showResult() {
    revealingSection.style.display = 'none';
    resultSection.style.display = 'block';

    diceResultElem.textContent = `Kết quả: [${dice.join(', ')}] (Tổng: ${total})`;
    resultTextElem.textContent = resultText;
    resultTextElem.style.color = resultText.includes('thắng') ? '#00ff00' : '#ff0000';
    balanceElem.textContent = `Số dư: ${balance} VND`;
}

// Event listeners
taiBtn.addEventListener('click', () => {
    if (!betLocked) {
        betChoice = 'Tài';
        choiceElem.textContent = `Bạn chọn: ${betChoice}`;
    }
});

xiuBtn.addEventListener('click', () => {
    if (!betLocked) {
        betChoice = 'Xỉu';
        choiceElem.textContent = `Bạn chọn: ${betChoice}`;
    }
});

playAgainBtn.addEventListener('click', startGame);

// Bắt đầu game đầu tiên
startGame();