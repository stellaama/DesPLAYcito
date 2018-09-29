import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import playbutton from './PlayButtonLogo.png';

class App extends Component {

  constructor(){
    super();
    this.state = {
      loggedIn: false
    };
    this.nowLoggedIn = this.nowLoggedIn.bind(this);
  }

  nowLoggedIn(){
    this.setState({
      loggedIn: true
    })
  }

  render() {
    let loggedIn = this.state.loggedIn

    let buttonOption =
    <div className= "connect-section">
      <button id="connect-spotify" onClick={this.nowLoggedIn}> <b>LOG IN TO SPOTIFY</b></button>
    </div>

    if (loggedIn){
      buttonOption =
      <div>
      <div><button>PlayList #1</button></div>
      <div><button>PlayList #2</button></div>
      <div><button>PlayList #3</button></div>
      <div><button>PlayList #4</button></div>
      </div>
    }

    return (
      <div className ="color-background">
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Des<img id="top-logo" src={playbutton}/>cito</h1>
          </header>
        </div>
        {buttonOption}
      </div>
    );
  }
}

export default App;
