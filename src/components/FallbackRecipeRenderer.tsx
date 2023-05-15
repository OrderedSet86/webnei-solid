import { Index } from 'solid-js'
import { appState, setAppState } from '~/state/appState'
import { produce } from 'solid-js/store'
import { Box, Center, Divider, Grid, GridItem } from '@hope-ui/solid'
import { appStyles } from '~/components/AppStyle'
import ClickableItem from './ClickableItem'


interface BasicDimensions {
    width: number
    height: number
}

interface RecipeDimensionProps {
    itemInputDims: BasicDimensions
    itemOutputDims: BasicDimensions
    fluidInputDims: BasicDimensions
    fluidOutputDims: BasicDimensions
}

interface FallbackRecipeRendererProps {
    recipe: {
        dimensions: RecipeDimensionProps
        inputItems: Array<any>
        inputFluids: Array<any>
        outputItems: Array<any>
        outputFluids: Array<any>
    }
}

const scaleFactor = 1.25
const gap = 2
const boxCountToGridSize = (boxSize: number) => {
    return (appState.imageWidth + 2) * scaleFactor * boxSize + gap * (boxSize-1)
}

const FallbackRecipeRenderer = (props: FallbackRecipeRendererProps) => {
    // Renders a recipe as a grid -> grid (no darkUI asset)

    const heightBoxes = Math.max(props.recipe.dimensions.itemInputDims.height, props.recipe.dimensions.itemOutputDims.height)
    const gridPxHeight = boxCountToGridSize(heightBoxes)

    return (
        <Box paddingBottom={10}>
            <Grid
                templateColumns={
                    `
                    ${boxCountToGridSize(props.recipe.dimensions.itemInputDims.width)}px
                    60px
                    ${boxCountToGridSize(props.recipe.dimensions.itemOutputDims.width)}px
                `}
                gap={0}
                height={`${gridPxHeight}px`}
                bg={appStyles.recipeBrowserColor}
            >
                <Center>
                    <ItemAndFluidGrid
                        items={props.recipe.inputItems}
                        fluids={props.recipe.inputFluids}
                        itemDims={props.recipe.dimensions.itemInputDims}
                        fluidDims={props.recipe.dimensions.fluidInputDims}
                    />
                </Center>

                <Center>
                    <p style={`color:${appStyles.recipeArrowColor}; font-size:40px; margin:0px;`}>⇒</p>
                </Center>

                <Center>
                    <ItemAndFluidGrid
                        items={props.recipe.outputItems}
                        fluids={props.recipe.outputFluids}
                        itemDims={props.recipe.dimensions.itemOutputDims}
                        fluidDims={props.recipe.dimensions.fluidOutputDims}
                    />
                </Center>
            </Grid>
        </Box>
    );
}

interface ItemAndFluidGridProps {
    items: Array<any>
    fluids: Array<any>
    itemDims: BasicDimensions
    fluidDims: BasicDimensions
}

const ItemAndFluidGrid = (props: ItemAndFluidGridProps) => {
    // Create hash map of position -> item or fluid
    // Then iterate over the gridSize ** 2 positions and render the item or fluid if it exists
    // Note: indexes are column-major order, so need to convert to row-major order
    
    const positionToItemMapping = props.items.concat(props.fluids).reduce((map, obj) => {
        map.set(obj.position, obj);
        return map;
    }, new Map<number, any>());

    const gridWidthLayoutStr = `repeat(${props.itemDims.width}, 1fr)`
    const gridHeightLayoutStr = `repeat(${props.itemDims.height}, 1fr)`

    return (
        <Grid
            templateColumns={gridHeightLayoutStr}
            templateRows={gridWidthLayoutStr}
            gap={gap}
            height={boxCountToGridSize(props.itemDims.height)}
            width={boxCountToGridSize(props.itemDims.width)}
        >
            <Index each={Array.from({ length: props.itemDims.width * props.itemDims.height })}>
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
                            <GridItem bg={appStyles.recipeGridColor}>
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
                        <GridItem bg={appStyles.recipeGridColor}/>
                    );
                }}
            </Index>
        </Grid>
    )
}


export default FallbackRecipeRenderer;