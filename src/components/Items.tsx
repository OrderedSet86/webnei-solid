import ClickableItem from './ClickableItem'
import {
    createEffect,
    createMemo,
    Index,
    Show,
} from "solid-js";
import { appState, setAppState } from '~/state/appState'
import { gql, createGraphQLClient } from "@solid-primitives/graphql"
import { Image, Tooltip } from "@hope-ui/solid";
import { produce } from 'solid-js/store'

import "./Items.css"

// Modified from https://www.solidjs.com/examples/ethasketch

const boxWidth = 40;
const baseImagePath = "./nei_images";
const fallbackImage = "/missing.png";

function Items(props: {ownWidth: number}) {
  // Layout
  const gridSideLength = () => Math.floor(props.ownWidth / boxWidth);
  const gridTemplateString = createMemo(() =>
    `repeat(${gridSideLength()}, ${boxWidth}px)`
  );
  const numBoxes = createMemo(() => gridSideLength() ** 2);

  // GraphQL
  const graphQLClient = createGraphQLClient("http://localhost:5000/graphql");
  const [data, {refetch}] = graphQLClient<{ getNSidebarItems: []}>(
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

  createEffect(() => {
    console.log(data());
  })

  return (
    <>
      <div
        style={{
          display: "grid",
          "grid-template-rows": gridTemplateString(),
          "grid-template-columns": gridTemplateString(),
        }}
      >
        <Show when={!data.loading}>
          <Index
            each={Array.from({ length: numBoxes() })}
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