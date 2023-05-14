import { createStore } from 'solid-js/store'


interface AppStateInterface {
  height: number;
  width: number;
  search: string;
  currentBasicSidebarItem: {
    id?: string;
    localizedName?: string;
    tooltip?: string;
    imageFilePath?: string;
    makeOrUse?: string;
  };
  gql_recipe_response: string;
  export_version: string;
  imageWidth: number;
}


const [appState, setAppState] = createStore<AppStateInterface>({
  height: window.innerHeight,
  width: window.innerWidth,
  search: '',
  currentBasicSidebarItem: {},
  gql_recipe_response: '',
  export_version: '2.2.8',
  imageWidth: 40 - 2,
});

export {appState, setAppState}