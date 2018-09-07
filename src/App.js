import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Expression from './Expression';
import Instruction from './Instruction';
import ThankYou from './ThankYou';

class App extends Component {
  render() {
    return (
      <div className="App">
      <div className="header"></div>
      <Router>
        <div>
          <Route exact path="/" component={Instruction} />
          <Route exact path="/expression" component={Expression} />
          <Route exact path="/after/:workerID" component={ThankYou} />
        </div>
      </Router>
      </div>
    )
  }

}

export default App;
