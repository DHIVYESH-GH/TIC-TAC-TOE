const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

// Sounds
const clickSound = new Audio("click.mp3");
const winSound = new Audio("win.mp3");
const drawSound = new Audio("draw.mp3");

initializeGame();

function initializeGame() {
    cells.forEach((cell, index) => {
        cell.setAttribute("cellIndex", index);
        cell.addEventListener("click", cellClicked);
    });
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex");

    // Prevent interaction if the cell is already occupied or the game is not running
    if (options[cellIndex] !== "" || !running) {
        return;
    }

    // Update the cell and check for a win or draw
    updateCell(this, cellIndex);
    checkWinner();

    // Play click sound only if the game is still running
    if (running) {
        clickSound.currentTime = 0; // Reset sound playback time
        clickSound.play(); // Play click sound
    }
}



function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;

    // Apply glow effect immediately based on the current player
    if (currentPlayer === "X") {
        cell.classList.add("x-glow");
        cell.classList.remove("o-glow");
    } else {
        cell.classList.add("o-glow");
        cell.classList.remove("x-glow");
    }
    
    // Force reflow to ensure the style is applied instantly
    void cell.offsetWidth;
}


function changePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
    let roundWon = false;
    let winningCells = [];

    for (const condition of winConditions) {
        const [a, b, c] = condition;
        if (options[a] && options[a] === options[b] && options[a] === options[c]) {
            roundWon = true;
            winningCells = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
        highlightWinningCells(winningCells);
        winSound.play(); // Play winning sound
        return; // Exit the function to prevent further checks
    }

    if (!options.includes("")) {
        statusText.textContent = "Draw!";
        running = false;
        drawSound.play(); // Play draw sound
    } else {
        changePlayer();
    }
}


function highlightWinningCells(winningCells) {
    winningCells.forEach(index => {
        cells[index].classList.add("win-glow");
    });
}

function restartGame() {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;

    // Clear all cell content and glow classes
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("x-glow", "o-glow"); // Remove glow classes
        cell.classList.remove("win-glow");
        cell.style.border = "4px solid black"; // Reset border style to default
        cell.style.boxShadow = "none"; // Reset shadow to remove glow
    });

    running = true;
}


