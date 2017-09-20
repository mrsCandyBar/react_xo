import React from 'react';
import Board from '../components/board.jsx';
import Scoreboard from '../components/scoreboard.jsx';
import SVG from '../../helpers/svg.jsx';

import tilePlacement from '../place.js';
let Place = new tilePlacement();

import ruleBook from '../rules.js';
let Rule = new ruleBook();

function User(props) {
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

export default class Game extends React.Component {

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

    componentDidMount() {
        this.playerSelection(this.props.location.state.opponent);
    }

    componentDidUpdate() {
        if (this.state.history.length === 10 || this.state.winStrike != '') {
            setTimeout(() => {
                this.state.winStrike = '';
                this.restartGame();
            }, 1000);

        } else {
            this.isOpponentNext(this.state.history[this.state.history.length - 1].squares);
        }
    }

    playerSelection(player) {
        this.setState({
            opponent: player == 'X' ? 'O' : 'X' });
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

            if (isWinningMove) {
                let userData = this._updateScores(this.state.game.users, squares[i].player);
                this.setState({
                    history: history.concat([{
                        squares: squares,
                        move: i
                    }]),
                    stepNumber: history.length,
                    currentPlayer: this._returnPlayer('', 'next'),
                    game: {
                        users: userData
                    },
                    winStrike: isWinningMove
                });

            } else {
                this.setState({
                    history: history.concat([{
                        squares: squares,
                        move: i
                    }]),
                    stepNumber: history.length,
                    currentPlayer: this._returnPlayer('', 'next'),
                    winStrike: isWinningMove
                });
            }
        }
    }

    _updateScores(userData, player) {
        let user = this._returnPlayer('number', '', player);
        userData[user].score = userData[user].score + 1;
        return userData;
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
    }

    isOpponentNext(squares) {
        let currentPlayer = this._returnPlayer();
        console.log(currentPlayer == this.state.opponent);
        if (currentPlayer == this.state.opponent) {
            setTimeout(() => {
                this.handleClick(Place.possibleMoves(squares, currentPlayer));
            }, 400);
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