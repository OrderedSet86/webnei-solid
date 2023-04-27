import ClickableItem from './ClickableItem'
import {
  createEffect,
  createMemo,
  Index,
  Show,
} from "solid-js";
import { appState, setAppState } from '~/state/appState'
import { gql, createGraphQLClient } from "@solid-primitives/graphql"
import { produce } from 'solid-js/store'

import "./Items.css"

// Modified from https://www.solidjs.com/examples/ethasketch

const boxWidth = 40;

function Items(props: {ownWidth: number, ownHeight: number}) {
  // Layout
  const gridSideWidth = () => Math.floor(props.ownWidth / boxWidth)
  const gridSideHeight = () => Math.floor(props.ownHeight / boxWidth)

  const numBoxes = createMemo(() => gridSideWidth() * gridSideHeight());

  // GraphQL
  const graphQLClient = createGraphQLClient("http://localhost:5000/graphql");
  const [data, {refetch}] = graphQLClient<{ getNSidebarItems: Array<any>}>(
    gql`
      query SidebarItems(
        $limit: Int!,
        $search: String!,
        $mode: String!
      ) {
        getNSidebarItems(limit: $limit, search: $search, mode: $mode) {
          itemId
          localizedName
          tooltip
          imageFilePath
        }
      }
    `,
    () => ({
      limit: numBoxes(),
      search: appState.search,
      mode: "contains",
    }),
    { getNSidebarItems: [] } // Initial value
  );

  return (
    <>
      <div
        style={{
          display: "grid",
          "grid-template-rows": `repeat(${gridSideHeight()}, ${boxWidth}px)`,
          "grid-template-columns": `repeat(${gridSideWidth()}, ${boxWidth}px)`,
        }}
      >
        <Show when={!data.loading}>
          <Index
            each={Array.from({ length: numBoxes()})}
          >
            {(_, index) => {
              const tooltipLabel = `${data()?.getNSidebarItems?.[index]?.['tooltip']}`

              return (
                <ClickableItem 
                  tooltipLabel={tooltipLabel}
                  display_info={data()?.getNSidebarItems?.[index]}
                />
              );
            }}
          </Index>
        </Show>
      </div>
    </>
  );
}

export default Items;