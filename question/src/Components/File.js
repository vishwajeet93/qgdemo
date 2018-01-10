import React, { Component } from 'react';
import FileReaderInput from 'react-file-reader-input';
import axios from 'axios';
import ReactDOM from 'react-dom';
import Qna from './Qna';
import Sent from './Sent';


class File extends Component {
  constructor(){
    super();

    this.state = {
      isLoading : false,
      content : '',
      qnas : [],
      childs : [],
      con : '',
      sentences :[]
    }
    this.onc = this.onc.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange=this.handleChange.bind(this);
  }
  handleChange (event) {
    this.setState({content: event.target.value});
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
    var url = 'http://localhost:9000/?properties=%7B%22annotators%22:%22tokenize,ssplit%22,%22outputFormat%22:%22json%22%7D';
    // console.log(this.state.content);
    var para =this.state.content;
    // console.log(para);
     console.log('a');
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
      if (this.state.con !== para){
        this.setState({qnas:[]});
        this.setState({sentences: sents});
        var i1 = this.state.i + 1;
        this.setState({i:i1});
        this.setState({con : para});
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
              console.log('chi',this.state.childs);
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
    // This probably where you would have an `ajax` call
  }
  render(){
    let Content;
    if(this.state.content){
      Content =
      (
      <div className="container-fluid">
      <br/>
        <textarea value={this.state.content} onChange={this.handleChange} className="form-control" ref = "parainp" rows="10"/>
        </div>
    );
    }
    var isLoading = this.state.isLoading;

    return(
      <div className="container File">
      <br/> <br/><br/>
        <label for= "my-file-input"> Choose file :</label>
        <FileReaderInput as="text" type="file" id ="my-file-input" multipleFiles={false} onChange={this.onc}>
        <button >Select a file!</button>
        <span ref = "filename"> No file chosen</span>
        </FileReaderInput>
          {Content}
            <br />
            {this.state.sentences.map((sen,i) =>{return <div class="list-group">
            <li className="list-group-item list-group-item-warning"><Sent onRef={ref => (this.state.childs.push(ref))}
            key={i} sent = {sen}/></li><br/></div>})}
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
