
export default class Place {

    possibleMoves(squares, thisUser) {
        squares = squares ? squares : [0, 1, 2, 3, 4, 5, 6, 7, 8];
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        let move = _singleOut(squares, thisUser, lines);
        if (move === false) { move = _singleOut(squares, thisUser == 'X' ? 'O' : 'X', lines); }
        if (move === false) { move = _securePosition(squares, thisUser, lines) }
        return move === false ? _randomize(squares, this) : move;

        function _singleOut(squares, user, lines) {
            for (let i = 0; i < lines.length; i++) {
                const [a, b, c] = lines[i];
                if (((squares[a].player == user) && (squares[b].player == user) && !squares[c].player) ||
                    ((squares[b].player == user) && (squares[c].player == user) && !squares[a].player) ||
                    ((squares[a].player == user) && (squares[c].player == user) && !squares[b].player)) {
                    if (!squares[a].player) {
                        return a
                    }
                    else if (!squares[b].player) {
                        return b
                    }
                    else if (!squares[c].player) {
                        return c
                    }
                }
            }
            return false;
        }

        function _securePosition(squares, user, lines) {
            for (let i = 0; i < lines.length; i++) {
                const [a, b, c] = lines[i];
                if (((squares[a].player == user) && (!squares[b].player) && (!squares[c].player)) ||
                    ((squares[b].player == user) && (!squares[c].player) && (!squares[a].player)) ||
                    ((squares[a].player == user) && (!squares[c].player) && (!squares[b].player))) {
                    if (!squares[a].player) {
                        return a
                    }
                    else if (!squares[b].player) {
                        return b
                    }
                    else if (!squares[c].player) {
                        return c
                    }
                }
            }
            return false;
        }

        function _randomize(squares, $this) {
            let availableMoves = [];
            squares.forEach((move, index) => {
                if (!move.player) {
                    availableMoves[availableMoves.length] = index;
                }
            })

            let getRandomOpenSlot = 0;
            if (availableMoves.length > 1) {
                getRandomOpenSlot = Math.round(Math.random() * ((availableMoves.length - 1) - 1) + 1); }
            return availableMoves[getRandomOpenSlot];
        }
    }
}