import React, { Component } from 'react';
import './Sentence.css';
import Question from './Question';
import Quesans from './Quesans'
import {Tabs , Tab } from 'react-bootstrap';
import axios from 'axios';
import ReactDOM from 'react-dom';

class Sentence extends Component {
  constructor() {
     super();

     this.state = {
        var1:true,
        var2:true,
        var3:true,
        model:'',
        url:''
     }
     this.output = this.output.bind(this);
     this.handlemodel = this.handlemodel.bind(this);
  };
  output(){
     const sentence = ReactDOM.findDOMNode(this.refs.input).value;
     /*const url = "http://52.172.194.2:5000/cag?sent=donald trump is the current president of united states";
       axios.get(url).then(function (response){
       console.log()
     })*/
     var data = [{"src" :null,"beam_size":5,"replace_unk":"true",
         "withAttn":"true"}];
     data[0].src = sentence;
     data = JSON.stringify(data);
     const url = "http://52.172.194.2:7784/translator/translate"
     console.log(data);
     console.log(url);
     const config = {
         headers : {
             'Content-Type' : 'application/json',
              'Accept' :  'application/json'
         },
         data : data,
     };
     axios.post(url,config).then(function (response){
         console.log(response);
     });
     // request
     // .post('http://52.172.194.2:7784/translator/translate')
     // .send({src : "donald"})
     // .then(function(res){
     //   console.log(res);
     // })

  }

  handlemodel(e){
     this.setState({model:e.target.value});
  }
  render() {
    return (
      <div className="container Sentence">
      <br/><br/><br/>
          <h2>Enter a Sentence</h2>

          <form>
            <div class="form-group">
              <textarea class="form-control" ref = "input" rows="5">Donald Trump is the president of United States</textarea>
              <br/>
                  <Tabs className="myClass" defaultActiveKey={1} animation={true} id="noanim-tab-example">
                    <Tab eventKey={1} title="Question" > <Question/> </Tab>
                    <Tab eventKey={2} title="Question with answer" > <Quesans parent = {this}/> </Tab>
                 </Tabs>
            </div>
          </form>
      </div>
    );
  }
}

export default Sentence;
