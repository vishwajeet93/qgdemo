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
       headers : [],
       childs:[],
       rows_arr : [],
       t : 1,
       isLoading : false
     }
     this.handleClick = this.handleClick.bind(this);
     this.tabselect = this.tabselect.bind(this);
     this.make_matrix = this.make_matrix.bind(this);
  };
    make_matrix (sentence, question, attn_array) {
      console.log(question);
      console.log(sentence);
      console.log(attn_array);
  //  table = document.createElement("table");
      //container = document.getElementById(div_id);
      // container.appendChild(table);
      var q_array = question.split(" ");
      var v1 = [];
      var v2 = [];
      var s_array = sentence.split(" ");
      this.setState({headers : s_array});
    //  var attn_array = JSON.parse(attn_text);
      // header_row = document.createElement("tr");
      // table.appendChild(header_row);
      // blank = document.createElement("td");
      // header_row.appendChild(blank);
      // for (var i=0; i<s_array.length; i++){
      //   s_word = document.createElement("td");
      //   s_word.innerHTML = s_array[i];
      //   header_row.appendChild(s_word);
      // }
      for (var i = 0; i < q_array.length; i++) {
        // row = document.createElement("tr");
        // table.appendChild(row);
        // q_word = document.createElement("td");
        // row.appendChild(q_word);
        // q_word.innerHTML = q_array[i];
        v2.push(q_array[i]);
        for (var j = 0; j < s_array.length; j++) {
          // attn = document.createElement("td");
          // row.appendChild(attn);
          // amatrix,ttn.style.width = "15px";
          // attn.style.backgroundColor = "#800000";
          var x = Math.round(attn_array[i][j] * 100)/100;
          // attn.style.opacity = x.toString();
          v2.push(x.toString());
        }
        v1.push(v2);
        console.log(v2.slice(1,));
        v2 = [];
      }
      console.log(this.state.headers);
      console.log(v1);
      this.setState({rows_arr : v1});
    }


  handleClick() {
    this.setState({qnas:[]});
    ReactDOM.findDOMNode(this.refs.mat).style.display = "none";
    var questions = [];
    var v = this.state.t;
    var sentence = ReactDOM.findDOMNode(this.refs.input).value;
    this.setState({sentence:sentence});
    var data = [{"src" :null,"beam_size":5,"replace_unk":"true","withAttn":"true"}];
    var mod = this.state.childs[0].state.model;
    var opt = this.state.childs[1].state.selopt;
    var sel = this.state.childs[1].state.select;
    if (v==1 && mod == '') {
      alert('please select model');
    }
    else if (v==2 && sel == -1) {
        alert('please select a answer model');
    }
    // else if((v==2) && (sel == 2 || sel == 3) && (opt == '')) {
    //     alert('please select a option');
    // }

    else {
          this.setState({ isLoading: true });
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
        this.setState({model:''})

        var opt = this.state.childs[1].state.selopt;
        console.log(sel);
        console.log(opt);
        var targetUrl;
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
        var v1  = this.state.t;
        console.log(v1);
        console.log(res[0][0]["tgt"]);
        var v ={};
        v.q = res[0][0]["tgt"];
        if (v1==1){
        v.a = this.state.sentence;
        }
        if (v1==2){
          v.a = res[0][0]["ans"];
        }
        v.m = this.state.model;
        console.log(v);
        questions.push(v);
        this.setState({qnas: questions});
        this.setState({answer:res[0][0]["tgt"]});
        this.make_matrix(this.state.sentence,res[0][0]["tgt"],res[0][0]["attn"]);
        ReactDOM.findDOMNode(this.refs.mat).style.display = "block";
        setTimeout(() => {
          // Completed of async action, set loading state back
          this.setState({ isLoading: false });
        }, 100);
      }).catch(err => {
        alert('something wrong');
        this.setState({isLoading : false});
      });

        //console.log(this.state);
  }

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
          <table ref = "mat">
          <tbody>
            <Header heads = {this.state.headers}/>
            {this.state.rows_arr.map((row,i) => <Row row = {row} key = {i}/>)}
            </tbody>
          </table>
      </div>
    );
  }
}

class Row extends Component{
  render() {
    // var mystyle = {
    //   width : 60,
    //   backgroundColor : '#800000',
    //   opacity : ele
    // }

    return (
      <tr>
      <td> {this.props.row[0]} </td>
        {this.props.row.slice(1,).map((ele,i) => <td style = {{width : 60,
          backgroundColor : '#800000',opacity : ele}}
          key = {i}>{ele} </td>)}
      </tr>
    )
  }
}
class Header extends Component{
  render() {
    var style = {
      width : 80
    }
    return (
      <tr>
        <td style = {style}> </td>
        {this.props.heads.map((head,i) => <td style = {style} key = {i}> {head} </td>)}
      </tr>
    );
  }
}

export default Sentence;
