import React, { Component } from 'react';
import {Grid, Col,Row } from 'react-bootstrap';
import { BrowserRouter as Router, Switch,IndexRoute,IndexLink, Route, Link,NavLink } from 'react-router-dom';

import './Sidebar.css';

class Sidebar extends Component {
  burgerToggle(){
    let linksEl = document.querySelector('.narrowLinks');
    if (linksEl.style.display === 'block') {
              linksEl.style.display = 'none';
          } else {
              linksEl.style.display = 'block';
          }
  }
  render() {
    return (
      <div className="Sidebar">
      <h2 className="qg"><font color="white"><b>Question generator</b></font></h2>
      <div>
      <hr/>
      <div className="panel-default">
      <ul className="list-unstyled">
      <li> <NavLink  to={'/Sentence'} activeClassName="active">Sentence</NavLink></li>
      <li><NavLink  to={'/Paragraph'} activeClassName="active" >Paragraph</NavLink></li>
      <li><NavLink  to={'/File'} activeClassName="active">Upload File</NavLink></li>
      </ul>
      </div>
      </div>
      </div>
    );
  }
}

export default Sidebar;
