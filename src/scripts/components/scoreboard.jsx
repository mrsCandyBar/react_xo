import React from 'react';

export default class Scoreboard extends React.Component {

    constructor() {
        super();
        this.state = {
            users: {}
        }
    }

    componentWillMount() {
        this.setState({
           users: this.props.game.users
        });
    }

    render() {
        let $this = this;
        let userList = this.state.users.map(function(user, index) {
            return (
                <li key={index}>
                    <player>
                        <svg viewBox="0 0 337 321">
                            <use xlinkHref={ index === 0 ? '#svg_x' : '#svg_kiss'} className={ index === 0 ? 'ico-blue' : 'ico-yellow'}></use>
                        </svg>
                    </player>
                    <score className={ index === 0 ? 'ico-blue' : 'ico-yellow'}>{user.score}</score>
                </li>
            );
        });

        return (
            <ul id="score">{ userList }</ul>
        );
    }
}