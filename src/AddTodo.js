// AddTodo.js
import {graphql, commitMutation} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';

// We start by defining our mutation from above using `graphql`
const mutation = graphql`
  mutation AddTodoMutation($input: AddTodoInput!) {
    addTodo(input: $input) {
      todoEdge {
        cursor
        node {
          id
          text
          complete
        }
      }
      viewer {
        id
        totalCount
      }
    }
  }
`;

function sharedUpdater(store, userId, newEdge) {
  // Get the current user record from the store
  const userProxy = store.get(userId);

  // Get the user's Todo List using ConnectionHandler helper
  const conn = ConnectionHandler.getConnection(
    userProxy,
    'TodoList_todos', // This is the connection identifier, defined here
    // https://github.com/relayjs/relay-examples/blob/master/todo/js/components/TodoList.js#L68
  );

  console.log("ConnectionHandler: ", conn);

  // Insert the new todo into the Todo List connection
  ConnectionHandler.insertEdgeAfter(conn, newEdge);
}

let tempID = 0;

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

function commit(environment, text, userId) {
  // Now we just call commitMutation with the appropriate parameters
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {
          text,
          clientMutationId: 'client:newTodo:' + tempID++,
        },
      },
      updater: (store) => {
        // Get the payload returned from the server
        const payload = store.getRootField('addTodo');
        console.log("payload: ", payload);
  
        // Get the edge of the newly created Todo record
        const newEdge = payload.getLinkedRecord('todoEdge');
  
        // Add it to the user's todo list
        sharedUpdater(store, userId, newEdge);
      }
      // optimisticResponse: getOptimisticResponse(complete, todo),
    }
  );
}

// function commit(environment, text, user) {
//   return commitMutation(environment, {
//     mutation,
//     variables: {
//       input: {
//         text,
//         clientMutationId: tempID++,
//       },
//     },
//     updater: (store) => {
//       // Get the payload returned from the server
//       const payload = store.getRootField('addTodo');

//       // Get the edge of the newly created Todo record
//       const newEdge = payload.getLinkedRecord('todoEdge');

//       // Add it to the user's todo list
//       sharedUpdater(store, user, newEdge);
//     },
//     optimisticUpdater: (store) => {
//       // Create a Todo record in our store with a temporary ID
//       const id = 'client:newTodo:' + tempID++;
//       const node = store.create(id, 'Todo');
//       node.setValue(text, 'text');
//       node.setValue(id, 'id');

//       // Create a new edge that contains the newly created Todo record
//       const newEdge = store.create(
//         'client:newEdge:' + tempID++,
//         'TodoEdge',
//       );
//       newEdge.setLinkedRecord(node, 'node');

//       // Add it to the user's todo list
//       sharedUpdater(store, user, newEdge);

//       // Given that we don't have a server response here,
//       // we also need to update the todo item count on the user
//       const userRecord = store.get(user.id);
//       userRecord.setValue(
//         userRecord.getValue('totalCount') + 1,
//         'totalCount',
//       );
//     },
//   });
// }

export default {commit};