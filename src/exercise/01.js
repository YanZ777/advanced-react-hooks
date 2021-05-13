// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

const stateReducer = (previousState, dispatch) => {
   const { type, step } = dispatch;
   switch(type) {
      case 'INCREMENT':
         return {count: previousState.count + step};
      default:
   }
}

function Counter({initialCount = 0, step = 1}) {
  // 🐨 replace React.useState with React.useReducer.
  // 💰 React.useReducer(countReducer, initialCount)
  // const [count, setCount] = React.useState(initialCount)

  const [state, dispatch] = React.useReducer(stateReducer, { count: initialCount });
  const { count } = state;

  // 💰 you can write the countReducer function so you don't have to make any
  // changes to the next two lines of code! Remember:
  // The 1st argument is called "state" - the current value of count
  // The 2nd argument is called "newState" - the value passed to setCount
  const increment = () => dispatch({type: 'INCREMENT', step})
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
