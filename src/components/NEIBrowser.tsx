import {
    createEffect,
    createMemo,
    createSignal,
    ErrorBoundary,
    Index,
    Show,
} from "solid-js";
import { appState, setAppState } from '~/state/appState'
import { gql, createGraphQLClient } from "@solid-primitives/graphql"
import { produce } from 'solid-js/store'

import FallbackRecipeRenderer from "./FallbackRecipeRenderer";

interface QueryInternals {
  singleId?: string
  makeOrUse?: string
  GTRecipes?: Array<{}>
  OtherRecipes?: Array<{
    inputItems?: Array<{}>
    outputItems?: Array<{}>
  }>
}
interface MakeQueryResponse {
  getRecipesThatMakeSingleId: QueryInternals
}
interface UseQueryResponse {
  getRecipesThatUseSingleId: QueryInternals
}


function NEIBrowser() {
  const graphQLClient = createGraphQLClient("http://localhost:5000/graphql");

  const queryCore = `
    singleId
    makeOrUse
    GTRecipes {
      localizedMachineName
      amperage
      voltage
      durationTicks
      baseRecipe {
        ...NEIBaseRecipeFragment
      }
      additionalInfo
      fluidInputDims {
        height
        width
      }
      fluidOutputDims {
        height
        width
      }
      iconId
      iconInfo
      itemInputDims {
        height
        width
      }
      itemOutputDims {
        height
        width
      }
      recipeId
      requiresCleanroom
      requiresLowGravity
      shapeless
      voltageTier
    }
    OtherRecipes {
      ...NEIBaseRecipeFragment
    }
  `

  const queryFragments = `
    fragment NEIFluidFragment on NEIFluid {
      density
      fluidId
      gaseous
      id
      imageFilePath
      localizedName
      liters
      modId
      nbt
      outputProbability
      position
      temperature
    }
    
    fragment NEIItemFragment on NEIItem {
      id
      localizedName
      stackSize
      imageFilePath
      itemId
      modId
      nbt
      outputProbability
      position
      tooltip
    }
    
    fragment NEIBaseRecipeFragment on NEIBaseRecipe {
      recipeId
      inputItems {
        ...NEIItemFragment
      }
      outputItems {
        ...NEIItemFragment
      }
      inputFluids {
        ...NEIFluidFragment
      }
      outputFluids {
        ...NEIFluidFragment
      }
    }
  `

  const [makeInput, setMakeInput] = createSignal("")
  const [useInput, setUseInput] = createSignal("")

  const [makeData, {refetch: refetchMakeData}] = graphQLClient<MakeQueryResponse>(
    gql`
    query MakeItems($single_id: String!) {
      getRecipesThatMakeSingleId(itemId: $single_id) {
        ${queryCore}
      }
    }
    ${queryFragments}
    `,
    () => ({
      single_id: makeInput(),
    }),
    { getRecipesThatMakeSingleId: {} } // Initial value
  );

  const [useData, {refetch: refetchUseData}] = graphQLClient<UseQueryResponse>(
    gql`
    query UseItems($single_id: String!) {
      getRecipesThatUseSingleId(itemId: $single_id) {
        ${queryCore}
      }
    }
    ${queryFragments}
    `,
    () => ({
      single_id: useInput(),
    }),
    { getRecipesThatUseSingleId: {} } // Initial value
  );

  createEffect(() => {
    // When a new appState.currentBasicSidebarItem is set, check if it is "make" or "use"
    // Then update the relevant GraphQL query input
    if (appState.currentBasicSidebarItem.id) {
      if (appState.currentBasicSidebarItem.makeOrUse === "make") {
        setMakeInput(appState.currentBasicSidebarItem.id)
      } else if (appState.currentBasicSidebarItem.makeOrUse === "use") {
        setUseInput(appState.currentBasicSidebarItem.id)
      }
    }
  })

  return (
    <>
      <Show when={appState.currentBasicSidebarItem.makeOrUse === "make"}>
        <Show when={!makeData.loading}>
          <Index
            each={makeData()?.getRecipesThatMakeSingleId?.OtherRecipes}
          >
            {(recipe, index) => {
              return (
                <FallbackRecipeRenderer recipe={recipe()} />
              );
            }}
          </Index>
        </Show>
      </Show>
      <Show when={appState.currentBasicSidebarItem.makeOrUse === "use"}>
        <Show when={!useData.loading}>
          <Index
            each={useData()?.getRecipesThatUseSingleId?.OtherRecipes}
          >
            {(recipe, index) => {
              return (
                <FallbackRecipeRenderer recipe={recipe()} />
              );
            }}
          </Index>
        </Show>
      </Show>
    </>
  )
}

export default NEIBrowser;