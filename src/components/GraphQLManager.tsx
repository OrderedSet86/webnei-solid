import { createSignal } from "solid-js"
import { gql, createGraphQLClient } from "@solid-primitives/graphql"

import {
    AssociatedRecipesInterface,
    BasicDimensionsInterface,
    RecipeDimensionInterface,
    ItemInterface,
    FluidInterface,
    BaseRecipeInterface,
    GTRecipeInterface,
    SidebarItemInterface,
} from "./Interfaces"


export interface getGTRecipeByRecipeIdInterface {
    getGTRecipeByRecipeId: GTRecipeInterface
}

export interface getNSidebarItemsInterface {
    getNSidebarItems: Array<SidebarItemInterface>
}

export interface getRecipesThatMakeSingleIdInterface {
    getRecipesThatMakeSingleId: AssociatedRecipesInterface
}

export interface getRecipesThatUseSingleIdInterface {
    getRecipesThatUseSingleId: AssociatedRecipesInterface
}


const gqlInputCache = createSignal<Array<Record<string, string | number | boolean>>>([])
const gqlOutputCache = createSignal<Array<
    getGTRecipeByRecipeIdInterface 
    | getNSidebarItemsInterface
    | getRecipesThatMakeSingleIdInterface
    | getRecipesThatUseSingleIdInterface
>>([])


// Public interface
export const makeItemsAvailable = createSignal<boolean>(false)

export const useItemsAvailable = createSignal<boolean>(false)
export const useInput = createSignal<string>("")
export const useOutput = createSignal<AssociatedRecipesInterface>()


const GraphQLManager = () => {
    // Stores a cache of the last 10 queries (inputs and outputs)
    const graphQLClient = createGraphQLClient("http://localhost:5000/graphql")



}

export default GraphQLManager