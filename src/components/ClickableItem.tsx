import { Show } from "solid-js";
import { appState, setAppState } from '~/state/appState'
import { Box, Center, Image, Tooltip } from "@hope-ui/solid";
import { produce } from 'solid-js/store'

import './ClickableItem.css'


interface ClickableItemProps {
  tooltipLabel: string;
  basic_display_info: { // aka SidebarItem
    itemId: string;
    localizedName: string;
    tooltip: string;
    imageFilePath: string;
    makeOrUse?: string;
  };
  scaleFactor: number;
  divClass?: string;
  advanced_display_info?: {
    quantity: number;
    clickableType: string;
  }
}

const baseImagePath = "./nei_images";
const fallbackImage = "missing.png";


function ClickableItem(props: ClickableItemProps) {
  // Currently supports:
  // Left click: look up sources of item

  // TODO: Later want this to support:
  // R: look up sources of item
  // U: look up uses of item

  const handleMakeClick = (event: MouseEvent | undefined) => {
    if (props.basic_display_info) {
      setAppState(produce((s) => {
        s.currentBasicSidebarItem = props.basic_display_info
        s.makeOrUse = "make"
      }));
    }
  }

  const handleUseClick = (event: MouseEvent | undefined) => {
    if (props.basic_display_info) {
      setAppState(produce((s) => {
        s.currentBasicSidebarItem = props.basic_display_info
        s.makeOrUse = "use"
      }));
    }
  }

  const handleKey = (event: KeyboardEvent) => {
    if (event.key === 'r' || event.key === 'R') {
      handleMakeClick(undefined);
    } else if (event.key === 'u' || event.key === 'U') {
      handleUseClick(undefined);
    }
  }

  const fullClickableWidth = (appState.imageWidth + 2) * props.scaleFactor;
  const imageWidth = appState.imageWidth * props.scaleFactor;
  let quantityLabel = props.advanced_display_info ? props.advanced_display_info.quantity.toString() : "";
  if (props.advanced_display_info && props.advanced_display_info.clickableType == "fluid") {
    quantityLabel = quantityLabel + "L";
  }

  const divClassName = props.divClass ? props.divClass : "cellNoOutline";
  const quantityDisplayWidth = Math.min(
    fullClickableWidth,
    props.advanced_display_info ? quantityLabel.length * 10 : 0,
  );

  const insideElements = (
    <>
      <Show when={props.basic_display_info} fallback={<></>}>
        <Tooltip
          className="tooltip"
          label={props.tooltipLabel.replaceAll("\\u000a", "\u000a")}
          placement="right" 
          closeOnClick={false}
          overflow="hidden"
        >
          <Center h={fullClickableWidth} w={fullClickableWidth}>
            <img
              src={`${baseImagePath}/${props.basic_display_info.imageFilePath}`}
              width={imageWidth}
              height={imageWidth}
              loading="lazy"
              decoding="async"
            />
          </Center>
        </Tooltip>
      </Show>
      <Show 
        when={
          props.advanced_display_info && 
            (props.advanced_display_info.quantity > 1 || props.advanced_display_info.clickableType == "fluid")
        }
        fallback={<></>}
      >
        <Box
          position="absolute"
          bottom={0}
          right={0}
          width={quantityDisplayWidth}
          height={15}
          bgColor="white"
        >
          <Center h={15} w={quantityDisplayWidth}>
            {quantityLabel}
          </Center>
        </Box>
      </Show>
    </>
  );

  const parentDiv: any = (
    <div 
      class={divClassName} 
      onClick ={(event) => {handleMakeClick(event)}}
      onContextMenu={(event) => {handleUseClick(event)}}
      onMouseEnter={(event) => {document.addEventListener("keydown", handleKey)}}
      onMouseLeave={(event) => {document.removeEventListener("keydown", handleKey)}}
      children={insideElements}
    />
  )

  // Disable normal context menu on click
  if (parentDiv) {
    parentDiv.oncontextmenu = (e: any) => {return false;}
  }

  return parentDiv;
}

export default ClickableItem;