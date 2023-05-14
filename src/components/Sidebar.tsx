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
                <GridItem bg="#2b2d42">
                    <Center>
                        <Items ownHeight={props.ownHeight - searchBoxHeight} ownWidth={props.ownWidth}/>
                    </Center>
                </GridItem>
                <GridItem bg="#2b2d42">
                    <SearchBar/>
                </GridItem>
            </Grid>
        </>
    );
}

export default Sidebar;