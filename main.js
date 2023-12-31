/*----- audio -----*/
const chip1 = new Audio('chip1.wav');
const chip2 = new Audio('chip2.wav');
const chip3 = new Audio('chip3.wav');
const gameOver = new Audio('game_over.wav');
const newBoardSound = new Audio('new_game_sound.wav')

/*----- constants -----*/
const player1 = 'red';
const player2 = 'blue';
const boardWidth = 7;
const boardHeight = 6;

/*----- state variables -----*/
let currentPlayer = player1;
let board = createBoard();

/*----- cached elements -----*/
const slots = document.querySelectorAll('.slot');

/*----- event listeners -----*/
for (let slot of slots) {
  slot.addEventListener('click', handleSlotClick);
}

/*----- functions -----*/
function createBoard() {
  const board = [];
  for (let row = 0; row < boardHeight; row++) {
    const rowArray = [];
    for (let col = 0; col < boardWidth; col++) {
      rowArray.push('');
    }
    board.push(rowArray);
  }
  return board;
}

function handleSlotClick(event) {
  chip1.load()
  chip2.load()
  chip3.load()
  playRandomChipSound()
  const clickedSlot = event.target;
  const colIndex = Array.from(clickedSlot.parentNode.children).indexOf(clickedSlot);

  let bottomMostEmptyRow = boardHeight - 1;
  while (bottomMostEmptyRow > 0 && board[bottomMostEmptyRow][colIndex] !== '') {
    bottomMostEmptyRow--;
  }

  if (board[bottomMostEmptyRow][colIndex] === '') {
    board[bottomMostEmptyRow][colIndex] = currentPlayer;
    const bottomMostEmptySlot = clickedSlot.parentNode.parentNode.children[bottomMostEmptyRow].children[colIndex];
    bottomMostEmptySlot.style.backgroundColor = currentPlayer;
    checkWin(bottomMostEmptyRow, colIndex);
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  }
}



function checkWin(row, col) {
  if (checkVertical(row, col) || checkHorizontal(row, col) || checkDiagonal(row, col)) {
    gameOver.play()
    const winnerDiv = document.createElement('div');
    winnerDiv.id = 'winner';
    winnerDiv.textContent = currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1) + ' wins!';
    winnerDiv.style.color = currentPlayer;
    
    const resetButton = document.createElement('button');
    resetButton.id = 'reset-button';
    resetButton.textContent = 'Reset';
    
    document.body.appendChild(winnerDiv);
    document.body.appendChild(resetButton);
    
    resetButton.addEventListener('click', resetGame);
  }
}



function checkVertical(row, col) {
  let count = 1;
  let r = row - 1;
  while (r >= 0 && board[r][col] === currentPlayer) {
    count++;
    r--;
  }
  r = row + 1;
  while (r < boardHeight && board[r][col] === currentPlayer) {
    count++;
    r++;
  }
  return count >= 4;
}

function checkHorizontal(row, col) {
  let count = 1;
  let c = col - 1;
  while (c >= 0 && board[row][c] === currentPlayer) {
    count++;
    c--;
  }
  c = col + 1;
  while (c < boardWidth && board[row][c] === currentPlayer) {
    count++;
    c++;
  }
  return count >= 4;
}

function checkDiagonal(row, col) {
  return checkDiagonal1(row, col) || checkDiagonal2(row, col);
}

function checkDiagonal1(row, col) {
  let count = 1;
  let r = row - 1;
  let c = col - 1;
  while (r >= 0 && c >= 0 && board[r][c] === currentPlayer) {
    count++;
    r--;
    c--;
  }
  r = row + 1;
  c = col + 1;
  while (r < boardHeight && c < boardWidth && board[r][c] === currentPlayer) {
    count++;
    r++;
    c++;
  }
  return count >= 4;
}

function checkDiagonal2(row, col) {
  let count = 1;
  let r = row - 1;
  let c = col + 1;
  while (r >= 0 && c < boardWidth && board[r][c] === currentPlayer) {
    count++;
    r--;
    c++;
  }
  r = row + 1;
  c = col - 1;
  while (r < boardHeight && c >= 0 && board[r][c] === currentPlayer) {
    count++;
    r++;
    c--;
  }
  return count >= 4;
}

function resetGame() {
  newBoardSound.play()
  currentPlayer = player1;
  board = createBoard();
  for (let slot of slots) {
    slot.style.backgroundColor = 'white';
  }
  
  const winnerDiv = document.getElementById('winner');
  const resetButton = document.getElementById('reset-button');
  
  if (winnerDiv) {
    winnerDiv.remove();
  }
  
  if (resetButton) {
    resetButton.remove();
  }
}

function playRandomChipSound() {
  const soundIndex = Math.floor(Math.random() * 3) + 1;
  const sound = new Audio(`chip${soundIndex}.wav`);
  sound.play();
}