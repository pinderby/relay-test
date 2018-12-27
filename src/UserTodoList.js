// UserTodoList.js
import React from 'react';
import {graphql, QueryRenderer} from 'react-relay';
import environment from './Environment'

export default class UserTodoList extends React.Component {
  render() {
    const {userID} = this.props;

    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query UserTodoListQuery($userID: ID!) {
            node(id: $userID) {
              id
            }  
          }
        `}
        variables={{userID}}
        render={({error, props}) => {
          if (error) {
            return <div>Error!</div>;
          }
          if (!props) {
            return <div>Loading...</div>;
          }
          return <div>User ID: {props.node.id}</div>;
        }}
      />
    );
  }
}