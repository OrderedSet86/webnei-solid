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

const gridSize = 3
const scaleFactor = 1.25
const gap = 2
const recipeWidth = (appState.imageWidth + 2) * scaleFactor * gridSize + gap * (gridSize-1)
const sizeStr = `${recipeWidth}px`

const FallbackRecipeRenderer = (props: FallbackRecipeRendererProps) => {
    // Renders a recipe as a 4x4 grid -> 4x4 grid (no darkUI asset)

    return (
        <Box paddingBottom={10}>
            <Grid templateColumns={`repeat(3, ${recipeWidth}px)`} gap={0} height={sizeStr} bg="#001219">
                <ItemAndFluidGrid items={props.recipe.inputItems} fluids={props.recipe.inputFluids}/>
                <Center>
                    <p style="color:white; font-size:40px">⇒</p>
                </Center>
                <ItemAndFluidGrid items={props.recipe.outputItems} fluids={props.recipe.outputFluids}/>
            </Grid>
        </Box>
    );
}

interface ItemAndFluidGridProps {
    items: Array<any>
    fluids: Array<any>
}

const ItemAndFluidGrid = (props: ItemAndFluidGridProps) => {
    // Create hash map of position -> item or fluid
    // Then iterate over the gridSize ** 2 positions and render the item or fluid if it exists
    // Note: indexes are column-major order, so need to convert to row-major order
    
    const positionToItemMapping = props.items.concat(props.fluids).reduce((map, obj) => {
        map.set(obj.position, obj);
        return map;
    }, new Map<number, any>());

    const gridStr = `repeat(${gridSize}, 1fr)`

    return (
        <Grid templateColumns={gridStr} templateRows={gridStr} gap={gap} height={sizeStr} width={sizeStr}>
            <Index each={Array.from({ length: gridSize ** 2 })}>
                {(_, index) => {
                    const index_obj = positionToItemMapping.get(index);

                    if (index_obj) {
                        let clickableType = "";
                        let quantity = -1;
                        if (index_obj.hasOwnProperty("stackSize")) {
                            clickableType = "item";
                            quantity = index_obj.stackSize;
                        } else if (index_obj.hasOwnProperty("liters")) {
                            clickableType = "fluid";
                            quantity = index_obj.liters;
                        } else {
                            console.log("Unknown clickable type");
                        }
                        return (
                            <GridItem bg="#343a40">
                                <Center>
                                    <ClickableItem
                                        tooltipLabel={index_obj.localizedName}
                                        basic_display_info={index_obj}
                                        divClass={"cellNoOutline"}
                                        scaleFactor={scaleFactor}
                                        advanced_display_info={{quantity: quantity, clickableType: clickableType}}
                                    />
                                </Center>
                            </GridItem>
                        );
                    } else return (
                        <GridItem bg="#343a40"/>
                    );
                }}
            </Index>
        </Grid>
    )
}


export default FallbackRecipeRenderer;