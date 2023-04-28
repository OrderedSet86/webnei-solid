import { Index } from 'solid-js'
import { appState, setAppState } from '~/state/appState'
import { produce } from 'solid-js/store'
import { Box, Center, Divider, Grid, GridItem } from '@hope-ui/solid'
import ClickableItem from './ClickableItem'


interface FallbackRecipeRendererProps {
    recipe: {
        inputItems: Array<any>
        inputFluids: Array<any>
        outputItems: Array<any>
        outputFluids: Array<any>
    }
}

const gap = 2
const recipeWidth = appState.imageWidth * 4 + gap * 3
const sizeStr = `${recipeWidth}px`

const FallbackRecipeRenderer = (props: FallbackRecipeRendererProps) => {
    // Renders a recipe as a 4x4 grid -> 4x4 grid (no darkUI asset)

    const gap = 2
    const recipeWidth = appState.imageWidth * 4 + gap * 3
    const sizeStr = `${recipeWidth}px`

    return (
        <>
            <Grid templateColumns={`repeat(3, ${recipeWidth}px)`} gap={0} height={sizeStr} bgColor="red">
                <ItemAndFluidGrid items={props.recipe.inputItems} fluids={props.recipe.inputFluids}/>
                <Center>
                    <Divider orientation="vertical"/>
                </Center>
                <ItemAndFluidGrid items={props.recipe.outputItems} fluids={props.recipe.outputFluids}/>
            </Grid>
        </>
    );
}

interface ItemAndFluidGridProps {
    items: Array<any>
    fluids: Array<any>
}

const ItemAndFluidGrid = (props: ItemAndFluidGridProps) => {
    return (
        <Grid templateColumns="repeat(4, 1fr)" templateRows="repeat(4, 1fr)" gap={gap} height={sizeStr} width={sizeStr}>
            <Index each={Array.from({ length: 16 })}>
                {(_, index) => {
                    const item = props.items[index];
                    if (item) {
                        return (
                            <GridItem bg="blue">
                                <Center>
                                    <ClickableItem
                                        tooltipLabel={item.localizedName}
                                        display_info={item}
                                        divClass={"cellNoOutline"}
                                    />
                                </Center>
                            </GridItem>
                        );
                    } else return (
                        <GridItem bg="blue"/>
                    );
                }}
            </Index>
        </Grid>
    )
}


export default FallbackRecipeRenderer;