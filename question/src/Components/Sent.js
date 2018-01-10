import React, { Component } from 'react';
import Button from 'react-bootstrap';
import axios from 'axios';
import ReactDOM from 'react-dom';
import Qna from './Qna';
import Dropdown from 'react-dropdown';
import './Sent.css';

class Sent extends Component {
  constructor() {
    super();

    this.state = {
        opt1 : 'Choose automatically',
        opt2 : '',
        list : []
    }
    this._onSelect = this._onSelect.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    this.props.onRef(this)
    ReactDOM.findDOMNode(this.refs.list).style.display = "none";
  }
  handleClick(e) {
    this.setState({opt2 : e.target.value});
    console.log(this.state.opt1);
    console.log(this.state.opt2);
  }
  _onSelect(e) {
    this.setState({opt2:''});
    ReactDOM.findDOMNode(this.refs.list).style.display = "none";
    console.log(e.label);
    this.setState({opt1 : e.target.value});
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    var url = "http://52.172.194.2:5000/cag?sent="+this.props.sent;
    axios.get(proxyUrl + url)
    .then(res => {
      var op = this.state.opt1
      if (op == 'Named Entities'){
        this.setState({list:res.data[0]["Paragraphs:"][0]["Named Entities:"]});
        if (this.state.list.length > 0){
          this.setState({opt2 : this.state.list[0]});
          // console.log('opt2',this.state.list);
        }

        ReactDOM.findDOMNode(this.refs.list).style.display = "block";
      }
      if (op == 'Noun Phrases'){
        this.setState({list:res.data[0]["Paragraphs:"][0]["Noun Phrases:"]});
        if (this.state.list.length > 0){
          this.setState({opt2 : this.state.list[0]});
          // console.log('opt2',this.state.list);
        }
        ReactDOM.findDOMNode(this.refs.list).style.display = "block";
      }
    })


  }
  render(){
    var options = ['Choose automatically','Named Entities' , 'Noun Phrases'];
    var title = 'Primary';
    const defaultOption = options[0];
    return (
      // <div>
      //   <li> {this.props.sent} </li>

      <div className = "container Sent" >
      <div className = "col-sm-5">
      {this.props.sent}
      </div>
      <div className = "col-sm-2">
      <select className = "form-control" ref = "sel" onChange={this._onSelect}>
        {options.map((op,i) => <option key = {i} ref = {i} value = {op}>
                                      {op}</option>)}
      </select>
         </div>
      <div className= "col-sm-5" ref = "list">
      <label htmlFor = "sel" className = "col-lg-4"> {this.state.opt1} :</label>
        <div className = "col-lg-8" ref = "list">
        <select className = "form-control" ref = "sel" onChange={this.handleClick}>
          {this.state.list.map((op,i) => <option key = {i} ref = {i} value = {op}>
                                        {op}</option>)}
        </select>
          </div>
        </div>
      </div>
    )
  }
}
export default Sent;
