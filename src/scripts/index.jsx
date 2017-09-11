import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/board.jsx';

class Game extends React.Component {

    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill({
                    player: null,
                    winCheck: false,
                    move: null
                })
            }],
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i].player) {
            return;
        }
        squares[i] = {
            player: this.state.xIsNext ? 'X' : 'O',
            winCheck: false
        }


        this.setState({
            history: history.concat([{
                squares: squares,
                move: i
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    restartGame() {
        this.setState({
            history: [{
                squares: Array(9).fill({
                    player: null,
                    winCheck: false,
                    move: null
                })
            }],
            stepNumber: 0,
            xIsNext: this.state.xIsNext ? true : false
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
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const desc = move ?
                'Move #' + step.move : 'Game start';

            return (
              <li key={move} className={this.state.stepNumber === move  ? 'bold' : ''} >
                  <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
              </li>
            );
        })

        let status;
        if (winner) {
            status = 'Winner: ' + (this.state.xIsNext ? 'O' : 'X');
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winningSquares={winner}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <ol>{ moves }</ol>
                </div>

                <button
                    className={ winner ? '' : 'hidden'}
                    onClick={() => this.restartGame() }>
                    Restart
                </button>
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

            squares[a].winCheck = true;
            squares[b].winCheck = true;
            squares[c].winCheck = true;
            return lines[i];
        }
    }
}

// ========================================

var appContainer = document.createElement('div');
appContainer.id = "appHolder";
document.body.appendChild(appContainer);

ReactDOM.render(<Game />, document.getElementById('appHolder'));
