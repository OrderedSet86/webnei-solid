import type { JSX } from 'solid-js';
import { Center, Grid, GridItem } from '@hope-ui/solid'
import Items from "~/components/Items";
import SearchBar from "~/components/SearchBar";


interface SidebarProps {
    ownHeight: number;
    ownWidth: number;
}

const searchBoxHeight = 50;

const Sidebar = (props: SidebarProps): JSX.Element => {

    return (
        <>
            <Grid templateRows="repeat(2, 1fr)" gap={0} height={props.ownHeight}>
                <GridItem bg="orange">
                    <Center>
                        <Items ownWidth={props.ownHeight - searchBoxHeight}/>
                    </Center>
                </GridItem>
                <GridItem bg="blue">
                    <SearchBar/>
                </GridItem>
            </Grid>
        </>
    );
}

export default Sidebar;