import React from 'react';

function ReturnPlayer(props) {
    return (
        <svg viewBox="0 0 337 321" className={props.index == 0 ? '' : 'angle-' + props.position }>
            <use xlinkHref={props.index == 0 ? '#svg_x' : '#svg_kiss'} className={props.index == 0 ? 'ico-blue' : 'ico-yellow'}></use>
        </svg>
    )
}

function Square(props) {
    let createIcon = <ReturnPlayer index={ props.value.player == 'X' ? 0 : 1 } position={ props.value.position } />;
    return (
        <button className='square' onClick={props.onClick}>
            <move>{ props.value.player ? createIcon : '' }</move>
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
            <div className="game-board">{ blockList }</div>
        );
    }

}