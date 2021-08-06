var ws = new WebSocket("ws://h2903214.stratoserver.net:53112/login/Joanna/geheim");

ws.onopen = function () {
    alert("Opened!");
    ws.send("JOIN_GAME Torsten");
    ws.send("VIEW_GAME Torsten");
};

const originalGameField = [
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
]

ws.onmessage = function (evt) {
    let data = evt.data
    console.log(originalGameField)
    if (data.substr(13, 1) === "1" && evt.data.startsWith('PLAYER_MOVED')) {
        let x = data.substr(15, 1);
        let y = data.substr(17, 1);
        playedMove(x, y, 1)
    } else if (evt.data.startsWith('PLAYER_MOVED')) {
        let x = data.substr(15, 1);
        let y = data.substr(17, 1);
        playedMove(x, y, 0)
    }

    if (evt.data.startsWith('PLAYER_MOVED')) {
        var result;

        if (checkForWin(1, originalGameField) != undefined) {
            result = checkForWin(1, originalGameField).xAxis;
            setTimeout(function () {
                ws.send("MOVE " + result);
            }, 3000);
            console.log("Win: ", result)
            return
        } else if (checkForWin(0, originalGameField) != undefined) {
            var result2 = checkForWin(0, originalGameField).xAxis;
            ws.send("MOVE " + result2);
            console.log("Defeated: ", result2)
            return
        } else if (threeInARow(1, 0, originalGameField) != undefined) {
            result = threeInARow(1, 0, originalGameField).xAxis;
            ws.send("MOVE " + result);
            console.log("Three in Row ", result)
            return
        } else if (threeInARow(0, 1, originalGameField) != undefined) {
            result = threeInARow(0, 1, originalGameField).xAxis;
            ws.send("MOVE " + result);
            console.log("Three in Row/ Opponent: ", result)
            return
        } else if (checkPossibleMoves(1) != undefined) {
            result = checkPossibleMoves(1).xAxis;
            ws.send("MOVE " + result);
            console.log("Could Win in two: ", result)
            return
        } else if (checkPossibleMoves(0) != undefined) {
            result = checkPossibleMoves(0).xAxis;
            ws.send("MOVE " + result);
            console.log("Could lose in two/ Opponent: ", result)
            return
        } else {
            let indexRow = 0;
            for (let row in originalGameField) {
                indexRow++;
                if (indexRow > 5) {

                }
            }
            var random = Math.floor(Math.random() * 3 + 2);
            ws.send("MOVE " + random);
            console.log("random: ", random)
            return
        }
    }
};

function playedMove(x, y, player) {
    originalGameField[x][y] = player;
}

