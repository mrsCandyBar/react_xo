import React from 'react';

export default class FinishMove extends React.Component {

    render() {
        return(
            <div className={ this.props.direction ? ('overlay ' + this.props.direction) : 'hidden' }>
                <svg viewBox="0 0 273 1328">
                    <use xlinkHref="#svg_slash" className={ this.props.winner ? 'ico-blue' : 'ico-yellow' }></use>
                </svg>
            </div>
        )
    }
}