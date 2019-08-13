let squares = [];
let totalSquares = 3;

let ai;
let player;
let playerTurn = true;
let winner = null;
let aiPlayer;
let huPlayer;

let board = [ '', '', '', '', '', '', '', '', '' ];
let origBoard = [ '', '', '', '', '', '', '', '', '' ];
let gameboard = [ [ '', '', '' ], [ '', '', '' ], [ '', '', '' ] ];
let emptySpots = [];
let emptyIndex = [];

let totalMoves = 0;

let players = [ 'X', 'O' ];

let isWinner = false;

let currentPlayer;

let currentPlayerD;

let startText = 'Starting Player: ' + currentPlayer;

function setup() {
	createCanvas(900, 900);

	origBoard = [ '', '', '', '', '', '', '', '', '' ];
	emptySpots = [];

	let squareSize = width / totalSquares;
	let index = 0;

	for (let j = 150; j < height; j += squareSize) {
		for (let i = 150; i < width; i += squareSize) {
			squares.push(new Square(i, j, squareSize, index));
			index++;
		}
	}

	currentPlayer = random(players);
	startText = 'You are playing first as: ' + currentPlayer;

	let button = createButton('Reset').style('color', '#000').style('font-size', '16pt');
	button.mousePressed(resetSketch);

	console.log('Current Player: ' + currentPlayer);
	currentPlayerD = createP(startText).style('color', '#000').style('font-size', '32pt');

	if (playerTurn == true && currentPlayer == 'X') {
		player = 'X';
		huPlayer = 'X';
		aiPlayer = 'O';
		ai = new AI('O');
	} else if (playerTurn == true && currentPlayer) {
		player = 'O';
		huPlayer = 'O';
		aiPlayer = 'X';
		ai = new AI('X');
	}
}

function draw() {
	if (!isWinner) {
		// logic
		for (let i = 0; i < board.length; i++) {
			if (board[i] == 'O') {
				origBoard[i] = 'O';
			} else if (board[i] == 'X') {
				origBoard[i] = 'X';
			} else if (board[i] == '') {
				origBoard[i] = i;
			}
		}

		for (let i = 0; i < board.length; i++) {
			if (board[i] == '') {
				emptyIndex.push(i);
			}
		}

		updateGameboard();
		winCheck();
		ai.pickMove();

		// draw
		background(255);

		for (let i = 0; i < squares.length; i++) {
			squares[i].show();
		}
	}
}

function resetSketch() {
	window.location.reload();
}

function updateGameboard() {
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			gameboard[i][j] = board[i * 3 + j];
		}
	}
}

function winCheck() {
	winner = null;

	// horizontal
	for (let i = 0; i < 3; i++) {
		if (
			gameboard[i][0] == gameboard[i][1] &&
			gameboard[i][1] == gameboard[i][2] &&
			gameboard[i][0] != '' &&
			gameboard[i][1] != '' &&
			gameboard[i][2] != ''
		) {
			winner = gameboard[i][0];
			isWinner = true;
		}
	}

	// vertical
	for (let i = 0; i < 3; i++) {
		if (
			gameboard[0][i] == gameboard[1][i] &&
			gameboard[1][i] == gameboard[2][i] &&
			gameboard[0][i] != '' &&
			gameboard[1][i] != '' &&
			gameboard[2][i] != ''
		) {
			winner = gameboard[0][i];
			isWinner = true;
		}
	}

	// diagonal
	if (
		gameboard[0][0] == gameboard[1][1] &&
		gameboard[1][1] == gameboard[2][2] &&
		gameboard[0][0] != '' &&
		gameboard[1][1] != '' &&
		gameboard[2][2] != ''
	) {
		winner = gameboard[0][0];
		isWinner = true;
	}

	if (
		gameboard[2][0] == gameboard[1][1] &&
		gameboard[1][1] == gameboard[0][2] &&
		gameboard[2][0] != '' &&
		gameboard[1][1] != '' &&
		gameboard[0][2] != ''
	) {
		winner = gameboard[2][0];
		isWinner = true;
	}

	// declare tie
	if (totalMoves == 9 && winner == null) {
		console.log('TIE');
		createP('The game ended in a tie!').style('color', '#000').style('font-size', '32pt');
		totalMoves = 0;
	}

	// declare winner
	if (winner != null) {
		console.log('The winner is: ' + winner + '!');
		createP('The winner is: ' + winner + '!').style('color', '#000').style('font-size', '32pt');
	}
}

function mousePressed() {
	for (let i = 0; i < squares.length; i++) {
		squares[i].clicked();
	}
}

class Square {
	constructor(x, y, size, index) {
		this.x = x;
		this.y = y;
		this.index = index;

		for (let i = 0; i < 9; i++) {
			if (this.index == i) {
				this.value = board[i];
			}
		}

		this.col = color(255);
		this.size = size;
		this.r = this.size / 2;
	}

	show() {
		stroke(0);
		strokeWeight(4);
		fill(this.col);
		rectMode(RADIUS);
		rect(this.x, this.y, this.r, this.r);

		noStroke();
		fill(0);
		let tSize = 236;
		textSize(tSize);
		text(this.value, this.x - tSize / 3, this.y + tSize / 3);
	}

	clicked() {
		if (!isWinner) {
			let d = dist(mouseX, mouseY, this.x, this.y);
			if (d < this.r) {
				this.changeText();
			}
		}
	}

