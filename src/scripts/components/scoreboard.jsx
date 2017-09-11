import React from 'react';

export default class Scoreboard extends React.Component {

    constructor() {
        super();
        this.state = {
            game: {}
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
                    {user.name} ({user.score})
                    <input defaultValue={user.name} id={'player' + index} type="text" />
                    <button onClick={() => $this.props.onClick({name: document.getElementById('player' + index).value, index: index})}>Change</button>
                </li>
            );
        });

        return (
            <div>
                <h5>Home Screen</h5>
                <ul>{ userList }</ul>

                <button onClick={() => this.props.Rename() }></button>
            </div>

        );
    }
}