import { Input } from "@hope-ui/solid";
import type { JSX } from 'solid-js';
import { debounce } from "@solid-primitives/scheduled";
import { appState, setAppState } from '~/state/appState'
import { produce } from 'solid-js/store'


const SearchBar = (): JSX.Element => {
    const updateSearch = debounce((search: string) => {
        console.log(appState.search)
        setAppState(produce((s) => {
            s.search = search;
        }))
        console.log(appState.search)
    }, 250)

    const handleInput = (event: Event) => {
        if (event.target) {
            updateSearch((event.target as HTMLInputElement).value);
        }
    }
    
    return (
        <>
            <Input placeholder="Search" height="100%" color="white" onInput={handleInput}/>
        </>
    )
}

export default SearchBar;