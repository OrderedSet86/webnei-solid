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
import { Image, Tooltip, Text } from "@hope-ui/solid";
import { produce } from 'solid-js/store'


interface QueryResponse {
  getRecipesThatMakeSingleId: {
    singleId?: string
    makeOrUse?: string
    GTRecipes?: Array<{}>
    OtherRecipes?: Array<{
      inputItems?: Array<{}>
      outputItems?: Array<{}>
    }>
  }
}


function NEIBrowser() {
  const graphQLClient = createGraphQLClient("http://localhost:5000/graphql");

  const [data, {refetch}] = graphQLClient<QueryResponse>(
    gql`
    query MakeItems($single_id: String!) {
      getRecipesThatMakeSingleId(itemId: $single_id) {
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
      }
    }
    
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
    `,
    () => ({
      single_id: appState.currentSidebarItem.itemId || "",
    }),
    { getRecipesThatMakeSingleId: {} } // Initial value
  );

  createEffect(() => {
    if (!data.loading) {
      console.log(data());
    }
  });

  return (
    <>
      <Show when={!data.loading}>
        <Index
          each={data()?.getRecipesThatMakeSingleId?.OtherRecipes}
        >
          {(recipe, index) => {
            return (
              <Text>
                {JSON.stringify(recipe().inputItems)}
                <br/>
                {JSON.stringify(recipe().outputItems)}
              </Text>
            );
          }}
        </Index>
      </Show>
    </>
  )
}

export default NEIBrowser;