import React, { Component } from 'react';
import Button from 'react-bootstrap';
import axios from 'axios';
import ReactDOM from 'react-dom';
import Qna from './Qna';


class Paragraph extends Component {
  constructor() {
    super();
    this.state ={
      qnas : [],
      isLoading : false
    }
    this.handleClick = this.handleClick.bind(this);
  }
    handleClick() {
      var questions = [];
      this.setState({ isLoading: true });
      var para = ReactDOM.findDOMNode(this.refs.parainp).value;
      // var url = 'http://localhost:9000/?properties={"inputFormat": "serialized", "inputSerializer", "edu.stanford.nlp.pipeline.ProtobufAnnotationSerializer", "annotators": "tokenize,ssplit,pos,lemma,ner", "outputFormat": "serialized", "serializer", "edu.stanford.nlp.pipeline.ProtobufAnnotationSerializer"}';
      var url = 'http://localhost:9000/?properties=%7B%22annotators%22:%22tokenize,ssplit%22,%22outputFormat%22:%22json%22%7D';
    //  console.log(url);
    //  console.log(para);
      axios.post(url,para).then(function(res){
        var sentsarr = res.data["sentences"];
        var sents = [];
        var sent = '';
        for (var i=0;i<sentsarr.length;i++){
          for (var j=0;j<sentsarr[i]["tokens"].length;j++){
            sent = sent + sentsarr[i]["tokens"][j]["word"] + ' ';
          }
          sents.push(sent);
          sent = '';
        }
        var data = [{"src" :null,"beam_size":5,"replace_unk":"true",
            "withAttn":"true"}];
        var i,dat;
        var j = 0;
        console.log(sents);
        this.setState({answers:sents});
        var n = sents.length;
        var j = 0;
        for (i in sents){

          data[0].src = sents[i];
          dat = JSON.stringify(data);
    //      console.log(data);
          var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
          var targetUrl = 'http://52.172.194.2:7789/translator/translate';
          fetch(proxyUrl +targetUrl, {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            //  mode : 'no-cors',
            body: dat
          })
          .then(res=> res.json())
          .then(res=> {
            var v = {};
            j = j + 1;
            v.q = res[0][0]["tgt"];
            v.a = res[0][0]["ans"];
            questions.push(v);
            //console.log(questions);
            this.setState({qnas: questions});
            if (j == n){
              setTimeout(() => {
                // Completed of async action, set loading state back
                this.setState({ isLoading: false });
              }, 1000);
            }
          });
        }
      }.bind(this),)
      console.log(this.state.qnas);
    //  this.setState(this:self);
      // This probably where you would have an `ajax` call

    }

  render() {
    let isLoading = this.state.isLoading;
    return(
      <div className="container Paragraph">
      <br/><br/><br/>
      <h2>Enter a Paragraph</h2>
      <form>

            <textarea className="form-control" ref = "parainp" rows="10">Donald Trump is the president of United States</textarea>

            <br/>
            <button type="button" className="btn btn-primary"
             disabled={isLoading}
             onClick={!isLoading ? this.handleClick : null} >
             {isLoading ? 'Generating...' : 'Generate '}
           </button>
     </form>
          <Qna qnas={this.state.qnas} />
     </div>
   );
  }
}

export default Paragraph;
