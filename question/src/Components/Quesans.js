import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

class Quesans extends Component {
  constructor () {
    super();

    this.state = {
      select : -1,
      options : ['Generate automatically' ,
                  'Named Entities' ,
                  'Noun phrases' ],
      option : 'Named Entities',
      list : [],
      childs : []
    }
    this.sl = this.sl.bind(this);
  }
  componentDidMount() {
    console.log('Component DID MOUNT!'),
    this.props.onRef(this)
  }
  sl(e) {
    var i = e.target.value;
    var sentence = ReactDOM.findDOMNode(this.props.parent.refs.input).value;
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    var url = "http://52.172.194.2:5000/cag?sent="+sentence;
    if (i==0){
      console.log(this.refs.list);
      ReactDOM.findDOMNode(this.refs.list).style.display = "none";
    } else {
        axios.get(proxyUrl + url).then(function (response){
          ReactDOM.findDOMNode(this.refs.list).style.display = "block";
          if (i == 1) {
            this.setState({option:'Named Entities'});
            this.setState({list:response.data[0]["Paragraphs:"][0]["Named Entities:"]});
          }
          if (i == 2){
            this.setState({option:'Noun Phrases'});
            this.setState({list:response.data[0]["Paragraphs:"][0]["Noun Phrases:"]});
          }
          console.log(response.data[0]["Paragraphs:"][0]["Noun Phrases:"]);
        }.bind(this));
      }
    var s = this.state.select;
    if(s !== -1) {
      console.log(this.state.childs[2]);
       ReactDOM.findDOMNode(this.state.childs[s].refs[s]).checked = false;
    }
    if(s !== -1) {
      console.log(this.state.childs[2]);
       ReactDOM.findDOMNode(this.state.childs[s].refs[s]).checked = false;
    }
    if (s == i){
      this.setState({select:-1});
    }else {
      this.setState({select:i});
    }
    // console.log(React.children.count(this.props.children));
    console.log(this.state.select);
  }

  render(){
    return (
      <div className = "container">

      <div className = "col-sm-6">
      <label for = "options"> Options :</label>
      <div id = "options" >
        {this.state.options.map((opt,i) => <Checkbox onRef={ref => (this.state.childs.push(ref))}
        usl={this.sl} id = {i} data = {opt} />)}
      </div>
      </div>
      <div className= "col-sm-6" ref = "list">
      <label for = "sel" className = "col-lg-4"> {this.state.option} :</label>
        <div className = "col-lg-8" ref = "list">
        <select className = "form-control" id = "sel">
          {this.state.list.map((op,i) => <option key = {i} ref = {i} value = {i}>
                                        {op}</option>)}
        </select>
        </div>
      </div>
      </div>
    );
  }
}

class Checkbox extends Component {
  componentDidMount() {
 this.props.onRef(this)
}
  render(){
    return(
      <div className = "checkbox">
        <label> <input type = "checkbox"ref = {this.props.id}
         value = {this.props.id} onClick = {this.props.usl} />{this.props.data}</label>
      </div>
    );
  }
}

export default Quesans;
