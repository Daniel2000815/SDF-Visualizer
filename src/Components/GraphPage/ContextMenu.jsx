import * as React from "react";

/*import { ContextMenu, MenuItem } from "react-contextmenu";

import { NodeTypes } from "../../Types/NodeOperations";
import { Text } from "@nextui-org/react";

import { IoPrism, IoShapes, IoCrop, IoHammer } from "react-icons/io5"; // primitiva, boolean, transform, deform

// const customStyles = {
//   width: "250px",
//   height: "250px",
//   backgroundColor: "purple",
//   color: "white",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   margin: "auto"
// };

// https://codesandbox.io/s/tq8r3?file=/src/components/coupon.css:969-2051
export default function CustomContextMenu(props) {
  const icons = [<IoPrism />, <IoShapes />, <IoCrop />, <IoHammer />];

  return (
    <ContextMenu
      onShow={() => console.log("MENU")}
      id="contextmenu"
      hideOnLeave={true}
    >
      {Object.keys(NodeTypes).map((type, index) => (
        <MenuItem
          key={index}
          onClick={(e) => props.newNode(Object.values(NodeTypes)[index], e)}
        >
          {icons[index]}
          <Text
            css={{align: "left"}}
            weight="bold"
          >
            {type}
          </Text>
          <Text
            css={{align: "right"}}
            weight="bold"
          >
            {type[0].toUpperCase()}
          </Text>
        </MenuItem>
      ))}
    </ContextMenu>
  );
}
*/
import { shallow } from "zustand/shallow";
import { useStore } from "../../graphStore";

import { Menu, Item, Separator, Submenu } from "react-contexify";

import { IoPrism, IoShapes, IoCrop, IoHammer, IoCopy } from "react-icons/io5"; // primitiva, boolean, transform, deform
import { Text } from "@nextui-org/react";
import { NodeTypes } from "../../Types/NodeOperations";
const selector = () => (store) => ({
  primitives: store.primitives,
});

export function ContextMenu(props) {
  const { primitives, changePrimitive } = useStore(selector(), shallow);
  const icons = [<IoPrism />, <IoShapes />, <IoCrop />, <IoHammer />, <IoCopy/>];

  return (
    <Menu id={"node_context_menu"}>
      {Object.keys(NodeTypes).map((type, index) => (
        <Item
          key={index}
          onClick={({ triggerEvent }) => props.newNode(Object.values(NodeTypes)[index], triggerEvent)}
        >
          {icons[index]} {type}
        </Item>
      ))}
    </Menu>
  );
}
