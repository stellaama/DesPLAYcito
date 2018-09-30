import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import playbutton from './PlayButtonLogo.png';

import axios from 'axios';

class App extends Component {

  constructor(){
    super();
    this.state = {
      loggedIn: false,
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.authorizeMySpotify = this.authorizeMySpotify.bind(this);
    this.checkLogIn = this.checkLogIn.bind(this);
  }

  componentDidMount(){
    axios.get('/get-login-url')
    .then((res) => {
      this.setState({
        logInUrl: res.data.url
      });
    })
  }

  authorizeMySpotify(){
    if (this.state.logInUrl){
      var myWindow = window.open(this.state.logInUrl, "", "width=600,height=600");
    }
  }

  checkLogIn(){
    axios.get('/loggedIn')
    .then((res) => {
      this.setState({
        loggedIn: res.data.login
      });
    });
  }


  render() {
    let loggedIn = this.state.loggedIn;

    let buttonOption =
    <div className= "connect-section">
      <button className="spotify-button" onClick={this.authorizeMySpotify}> <b>AUTHORIZE MY SPOTIFY</b></button>
      <button className="spotify-button" onClick={this.checkLogIn}> <b>CHECK IF LOGGED IN</b></button>
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
