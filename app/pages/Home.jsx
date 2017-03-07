import React, {Component} from "react";
import {connect} from "react-redux";
import "./Home.css";

class Home extends Component {

  render() {
    return (
      <div className="home">
        <h1 className="title">Coming Soon</h1>
        <div className="splash"></div>
      </div>
    );
  }
}

export default connect(() => ({}), {})(Home);
