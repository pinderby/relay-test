import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { graphql, QueryRenderer } from 'react-relay';
import environment from './Environment'
import ViewerTodoList from './ViewerTodoList';

class App extends React.Component {
  render() {
    return (
      <div>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query AppQuery {
              viewer {
                id
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
            return <div>User ID: {props.viewer.id}</div>;
          }}
        />
        <ViewerTodoList />
      </div>
    );
  }
}
export default App


// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <p>
//             Edit <code>src/App.js</code> and save to reload.
//           </p>
//           <a
//             className="App-link"
//             href="https://reactjs.org"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Learn React
//           </a>
//         </header>
//       </div>
//     );
//   }
// }

// export default App;
