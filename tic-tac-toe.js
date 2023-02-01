const squares = document.querySelectorAll(".square");
const X = "X";
const O = "O";
let currentPlayer = X;
let gameBoard = Array.from(Array(9).keys());

for (const square of squares) {
    square.addEventListener("click", function(event) {
        const squareIndex = parseInt(event.target.id);
        if (typeof gameBoard[squareIndex] === "number") {
            gameBoard[squareIndex] = currentPlayer;
            event.target.textContent = currentPlayer;

            let gameWon = checkWin(gameBoard, currentPlayer);
            if (gameWon) {
                alert(`Player ${currentPlayer} won!`);
                resetGame();
                return;
            }

            if (currentPlayer === X) {
                currentPlayer = O;
            } else {
                currentPlayer = X;
            }

            if (isDraw(gameBoard)) {
                alert("Draw!");
                resetGame();
                return;
            }

            // AI turn
            if (currentPlayer === O) {
                const bestMove = minimax(gameBoard, currentPlayer);
                gameBoard[bestMove.index] = currentPlayer;
                squares[bestMove.index].textContent = currentPlayer;

                gameWon = checkWin(gameBoard, currentPlayer);
                if (gameWon) {
                    alert(`Player ${currentPlayer} won!`);
                    resetGame();
                    return;
                }

                if (isDraw(gameBoard)) {
                    alert("Draw!");
                    resetGame();
                    return;
                }

                currentPlayer = X;
            }
        }
    });
}

function checkWin(board, player) {
    const winCombinations = [    [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combination of winCombinations) {
        if (board[combination[0]] === player &&
            board[combination[1]] === player &&
            board[combination[2]] === player) {
            return true;
        }
    }

    return false;
}

function isDraw(board) {
    return board.every(square => typeof square === "string");
}

function minimax(newBoard, player) {
    const availableSquares = newBoard.filter(square => typeof square === "number");

    if (checkWin(newBoard, X)) {
        return { score: -10 };
    } else if (checkWin(newBoard, O)) {
        return { score: 10 };
    } else if (availableSquares.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    for (const square of availableSquares) {
        const move = {};
        move.index = newBoard[square];
        newBoard[square] = player;

        if (player === O) {
            move.score = minimax(newBoard, X).score;
        } else {
            move.score = minimax(newBoard, O).score;
        }

        newBoard[square] = move.index;
        moves.push(move);
    }

    let bestMove;
    if (player === O) {
        let bestScore = -Infinity;
        for (const move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (const move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }

    return bestMove;
}

function resetGame() {
    currentPlayer = X;
    gameBoard = Array.from(Array(9).keys());
    for (const square of squares) {
        square.textContent = "";
    }
}
