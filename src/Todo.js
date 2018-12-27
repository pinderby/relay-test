// Todo.js
import React from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import ChangeTodoStatus from './ChangeTodoStatus';
import RemoveTodo from './RemoveTodo';

class Todo extends React.Component {
  // Add a new event handler that fires off the mutation
  _handleOnCheckboxChange = (e) => {
    const complete = e.target.checked;
    ChangeTodoStatus.commit(
      this.props.relay.environment,
      complete,
      this.props.todo,
    );
  };

  // Add a new event handler that fires off the mutation to remove todo
  removeTodo = (e) => {
    RemoveTodo.commit(
      this.props.relay.environment,
      "VXNlcjptZQ==",
      this.props.todo.id
    );
  };
    
  
  render() {
    const {complete, text} = this.props.todo;

    return (
      <li>
        <div>
          <input
            onChange={this._handleOnCheckboxChange}
            checked={complete}
            type="checkbox"
          />
          <label>
            {text}
          </label>
          <button onClick={this.removeTodo}>x</button>
        </div>
      </li>
    );
  }
}

export default createFragmentContainer(
  Todo,
  graphql`
    # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
    fragment Todo_todo on Todo {
      complete
      text
      id
    }
  `
)