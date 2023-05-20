import { Index } from 'solid-js'
import { produce } from 'solid-js/store'
import { Box, Center, Divider, Grid, GridItem } from '@hope-ui/solid'

import { appState, setAppState } from '~/state/appState'
import { appStyles } from './AppStyle'
import ClickableItem from './ClickableItem'
import { BaseRecipeInterface, BasicDimensionsInterface, ItemInterface, FluidInterface } from './Interfaces'


interface FallbackRecipeRendererProps {
    recipe: BaseRecipeInterface
}

const scaleFactor = 1.25
const gap = 2
const recipePadding = 10
const boxCountToGridSize = (boxSize: number) => {
    return (appState.imageWidth + 2) * scaleFactor * boxSize + gap * (boxSize-1)
}

const FallbackRecipeRenderer = (props: FallbackRecipeRendererProps) => {
    // Renders a recipe as a grid -> grid (no darkUI asset)

    // Compute overall recipe grid attributes
    const maxInputBoxWidth = Math.max(props.recipe.dimensions.itemInputDims.width, props.recipe.dimensions.fluidInputDims.width)
    const inputWidth = boxCountToGridSize(maxInputBoxWidth)

    const maxOutputBoxWidth = Math.max(props.recipe.dimensions.itemOutputDims.width, props.recipe.dimensions.fluidOutputDims.width)
    const outputWidth = boxCountToGridSize(maxOutputBoxWidth)

    const inputHeight = (
        boxCountToGridSize(props.recipe.dimensions.itemInputDims.height) 
        + boxCountToGridSize(props.recipe.dimensions.fluidInputDims.height)
        + gap
    )
    const outputHeight = (
        boxCountToGridSize(props.recipe.dimensions.itemOutputDims.height)
        + boxCountToGridSize(props.recipe.dimensions.fluidOutputDims.height)
        + gap
    )
    const maxHeight = Math.max(inputHeight, outputHeight)


    // Construct single recipe grid
    return (
        <Box paddingBottom={recipePadding}>
            <Grid
                templateColumns={
                    `
                    ${inputWidth}px
                    60px
                    ${outputWidth}px
                `}
                gap={0}
                height={`${maxHeight}px`}
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
    items: Array<ItemInterface>
    fluids: Array<FluidInterface>
    itemDims: BasicDimensionsInterface
    fluidDims: BasicDimensionsInterface
}

const ItemAndFluidGrid = (props: ItemAndFluidGridProps) => {
    // Create hash map of position -> item or fluid
    // Then iterate over the grid positions and render the item or fluid if it exists
    // Note: indexes are column-major order, so need to convert to row-major order
    
    const positionToItemMapping = props.items.reduce((map, obj) => {
        map.set(obj.position, obj);
        return map;
    }, new Map<number, ItemInterface>());
    const positionToFluidMapping = props.fluids.reduce((map, obj) => {
        map.set(obj.position, obj);
        return map;
    }, new Map<number, FluidInterface>());

    const constructGrid = (dimension: BasicDimensionsInterface, positionMapping: Map<number, ItemInterface | FluidInterface>) => {
        return (
            <Grid
                templateColumns={`repeat(${dimension.width}, 1fr)`}
                templateRows={`repeat(${dimension.height}, 1fr)`}
                gap={gap}
                height={boxCountToGridSize(dimension.height)}
                width={boxCountToGridSize(dimension.width)}
            >
                <Index each={Array.from({ length: dimension.width * dimension.height })}>
                    {(_, index) => {
                        const index_obj = positionMapping.get(index);

                        if (index_obj) {
                            let clickableType = "";
                            let quantity = -1;

                            if (index_obj.hasOwnProperty("stackSize")) {
                                clickableType = "item";
                                quantity = (index_obj as ItemInterface).stackSize;
                            } else if (index_obj.hasOwnProperty("liters")) {
                                clickableType = "fluid";
                                quantity = (index_obj as FluidInterface).liters;
                            } else {
                                console.log("Unknown clickable type");
                            }

                            const tooltipLabel = clickableType == "item" ? (index_obj as ItemInterface).tooltip : "";

                            return (
                                <GridItem bg={appStyles.recipeGridColor}>
                                    <Center>
                                        <ClickableItem
                                            tooltipLabel={index_obj.localizedName}
                                            basic_display_info={{
                                                itemId: index_obj.id,
                                                localizedName: index_obj.localizedName,
                                                tooltip: tooltipLabel,
                                                imageFilePath: index_obj.imageFilePath,
                                            }}
                                            divClass={"cellNoOutline"}
                                            scaleFactor={scaleFactor}
                                            advanced_display_info={{quantity: quantity, clickableType: clickableType}}
                                        />
                                    </Center>
                                </GridItem>
                            );
                        } else return (
                            // No item at this position
                            <GridItem
                                bg={appStyles.recipeGridColor}
                            />
                        );
                    }}
                </Index>
            </Grid>
        )
    }

    const itemGrid = constructGrid(props.itemDims, positionToItemMapping);
    const fluidGrid = constructGrid(props.fluidDims, positionToFluidMapping);

    return (
        <>
            <Grid
                templateRows={`${boxCountToGridSize(props.itemDims.height)}px ${boxCountToGridSize(props.fluidDims.height)}px`}
                gap={gap}
            >
                {itemGrid}
                {fluidGrid}
            </Grid>
        </>
    )
}


export default FallbackRecipeRenderer;