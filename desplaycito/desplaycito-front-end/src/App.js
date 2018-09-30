import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import playbutton from './PlayButtonLogo.png';


import axios from 'axios';

function PlaylistButton(props){
  return (
    <div className= "playlistbuttons">
        <button className = "groupbuttons" >
          <h1 className= "playlisttitles">{props.title1}</h1>
          <p className="description">{props.description1}</p>
        </button>
        <div className="sidedivider"/>
        <button className = "groupbuttons" >
          <h1 className= "playlisttitles">{props.title2}</h1>
          <p className="description">{props.description2}</p>
        </button>
    </div>
  )
}


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
      var playlist = [["Top Artists", "Playlist of songs by your top artists"],["Top Tracks", "Playlist of your top tracks"], ["Related Artists","Playlist of songs by artists related to your top artists"],["Saved Tracks","Playlist of songs from your saved tracks"]]

      buttonOption = [];

      for (let i=0; i < 3; i += 2)
        buttonOption.push(<PlaylistButton title1={playlist[i][0]} description1={playlist[i][1]} title2={playlist[i+1][0]} description2={playlist[i+1][1]}/>);
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
