var React = require('react');
var axios = require ('axios');

const updateStreakUrl = 'update_streaks/';

// Taken fron Django docs
// using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

var ButtonAndCountdown = React.createClass({
  displayname: '',
  interval: 1000,
  streakTime: 60,
  tickElapsed: 120,
  streakCount: 0,

  getInitialState: function() {
    return {
      timeRemaining: this.streakTime - this.tickElapsed,
      streakCount: this.streakCount,
      streakMessage: "Click button to begin streak: ",
    };
  },

  componentDidMount() {
    this.intervalId = setInterval(this.tick, this.interval);
    this.setState({
      timeRemaining: 0,
      streakCount: this.streakCount
    });
  },
  componentWillUnmount(){
    clearInterval(this.intervalId);
  },

  tick: function () {
    var streakTime = this.streakTime;
    var timeRemaining = 0;
    var streakMessage = "";
    this.tickElapsed += 1;

    // Button on Cooldown
    if (this.tickElapsed > streakTime) {
      streakMessage = "Streak ends in: ";
      timeRemaining = (this.streakTime + this.streakTime) - this.tickElapsed;
    }
    else {
      streakMessage = "Button on cooldown: ";
      timeRemaining = this.streakTime - this.tickElapsed;
    }

    // Reset streak if it's been too long
    if (this.tickElapsed > streakTime + streakTime) {
      this.streakCount = 0;
      timeRemaining = 0;
      var streakMessage = "Click button to begin streak: ";
    }

    // Set timer
    this.setState({
      timeRemaining: timeRemaining,
      streakCount: this.streakCount,
      streakMessage: streakMessage,
    });
  },
  buttonClicked: function () {
    var clickCooldown = this.streakTime - this.tickElapsed;

    if (clickCooldown < 0) {
      // Minute is up, I can click now
      this.streakCount += 1;
      this.tickElapsed = 0;

      axios({
        method: 'post',
        url: updateStreakUrl,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'X-CSRFToken',
        data: {
          streakCount: this.streakCount
        }
      });
    }
    // Update click counter
    this.setState({
      streakCount: this.streakCount
    });
  },

  render: function() {
    return (
      <div className="row">
        <div className="col-md-4">
          <button className="btn btn-lg btn-block btn-danger" onClick={this.buttonClicked}>Push Me!</button>
        </div>
        <div className="col-md-4">
          <h3>Current Streak: {this.state.streakCount}</h3>
        </div>
        <div className="col-md-4">
          <h3>{this.state.streakMessage} {this.state.timeRemaining}</h3>
        </div>
      </div>
    );
  }
});

module.exports = ButtonAndCountdown;
