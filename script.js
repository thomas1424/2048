document.addEventListener("DOMContentLoaded", () => {
  const gridDisplay = document.querySelector('.grid-container');
  const scoreDisplay = document.querySelector('.score-container');
  const bestDisplay = document.querySelector('.best-container');
  const resultDisplay = document.querySelector('.game-message p');
  const width = 4;
  let squares = [];
  let score = 0;
  let bestScore = 0;

  // Create the playing board
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      let square = document.createElement('div');
      square.classList.add('grid-cell');
      square.innerHTML = 0;
      gridDisplay.appendChild(square);
      squares.push(square);
    }
    generate();
    generate();
  }
  createBoard();

  // Generate a new number
  function generate() {
    let randomNumber = Math.floor(Math.random() * squares.length);
    if (squares[randomNumber].innerHTML == 0) {
      squares[randomNumber].innerHTML = 2;
      squares[randomNumber].classList.add('tile', 'tile-2');
      checkForGameOver();
    } else generate();
  }

  // Swipe right
  function moveRight() {
    for (let i = 0; i < width * width; i++) {
      if (i % 4 === 0) {
        let totalOne = squares[i].innerHTML;
        let totalTwo = squares[i + 1].innerHTML;
        let totalThree = squares[i + 2].innerHTML;
        let totalFour = squares[i + 3].innerHTML;
        let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

        let filteredRow = row.filter(num => num);
        let missing = 4 - filteredRow.length;
        let zeros = Array(missing).fill(0);
        let newRow = zeros.concat(filteredRow);

        squares[i].innerHTML = newRow[0];
        squares[i + 1].innerHTML = newRow[1];
        squares[i + 2].innerHTML = newRow[2];
        squares[i + 3].innerHTML = newRow[3];
      }
    }
  }

  // Swipe left
  function moveLeft() {
    for (let i = 0; i < width * width; i++) {
      if (i % 4 === 0) {
        let totalOne = squares[i].innerHTML;
        let totalTwo = squares[i + 1].innerHTML;
        let totalThree = squares[i + 2].innerHTML;
        let totalFour = squares[i + 3].innerHTML;
        let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

        let filteredRow = row.filter(num => num);
        let missing = 4 - filteredRow.length;
        let zeros = Array(missing).fill(0);
        let newRow = filteredRow.concat(zeros);

        squares[i].innerHTML = newRow[0];
        squares[i + 1].innerHTML = newRow[1];
        squares[i + 2].innerHTML = newRow[2];
        squares[i + 3].innerHTML = newRow[3];
      }
    }
  }

  // Swipe down
  function moveDown() {
    for (let i = 0; i < 4; i++) {
      let totalOne = squares[i].innerHTML;
      let totalTwo = squares[i + width].innerHTML;
      let totalThree = squares[i + (width * 2)].innerHTML;
      let totalFour = squares[i + (width * 3)].innerHTML;
      let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

      let filteredColumn = column.filter(num => num);
      let missing = 4 - filteredColumn.length;
      let zeros = Array(missing).fill(0);
      let newColumn = zeros.concat(filteredColumn);

      squares[i].innerHTML = newColumn[0];
      squares[i + width].innerHTML = newColumn[1];
      squares[i + (width * 2)].innerHTML = newColumn[2];
      squares[i + (width * 3)].innerHTML = newColumn[3];
    }
  }

  // Swipe up
  function moveUp() {
    for (let i = 0; i < 4; i++) {
      let totalOne = squares[i].innerHTML;
      let totalTwo = squares[i + width].innerHTML;
      let totalThree = squares[i + (width * 2)].innerHTML;
      let totalFour = squares[i + (width * 3)].innerHTML;
      let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

      let filteredColumn = column.filter(num => num);
      let missing = 4 - filteredColumn.length;
      let zeros = Array(missing).fill(0);
      let newColumn = filteredColumn.concat(zeros);

      squares[i].innerHTML = newColumn[0];
      squares[i + width].innerHTML = newColumn[1];
      squares[i + (width * 2)].innerHTML = newColumn[2];
      squares[i + (width * 3)].innerHTML = newColumn[3];
    }
  }

  // Combine rows
  function combineRow() {
    for (let i = 0; i < width * width - 1; i++) {
      if (squares[i].innerHTML === squares[i + 1].innerHTML) {
        let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
        squares[i].innerHTML = combinedTotal;
        squares[i + 1].innerHTML = 0;
        score += combinedTotal;
        scoreDisplay.innerHTML = score;
        if (score > bestScore) {
          bestScore = score;
          bestDisplay.innerHTML = bestScore;
        }
      }
    }
    checkForWin();
  }

  // Combine columns
  function combineColumn() {
    for (let i = 0; i < width * width - width; i++) {
      if (squares[i].innerHTML === squares[i + width].innerHTML) {
        let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + width].innerHTML);
        squares[i].innerHTML = combinedTotal;
        squares[i + width].innerHTML = 0;
        score += combinedTotal;
        scoreDisplay.innerHTML = score;
        if (score > bestScore) {
          bestScore = score;
          bestDisplay.innerHTML = bestScore;
        }
      }
    }
    checkForWin();
  }

  // Assign key codes
  function control(e) {
    if (e.keyCode === 39) {
      keyRight();
    } else if (e.keyCode === 37) {
      keyLeft();
    } else if (e.keyCode === 38) {
      keyUp();
    } else if (e.keyCode === 40) {
      keyDown();
    }
  }
  document.addEventListener('keyup', control);

  function keyRight() {
    moveRight();
    combineRow();
    moveRight();
    generate();
  }

  function keyLeft() {
    moveLeft();
    combineRow();
    moveLeft();
    generate();
  }

  function keyDown() {
    moveDown();
    combineColumn();
    moveDown();
    generate();
  }

  function keyUp() {
    moveUp();
    combineColumn();
    moveUp();
    generate();
  }

  // Check for the number 2048 in the squares to win
  function checkForWin() {
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML == 2048) {
        resultDisplay.innerHTML = 'You Win!';
        document.removeEventListener('keyup', control);
        setTimeout(() => clear(), 3000);
      }
    }
  }

  // Check for no zeros on the board to lose
  function checkForGameOver() {
    let zeros = 0;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML == 0) {
        zeros++;
      }
    }
    if (zeros === 0) {
      resultDisplay.innerHTML = 'You Lose!';
      document.removeEventListener('keyup', control);
      setTimeout(() => clear(), 3000);
    }
  }

  // Clear timer
  function clear() {
    resultDisplay.innerHTML = '';
    squares.forEach(square => square.innerHTML = 0);
    createBoard();
  }

  // Add colours
  function addColours() {
    for (let i = 0; i < squares.length; i++) {
      squares[i].className = 'grid-cell';
      if (squares[i].innerHTML == 0) squares[i].style.backgroundColor = '#cdc1b4';
      else if (squares[i].innerHTML == 2) squares[i].classList.add('tile', 'tile-2');
      else if (squares[i].innerHTML == 4) squares[i].classList.add('tile', 'tile-4');
      else if (squares[i].innerHTML == 8) squares[i].classList.add('tile', 'tile-8');
      else if (squares[i].innerHTML == 16) squares[i].classList.add('tile', 'tile-16');
      else if (squares[i].innerHTML == 32) squares[i].classList.add('tile', 'tile-32');
      else if (squares[i].innerHTML == 64) squares[i].classList.add('tile', 'tile-64');
      else if (squares[i].innerHTML == 128) squares[i].classList.add('tile', 'tile-128');
      else if (squares[i].innerHTML == 256) squares[i].classList.add('tile', 'tile-256');
      else if (squares[i].innerHTML == 512) squares[i].classList.add('tile', 'tile-512');
      else if (squares[i].innerHTML == 1024) squares[i].classList.add('tile', 'tile-1024');
      else if (squares[i].innerHTML == 2048) squares[i].classList.add('tile', 'tile-2048');
    }
  }
  addColours();

  let myTimer = setInterval(addColours, 50);

  // Keep playing after winning
  window.keepPlaying = function() {
    document.querySelector('.game-message').style.display = 'none';
    document.addEventListener('keyup', control);
    resultDisplay.innerHTML = '';
  }

  // Restart the game
  window.restartGame = function() {
    document.querySelector('.game-message').style.display = 'none';
    resultDisplay.innerHTML = '';
    score = 0;
    scoreDisplay.innerHTML = score;
    squares.forEach(square => square.innerHTML = 0);
    createBoard();
  }
});
