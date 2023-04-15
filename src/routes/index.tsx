import Sidebar from '~/components/Sidebar'
import { appState, setAppState } from '~/state/appState'
import { onMount } from 'solid-js'
import { produce } from 'solid-js/store'
import { HopeProvider } from '@hope-ui/solid'
import { Box, Grid, GridItem } from '@hope-ui/solid'

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

  return (
    <main>
      <HopeProvider>
        <Box height="100vh" bg="black" padding={0} margin={0}>
          <Grid templateRows="repeat(2, 1fr)" gap={gap} height="100vh">
            <GridItem h={topHeight} bg="tomato"/>
            <GridItem h={lowerHeight()}>
              <Grid templateColumns="repeat(2, 1fr)" gap={gap} height="100%">
                <GridItem bg="purple"/>
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
