import React from 'react';

function Square(props) {
    return (
        <button className={props.value.winCheck ? 'square highlight' : 'square'} onClick={props.onClick}>
            {props.value.player}
        </button>
    );
}

export default class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let $this = this;
        let rows = Array(3).fill(null);
        let counter = 0;
        let blockList = rows.map(function(name, index) {
            return (
                <div key={index} className="board-row">
                    {$this.renderSquare(counter++)}
                    {$this.renderSquare(counter++)}
                    {$this.renderSquare(counter++)}
                </div>
            );
        });

        return (
            <div>{ blockList }</div>
        );
    }

}