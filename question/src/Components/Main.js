import React, { Component } from 'react';
import Sentence from './Sentence';
import File from './File'
import Paragraph from './Paragraph';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class Main extends Component {
  render() {
    return (
      <div className="Main">
      <Switch>
      <Route exact path='/Sentence' component={Sentence} />
        <Route exact path='/Paragraph' component={Paragraph} />
          <Route exact path='/File' component={File} />
    </Switch>
    </div>
    );
  }
}

export default Main;