	changeText() {
		if (!isWinner) {
			if (this.value == '' && currentPlayer == 'X' && playerTurn == true) {
				this.col = color(0, 255, 0, 100);

				this.value = 'X';

				for (let i = 0; i < 9; i++) {
					if (this.index == i) {
						board[i] = this.value;
					}
				}

				totalMoves++;

				currentPlayer = players[1];

				if (playerTurn == true) {
					playerTurn = false;
				}

				console.log('X made a move!');
				console.log('Current Player: ' + currentPlayer);
			} else if (this.value == '' && currentPlayer == 'O' && playerTurn == true) {
				this.col = color(0, 0, 255, 100);

				this.value = 'O';

				for (let i = 0; i < 9; i++) {
					if (this.index == i) {
						board[i] = this.value;
					}
				}

				totalMoves++;

				currentPlayer = players[0];

				if (playerTurn == true) {
					playerTurn = false;
				}

				console.log('O made a move!');
				console.log('Current Player: ' + currentPlayer);
			}
		}
	}
}

class AI {
	constructor(pla) {
		this.pla = pla;
		this.haspicked = false;
		this.x;
		//this.x = Math.floor(Math.random() * 9 + 0);
		this.moveIndex;
		this.hasminimaxed = false;
	}

	pickSpot() {
		//this.x = Math.floor(Math.random() * 9 + 0);

		if (!playerTurn) {
			//console.log('aiMove' + this.aiMove());
			this.x = Math.floor(Math.random() * 9 + 0);
		}
	}

	aiMove() {
		return minimax(gameboard, 0, aiPlayer);
	}

	pickMove() {
		if (!playerTurn && this.haspicked == true) {
			this.haspicked = false;
		}

		if (!this.haspicked) {
			this.pickSpot();
		}

		if (playerTurn == false) {
			if (!this.haspicked) {
				if (board[this.x] == '') {
					// console.log('I can pick a move!');
					// console.log('I can pick board[' + this.x + ']');
					// console.log('I am playing as: ' + this.pla);

					if (!isWinner) {
						if (currentPlayer == 'X' && playerTurn == false) {
							squares[this.x].col = color(0, 255, 0, 100);

							squares[this.x].value = 'X';

							for (let i = 0; i < 9; i++) {
								if (squares[this.x].index == i) {
									board[i] = squares[this.x].value;
								}
							}

							totalMoves++;

							currentPlayer = players[1];

							if (playerTurn == false) {
								playerTurn = true;
							}

							this.haspicked = true;

							console.log('X made a move!');
							console.log('Current Player: ' + currentPlayer);
						} else if (currentPlayer == 'O' && playerTurn == false) {
							squares[this.x].col = color(0, 0, 255, 100);

							squares[this.x].value = 'O';

							for (let i = 0; i < 9; i++) {
								if (squares[this.x].index == i) {
									board[i] = squares[this.x].value;
								}
							}

							totalMoves++;

							currentPlayer = players[0];

							if (playerTurn == false) {
								playerTurn = true;
							}

							this.haspicked = true;

							console.log('O made a move!');
							console.log('Current Player: ' + currentPlayer);
						}
					}
				} else if (board[this.x] == 'X' || board[this.x] == 'O') {
					this.pickSpot();
				}
			}
		}
	}
}

function isGameOver() {
	let whoWon = null;

	// horizontal
	for (let i = 0; i < 3; i++) {
		if (
			gameboard[i][0] == gameboard[i][1] &&
			gameboard[i][1] == gameboard[i][2] &&
			gameboard[i][0] != '' &&
			gameboard[i][1] != '' &&
			gameboard[i][2] != ''
		) {
			whoWon = gameboard[i][0];
			return whoWon;
		}
	}

	// vertical
	for (let i = 0; i < 3; i++) {
		if (
			gameboard[0][i] == gameboard[1][i] &&
			gameboard[1][i] == gameboard[2][i] &&
			gameboard[0][i] != '' &&
			gameboard[1][i] != '' &&
			gameboard[2][i] != ''
		) {
			whoWon = gameboard[0][i];
			return whoWon;
		}
	}

	// diagonal
	if (
		gameboard[0][0] == gameboard[1][1] &&
		gameboard[1][1] == gameboard[2][2] &&
		gameboard[0][0] != '' &&
		gameboard[1][1] != '' &&
		gameboard[2][2] != ''
	) {
		whoWon = gameboard[0][0];
		return whoWon;
	}

	if (
		gameboard[2][0] == gameboard[1][1] &&
		gameboard[1][1] == gameboard[0][2] &&
		gameboard[2][0] != '' &&
		gameboard[1][1] != '' &&
		gameboard[0][2] != ''
	) {
		whoWon = gameboard[2][0];
		return whoWon;
	}

	// tie
	if (totalMoves == 9 && whoWon == null) {
		return null;
	}

	return false;
}

function minimax(newBoard, depth, player) {
	const gameState = isGameOver();

	if (gameState === false) {
		const values = [];
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				const gridCopy = _.cloneDeep(newBoard);
				if (gridCopy[i][j] !== '') continue;
				gridCopy[i][j] = player;
				const value = minimax(gridCopy, depth + 1, player === huPlayer ? aiPlayer : huPlayer);
				values.push({
					cost: value,
					cell: {
						i: i,
						j: j
					}
				});
			}
		}
		if (player === aiPlayer) {
			const max = _.maxBy(values, (v) => {
				return v.cost;
			});
			if (depth === 0) {
				return max.cell;
			} else {
				return max.cost;
			}
		} else {
			const min = _.minBy(values, (v) => {
				return v.cost;
			});
			if (depth === 0) {
				return min.cell;
			} else {
				return min.cost;
			}
		}
	} else if (gameState === null) {
		return 0;
	} else if (gameState === huPlayer) {
		return depth - 10;
	} else if (gameState === aiPlayer) {
		return 10 - depth;
	}
}
