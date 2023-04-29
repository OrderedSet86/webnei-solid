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

const scaleFactor = 1.25
const gap = 2
const recipeWidth = (appState.imageWidth + 2) * scaleFactor * 4 + gap * 3
const sizeStr = `${recipeWidth}px`

const FallbackRecipeRenderer = (props: FallbackRecipeRendererProps) => {
    // Renders a recipe as a 4x4 grid -> 4x4 grid (no darkUI asset)

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
                    if (index < props.items.length) {
                        const item = props.items[index];
                        return (
                            <GridItem bg="blue">
                                <Center>
                                    <ClickableItem
                                        tooltipLabel={item.localizedName}
                                        basic_display_info={item}
                                        divClass={"cellNoOutline"}
                                        scaleFactor={scaleFactor}
                                        advanced_display_info={{quantity: item.stackSize, clickableType: "item"}}
                                    />
                                </Center>
                            </GridItem>
                        );
                    } else if (index < props.items.length + props.fluids.length) {
                        const fluid = props.fluids[index - props.items.length];
                        return (
                            <GridItem bg="blue">
                                <Center>
                                    <ClickableItem
                                        tooltipLabel={fluid.id}
                                        basic_display_info={fluid}
                                        divClass={"cellNoOutline"}
                                        scaleFactor={scaleFactor}
                                        advanced_display_info={{quantity: fluid.liters, clickableType: "fluid"}}
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