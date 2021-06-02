// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

// 🐨 this is going to be our generic asyncReducer
function genericAsyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      // 🐨 replace "pokemon" with "data" (in the action too!)
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function useAsync(initialState) {
   const [state, dispatch] = React.useReducer(genericAsyncReducer, {
      status: 'idle',
      data: null,
      error: null,
      ...initialState,
   });

   const asyncCallback = React.useCallback((functionToWrap) => {
      dispatch({type: 'pending'})
      functionToWrap.then(
         data => {
            dispatch({type: 'resolved', data})
         },
         error => {
            dispatch({type: 'rejected', error})
         }
      )
   }, []);
   /*
   React.useEffect(() => {
      // 💰 this first early-exit bit is a little tricky, so let me give you a hint:
      // const promise = asyncCallback()
      // if (!promise) {
      //   return
      // }
      // then you can dispatch and handle the promise etc...
      const promise = asyncCallback()
      if (!promise) {
        return
      }
      dispatch({type: 'pending'})
      promise.then(
         data => {
            dispatch({type: 'resolved', data})
         },
         error => {
            dispatch({type: 'rejected', error})
         }
      )
      // 🐨 you'll accept dependencies as an array and pass that here.
      // 🐨 because of limitations with ESLint, you'll need to ignore
      // the react-hooks/exhaustive-deps rule. We'll fix this in an extra credit.
    }, [asyncCall])
    */

   return {...state, run: asyncCallback};
}

function PokemonInfo({pokemonName}) {
  // 🐨 move both the useReducer and useEffect hooks to a custom hook called useAsync
  // here's how you use it:
  const {data, status, error, run} = useAsync({
      status: pokemonName ? 'pending' : 'idle',
   })
   
   React.useEffect(() => {
      if (!pokemonName) {
         return
      }
      run(fetchPokemon(pokemonName))
   }, [pokemonName, run])

  // Pre Extra Credit 2
//   const asyncCallback = React.useCallback(() => {
//    if (!pokemonName) {
//      return
//    }
//    return fetchPokemon(pokemonName)
// }, [pokemonName]);
//   const state = useAsync(
//     asyncCallback,
//     {status: pokemonName ? 'pending' : 'idle'},
//   )\

   // Pre Extra Credit 1
  // 🐨 so your job is to create a useAsync function that makes this work.
//   const [state, dispatch] = React.useReducer(pokemonInfoReducer, {
//     status: pokemonName ? 'pending' : 'idle',
//     // 🐨 this will need to be "data" instead of "pokemon"
//     data: null,
//     error: null,
//   })

  // 🐨 this will change from "pokemon" to "data"
  // const {data, status, error} = state

  if (status === 'idle' || !pokemonName) {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={data} />
  }

  throw new Error('This should be impossible')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
