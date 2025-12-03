const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const size = 3;
const cellSize = canvas.width / size;

let board = Array(size).fill(null).map(() => Array(size).fill(''));
let currentPlayer = 'X';
let gameOver = false;
let aiMode = null;

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 1; i < size; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c] !== '') {
                ctx.font = "40px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = board[r][c] === 'X' ? "#ff4757" : "#1e90ff";
                ctx.fillText(board[r][c], c * cellSize + cellSize / 2, r * cellSize + cellSize / 2);
            }
        }
    }
}

function checkWinner() {
    for (let i = 0; i < size; i++) {
        if (board[i][0] && board[i].every(cell => cell === board[i][0])) return board[i][0];
        if (board[0][i] && board.every(row => row[i] === board[0][i])) return board[0][i];
    }
    if (board[0][0] && board.every((row, idx) => row[idx] === board[0][0])) return board[0][0];
    if (board[0][size-1] && board.every((row, idx) => row[size-1-idx] === board[0][size-1])) return board[0][size-1];
    if (board.flat().every(cell => cell !== '')) return 'Draw';
    return null;
}

canvas.addEventListener('click', (e) => {
    if (gameOver) return;
    const x = Math.floor(e.offsetX / cellSize);
    const y = Math.floor(e.offsetY / cellSize);
    if (board[y][x] === '') {
        board[y][x] = currentPlayer;
        drawBoard();
        let result = checkWinner();
        if (result) {
            document.getElementById('message').innerText = result === 'Draw' ? "It's a Draw!" : `${result} Wins!`;
            gameOver = true;
            return;
        }
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (aiMode && currentPlayer === 'O') aiMove();
    }
});

function aiMove() {
    let emptyCells = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c] === '') emptyCells.push([r,c]);
        }
    }
    if (emptyCells.length === 0) return;

    let [r,c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[r][c] = 'O';
    drawBoard();
    let result = checkWinner();
    if (result) {
        document.getElementById('message').innerText = result === 'Draw' ? "It's a Draw!" : `${result} Wins!`;
        gameOver = true;
    }
    currentPlayer = 'X';
}

// Buttons
document.getElementById('pvp').onclick = () => { resetGame(); aiMode = null; };
document.getElementById('ai-easy').onclick = () => { resetGame(); aiMode = 'easy'; };
document.getElementById('ai-medium').onclick = () => { resetGame(); aiMode = 'medium'; };
document.getElementById('ai-hard').onclick = () => { resetGame(); aiMode = 'hard'; };
document.getElementById('reset').onclick = () => { resetGame(); };
document.getElementById('new-game').onclick = () => { resetGame(); };

document.getElementById('theme-toggle').onclick = () => {
    document.body.classList.toggle('dark');
};

function resetGame() {
    board = Array(size).fill(null).map(() => Array(size).fill(''));
    currentPlayer = 'X';
    gameOver = false;
    document.getElementById('message').innerText = '';
    drawBoard();
}

drawBoard();
