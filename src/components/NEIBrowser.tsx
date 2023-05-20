import {
    createEffect,
    createSignal,
    Show,
} from "solid-js";
import { appState, setAppState } from '~/state/appState'
import { gql, createGraphQLClient } from "@solid-primitives/graphql"

import MachineTabs from "./MachineTabs"
import { AssociatedRecipesInterface } from "./Interfaces";


interface MakeQueryResponse {
  getRecipesThatMakeSingleId: AssociatedRecipesInterface | {}
}
interface UseQueryResponse {
  getRecipesThatUseSingleId: AssociatedRecipesInterface | {}
}


function NEIBrowser() {
  const graphQLClient = createGraphQLClient("http://localhost:5000/graphql");

  const queryCore = `
    singleId
    GTRecipes {
      localizedMachineName
      amperage
      voltage
      durationTicks
      baseRecipe {
        ...NEIBaseRecipeFragment
      }
      additionalInfo
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
    input
    internalName
    localizedName
    liters
    luminosity
    modId
    nbt
    outputProbability
    position
    temperature
    unlocalizedName
    viscosity
  }
  
  fragment NEIItemFragment on NEIItem {
    id
    localizedName
    stackSize
    imageFilePath
    input
    internalName
    itemDamage
    itemId
    maxDamage
    maxStackSize
    modId
    nbt
    outputProbability
    position
    tooltip
    unlocalizedName
  }
  
  fragment RecipeDimensionFragment on NEIRecipeDimensions {
    height
    width
  }
  
  fragment NEIDimensionFragment on NEIAllDimensions {
    itemInputDims {
      ...RecipeDimensionFragment
    }
    itemOutputDims {
      ...RecipeDimensionFragment
    }
    fluidInputDims {
      ...RecipeDimensionFragment
    }
    fluidOutputDims {
      ...RecipeDimensionFragment
    }
  }
  
  fragment NEIBaseRecipeFragment on NEIBaseRecipe {
    recipeId

    recipeType
    iconId
    dimensions {
      ...NEIDimensionFragment
    }
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
    if (appState.currentBasicSidebarItem.itemId) {
      if (appState.currentBasicSidebarItem.makeOrUse === "make") {
        setMakeInput(appState.currentBasicSidebarItem.itemId)
        console.log(`Set makeInput to ${appState.currentBasicSidebarItem.itemId}`)
      } else if (appState.currentBasicSidebarItem.makeOrUse === "use") {
        setUseInput(appState.currentBasicSidebarItem.itemId)
      }
    }
  })

  return (
    // Why "as" cast to AssociatedRecipesInterface?
    // For some reason Typescript doesn't recognize that the graphql output is
    //  guaranteed to be defined (as AssociatedRecipes) when the query is not loading.

    <>
      <Show when={appState.currentBasicSidebarItem.makeOrUse === "make"}>
        <Show when={!makeData.loading}>
          <MachineTabs
            {...(makeData()?.getRecipesThatMakeSingleId as AssociatedRecipesInterface)}
          />
        </Show>
      </Show>
      <Show when={appState.currentBasicSidebarItem.makeOrUse === "use"}>
        <Show when={!useData.loading}>
          <MachineTabs
            {...(useData()?.getRecipesThatUseSingleId as AssociatedRecipesInterface)}
          />
        </Show>
      </Show>
    </>
  )
}

export default NEIBrowser;