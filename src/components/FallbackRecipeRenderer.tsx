import { Index } from 'solid-js'
import { appState, setAppState } from '~/state/appState'
import { produce } from 'solid-js/store'
import { Grid, GridItem } from '@hope-ui/solid'
import ClickableItem from './ClickableItem'


interface FallbackRecipeRendererProps {
    recipe: {
        inputItems: Array<any>
        inputFluids: Array<any>
        outputItems: Array<any>
        outputFluids: Array<any>
    }
}

const FallbackRecipeRenderer = (props: FallbackRecipeRendererProps) => {
    // Renders a recipe as a 4x4 grid -> 4x4 grid (no darkUI asset)

    console.log(props.recipe)

    return (
        <>
            <Grid templateColumns="repeat(4, 1fr)" templateRows="repeat(4, 1fr)" gap={2} height="200px" width="200px">
                <Index each={Array.from({ length: 16 })}>
                    {(_, index) => {
                        const item = props.recipe.inputItems[index];
                        if (item) {
                            return (
                                <GridItem bg="red">
                                    <ClickableItem
                                        tooltipLabel={item.localizedName}
                                        display_info={item}
                                    />
                                </GridItem>
                            );
                        } else return (
                            <GridItem bg="blue"/>
                        );
                    }}
                </Index>
            </Grid>
            <Grid templateColumns="repeat(4, 1fr)" templateRows="repeat(4, 1fr)" gap={2} height="200px" width="200px">
                <Index each={Array.from({ length: 16 })}>
                    {(_, index) => {
                        const item = props.recipe.outputItems[index];
                        if (item) {
                            return (
                                <GridItem bg="red">
                                    <ClickableItem
                                        tooltipLabel={item.localizedName}
                                        display_info={item}
                                    />
                                </GridItem>
                            );
                        } else return (
                            <GridItem bg="blue"/>
                        );
                    }}
                </Index>
            </Grid>
        </>
    );
}

export default FallbackRecipeRenderer;