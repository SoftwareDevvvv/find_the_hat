// NOT OPTIMIZED
const levels = require("./levels");

const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";
const STEP = 1;
class Field {
  constructor(fieldArray) {
    this._fieldArray = fieldArray;
    this._playerCoords = [0, 0];
    this._fallInHole = false;
    this._outOfBound = false;
    this._won = false;
    this._hatCoords = [2, 1];
  }

  print() {
    for (let char of this._fieldArray) console.log(char);
  }

  checkWin(move) {
    if (!move) return;
    if (this._fieldArray[move[0]][move[1]] === hat) this._won = true;
  }

  fieldHeight() {
    return this._fieldArray.length;
  }

  fieldWidth() {
    return this._fieldArray[0].length;
  }

  checkIfMoveInHole(move) {
    if (!move) return;
    if (this._fieldArray[move[0]][move[1]] === hole) this._fallInHole = true;
  }

  checkOutOfBound() {
    if (
      this._playerCoords[0] < 0 ||
      this._playerCoords[0] > this.fieldHeight() - 1
    ) {
      this._outOfBound = true;
    }
    if (
      this._playerCoords[1] < 0 ||
      this._playerCoords[1] > this.fieldWidth() - 1
    ) {
      this._outOfBound = true;
    }
  }
  update(currentCoords, ToCoords) {
    this.checkWin(ToCoords);
    this.checkIfMoveInHole(ToCoords);
    this.checkOutOfBound();
    this._fieldArray[currentCoords[0]][currentCoords[1]] = fieldCharacter;
    this._fieldArray[ToCoords[0]][ToCoords[1]] = pathCharacter;
  }

  move(command) {
    let invalidCommand = false;
    let currentCoords = [...this._playerCoords];
    if (command === "u") {
      this._playerCoords[0] -= STEP;
    } else if (command === "d") {
      this._playerCoords[0] += STEP;
    } else if (command === "r") {
      this._playerCoords[1] += STEP;
    } else if (command === "l") {
      this._playerCoords[1] -= STEP;
    } else {
      invalidCommand = true;
    }

    this.update(currentCoords, this._playerCoords);
  }

  playGame() {
    while (!this._outOfBound && !this._fallInHole && !this._won) {
      console.clear();
      this.print();
      const command = prompt(
        "What's your move? [u] UP, [d] DOWN, [r] RIGHT, [l] LEFT"
      );
      this.move(command);
    }
    if (this._outOfBound) {
      console.log("You went outside, grab me a drink with you, would ya?");
    }
    if (this._fallInHole) {
      console.log("You Fall, lemme get help for you!");
    }
    if (this._won) {
      console.log(
        "You win, Congratulations on winning this, you must put it on your cv!"
      );
    }
  }
}

for (let level of levels.levels) {
  const myField = new Field(level);
  myField.playGame();
}
