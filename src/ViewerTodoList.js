// ViewerTodoList.js
import React from 'react';
import {graphql, QueryRenderer} from 'react-relay';
import TodoList from './TodoList';
import AddTodo from './AddTodo';
import environment from './Environment';

export default class ViewerTodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(e) {
    console.log('A task was submitted: ' + this.state.value);
    e.preventDefault();
    const text = this.state.value;
    AddTodo.commit(
      environment,
      text,
      "VXNlcjptZQ==",
    );
    this.setState({value: ""});
  }
  
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query ViewerTodoListQuery {
            viewer {
              id
              # Re-use the fragment here
              ...TodoList_userTodoData  
            }
          }
        `}
        variables={{}}
        render={({error, props}) => {
          if (error) {
            return <div>Error!</div>;
          }
          if (!props) {
            return <div>Loading...</div>;
          }
          return (
            <div>
              <div>Todo list for User {props.viewer.id}:</div>
              <form onSubmit={this.handleSubmit}>
                <label>
                  New Task:
                  <input type="text" name="new_task" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
              </form>
              <TodoList userTodoData={props.viewer} />
            </div>
          );
        }}
      />
    );
  }
}