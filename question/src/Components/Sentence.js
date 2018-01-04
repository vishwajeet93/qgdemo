import React, { Component } from 'react';
import './Sentence.css';
import Question from './Question';
import Quesans from './Quesans'
import {Tabs , Tab } from 'react-bootstrap';
import axios from 'axios';
import ReactDOM from 'react-dom';
import Qna from './Qna';

class Sentence extends Component {
  constructor() {
     super();

     this.state = {
       qnas : [],
       var1:true,
       var2:true,
       var3:true,
       model:'',
       url:'',
       question : '',
       sentence : '',
       answer :'',
       childs:[],
       t : 1,
       isLoading : false
     }
     this.handleClick = this.handleClick.bind(this);
     this.tabselect = this.tabselect.bind(this);
  };
  handleClick() {
    var questions = [];
    this.setState({ isLoading: true });
    var v = this.state.t;
    var sentence = ReactDOM.findDOMNode(this.refs.input).value;
    this.setState({sentence:sentence});
    var data = [{"src" :null,"beam_size":5,"replace_unk":"true","withAttn":"true"}];
    var mod = this.state.childs[0].state.model;
    if (v==1 && mod == '') {
      alert('please select model');
    }
    else {
      if(v == 1) {
        this.setState({model:mod});
        var sel = this.state.childs[0].state.select;
        console.log(sel);
        if (mod == ''){
          alert('please select model');

        }
        var targetUrl;
        if (sel == 0){
          targetUrl = "http://52.172.194.2:7785/translator/translate";
          data[0].src = sentence;
          console.log("NO");
        }
        if (sel == 1){
          targetUrl = "http://52.172.194.2:7784/translator/translate";
          data[0].src = sentence;
        }
        if (sel == 2){
          targetUrl = "http://52.172.194.2:7787/translator/translate";
          data[0].src = 'SOS '+sentence+'EOS';
          console.log(data);
        }
        if (sel == 3){
          targetUrl = "http://52.172.194.2:7788/translator/translate";
          data[0].src = 'SOS '+sentence;
          console.log(data);
        }
        if (sel == 4){
          targetUrl = "http://52.172.194.2:7789/translator/translate";
          data[0].src = sentence;
        }
      }
      if(v == 2){
        var sel = this.state.childs[1].state.select;
        var opt = this.state.childs[1].state.option;
        var targetUrl;
        if(sel == -1) {
          alert("Please select a answer model")
        }
        if(sel == 0){
          targetUrl = "http://52.172.194.2:7789/translator/translate";
          data[0].src = sentence;
        }
        if(sel == 1 || sel == 2){
          targetUrl = "http://52.172.194.2:7790/translator/translate";
          data[0].src = sentence;
          data[0].selans = opt;
        }

      }

      var proxyUrl = 'https://cors-anywhere.herokuapp.com/';

      fetch(proxyUrl + targetUrl, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        //  mode : 'no-cors',
        body: JSON.stringify(data)
      })
      .then(res=> res.json())
      .then(res=> {
        console.log(res);
        console.log(res[0][0]["tgt"]);
        var v ={};
        v.q = res[0][0]["tgt"];
        v.a = this.state.sentence;
        v.m = this.state.model;
        console.log(v);
        questions.push(v);
        this.setState({qnas: questions});

        this.setState({answer:res[0][0]["tgt"]});
      });

        //console.log(this.state);
  }
    setTimeout(() => {
      // Completed of async action, set loading state back
      this.setState({ isLoading: false });
    }, 2000);
  }
  tabselect(key) {
    this.setState({t:key});
    console.log(this.state.t);
  }
  handlemodel(e){
     this.setState({model:e.target.value});
  }
  render() {
    let isLoading = this.state.isLoading;
    return (
      <div className="container Sentence">
      <br/><br/><br/>
          <h2>Enter a Sentence</h2>

          <form>
            <div class="form-group">
              <textarea class="form-control" ref = "input" rows="5">Donald Trump is the president of United States</textarea>
              <br/>
                  <Tabs className="myClass" defaultActiveKey={1} onSelect={this.tabselect} animation={true} id="noanim-tab-example">
                    <Tab eventKey={1} title="Question" > <Question onRef={ref => (this.state.childs.push(ref))}/> </Tab>
                    <Tab eventKey={2} title="Question with answer" > <Quesans onRef={ref => (this.state.childs.push(ref))} parent = {this}/> </Tab>
                 </Tabs>
                 <button type="button" className="btn btn-primary"
                   disabled={isLoading}
                   onClick={!isLoading ? this.handleClick : null} >
                   {isLoading ? 'Generating...' : 'Generate '}
                 </button>
            </div>
          </form>
          <Qna qnas={this.state.qnas} />
      </div>
    );
  }
}

export default Sentence;
