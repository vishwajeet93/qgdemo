import React, { Component } from 'react';

class Navbar extends Component {
  render() {
    return (

      <div className="Navbar">
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">Question Generator</a>
          </div>
          <div className="collapse navbar-collapse" id="myNavbar">
            <ul className="nav navbar-nav">
              <li className="active"><a href="#">Sentence</a></li>
              <li><a href="#">Paragraph</a></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li><a href="#"><span className="glyphicon glyphicon-open-file"></span>Upload a file</a></li>
            </ul>
          </div>
        </div>
      </nav>

      <div  className="jumbotron text-center">
      <h1>Question Generator</h1>
      <p>one line description</p>
      </div>

    </div>
    );
  }
}

export default Navbar;
