import { createEffect, Index } from "solid-js"
import { Box, Center, Grid, Tooltip, Tabs, TabList, Tab, TabPanel } from "@hope-ui/solid"

import FallbackRecipeRenderer from "./FallbackRecipeRenderer"
import { appState, setAppState } from '~/state/appState'
import { AssociatedRecipesInterface, BaseRecipeInterface } from "./Interfaces"


const MachineTabs = (props: AssociatedRecipesInterface) => {

    if (props.gtRecipes && props.otherRecipes) {
        const allRecipes = props.otherRecipes.concat(
            props.gtRecipes.map((recipe) => recipe.baseRecipe)
        )

        // Group recipes by icon_id
        const iconToRecipes = new Map<string, Array<BaseRecipeInterface>>();
        for (const recipe of allRecipes) {
            const iconId = recipe.iconId;
            if (iconToRecipes.has(iconId)) {
                iconToRecipes.get(iconId)?.push(recipe);
            }
            else {
                iconToRecipes.set(iconId, [recipe]);
            }
        }

        const iconToLocalizedName = new Map<string, string>();
        for (const recipe of allRecipes) {
            iconToLocalizedName.set(recipe.iconId, recipe.recipeType);
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
                                            <FallbackRecipeRenderer recipe={recipe()} />
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