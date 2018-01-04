import React, { Component } from 'react';
import QnaItem from './QnaItem'


class Qna extends Component {

  render() {
    let Qs;
    if(this.props.qnas){
      Qs = this.props.qnas.map(question =>{
        return (
          <QnaItem key={question.q} question={question}/>
        );
      });

    }
    return (
      <div className="Qna">
      <h3> Question(s) </h3>
      <ul class="list-group">
      {Qs}
      </ul>
      </div>
    );
  }
}

export default Qna;
