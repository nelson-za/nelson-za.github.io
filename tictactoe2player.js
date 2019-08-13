let squares = [];
let totalSquares = 3;

let board = [ '', '', '', '', '', '', '', '', '' ];
let gameboard = [ [ '', '', '' ], [ '', '', '' ], [ '', '', '' ] ];

let totalMoves = 0;

let players = [ 'X', 'O' ];

let isWinner = false;

let currentPlayer;

let currentPlayerD;

let startText = 'Starting Player: ' + currentPlayer;

function setup() {
	canvas = createCanvas(900, 900);
	canvas.parent('game');

	let squareSize = width / totalSquares;
	let index = 0;

	for (let j = 150; j < height; j += squareSize) {
		for (let i = 150; i < width; i += squareSize) {
			squares.push(new Square(i, j, squareSize, index));
			index++;
		}
	}

	currentPlayer = random(players);
	startText = 'Starting Player: ' + currentPlayer;

	let button = createButton('Reset').style('color', '#000').style('font-size', '16pt');
	button.mousePressed(resetSketch);

	console.log('Current Player: ' + currentPlayer);
	currentPlayerD = createP(startText).style('color', '#000').style('font-size', '32pt');
}

function draw() {
	if (!isWinner) {
		// logic
		updateGameboard();
		winCheck();

		// draw
		background(255);

		for (let i = 0; i < squares.length; i++) {
			squares[i].show();
		}
	}
}

function resetSketch() {
	// isWinner = false;
	// squares = [];
	// board = [ '', '', '', '', '', '', '', '', '' ];
	// gameboard = [ [ '', '', '' ], [ '', '', '' ], [ '', '', '' ] ];
	// totalMoves = 0;

	// let squareSize = width / totalSquares;
	// let index = 0;

	// for (let j = 150; j < height; j += squareSize) {
	// 	for (let i = 150; i < width; i += squareSize) {
	// 		squares.push(new Square(i, j, squareSize, index));
	// 		index++;
	// 	}
	// }

	// currentPlayer = random(players);
	// startText = 'Starting Player: ' + currentPlayer;

	// currentPlayerD = null;

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
	let winner = null;

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
			if (this.value == '' && currentPlayer == 'X') {
				this.col = color(0, 255, 0, 100);

				this.value = 'X';

				for (let i = 0; i < 9; i++) {
					if (this.index == i) {
						board[i] = this.value;
					}
				}

				totalMoves++;

				currentPlayer = players[1];

				console.log('X made a move!');
				console.log('Current Player: ' + currentPlayer);
			} else if (this.value == '' && currentPlayer == 'O') {
				this.col = color(0, 0, 255, 100);

				this.value = 'O';

				for (let i = 0; i < 9; i++) {
					if (this.index == i) {
						board[i] = this.value;
					}
				}

				totalMoves++;

				currentPlayer = players[0];

				console.log('O made a move!');
				console.log('Current Player: ' + currentPlayer);
			}
		}
	}
}
