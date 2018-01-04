import React, { Component } from 'react';

class Form extends Component {
  render() {
    return (
      <div className="Form">
      <div className="container">
        <h2>Form control: textarea</h2>
        <p>The form below contains a textarea for comments:</p>
        <form>
        <div className="form-group">
        <label for="comment">Comment:</label>
        <textarea className="form-control" rows="5" id="comment"></textarea>
        </div>
        </form>
        </div>
    </div>
    );
  }
}

export default Form;
