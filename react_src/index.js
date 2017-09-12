var ReactDOM = require('react-dom');
var React = require('react');

var HighscoreDisplay = require('./highscoreDisplay');
var ButtonAndCountdown = require('./buttonClickStreak');

// React.createClass

// Display high score
ReactDOM.render(
  <HighscoreDisplay />,
  document.getElementById("clickcounter")
);

// Button is separate, and sends calls to server instead
ReactDOM.render(
  <ButtonAndCountdown />,
  document.getElementById('clickbutton')
);
