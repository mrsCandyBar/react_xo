import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import SVG from '../../helpers/svg.jsx';

function User(props) {
    let randomPosition = Math.round(Math.random() * (12 - 1) + 1);

    return (
        <div className={ 'quadrant angle-' + randomPosition }>
            <svg viewBox="0 0 337 321">
                <use xlinkHref={props.index == 0 ? '#svg_x' : '#svg_kiss'} className={props.index == 0 ? 'ico-blue' : 'ico-yellow'} ></use>
            </svg>
        </div>
    )
}

class Intro extends React.Component {

    constructor() {
        super();
        this.text = 'Hugs and Kisses';
        this.state = {
            print: '',
            index: 0
        };
    }

    updateText(update) {
        this.setState({
            print: this.state.print + update,
            index: parseInt(this.state.index) + 1
        });
    }

    render() {

        setTimeout(() => {
            if (parseInt(this.text.length) > parseInt(this.state.index)) {
                this.updateText(this.text.charAt(this.state.index)); }

            else {
                setTimeout(() => {
                    if (this.text != 'Select a Character') {
                        this.text = 'Select a Character';
                        this.state.print = '';
                        this.state.index = -1;
                        this.updateText('');
                    }
                }, 2000);
            }
        }, 100);

        return (
            <p>{ this.state.print }</p>
        )
    }
}

export default class Home extends React.Component {

    render() {
        return (
            <page id="home">
                <div className="hidden">
                    <SVG/>
                </div>

                <div className="containment">
                    <Link to={{
                        pathname: '/game',
                        state: {opponent: 'X'}
                    }}><User index="0"/></Link>

                    <User index="1"/>
                    <User index="0"/>

                    <Link to={{
                        pathname: '/game',
                        state: {opponent: 'O'}
                    }}><User index="1"/></Link>
                </div>

                <title>
                    <Intro />
                </title>
            </page>
        )
    }
}