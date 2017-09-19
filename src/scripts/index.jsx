import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/board.jsx';
import Scoreboard from './components/scoreboard.jsx';
import SVG from '../helpers/svg.jsx';
import FinishMove from './components/finishMove.jsx';


function User(props) {
    return (
        <svg viewBox="0 0 337 321">
            <use xlinkHref={props.index == 0 ? '#svg_x' : '#svg_kiss'} className={props.index == 0 ? 'ico-blue' : 'ico-yellow'}></use>
        </svg>
    )
}

class Game extends React.Component {

    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill({
                    player: null,
                    move: null
                })
            }],
            stepNumber: 0,
            currentPlayer: 'X',
            game: {
                users: [{
                    name: 'Player 1',
                    score: 0
                }, {
                    name: 'Player 2',
                    score: 0
                }],
            },
            winStrike: '',
            opponent: 'O',
            strategy: 'offense'
        };
    }

    playerSelection(player) {
        this.setState({
           opponent: player === 'X' ? 'O' : 'X' });

        if (this.isOpponentNext()) {
            this.automateClick(); }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (!squares[i].player) {
            squares[i] = {
                player: this.state.currentPlayer };

            let isWinningMove;
            isWinningMove = calculateWinner(squares);
            isWinningMove = isWinningMove ?  _determineWinningLine(isWinningMove) : '';

            this.setState({
                history: history.concat([{
                    squares: squares,
                    move: i
                }]),
                stepNumber: history.length,
                currentPlayer: this.returnPlayer('', 'next'),
                winStrike: isWinningMove ? isWinningMove : ''
            });

            if (isWinningMove) {
                let updateUserData = this.state.game.users;
                let user = this.returnPlayer('number', '', squares[i].player);
                updateUserData[user].score = updateUserData[user].score + 1;

                setTimeout(() => {
                    this.restartGame();
                    this.setState({
                        game: {
                            users: updateUserData
                        },
                        winStrike: ''
                    });
                }, 1000)

            } else if (history.length === 9) {
                setTimeout(() => {
                    this.restartGame();
                }, 1000);

            } else {
                setTimeout(() => {
                    let lastMove = this.state.history[this.state.history.length - 1].squares;
                    if (this.isOpponentNext() && (squares === lastMove)) {
                        this.automateClick(squares);
                    }
                }, 500);
            }

        }
    }

        isOpponentNext() {
            return (this.returnPlayer() == this.state.opponent) ? true : false;
        }

        returnPlayer(type, state, player) {
            if (!player) {
                player = this.state.currentPlayer; }

            if (type == 'number') {
                if (state == 'next') {
                    return player == 'X' ? '1' : '0' }
                return player == 'X' ? '0' : '1'
            }

            if (state == 'next') {
                return player == 'X' ? 'O' : 'X'; }
            return player
        }


    automateClick(squares) {
        this.handleClick(this.possibleMoves(squares));
    }

    // Has game been won check
    possibleMoves(squares) {
        squares = squares ? squares : [0,1,2,3,4,5,6,7,8];
        let playStyle = this.state.strategy;
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

        if (playStyle == 'random') {
            return _randomize(squares); }

        let user = playStyle == 'defense' ? this.returnPlayer('letter', 'next') : this.returnPlayer();
        let move = _singleOut(squares, user, lines);
        if (!move) { move = _securePosition(squares, user, lines) }
        return !move ? _randomize(squares) : move;

        function _singleOut(squares, user, lines) {
            for (let i = 0; i < lines.length; i++) {
                const [a, b, c] = lines[i];
                if (((squares[a].player == user) && (squares[b].player == user) && (!squares[c].player)) ||
                    ((squares[b].player == user) && (squares[c].player == user) && (!squares[a].player)) ||
                    ((squares[a].player == user) && (squares[c].player == user) && (!squares[b].player))) {
                    if (!squares[a].player)         { return a }
                    else if (!squares[b].player)    { return b }
                    else if (!squares[c].player)    { return c }
                }
            }
            return false;
        }

        function _securePosition(squares, user, lines) {
            for (let i = 0; i < lines.length; i++) {
                const[a, b, c] = lines[i];
                if (((squares[a].player == user) && (!squares[b].player) && (!squares[c].player)) ||
                    ((squares[b].player == user) && (!squares[c].player) && (!squares[a].player)) ||
                    ((squares[a].player == user) && (!squares[c].player) && (!squares[b].player))) {
                    if (!squares[a].player)         { return a }
                    else if (!squares[b].player)    { return b }
                    else if (!squares[c].player)    { return c }
                }
            }
            return false;
        }

        function _randomize(squares) {
            let availableMoves = [];
            squares.forEach((move, index) => {
                if (!move.player) {
                    availableMoves[availableMoves.length] = index; }
            })

            let getRandomOpenSlot = 0;
            if (availableMoves.length > 1) {
                getRandomOpenSlot = Math.round(Math.random() * ((availableMoves.length - 1) - 1) + 1);
            }
            return availableMoves[getRandomOpenSlot];
        }
    }

    // Restart game
    restartGame() {
        this.setState({
            history: [{
                squares: Array(9).fill({
                    player: null,
                    move: null
                })
            }],
            stepNumber: 0,
            currentPlayer: this.returnPlayer('letter', 'next')
        });

        // If last move played was PC check
        if (this.isOpponentNext()) {
            this.automateClick();
        }
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winningSlash = this.state.winStrike;
        let user = winningSlash ? this.returnPlayer('number', 'next') : this.returnPlayer('number');

        return (
            <div className="game">
                <SVG />
                <div className="game-info">
                    <div id="status" className={ user == 0 ? 'ico-blue' : 'ico-yellow'}>
                        <player><User index={ user } /></player>
                        <h4>&nbsp;{ winningSlash ? 'wins!!!' : 'next up!' }&nbsp;</h4>
                    </div>
                </div>

                <FinishMove direction={ winningSlash } winner={ user } />
                <Board squares={current.squares} onClick={(i) => this.isOpponentNext() ? '' : this.handleClick(i)}/>
                <Scoreboard game={this.state.game} />

            </div>
        );
    }
}

// Has game been won check
function calculateWinner(squares) {
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
            return lines[i];
        }
    }
}

// which direction was the winning line
function _determineWinningLine(winner) {
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


// ========================================

var appContainer = document.createElement('div');
appContainer.id = "appHolder";
document.body.appendChild(appContainer);

var addFont = document.createElement('link');
addFont.href = 'https://fonts.googleapis.com/css?family=Architects+Daughter';
addFont.rel = 'stylesheet';
document.head.appendChild(addFont);

ReactDOM.render(<Game />, document.getElementById('appHolder'));
