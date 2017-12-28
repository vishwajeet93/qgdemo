import React, { Component } from 'react';
import Button from 'react-bootstrap';

class Paragraph extends Component {
  constructor() {
    super();

    this.state = {
      isLoading : false
    }
    this.handleClick = this.handleClick.bind(this);
  }
    handleClick() {
      this.setState({ isLoading: true });

      // This probably where you would have an `ajax` call
      setTimeout(() => {
        // Completed of async action, set loading state back
        this.setState({ isLoading: false });
      }, 2000);
    }
  render() {
    let isLoading = this.state.isLoading;
    return(
      <div className="container Paragraph">
      <br/><br/><br/>
      <h2>Enter a Paragraph</h2>
      <form>

            <textarea className="form-control" ref = "parainp" rows="10">Donald Trump is the president of United States</textarea>

            <br/>
            <button type="button" className="btn btn-primary"
             disabled={isLoading}
             onClick={!isLoading ? this.handleClick : null} >
             {isLoading ? 'Generating...' : 'Generate '}
           </button>
     </form>
     </div>
   );
  }
}

export default Paragraph;
