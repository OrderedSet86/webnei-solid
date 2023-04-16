import { createStore } from 'solid-js/store'

export const [appState, setAppState] = createStore({
  height: window.innerHeight,
  width: window.innerWidth,
  search: '',
  currentSidebarItem: {},
  gql_recipe_response: '',
  export_version: '2.2.8',
  imageWidth: 40 - 2,
});
