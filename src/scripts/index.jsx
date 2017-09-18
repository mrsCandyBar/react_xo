import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/board.jsx';
import Scoreboard from './components/scoreboard.jsx';
import SVG from '../helpers/svg.jsx';
import FinishMove from './components/finishMove.jsx';


function ReturnPlayer(props) {
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
            xIsNext: true,
            game: {
                users: [{
                    name: 'Player 1',
                    score: 0
                }, {
                    name: 'Player 2',
                    score: 0
                }],
            },
            winStrike: ''
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (!squares[i].player) {
            squares[i] = {
                player: this.state.xIsNext ? 'X' : 'O'
            }

            let isWinningMove = calculateWinner(squares);
            isWinningMove = isWinningMove ?  _determineWinningLine(isWinningMove) : '';
            this.setState({
                history: history.concat([{
                    squares: squares,
                    move: i
                }]),
                stepNumber: history.length,
                xIsNext: !this.state.xIsNext,
                winStrike: isWinningMove ? isWinningMove : ''
            });

            if (isWinningMove) {
                let updateUserData = this.state.game.users;
                let user = this.state.xIsNext ? 0 : 1;
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
                }, 700);
            }

        }
    }

    restartGame() {
        this.setState({
            history: [{
                squares: Array(9).fill({
                    player: null,
                    move: null
                })
            }],
            stepNumber: 0,
            xIsNext: this.state.xIsNext ? true : false,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2 === 0) ? true : false
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winStreak = this.state.winStrike;

        let status;
        if (winStreak) {
            let winningUser = this.state.xIsNext ? 1 : 0;
            status = 'Winner: ' + this.state.game.users[winningUser].name;
        }

        return (
            <div className="game">
                <SVG />
                <div className="game-info">
                    <div id="status" className={ this.state.xIsNext ? 'ico-blue' : 'ico-yellow'}>
                        &nbsp;{ !winStreak ? 'next move ' : '' }&nbsp;
                        <player><ReturnPlayer index={ this.state.xIsNext ? 0 : 1} /></player>
                        <h4>&nbsp;{ winStreak ? 'wins!!!' : '' }&nbsp;</h4>
                    </div>
                </div>

                <FinishMove direction={ winStreak } winner={ !this.state.xIsNext } />
                <Board
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}/>

                <Scoreboard game={this.state.game} />

            </div>
        );
    }
}

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
