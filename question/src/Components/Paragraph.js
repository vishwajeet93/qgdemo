import React, { Component } from 'react';
import Button from 'react-bootstrap';
import axios from 'axios';
import ReactDOM from 'react-dom';
import Qna from './Qna';
import Dropdown from 'react-dropdown';
import Sent from './Sent';

class Paragraph extends Component {
  constructor() {
    super();
    this.state ={
      qnas : [],
      isLoading : false,
      qaps : [],
      childs : [],
      content : '',
      i : 0,
      sentences : []
    }
    this.handleClick = this.handleClick.bind(this);
  }
    handleClick() {
      console.log('child',this.state.childs);
      var questions = [];
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
        if (this.state.content !== para){
          this.setState({qnas:[]});
          this.setState({sentences: sents});
          var i1 = this.state.i + 1;
          this.setState({i:i1});
          this.setState({content : para});
          // alert('awg')
          // break;
          console.log("yeey");
        }
        else {
          var data = [{"src" :null,"beam_size":5,"replace_unk":"true",
              "withAttn":"true"}];
              var i,dat;
              var j = 0;
              console.log(sents);
              this.setState({answers:sents});
              var n = 0;
              var j = 0;
              for (i in sents){
                console.log(this.state.childs[i]);
                console.log('opt1',this.state.childs[i].opt1);
                if (this.state.childs[i].state.opt1 == ''){
                  console.log("yeey");
                  //alert('please select options for all questions')
                  //this.setState({isLoading : false});
                  break;
                  console.log("yeey");
                }
                else {
                  n++;
                  this.setState({ isLoading: true });
                  var sel = this.state.childs[i].state.opt1;
                  var targetUrl;
                  if(sel == 'Choose automatically'){
                    targetUrl = "http://52.172.194.2:7789/translator/translate";
                    data[0].src = sents[i];
                  }
                  else {
                    targetUrl = "http://52.172.194.2:7790/translator/translate";
                    data[0].src = sents[i];
                    data[0].selans = this.state.childs[i].state.opt2;
                  }
                  dat = JSON.stringify(data);
                  //      console.log(data);
                  var proxyUrl = 'https://cors-anywhere.herokuapp.com/';

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
                      }, 300);
                    }
                  }).catch(err => {
                    this.setState({isLoading : false});
                    alert(err);
                  });
                }
              }
            }
          }.bind(this))
      console.log(this.state.qnas);
    //  this.setState(this:self);
      // This probably where you would have an `ajax` call

    }

  render() {
    let isLoading = this.state.isLoading;
    var options = ['Named Entities' , 'Noun Phrases']
    return(
      <div className="container Paragraph">
      <br/><br/><br/>
      <h2>Enter a Paragraph</h2>
      <form>
            <textarea className="form-control" ref = "parainp" rows="10">Donald Trump is the president of United States</textarea>
            <br/>
            {this.state.sentences.map((sen,i) =>{return <div class="list-group">
            <li className="list-group-item list-group-item-warning"><Sent onRef={ref => (this.state.childs.push(ref))}
            key={i} sent = {sen}/></li><br/></div>})}
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
