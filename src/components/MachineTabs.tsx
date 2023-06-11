import { createEffect, Index } from "solid-js"
import { Box, Center, Grid, Tooltip, Tabs, TabList, Tab, TabPanel } from "@hope-ui/solid"

import FallbackRecipeRenderer from "./FallbackRecipeRenderer"
import { appState, setAppState } from '~/state/appState'
import { AssociatedRecipesInterface, BaseRecipeInterface, GTRecipeInterface } from "./Interfaces"


const MachineTabs = (props: AssociatedRecipesInterface) => {

  if (props.GTRecipes && props.OtherRecipes) {
    const allRecipes: [string, BaseRecipeInterface | GTRecipeInterface][] = []
    for (const recipe of props.OtherRecipes) {
      allRecipes.push(['Other', recipe])
    }
    for (const recipe of props.GTRecipes) {
      allRecipes.push(['GT', recipe])
    }

    // Group recipes by icon_id
    const iconToRecipes = new Map<string, [string, BaseRecipeInterface | GTRecipeInterface][]>();
    for (const data of allRecipes) {
      const recipeType = data[0]
      const recipe = data[1]
      const baseRecipe = recipeType === 'GT' ? (recipe as GTRecipeInterface).baseRecipe : (recipe as BaseRecipeInterface)

      const iconId = baseRecipe.iconId;
      if (iconToRecipes.has(iconId)) {
        iconToRecipes.get(iconId)?.push(data);
      }
      else {
        iconToRecipes.set(iconId, [data]);
      }
    }

    const iconToLocalizedName = new Map<string, string>();
    for (const data of allRecipes) {
      const recipeType = data[0]
      const recipe = data[1]
      const baseRecipe = recipeType === 'GT' ? (recipe as GTRecipeInterface).baseRecipe : (recipe as BaseRecipeInterface)

      iconToLocalizedName.set(baseRecipe.iconId, baseRecipe.recipeType);
    }

    const indexKeys = Array.from(iconToRecipes.keys());

    return (
      <>
        <Tabs colorScheme={"accent"} marginTop={10} marginLeft={5} marginRight={5}>
          <TabList>
            <Index each={indexKeys}>
              {(iconId, index) => (
                <Tab>
                  {iconToLocalizedName.get(iconId())}
                </Tab>
              )}
            </Index>
          </TabList>
          <Index each={indexKeys}>
            {(iconId, index) => {
              const associated_recipes = iconToRecipes.get(iconId());
              return (
                <TabPanel>
                  <Index each={associated_recipes}>
                    {(recipe, index) => (
                      <FallbackRecipeRenderer
                        recipeType={recipe()[0]}
                        recipe={recipe()[1]}
                      />
                    )}
                  </Index>
                </TabPanel>
              )
            }}
          </Index>
        </Tabs>
      </>
    );
  } else {
    return <></>
  }
}

export default MachineTabs;