import Sidebar from "~/components/Sidebar"
import { HopeProvider } from '@hope-ui/solid'
import { Box, Grid, GridItem } from '@hope-ui/solid'

export default function Home() {
  return (
    <main>
      <HopeProvider>
        <Box height="100vh" bg="black" padding={0} margin={0}>
          <Grid templateRows="repeat(2, 1fr)" gap={6} height="100vh">
            <GridItem h="50px" bg="tomato"/>
            <GridItem>
              <Grid templateColumns="repeat(2, 1fr)" gap={6} height="100vh">
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
