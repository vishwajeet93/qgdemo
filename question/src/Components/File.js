import React, { Component } from 'react';
import FileReaderInput from 'react-file-reader-input';
import axios from 'axios';
import ReactDOM from 'react-dom';
import Qna from './Qna';


class File extends Component {
  constructor(){
    super();

    this.state = {
      isLoading : false,
      content : '',
      qnas : []
    }
    this.onc = this.onc.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  onc(eve,results) {
      console.log("edrg");
      const [e, file] = results[0];
      console.log(e.target.result);
      ReactDOM.findDOMNode(this.refs.filename).innerHTML = "   " + file["name"];
      this.setState({content : e.target.result});

  }
  handleClick() {
    var questions = [];
    this.setState({ isLoading: true });
    var url = 'http://localhost:9000/?properties=%7B%22annotators%22:%22tokenize,ssplit%22,%22outputFormat%22:%22json%22%7D';
    console.log(this.state.content);
    var para = this.state.content;
    console.log(para);
    // console.log(para);
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
      var j =0;
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
    // This probably where you would have an `ajax` call
  }
  render(){
    var isLoading = this.state.isLoading;

    return(
      <div className="container File">
      <br/> <br/><br/>
        <label for= "my-file-input"> Choose file :</label>
        <FileReaderInput as="text" type="file" id ="my-file-input" multipleFiles={false} onChange={this.onc}>
        <button >Select a file!</button>
        <span ref = "filename"> No file chosen</span>
        </FileReaderInput>
            <br />
            <button type="button" className="btn btn-primary"
             disabled={isLoading}
             onClick={!isLoading ? this.handleClick : null} >
             {isLoading ? 'Generating...' : 'Generate'}
           </button>
        <Qna qnas={this.state.qnas} />
      </div>
    );
  }
}

export default File;
