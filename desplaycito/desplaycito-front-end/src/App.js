import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import playbutton from './PlayButtonLogo.png';
import backbutton from './backbutton.png';


import axios from 'axios';
import SpotifyPlayer from 'react-spotify-player';
var moment = require('moment');

function PlaylistButton(props){
  return (
    <div className= "playlistbuttons">
        <button className = "groupbuttons" onClick={props.clickFunction1}>
          <h1 className= "playlisttitles">{props.title1}</h1>
          <p className="description">{props.description1}</p>
        </button>
        <div className="sidedivider"/>
        <button className = "groupbuttons" onClick={props.clickFunction2}>
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
      playlistChosen: false,
      goBack: true,
      playlistUrl: ""
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.authorizeMySpotify = this.authorizeMySpotify.bind(this);
    this.checkLogIn = this.checkLogIn.bind(this);
    this.checkplaylistChosen = this.checkplaylistChosen.bind(this);
    this.goBackToDashboard = this.goBackToDashboard.bind(this);
    this.getRelatedArtists = this.getRelatedArtists.bind(this);
    this.getTopTracks = this.getTopTracks.bind(this);
    this.getRelatedTracks = this.getRelatedTracks.bind(this);
    this.getTopArtists = this.getTopArtists.bind(this);
  }

  componentDidMount(){
    axios.get('/get-login-url')
    .then((res) => {
      this.setState({
        logInUrl: res.data.url
      });
    })
  }

  checkplaylistChosen(){
    this.setState({
      playlistChosen: true,
      goBack: false
    });
  }

  goBackToDashboard(){
    this.setState({
      playlistChosen: false,
      goBack: true,
      uri: ""
    })
  }

  authorizeMySpotify(){
    if (this.state.logInUrl){
      var myWindow = window.open(this.state.logInUrl, "", "width=600,height=600");
    }
  }

  getRelatedArtists(){
    this.setState({
      playlistChosen: true,
      goBack: false
    });
    if(this.state.user){
      var timeNow = moment().format("MM/DD/YY [at] hh:mma");
      axios.post('/relatedArtistsTracks',
      {userId:this.state.user.id,
        playlistName:this.state.user.display_name + "'s Top Artist Recommendations - " + timeNow
      }).then(res => {
        this.setState({
          uri: res.data.uri
        });
      })
    }
  }

  getTopTracks(){
    this.setState({
      playlistChosen: true,
      goBack: false
    });
    if(this.state.user){
      var timeNow = moment().format("MM/DD/YY [at] hh:mma");
      axios.post('/topTracks',
      {userId:this.state.user.id,
        playlistName:this.state.user.display_name + "'s Top Tracks - " + timeNow
      }).then(res => {
        this.setState({
          uri: res.data.uri
        });
      })
    }
  }

  getRelatedTracks(){
    this.setState({
      playlistChosen: true,
      goBack: false
    });
    if(this.state.user){
      var timeNow = moment().format("MM/DD/YY [at] hh:mma");
      axios.post('/relatedTopTracks',
      {userId:this.state.user.id,
        playlistName:this.state.user.display_name + "'s Top Tracks Recommendations - " + timeNow
      }).then(res => {
        this.setState({
          uri: res.data.uri
        });
      })
    }
  }

  getTopArtists(){
    this.setState({
      playlistChosen: true,
      goBack: false
    });
    if(this.state.user){
      var timeNow = moment().format("MM/DD/YY [at] hh:mma");
      axios.post('/topArtistsTracks',
      {userId:this.state.user.id,
        playlistName:this.state.user.display_name + "'s Top Artist Tracks - " + timeNow
      }).then(res => {
        this.setState({
          uri: res.data.uri
        });
      })
    }
  }

  checkLogIn(){
    axios.get('/loggedIn')
    .then((res) => {
      this.setState({
        loggedIn: res.data.login
      });
      if(res.data.login){
        axios.get('/myInfo')
        .then((res) => {
          this.setState({
            user: res.data
          });
        });
      }
    });
  }

  render() {
    let loggedIn = this.state.loggedIn;
    let goBack = this.state.goBack;
    let playlistChosen = this.state.playlistChosen;

    let buttonOption =
    <div>
      <div className="intro-align">
        <h3 className="intro-text">DesPLAYcito is your personal playlist generator. Connect it with your Spotify to see playlists curated to your tastes!</h3>
      </div>
      <div className= "connect-section">
        <button className="spotify-button" onClick={this.authorizeMySpotify}> <b>AUTHORIZE MY SPOTIFY</b></button>
        <div className = "sidedivider" />
        <button className="spotify-button" onClick={this.checkLogIn}> <b>CHECK IF LOGGED IN</b></button>
      </div>
    </div>

    let userGreeting = <div></div>;
    if (loggedIn && goBack){
      if (this.state.user){
        userGreeting = <h2 className="intro-text">Hey {this.state.user.display_name}! Click a button to make a customized playlist, just for you!</h2>
      }
      var playlist = [["Top Artists", "Playlist of songs by your top artists", this.getTopArtists],
      ["Top Tracks", "Playlist of your top tracks", this.getTopTracks],
      ["Related Artists","Playlist of songs by artists related to your top artists", this.getRelatedArtists],
      ["Related Tracks","Playlist of songs related to your top tracks", this.getRelatedTracks]]

      buttonOption = [];

      for (let i=0; i < 3; i += 2)
        buttonOption.push(<PlaylistButton
          title1={playlist[i][0]}
          description1={playlist[i][1]}
          clickFunction1={playlist[i][2]}
          title2={playlist[i+1][0]}
          description2={playlist[i+1][1]}
          clickFunction2={playlist[i+1][2]}
        />);
    }
    let playlistIframe = <div></div>
    if (this.state.uri){
      const size = {width: 400, height: 600};
      const view = 'list'; // or 'coverart'
      const theme = 'black'; // or 'white'
      playlistIframe = <SpotifyPlayer
        uri={this.state.uri}
        size={size}
        view={view}
        theme={theme}
      />
    }
    if(playlistChosen){
      buttonOption =
      <div>
        <img id="backbutton" src={backbutton} onClick={this.goBackToDashboard}/>
      {playlistIframe}
      </div>
    }

    return (
      <div className ="color-background">
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Des<img id="top-logo" src={playbutton}/>cito</h1>
          </header>
        </div>
        {userGreeting}
        {buttonOption}
      </div>
    );
  }
}

export default App;
