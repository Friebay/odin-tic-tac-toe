// Module to manage the game board state
const Gameboard = (() => {
    let board = Array(9).fill(null); // Initialize an empty 3x3 board as a 1D array
  
    // Get the value of a specific cell on the board
    const getCell = (index) => board[index];
  
    // Set the value of a cell if it's empty, returns true if successful
    const setCell = (index, marker) => {
      if (!board[index]) {  // Only set cell if it’s empty
        board[index] = marker;
        return true;
      }
      return false;  // Cell already filled
    };
  
    // Reset the board to its initial empty state
    const reset = () => {
      board = Array(9).fill(null);
    };
  
    // Get the entire board array (for rendering purposes)
    const getBoard = () => board;
  
    return { getCell, setCell, reset, getBoard };
  })();
  
  // Factory function to create a Player object with a name and marker
  const Player = (name, marker) => {
    return { name, marker };
  };
  
  // Module to control the game logic
  const GameController = (() => {
    let player1, player2;       // Player objects
    let currentPlayer;          // Keeps track of the current player
    let isGameOver = false;     // Flag to indicate if the game is over
  
    // Define the winning combinations based on board indices
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
  
    // Switch the current player to the other player
    const switchPlayer = () => {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    };
  
    // Check if there's a winner or a tie, return the winning player or "tie" if tied
    const checkWinner = () => {
      const board = Gameboard.getBoard();
      for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return currentPlayer; // Return the current player as the winner
        }
      }
      if (board.every(cell => cell !== null)) {
        return "tie"; // Return "tie" if all cells are filled and no winner
      }
      return null; // No winner yet
    };
  
    // Handle a cell click by placing a marker and checking for a winner
    const handleCellClick = (index) => {
      if (isGameOver || !Gameboard.setCell(index, currentPlayer.marker)) return;
  
      const winner = checkWinner();
      if (winner) {
        isGameOver = true; // Mark game as over if we have a winner
        DisplayController.showWinner(winner === "tie" ? "It's a tie!" : `${currentPlayer.name} wins!`);
      } else {
        switchPlayer(); // Switch to the other player if no winner
        DisplayController.updateStatus(`Current Player: ${currentPlayer.name}`);
      }
      DisplayController.render(); // Update the display after each move
    };
  
    // Start the game with given player names, resetting the board and setting player1 as current
    const startGame = (name1, name2) => {
      player1 = Player(name1 || "Player 1", "X"); // Default names if none provided
      player2 = Player(name2 || "Player 2", "O");
      currentPlayer = player1;
      isGameOver = false; // Reset game-over flag
      Gameboard.reset(); // Clear the board for a new game
      DisplayController.updateStatus(`Current Player: ${currentPlayer.name}`);
      DisplayController.render();
    };
  
    // Restart the game without changing player names, resetting to initial state
    const restartGame = () => {
      isGameOver = false;       // Reset game-over flag
      currentPlayer = player1;   // Reset to player 1 as the starting player
      Gameboard.reset();         // Clear the board
      DisplayController.updateStatus(`Current Player: ${currentPlayer.name}`);
      DisplayController.render();
    };
  
    return { handleCellClick, startGame, restartGame };
  })();
  
  // Module to control the display and user interface
  const DisplayController = (() => {
    const boardElement = document.getElementById("game-board"); // Board container element
    const statusElement = document.getElementById("game-status"); // Status display element
  
    // Render the board based on Gameboard state
    const render = () => {
      boardElement.innerHTML = ""; // Clear the board
      Gameboard.getBoard().forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.textContent = cell; // Display marker in cell
        cellElement.addEventListener("click", () => GameController.handleCellClick(index)); // Add click handler
        boardElement.appendChild(cellElement); // Add cell to board container
      });
    };
  
    // Update the status message (e.g., current player's turn)
    const updateStatus = (message) => {
      statusElement.textContent = message;
    };
  
    // Display the winner message or tie message
    const showWinner = (message) => {
      updateStatus(message);
    };
  
    // Toggle display between player setup and game board
    const toggleGameDisplay = (isGameActive) => {
      document.getElementById("player-setup").style.display = isGameActive ? "none" : "flex";
      document.getElementById("game-container").style.display = isGameActive ? "flex" : "none";
    };
  
    return { render, updateStatus, showWinner, toggleGameDisplay };
  })();
  
  // Event listeners for start and restart buttons
  document.getElementById("start-game").addEventListener("click", () => {
    const name1 = document.getElementById("player1-name").value; // Get player 1 name
    const name2 = document.getElementById("player2-name").value; // Get player 2 name
    GameController.startGame(name1, name2); // Start the game with entered names
    DisplayController.toggleGameDisplay(true); // Show the game board and hide the setup
  });
  
  document.getElementById("restart-game").addEventListener("click", () => {
    GameController.restartGame(); // Restart the game without changing player names
  });
  