function checkForWin(p1, gameField) {
    let indexRow = 0;

    for (let row of gameField) {
        let index = 0

        if (indexRow < 5) {
            for (let place of row) {
                if (indexRow === 0 && place === -1 && indexRow < 6 || indexRow > 0 && gameField[indexRow - 1][index] >= 0 && place === -1 && indexRow < 6) {
                    if (
                        // 3 left, 3 right, 2 left & 1 right, 1 left & 2 right
                        row[index + 1] === p1 && row[index + 2] === p1 && row[index + 3] === p1 ||
                        row[index - 1] === p1 && row[index - 2] === p1 && row[index - 3] === p1 ||
                        row[index - 1] === p1 && row[index + 1] === p1 && row[index + 2] === p1 ||
                        row[index - 1] === p1 && row[index - 2] === p1 && row[index + 1] === p1 ||
                        // beginning from column 4 -> 3 down 
                        indexRow >= 3 && gameField[indexRow - 1][index] === p1 && gameField[indexRow - 2][index] === p1 && gameField[indexRow - 3][index] === p1 ||
                        // diagonal 
                        indexRow >= 3 && gameField[indexRow - 1][index + 1] === p1 && gameField[indexRow - 2][index + 2] === p1 && gameField[indexRow - 3][index + 3] === p1 ||
                        indexRow >= 2 && indexRow < 5 && gameField[indexRow - 1][index + 1] === p1 && gameField[indexRow + 1][index - 1] === p1 && gameField[indexRow - 2][index + 2] === p1 ||
                        indexRow >= 1 && indexRow < 4 && gameField[indexRow - 1][index + 1] === p1 && gameField[indexRow + 1][index - 1] === p1 && gameField[indexRow + 2][index - 2] === p1 ||
                        indexRow >= 0 && indexRow < 3 && gameField[indexRow + 1][index - 1] === p1 && gameField[indexRow + 2][index - 2] === p1 && gameField[indexRow + 3][index - 3] === p1 ||

                        indexRow >= 3 && gameField[indexRow - 1][index - 1] === p1 && gameField[indexRow - 2][index - 2] === p1 && gameField[indexRow - 3][index - 3] === p1 ||
                        indexRow >= 2 && indexRow < 5 && gameField[indexRow - 1][index - 1] === p1 && gameField[indexRow - 2][index - 2] === p1 && gameField[indexRow + 1][index + 1] === p1 ||
                        indexRow >= 1 && indexRow < 4 && gameField[indexRow - 1][index - 1] === p1 && gameField[indexRow + 1][index + 1] === p1 && gameField[indexRow + 2][index + 2] === p1 ||
                        indexRow >= 0 && indexRow < 3 && gameField[indexRow + 1][index + 1] === p1 && gameField[indexRow + 2][index + 2] === p1 && gameField[indexRow + 3][index + 3] === p1
                    ) {
                        const winningMove = {
                            xAxis: index,
                            yAxis: indexRow
                        }
                        return winningMove
                    }
                }
                index++;
            }
        } else return undefined
        indexRow++;
    }
}

function threeInARow(p1, p2, gameField) {
    let indexRow = 0;

    for (let row of gameField) {
        let index = 0
        if (indexRow < 5) {
            for (let place of row) {
                if (indexRow === 0 && place === -1 && indexRow < 6 || indexRow > 0 && gameField[indexRow - 1][index] >= 0 && place === -1 && indexRow < 6) {
                    if (
                        indexRow > 0 && row[index + 1] === p1 && row[index + 2] === p1 && row[index + 3] !== p2 && row[index - 1] !== p2 && gameField[indexRow - 1][index + 3] !== -1 && gameField[indexRow - 1][index - 1] !== -1 ||
                        indexRow === 0 && row[index + 1] === p1 && row[index + 2] === p1 && row[index + 3] !== p2 && row[index - 1] !== p2 ||
                        indexRow > 0 && row[index - 1] === p1 && row[index - 2] === p1 && row[index - 3] !== p2 && row[index + 1] !== p2 && gameField[indexRow - 1][index - 3] !== -1 && gameField[indexRow - 1][index + 1] !== -1 ||
                        indexRow === 0 && row[index - 1] === p1 && row[index - 2] === p1 && row[index - 3] !== p2 && row[index + 1] !== p2
                    ) {
                        const threeInARowMove = {
                            xAxis: index,
                            yAxis: indexRow
                        }
                        return threeInARowMove
                    }
                }
                index++;
            }
        } else return undefined
        indexRow++;
    }

}

function checkPossibleMoves(p1) {
    var gameFieldCopy = [];
    gameFieldCopy = JSON.parse(JSON.stringify(originalGameField))
    let indexRow = 0;
    for (let row of gameFieldCopy) {
        let index = 0

        if (indexRow < 5) {
            for (let place of row) {
                if (indexRow === 0 && place === -1 && indexRow < 6 || indexRow > 0 && gameFieldCopy[indexRow - 1][index] >= 0 && place === -1 && indexRow < 6) {
                    gameFieldCopy[indexRow][index] = p1;
                    var winAfterTwo = checkForWin(p1, gameFieldCopy)
                    if (winAfterTwo !== undefined) {
                        const possibleMove = {
                            xAxis: index,
                            yAxis: indexRow
                        }
                        return possibleMove
                    } else {
                        gameFieldCopy = JSON.parse(JSON.stringify(originalGameField))
                    }
                }
                index++;

            }
        } else return undefined
        indexRow++;
    }
}

ws.onclose = function () {
    alert("Closed!");
};

ws.onerror = function (err) {
    alert("Error: " + err);
};
