import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/board.jsx';
import Scoreboard from './components/scoreboard.jsx';
import SVG from '../helpers/svg.jsx';

import tilePlacement from './place.js';
let Place = new tilePlacement();

import ruleBook from './rules.js';
let Rule = new ruleBook();

function User(props) {
    /*let randomPosition = Math.round(Math.random() * ((10 - 1) - 1) + 1);
    console.log('randomPosition >>', randomPosition);*/

    return (
        <svg viewBox="0 0 337 321">
            <use xlinkHref={props.index == 0 ? '#svg_x' : '#svg_kiss'} className={props.index == 0 ? 'ico-blue' : 'ico-yellow'} ></use>
        </svg>
    )
}

function FinishingMove(props) {
    return (
        <div className={ props.direction ? ('overlay ' + props.direction) : 'hidden' }>
            <svg viewBox="0 0 273 1328">
                <use xlinkHref="#svg_slash" className={ props.winner == 0 ? 'ico-blue' : 'ico-yellow' }></use>
            </svg>
        </div>
    );
}

class Game extends React.Component {

    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill({
                    player: null,
                    position: null
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
        };
    }

    playerSelection(player) {
        this.setState({
           opponent: player === 'X' ? 'O' : 'X' });
        this.isOpponentNext();
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (!squares[i].player) {
            squares[i] = {
                player: this.state.currentPlayer,
                position: Math.round(Math.random() * (12 - 1) + 1)
            };

            let isWinningMove = Rule.calculateWinner(squares);
            this.setState({
                history: history.concat([{
                    squares: squares,
                    move: i
                }]),
                stepNumber: history.length,
                currentPlayer: this._returnPlayer('', 'next'),
                winStrike: isWinningMove
            });

            if (isWinningMove) {
                this._updateScores({} = this.state.game.users, squares[i].player);

            } else if (history.length === 9) {
                setTimeout(() => {
                    this.restartGame(); }, 1000);

            } else {
                setTimeout(() => {
                    let lastMove = this.state.history[this.state.history.length - 1].squares;
                    this.isOpponentNext((squares === lastMove), squares); }, 500);
            }
        }
    }

        _updateScores(userData, player) {
            let user = this._returnPlayer('number', '', player);
            userData[user].score = userData[user].score + 1;

            setTimeout(() => {
                this.restartGame();
                this.setState({
                    game: {
                        users: userData
                    },
                    winStrike: ''
                });
            }, 1000)
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
            currentPlayer: this._returnPlayer('letter', 'next')
        });

        this.isOpponentNext();
    }

        isOpponentNext(condition, squares) {
            let currentPlayer = this._returnPlayer();
            if (currentPlayer == this.state.opponent) {
                if (condition == true) {
                    this.handleClick(Place.possibleMoves(squares, currentPlayer));
                } else {
                    if (condition != false) {
                        this.handleClick(Place.possibleMoves(squares, currentPlayer));
                    }
                }
            }
        }

        _returnPlayer(type, state, player) {
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



    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winningSlash = this.state.winStrike;
        let user = winningSlash ? this._returnPlayer('number', 'next') : this._returnPlayer('number');

        return (
            <div className="game">
                <SVG />
                <div className="game-info">
                    <div id="status" className={ user == 0 ? 'ico-blue' : 'ico-yellow'}>
                        <player><User index={ user } /></player>
                        <h4>&nbsp;{ winningSlash ? 'wins!!!' : 'next up!' }&nbsp;</h4>
                    </div>
                </div>

                <FinishingMove direction={ winningSlash } winner={ user } />
                <Board squares={current.squares} onClick={(i) => this._returnPlayer() == this.state.opponent ? '' : this.handleClick(i)}/>
                <Scoreboard game={this.state.game} />

            </div>
        );
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