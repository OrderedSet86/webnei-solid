import { Index } from 'solid-js'
import { Box, Center, Grid, GridItem } from '@hope-ui/solid'

import { appState, setAppState } from '~/state/appState'
import { appStyles } from './AppStyle'
import ClickableItem from './ClickableItem'
import {
    BaseRecipeInterface,
    BasicDimensionsInterface,
    FluidInterface,
    GTRecipeInterface,
    ItemInterface,
} from './Interfaces'

import "./FallbackRecipeRenderer.css"


interface FallbackRecipeRendererProps {
    recipe: BaseRecipeInterface | GTRecipeInterface
    recipeType: string
}

const scaleFactor = 1.25
const gap = 2
const recipePadding = 10
const boxCountToGridSize = (boxSize: number) => {
    return (appState.imageWidth + 2) * scaleFactor * boxSize + gap * (boxSize-1)
}

const FallbackRecipeRenderer = (props: FallbackRecipeRendererProps) => {
    // Renders a recipe as a grid -> grid (no darkUI asset)

    const baseRecipe = props.recipeType === 'GT' ? (props.recipe as GTRecipeInterface).baseRecipe : (props.recipe as BaseRecipeInterface)

    // Compute overall recipe grid attributes
    const maxInputBoxWidth = Math.max(baseRecipe.dimensions.itemInputDims.width, baseRecipe.dimensions.fluidInputDims.width)
    const inputWidth = boxCountToGridSize(maxInputBoxWidth)

    const maxOutputBoxWidth = Math.max(baseRecipe.dimensions.itemOutputDims.width, baseRecipe.dimensions.fluidOutputDims.width)
    const outputWidth = boxCountToGridSize(maxOutputBoxWidth)

    const inputHeight = (
        boxCountToGridSize(baseRecipe.dimensions.itemInputDims.height) 
        + boxCountToGridSize(baseRecipe.dimensions.fluidInputDims.height)
        + gap
    )
    const outputHeight = (
        boxCountToGridSize(baseRecipe.dimensions.itemOutputDims.height)
        + boxCountToGridSize(baseRecipe.dimensions.fluidOutputDims.height)
        + gap
    )
    const maxHeight = Math.max(inputHeight, outputHeight)

    // Compute GT recipe info (if applicable)
    var GTRecipeInfo = <></>
    if (props.recipeType === 'GT') {
        /* 
        A usual GT recipe string looks like:
        Total: 60,000 EU
        Voltage: 600 EU/t (EV)
        Time: 5 secs

        There are optional fields that get added contextually:
        Needs Cleanroom
        Needs Low Gravity
        Heat Capacity: 3,000 K (Nichrome)
        Amperage: 3
        Time: 0.8 secs (16 ticks)
        Start: 60,000,000 EU (MK 1)
        */
        const recipe = props.recipe as GTRecipeInterface
        let infoBuffer: string[] = []

        const totalEU = recipe.amperage * recipe.voltage * recipe.durationTicks
        const tickInfo = recipe.durationTicks < 20 ? ` (${recipe.durationTicks} ticks)` : ''

        infoBuffer.push(`Total: ${totalEU} EU`)
        infoBuffer.push(`Voltage: ${recipe.voltage} EU/t`)
        infoBuffer.push(`Time: ${recipe.durationTicks / 20} secs${tickInfo}`)
        if (recipe.requiresCleanroom) {
            infoBuffer.push(`Needs Cleanroom`)
        }
        if (recipe.requiresLowGravity) {
            infoBuffer.push(`Needs Low Gravity`)
        }
        if (recipe.additionalInfo) {
            infoBuffer.push(recipe.additionalInfo)
        }

        GTRecipeInfo = (
            <p class="gtinfo" style="color:white">
                {infoBuffer.join('\n')}
            </p>
        )
    }

    // Construct single recipe grid
    return (
        <Box className="fallback" marginBottom={recipePadding}>
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
                        items={baseRecipe.inputItems}
                        fluids={baseRecipe.inputFluids}
                        itemDims={baseRecipe.dimensions.itemInputDims}
                        fluidDims={baseRecipe.dimensions.fluidInputDims}
                    />
                </Center>

                <Center>
                    <p style={`color:${appStyles.recipeArrowColor}; font-size:40px; margin:0px;`}>⇒</p>
                </Center>

                <Center>
                    <ItemAndFluidGrid
                        items={baseRecipe.outputItems}
                        fluids={baseRecipe.outputFluids}
                        itemDims={baseRecipe.dimensions.itemOutputDims}
                        fluidDims={baseRecipe.dimensions.fluidOutputDims}
                    />
                </Center>
            </Grid>
            {GTRecipeInfo}
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