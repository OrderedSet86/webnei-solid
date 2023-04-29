import Sidebar from '~/components/Sidebar'
import NEIBrowser from '~/components/NEIBrowser'
import FallbackRecipeRenderer from '~/components/FallbackRecipeRenderer'
import { appState, setAppState } from '~/state/appState'

import { onMount } from 'solid-js'
import { produce } from 'solid-js/store'
import { HopeProvider } from '@hope-ui/solid'
import { Box, Grid, GridItem, Text } from '@hope-ui/solid'

Error.stackTraceLimit = Infinity;
const gap = 6;
const topHeight = 50;

export default function Home() {
  const lowerHeight = () => appState.height - topHeight - gap;
  const rightWidth = () => appState.width / 2 - gap;

  const handler = (event: Event) => {
    setAppState(produce((s) => {
      s.height = window.innerHeight;
      s.width = window.innerWidth;
    }));
  };

  onMount(() => {
    window.addEventListener('resize', handler);
  });

  const recipe = {
    "inputItems": [
      {
        "id": "i~gregtech~gt.metaitem.01~23019",
        "localizedName": "Aluminium Rod",
        "stackSize": 1,
        "imageFilePath": "item/gregtech/gt.metaitem.01~23019.png",
        "position": 0
      }
    ],
    "inputFluids": [
      {
        "id": "f~gregtech~plasma.argon",
        "imageFilePath": "fluid/gregtech/plasma.argon.png",
        "position": 0,
        "liters": 1
      }
    ],
    "outputItems": [
      {
        "localizedName": "Aluminium Nugget",
        "stackSize": 4,
        "imageFilePath": "item/gregtech/gt.metaitem.01~9019.png",
        "position": 0
      }
    ],
    "outputFluids": [
      {
        "id": "f~GalacticraftMars~argon",
        "imageFilePath": "fluid/GalacticraftMars/argon.png",
        "liters": 1,
        "position": 0
      }
    ]
  }

  return (
    <main>
      <HopeProvider>
        <Box height="100vh" bg="black" padding={0} margin={0}>
          <Grid templateRows="repeat(2, 1fr)" gap={gap} height="100%">
            <GridItem h={topHeight} bg="tomato"/>
            <GridItem h={lowerHeight()}>
              <Grid templateColumns="repeat(2, 1fr)" gap={gap} height="100%">
                <GridItem bg="purple" overflow="hidden" overflowY="auto">
                  <NEIBrowser/>
                </GridItem>
                <GridItem bg="green">
                  <Sidebar ownWidth={rightWidth()} ownHeight={lowerHeight()}/>
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
        </Box>
      </HopeProvider>
    </main>
  );
}
