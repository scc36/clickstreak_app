var React = require('react');
var axios = require ('axios');

const getStreakUrl = 'streaks/';

var HighscoreDisplay = React.createClass({
  displayname: '',
  interval: 1000,

  getInitialState: function() {
    return {
      yourStreak: 0,
      highestStreak: 0
    };
  },

  componentDidMount() {
    this.intervalId = setInterval(this.tick, this.interval);
    this.setState({
      yourStreak: 0,
      highestStreak: 0
    });
  },
  componentWillUnmount(){
    clearInterval(this.intervalId);
  },

  tick: function () {
    // Poll streaks from server
    axios.get(getStreakUrl)
      .then(result => {
        // Update highscores
        this.setState({
          yourStreak: result.data.user_streak,
          highestStreak: result.data.high_streak
        });
      });
  },

  render: function() {
    return (
      <div className="row">
        <div className="col-md-6">
          <div className="panel panel-info">
            <div className="panel-heading">
              <h3 className="panel-title">Your longest click streak</h3>
            </div>
            <div className="panel-body">
              {this.state.yourStreak}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="panel panel-success">
            <div className="panel-heading">
              <h3 className="panel-title">All-time longest click streak</h3>
            </div>
            <div className="panel-body">
              {this.state.highestStreak}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = HighscoreDisplay;
