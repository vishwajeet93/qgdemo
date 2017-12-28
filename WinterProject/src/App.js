import React, { Component } from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import Form from './Components/Form';
import Sidebar from './Components/Sidebar';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Main from './Components/Main';

class App extends Component {
  render() {
    return (
      <Router>
      <div className="App">

      <div className="row">
      <div className="col-sm-3 nopad">
      <Sidebar/>
      </div>
      <div className="col-sm-9">

      <Main />

      </div>

      </div>
      </div>
      </Router>
    );
  }
}

export default App;
