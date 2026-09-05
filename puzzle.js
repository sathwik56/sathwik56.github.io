/* =========================
   SLIDING PUZZLE GAME
========================= */

const GRID = 3;
const SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // 0 = empty

let tiles  = [...SOLVED];
let moves  = 0;
let seconds = 0;
let timerInterval = null;
let gameStarted = false;
let solved = false;

/* DOM refs */
const board       = document.getElementById("puzzle-board");
const movesEl     = document.getElementById("moves-count");
const timerEl     = document.getElementById("timer-display");
const winMessage  = document.getElementById("win-message");
const winSub      = document.getElementById("win-sub");
const shuffleBtn  = document.getElementById("shuffle-btn");
const resetBtn    = document.getElementById("reset-btn");
const playAgain   = document.getElementById("play-again-btn");


/* =========================
   TIMER
========================= */

function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        seconds++;
        timerEl.textContent = formatTime(seconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    timerEl.textContent = "0:00";
}

function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
}


/* =========================
   RENDER
========================= */

function render(movedIndex = -1) {
    board.innerHTML = "";

    tiles.forEach((num, i) => {
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "p-tile";

        if (num === 0) {
            tile.classList.add("empty");
            tile.setAttribute("aria-hidden", "true");
            tile.tabIndex = -1;
        } else {
            tile.textContent = num;
            tile.setAttribute("aria-label", `Tile ${num}`);

            if (i === movedIndex) {
                tile.classList.add("moving");
            }

            if (solved) {
                tile.classList.add("solved");
            }

            tile.addEventListener("click", () => handleMove(i));
            tile.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleMove(i);
                }
            });
        }

        board.appendChild(tile);
    });

    movesEl.textContent = moves;
}


/* =========================
   MOVE LOGIC
========================= */

function handleMove(i) {
    if (solved) return;

    const emptyIdx = tiles.indexOf(0);
    if (!isAdjacent(i, emptyIdx)) return;

    // Start timer on first move
    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }

    [tiles[i], tiles[emptyIdx]] = [tiles[emptyIdx], tiles[i]];
    moves++;

    render(emptyIdx); // show animation on the destination cell

    if (checkWin()) {
        stopTimer();
        solved = true;
        render(-1);
        showWin();
    }
}

function isAdjacent(a, b) {
    const ar = Math.floor(a / GRID);
    const ac = a % GRID;
    const br = Math.floor(b / GRID);
    const bc = b % GRID;
    return Math.abs(ar - br) + Math.abs(ac - bc) === 1;
}

function checkWin() {
    return tiles.every((n, i) => n === SOLVED[i]);
}


/* =========================
   WIN SCREEN
========================= */

function showWin() {
    winSub.textContent = `${moves} move${moves !== 1 ? "s" : ""} · ${formatTime(seconds)}`;
    winMessage.classList.add("show");
    board.style.opacity = "0.35";
}

function hideWin() {
    winMessage.classList.remove("show");
    board.style.opacity = "1";
}


/* =========================
   SHUFFLE (legal moves only)
========================= */

function shuffle(numMoves = 120) {
    tiles = [...SOLVED];
    let prevEmpty = -1;

    for (let i = 0; i < numMoves; i++) {
        const emptyIdx = tiles.indexOf(0);
        const neighbours = getNeighbours(emptyIdx)
            .filter(n => n !== prevEmpty);
        const pick = neighbours[Math.floor(Math.random() * neighbours.length)];
        [tiles[emptyIdx], tiles[pick]] = [tiles[pick], tiles[emptyIdx]];
        prevEmpty = emptyIdx;
    }
}

function getNeighbours(idx) {
    const r = Math.floor(idx / GRID);
    const c = idx % GRID;
    const n = [];
    if (r > 0) n.push(idx - GRID);
    if (r < GRID - 1) n.push(idx + GRID);
    if (c > 0) n.push(idx - 1);
    if (c < GRID - 1) n.push(idx + 1);
    return n;
}


/* =========================
   START / RESET
========================= */

function startGame() {
    hideWin();
    resetTimer();
    gameStarted = false;
    solved = false;
    moves = 0;
    shuffle(120);
    render(-1);
}

function resetGame() {
    hideWin();
    resetTimer();
    gameStarted = false;
    solved = false;
    moves = 0;
    tiles = [...SOLVED];
    render(-1);
}


/* =========================
   BUTTON EVENTS
========================= */

shuffleBtn?.addEventListener("click", startGame);
resetBtn?.addEventListener("click", resetGame);
playAgain?.addEventListener("click", startGame);


/* =========================
   KEYBOARD ARROW SUPPORT
========================= */

document.addEventListener("keydown", (e) => {
    if (solved) return;
    const emptyIdx = tiles.indexOf(0);

    const arrowMap = {
        "ArrowUp":    emptyIdx + GRID,   // tile below empty moves up
        "ArrowDown":  emptyIdx - GRID,
        "ArrowLeft":  emptyIdx + 1,
        "ArrowRight": emptyIdx - 1,
    };

    const target = arrowMap[e.key];
    if (target !== undefined && target >= 0 && target < tiles.length) {
        if (isAdjacent(target, emptyIdx)) {
            e.preventDefault();
            handleMove(target);
        }
    }
});


/* =========================
   REVEAL ANIMATION
========================= */

const revealEls = document.querySelectorAll(".reveal");

const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObs.observe(el));


/* =========================
   INIT — start shuffled
========================= */

startGame();
