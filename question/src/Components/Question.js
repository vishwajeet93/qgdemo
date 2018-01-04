import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';


class Question extends Component {
  constructor(props) {
    super(props);

    this.state = {
      model:'',
      select:-1,
      models : ['With features' , 'Without features' ,
                'Using D1Mtr for training' ,
                'Using D1Mtr with Features for training' ,
                'With Features + AEB'],
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
    var s = this.state.select;
    console.log(i);
    console.log(s);
    if(s !== -1) {
      console.log(this.state.childs[3]);
       ReactDOM.findDOMNode(this.state.childs[s].refs[s]).checked = false;
    }
    if (s == i){
      this.setState({select:-1});
      this.setState({model:'no'});
    }else {
      this.setState({select:i});
      var tempmo = this.state.models[i];
      this.setState({model:tempmo});      
    }
    // console.log(React.children.count(this.props.children));
    console.log(this.state.select);
  }
  render(){
    return (
      <div>
        <label for = "models"> Models*</label>
        <div id = "models">
        {this.state.models.map((mod,i) => <Checkbox onRef={ref => (this.state.childs.push(ref))}
                            usl={this.sl}  id = {i}  data = {mod}/>)}
        </div>

      </div>
    );
  }
}

class Checkbox extends Component {
  componentDidMount() {
 this.props.onRef(this)
}
  constructor(props) {
    super(props);

    this.state = {
    }
  };
  render(){
    return(
      <div className = "checkbox">
        <label> <input type = "checkbox" ref = {this.props.id}
         value = {this.props.id} onClick = {this.props.usl}/>{this.props.data}</label>
      </div>
    );
  }
}

export default Question;
