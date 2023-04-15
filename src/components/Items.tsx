import {
    createMemo,
    createSignal,
    Index,
} from "solid-js";

import "./Items.css"


// Modified from https://www.solidjs.com/examples/ethasketch


function randomHexColorString(): string {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}


function Items(props: {ownWidth: number}) {
  const [pixelWidth, setPixelWidth] = createSignal(40);
  const gridSideLength = () => Math.floor(props.ownWidth / pixelWidth());

  // const [gridSideLength, setGridSideLength] = createSignal(20);
  const gridTemplateString = createMemo(() =>
    `repeat(${gridSideLength()}, ${pixelWidth()}px)`
  );

  return (
    <>
      <div
        style={{
          display: "grid",
          "grid-template-rows": gridTemplateString(),
          "grid-template-columns": gridTemplateString(),
        }}
      >
        <Index
          each={Array.from({ length: gridSideLength() ** 2 })}
          fallback={"Input a grid side length."}
        >
          {(obj, index) => (
            <div
              class="cell"
              onMouseEnter={(event) => {
                const eventEl = event.currentTarget;

                eventEl.style.backgroundColor = randomHexColorString();

                setTimeout(() => {
                  eventEl.style.backgroundColor = "initial";
                }, 500);
              }}
              onClick ={(event) => {
                console.log(`Clicked on ${event.currentTarget} ${index}`)
              }}
            ></div>
          )}
        </Index>
      </div>
    </>
  );
}

export default Items;