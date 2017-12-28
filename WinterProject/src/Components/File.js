import React, { Component } from 'react';

class File extends Component {
  constructor(){
    super();

    this.state = {
      isLoading : false,
      file : ''
    }
    this.onChange = this.onChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  onChange(e) {
    this.setState({file:e.target.files[0]});
  }
  handleClick() {
    this.setState({ isLoading: true });

    // This probably where you would have an `ajax` call
    setTimeout(() => {
      // Completed of async action, set loading state back
      this.setState({ isLoading: false });
    }, 2000);
  }
  render(){
    var isLoading = this.state.isLoading;

    return(
      <div className="container File">
      <br/> <br/><br/>
      <form>
            <label for = "file"> Choose File :</label>
            <input type="file" id = "file" onchange="onChange(event)"/ >
            <br />
            <button type="button" className="btn btn-primary"
             disabled={isLoading}
             onClick={!isLoading ? this.handleClick : null} >
             {isLoading ? 'Generating...' : 'Generate'}
           </button>
     </form>
      </div>
    );
  }
}

export default File;
