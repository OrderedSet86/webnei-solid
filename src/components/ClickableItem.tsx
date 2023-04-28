import { Show } from "solid-js";
import { appState, setAppState } from '~/state/appState'
import { Center, Image, Tooltip } from "@hope-ui/solid";
import { produce } from 'solid-js/store'

import './ClickableItem.css'

interface ClickableItemProps {
  tooltipLabel: string;
  display_info: {
    itemId: string;
    localizedName: string;
    tooltip: string;
    imageFilePath: string;
  };
  divClass?: string;
}

const baseImagePath = "./nei_images";
const fallbackImage = "missing.png";

function ClickableItem(props: ClickableItemProps) {
  // Currently supports:
  // Left click: look up sources of item

  // TODO: Later want this to support:
  // Right click: look up uses of item
  // R: look up sources of item
  // U: look up uses of item

  const handleItemClick = (event: MouseEvent) => {
    if (props.display_info) {
      setAppState(produce((s) => {
        s.currentSidebarItem = props.display_info;
      }));
    }
  }

  const divClassName = props.divClass ? props.divClass : "cellNoOutline";

  return (
      <div class={divClassName} onClick ={(event) => {handleItemClick(event)}}>
        <Center h={appState.imageWidth + 2} w={appState.imageWidth + 2}>
          <Show when={props.display_info} fallback={<></>}>
            <Tooltip
              className="tooltip"
              label={props.tooltipLabel.replaceAll("\\u000a", "\u000a")}
              placement="right" 
              closeOnClick={false}
              overflow="hidden"
            >
                <img
                  src={`${baseImagePath}/${props.display_info.imageFilePath}`}
                  width={appState.imageWidth}
                  height={appState.imageWidth}
                  loading="lazy"
                  decoding="async"
                />
            </Tooltip>
          </Show>
        </Center>
      </div>
  );
}

export default ClickableItem;