import { createStore } from 'solid-js/store'

export const [appState, setAppState] = createStore({
  height: window.innerHeight,
  width: window.innerWidth,
  search: '',
});
