// TodoList.js
import React from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import Todo from './Todo';

class TodoList extends React.Component {
  render() {
    const {userTodoData: {totalCount, completedCount, todos}} = this.props;
    
    return (
      <section>
        <input
          checked={totalCount === completedCount}
          type="checkbox"
        />
        <ul>
          {todos.edges.map(edge =>
            <Todo
              key={edge.node.id}
              todo={edge.node}
            />
          )}
        </ul>
      </section>
    );
  }
}

export default createFragmentContainer(
  TodoList,
  graphql`
    # As a convention, we name the fragment as '<ComponentFileName>_<PropName>'
    fragment TodoList_userTodoData on User {
      todos(
        first: 2147483647  # max GraphQLInt, to fetch all todos
      ) @connection(key: "TodoList_todos") {
        edges {
          node {
            id,
            complete
            # We use the fragment defined by the child Todo component here
            ...Todo_todo,
          },
        },
      },
      id,
      totalCount,
      completedCount,
    }
  `,
);
