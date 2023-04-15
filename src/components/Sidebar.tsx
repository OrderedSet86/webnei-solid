import Items from "~/components/Items";
import type { JSX } from 'solid-js';
import { Box, Center, Grid, GridItem, Input } from '@hope-ui/solid'
import { debounce } from "@solid-primitives/scheduled";


interface SidebarProps {
    ownHeight: number;
    ownWidth: number;
}

const searchBoxHeight = 50;

const Sidebar = (props: SidebarProps): JSX.Element => {
    const updateSearch = debounce((search: string) => {
        console.log(search);
    }, 250)

    const handleInput = (event: Event) => {
        if (event.target) {
            updateSearch((event.target as HTMLInputElement).value);
        }
    }

    return (
        <>
            <Grid templateRows="repeat(2, 1fr)" gap={0} height={props.ownHeight}>
                <GridItem bg="orange">
                    <Center>
                        <Items ownWidth={props.ownHeight - searchBoxHeight}/>
                    </Center>
                </GridItem>
                <GridItem bg="blue">
                    <Input placeholder="Search" height="100%" color="white" onInput={handleInput}/>
                </GridItem>
            </Grid>
        </>
    );
}

export default Sidebar;