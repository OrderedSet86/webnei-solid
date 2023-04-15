import {
    createMemo,
    createSignal,
    Index,
} from "solid-js";

import "./Sidebar.css"


// Modified from https://www.solidjs.com/examples/ethasketch

const maxGridPixelWidth = 500;

function randomHexColorString(): string {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function clampGridSideLength(newSideLength: number): number {
    return Math.min(Math.max(newSideLength, 0), 100);
}


function Sidebar() {
  const [gridSideLength, setGridSideLength] = createSignal(10);
  const gridTemplateString = createMemo(() =>
    `repeat(${gridSideLength()}, ${maxGridPixelWidth / gridSideLength()}px)`
  );

  return (
    <>
      {/* <div>
        <label>Grid Side Length: </label>
        <input
          type="number"
          value={gridSideLength()}
          onInput={(e) =>
            setGridSideLength(
              clampGridSideLength(e.currentTarget.valueAsNumber)
            )
          }
        />
      </div> */}
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
          {() => (
            <div
              class="cell"
              onMouseEnter={(event) => {
                const eventEl = event.currentTarget;

                eventEl.style.backgroundColor = randomHexColorString();

                setTimeout(() => {
                  eventEl.style.backgroundColor = "initial";
                }, 500);
              }}
            ></div>
          )}
        </Index>
      </div>
    </>
  );
}

export default Sidebar;