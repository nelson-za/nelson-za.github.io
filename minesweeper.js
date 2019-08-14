// Minesweeper

let grid;
let cols;
let rows;
let isGameOver = false;
// w 90, 10 cols; w 30, 30 cols
let w = 30 * 2;
// cols 30
// rows 16
// bombs 90
let totalBombs = 99;

let winCount = 30 * 16 - totalBombs;
let revealedCount = 0;

// 30 cols
// 16 rows

function setup() {
	canvas = createCanvas(902 * 2, 482 * 2);
	//canvas = createCanvas(902, 902);
	canvas.parent('game');

	cols = floor(width / w);
	rows = floor(height / w);

	grid = createArray(cols, rows);

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j] = new Cell(i, j, w);
		}
	}

	// pick totalBomb spots //

	let options = [];
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			options.push([ i, j ]);
		}
	}

	for (let n = 0; n < totalBombs; n++) {
		let index = floor(random(options.length));
		let choice = options[index];
		let i = choice[0];
		let j = choice[1];
		options.splice(index, 1);
		grid[i][j].bomb = true;
	}

	// pick totalBomb spots //

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j].countBombNeighbors();
		}
	}

	let button = createButton('Reset').style('color', '#000').style('font-size', '16pt');
	button.mousePressed(resetSketch);

	let revealSquare = createP('Left click to reveal sqaure!').style('color', '#000').style('font-size', '32pt');
	let placeFlag = createP('Middle mouse to place or remove a flag!')
		.style('color', '#000')
		.style('font-size', '32pt');

	//console.log(winCount);
}

function draw() {
	// logic
	if (revealedCount === winCount) {
		gameWon();
	}

	// draw
	frameRate(60);
	background(255);

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j].show();
		}
	}
}

function resetSketch() {
	window.location.reload();
}

function mousePressed() {
	if (mouseButton === LEFT) {
		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
				if (grid[i][j].contains(mouseX, mouseY)) {
					grid[i][j].reveal();

					if (grid[i][j].bomb) {
						gameOver();
					}
				}
			}
		}
	}
	if (mouseButton === CENTER) {
		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
				if (grid[i][j].contains(mouseX, mouseY)) {
					if (!this.revealed) {
						if (!grid[i][j].flagPlaced) {
							grid[i][j].flagPlaced = true;
						} else if (grid[i][j].flagPlaced) {
							grid[i][j].flagPlaced = false;
						}
					}
				}
			}
		}
	}
}

function gameOver() {
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j].revealed = true;
			isGameOver = true;
			revealedCount = 30 * 16;
			noLoop();
		}
	}
}

function gameWon() {
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j].revealed = true;
			isGameOver = true;
			let gameHasBeenWon = createP('You have won!').style('color', '#000').style('font-size', '32pt');
			noLoop();
		}
	}
}

function createArray(cols, rows) {
	let arr = new Array(cols);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(rows);
	}
	return arr;
}

class Cell {
	constructor(i, j, w) {
		this.i = i;
		this.j = j;
		this.x = this.i * w;
		this.y = this.j * w;
		this.w = w;
		this.neigborCount = 0;

		this.bomb = false;
		this.flagPlaced = false;

		this.revealed = false;
	}

	countBombNeighbors() {
		if (this.bomb) {
			this.neigborCount = -1;
		} else {
			let total = 0;

			for (let xoff = -1; xoff <= 1; xoff++) {
				for (let yoff = -1; yoff <= 1; yoff++) {
					let i = this.i + xoff;
					let j = this.j + yoff;
					if (i > -1 && i < cols && j > -1 && j < rows) {
						let neigbor = grid[i][j];
						if (neigbor.bomb) {
							total++;
						}
					}
				}
			}
			this.neigborCount = total;
		}
	}

	show() {
		stroke(0);
		strokeWeight(3);
		noFill();
		rect(this.x, this.y, this.w, this.w);
		if (this.revealed) {
			if (this.bomb) {
				fill(255, 0, 0);
				ellipse(this.x + this.w * 0.5, this.y + this.w * 0.5, this.w * 0.5);
			} else {
				if (this.neigborCount > 0) {
					fill(200);
					rect(this.x, this.y, this.w, this.w);
					fill(200);
					textAlign(CENTER);
					textSize(48 / 3 * 2);
					fill(0);
					noStroke();
					text(this.neigborCount, this.x + this.w * 0.5, this.y + this.w - 24 / 3 * 2);
				} else {
					fill(0, 235, 100);
					rect(this.x, this.y, this.w, this.w);
				}
			}
		}
		if (this.flagPlaced && !this.revealed) {
			fill(0, 150, 235);
			//rect(this.x + this.w * 0.25, this.y + this.w * 0.25, this.w * 0.5, this.w * 0.5);
			ellipse(this.x + this.w * 0.5, this.y + this.w * 0.5, this.w * 0.5);
		}
	}

	contains(x, y) {
		if (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w) {
			return true;
		} else {
			return false;
		}
	}

	reveal() {
		this.revealed = true;
		if (this.revealed && !this.bomb) {
			revealedCount++;
		}
		if (this.neigborCount == 0) {
			this.floodFill();
		}
	}

	floodFill() {
		for (let xoff = -1; xoff <= 1; xoff++) {
			for (let yoff = -1; yoff <= 1; yoff++) {
				let i = this.i + xoff;
				let j = this.j + yoff;
				if (i > -1 && i < cols && j > -1 && j < rows) {
					let neigbor = grid[i][j];
					if (!neigbor.bomb && !neigbor.revealed) {
						neigbor.reveal();
					}
				}
			}
		}
	}
}
