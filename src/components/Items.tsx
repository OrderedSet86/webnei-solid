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

  const handleSidebarItemClick = (index: number) => {
    if (!data.loading) {
      setAppState(produce((s) => {
        s.currentSidebarItem = data().getNSidebarItems[index]
      }))
    }
  }

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
              const image_path = data()?.getNSidebarItems?.[index]?.['imageFilePath'];
              const full_image_path = () => `${baseImagePath}/${image_path}`;
              const tooltipLabel = `${data()?.getNSidebarItems?.[index]?.['tooltip']}`

              return (
                <Tooltip label={tooltipLabel} placement="right" withArrow closeOnClick={false}>
                  <div
                    class="cell"
                    onClick ={(event) => {
                      handleSidebarItemClick(index);
                    }}
                  >
                    <Image
                      src={full_image_path()}
                      width={appState.imageWidth}
                      height={appState.imageWidth}
                      loading="lazy"
                      fallback={fallbackImage}
                    />
                    {/* <picture>
                      <source srcset={full_image_path()}/>
                      <img src={fallbackImage} loading="lazy"/>
                    </picture> */}
                  </div>
                </Tooltip>
              );
            }}
          </Index>
        </Show>
      </div>
    </>
  );
}

export default Items;