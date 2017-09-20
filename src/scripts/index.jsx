import React from 'react';
import ReactDOM from 'react-dom';
import Game from './pages/game.jsx';
import Home from './pages/home.jsx';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class App extends React.Component {

    constructor() {
        super()
        this.state = {
            isFate: true
        }
    }

    render() {

        const BasicExample = () => (
          <Router>
              <div>
                  <ul className="hidden">
                      <li>
                          <Link to="/">Home</Link>
                          <Link to={{
                              pathname: '/game',
                              state: {fromDashboard: true}
                          }}
                          >Game</Link>
                      </li>
                  </ul>

                  <Route exact path="/" component={Home} />
                  <Route path="/game" component={Game} />
              </div>
          </Router>
        );


        return(
            <BasicExample />
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

ReactDOM.render(
    <App />,
    document.getElementById('appHolder')
);