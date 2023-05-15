import { createEffect, Index } from "solid-js"
import { Box, Center, Grid, Tooltip, Tabs, TabList, Tab, TabPanel } from "@hope-ui/solid"

import FallbackRecipeRenderer from "./FallbackRecipeRenderer"


interface GTRecipeInterface {
    localizedMachineName: string,
    baseRecipe: {
        iconId: string,
        recipeType: string,
    },
}

interface MachineTabsInterface {
    gtRecipes: Array<GTRecipeInterface>,
    otherRecipes: Array<{}>,
}

const MachineTabs = (props: MachineTabsInterface) => {

    if (props.gtRecipes) {
        // Group recipes by icon_id
        const iconToRecipes = new Map<string, Array<GTRecipeInterface>>();
        for (const recipe of props.gtRecipes) {
            const iconId = recipe.baseRecipe.iconId;
            if (iconToRecipes.has(iconId)) {
                iconToRecipes.get(iconId)?.push(recipe);
            }
            else {
                iconToRecipes.set(iconId, [recipe]);
            }
        }

        const iconToLocalizedName = new Map<string, string>();
        for (const recipe of props.gtRecipes) {
            iconToLocalizedName.set(recipe.baseRecipe.iconId, recipe.baseRecipe.recipeType);
        }

        const indexKeys = Array.from(iconToRecipes.keys());

        return (
            <>
                <Tabs colorScheme={"accent"} marginTop={10} marginLeft={5} marginRight={5}>
                    <TabList>
                        <Index each={indexKeys}>
                            {(iconId, index) => (
                                <Tab>{iconToLocalizedName.get(iconId())}</Tab>
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
                                            <FallbackRecipeRenderer recipe={recipe().baseRecipe} />
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