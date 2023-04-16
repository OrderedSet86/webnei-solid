import { appState, setAppState } from '~/state/appState'
import { Image, Tooltip } from "@hope-ui/solid";
import { produce } from 'solid-js/store'

interface ClickableItemProps {
  tooltipLabel: string;
  display_info: {
    itemId: string;
    localizedName: string;
    tooltip: string;
    imageFilePath: string;
  };
}

const baseImagePath = "./nei_images";
const fallbackImage = "/missing.png";

function ClickableItem(props: ClickableItemProps) {
  // Currently supports:
  // Left click: look up sources of item

  // Later want this to support:
  // Right click: look up uses of item
  // R: look up sources of item
  // U: look up uses of item

  const handleItemClick = (event: MouseEvent) => {
    setAppState(produce((s) => {
      s.currentSidebarItem = props.display_info;
    }));
  }

  return (
    <Tooltip label={props.tooltipLabel} placement="right" withArrow closeOnClick={false}>
      <div
      class="cell"
      onClick ={(event) => {
        handleItemClick(event);
      }}
      >
      <Image
        src={`${baseImagePath}/${props.display_info.imageFilePath}`}
        width={appState.imageWidth}
        height={appState.imageWidth}
        loading="lazy"
        fallback={fallbackImage}
      />
      </div>
    </Tooltip>
  );
}

export default ClickableItem;