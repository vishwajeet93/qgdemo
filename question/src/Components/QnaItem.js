import React, { Component } from 'react';

class QnaItem extends Component {
  render() {
    let model;
    if(this.props.question.m){
      model =
      (<li className="list-group-item list-group-item-danger">
          Model - {this.props.question.m}
        </li>
        );
    }
    return (
      <div className="QnaItem">
      {model}
      <li className="list-group-item">
      {this.props.question.q}
      </li>
      <li className="list-group-item list-group-item-success">
      {this.props.question.a}
      </li>
      <br />
      </div>
    );
  }
}

export default QnaItem;
