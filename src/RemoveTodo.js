// RemoveTodo.js
import {graphql, commitMutation} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';

// We start by defining our mutation from above using `graphql`
const mutation = graphql`
  mutation RemoveTodoMutation($input: RemoveTodoInput!) {
    removeTodo(input: $input) {
      deletedTodoId
      viewer {
        completedCount
        totalCount
      }
    }
  }
`;

// function getOptimisticResponse(complete, todo) {
//   return {
//     changeTodoStatus: {
//       todo: {
//         complete: complete,
//         id: todo.id,
//       },
//     },
//   };
// }

function sharedUpdater(store, userID, deletedID) {
  const userProxy = store.get(userID);
  const conn = ConnectionHandler.getConnection(userProxy, 'TodoList_todos');
  ConnectionHandler.deleteNode(conn, deletedID);
}

function commit(environment, userID, todoID) {
  // Now we just call commitMutation with the appropriate parameters
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {id: todoID},
      },
      updater: store => {
        const payload = store.getRootField('removeTodo');
        sharedUpdater(store, userID, payload.getValue('deletedTodoId'));
      }
      // optimisticResponse: getOptimisticResponse(complete, todo),
    }
  );
}

export default {commit};