import Sidebar from "~/components/Sidebar"
import { createSignal, onMount } from 'solid-js';
import { HopeProvider } from '@hope-ui/solid'
import { Box, Grid, GridItem } from '@hope-ui/solid'

const gap = 6;
const topHeight = 50;

export default function Home() {
  const [rect, setRect] = createSignal({
    height: window.innerHeight,
    width: window.innerWidth
  });

  const handler = (event: Event) => {
    setRect({ height: window.innerHeight, width: window.innerWidth });
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
            <GridItem h={rect().height - topHeight - gap}>
              <Grid templateColumns="repeat(2, 1fr)" gap={gap} height="100%">
                <GridItem bg="purple"/>
                <GridItem bg="green">
                  <Sidebar />
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
        </Box>
      </HopeProvider>
    </main>
  );
}
