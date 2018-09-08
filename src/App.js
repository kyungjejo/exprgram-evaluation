import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Expression from './Expression';
import Instruction from './Instruction';
import ThankYou from './ThankYou';
import Instruction2 from './Instruction2';
// import Context from './Context';
import Expression2 from './Expression2';

class App extends Component {
  render() {
    return (
      <div className="App">
      <div className="header"></div>
      <Router>
        <div>
          <Route exact path="/" component={Instruction} />
          <Route exact path="/2" component={Instruction2} />
          <Route exact path="/expression" component={Expression} />
          <Route exact path="/exprexpr" component={Expression2} />
          {/* <Route exact path="/context" component={Context} /> */}
          <Route exact path="/after/:workerID" component={ThankYou} />
        </div>
      </Router>
      </div>
    )
  }

}

export default App;
