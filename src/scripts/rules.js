

export default class RuleBook {

    calculateWinner(squares) {
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

        for (let i = 0; i < lines.length; i++) {
            const[a, b, c] = lines[i];
            if (squares[a].player != null &&
                squares[a].player === squares[b].player &&
                squares[a].player === squares[c].player) {
                return this._determineWinningLine(lines[i]);
            }
        }

        return false;
    }

    _determineWinningLine(winner) {
        winner.forEach((number, index) => {
            winner[index] = parseInt(number) + 1;
        });

        if ((winner[1] - winner[0]) === 1) {
            if (winner[0] === 1) {          return 'horizontal horizontal__top';}
            else if(winner[0] === 7) {      return 'horizontal horizontal__bottom';}
            else {                          return 'horizontal';}

        } else if ((winner[1] - winner[0]) === 4 || (winner[1] - winner[0]) === 2) {
            if (winner[0] === 1) {          return 'diagonal diagonal__startLeft';}
            else {                          return 'diagonal diagonal__startRight';}

        } else if ((winner[1] - winner[0]) === 3) {
            if (winner[0] === 1) {          return 'vertical vertical__left';}
            else if (winner[0] === 3) {     return 'vertical vertical__right';}
            else {                          return 'vertical';}

        }
    }
}