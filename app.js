const Gameboard = (() => {
    let board = Array(9).fill(null);
  
    const getCell = (index) => board[index];
    const setCell = (index, marker) => {
      if (!board[index]) {
        board[index] = marker;
        return true;
      }
      return false;
    };
    const reset = () => {
      board = Array(9).fill(null);
    };
    const getBoard = () => board;
  
    return { getCell, setCell, reset, getBoard };
  })();
  
  const Player = (name, marker) => {
    return { name, marker };
  };

  
  const GameController = (() => {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let currentPlayer = player1;
    let isGameOver = false;
  
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
  
    const switchPlayer = () => {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    };
  
    const checkWinner = () => {
      const board = Gameboard.getBoard();
      for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return currentPlayer;
        }
      }
      if (board.every(cell => cell !== null)) {
        return "tie";
      }
      return null;
    };
  
    const handleCellClick = (index) => {
      if (isGameOver || !Gameboard.setCell(index, currentPlayer.marker)) return;
  
      const winner = checkWinner();
      if (winner) {
        isGameOver = true;
        DisplayController.showWinner(winner === "tie" ? "It's a tie!" : `${currentPlayer.name} wins!`);
      } else {
        switchPlayer();
        DisplayController.updateStatus(`Current Player: ${currentPlayer.name}`);
      }
      DisplayController.render();
    };
  
    const resetGame = () => {
      Gameboard.reset();
      currentPlayer = player1;
      isGameOver = false;
      DisplayController.updateStatus(`Current Player: ${currentPlayer.name}`);
      DisplayController.render();
    };
  
    return { handleCellClick, resetGame };
  })();

  
  const DisplayController = (() => {
    const boardElement = document.getElementById("game-board");
    const statusElement = document.getElementById("game-status");
  
    const render = () => {
      boardElement.innerHTML = "";
      Gameboard.getBoard().forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.textContent = cell;
        cellElement.addEventListener("click", () => GameController.handleCellClick(index));
        boardElement.appendChild(cellElement);
      });
    };
  
    const updateStatus = (message) => {
      statusElement.textContent = message;
    };
  
    const showWinner = (message) => {
      updateStatus(message);
    };
  
    return { render, updateStatus, showWinner };
  })();
  
  // Initialize the game on load
  document.addEventListener("DOMContentLoaded", () => {
    GameController.resetGame();
  });
  