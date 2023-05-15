import { Index } from "solid-js"
import { Box, Center, Grid, Tooltip, Tabs, TabList, Tab } from "@hope-ui/solid"


interface MachineTabsInterface {
    gtRecipes: Array<{}>,
    otherRecipes: Array<{}>,
}

const MachineTabs = (props: MachineTabsInterface) => {
    // Group recipes by icon_id

    const tabChildrenConstructor = (outerProps: MachineTabsInterface) => {
        if (outerProps.gtRecipes) {
            return (
                <Index each={outerProps.gtRecipes}>
                    {(recipe, index) => (
                        <Tab>{recipe().localizedMachineName}</Tab>
                    )}
                </Index>
            )
        } else {
            return (
                <></>
            )
        }
    }

    const tabParent = (
        <Tabs
            colorScheme={"accent"}
            marginTop={10}
            marginLeft={5}
            marginRight={5}
        >
            <TabList
                children={tabChildrenConstructor(props)}
            />
        </Tabs>
    )

    return tabParent;
}

export default MachineTabs;