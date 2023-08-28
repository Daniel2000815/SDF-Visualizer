import React from "react";
import { Dropdown } from "@nextui-org/react";
import { useEffect } from "react";

export function DropdownTS(props: {
  items: string[];
  keys?: string[];
  defaultValue: string;
  onChange: (sel: string) => void;
  label: string;
  theme?: Theme;
  margin?: string;
}) {
  const [menuItems, setMenuItems] = React.useState<
    { key: string; name: string }[]
  >([]);
  const [selected, setSelected] = React.useState<any>(
    new Set([props.defaultValue])
  );

  useEffect(() => {
    console.log("what");

    let newItems: { key: string; name: string }[] = [];
    props.items.forEach((i, idx) =>
      newItems.push({ key: props.keys?.at(idx) || i, name: i.replace("_", " ") })
    );
    setMenuItems(newItems);
  }, [props.items]);

  const selectedValue = React.useMemo(
    () => props.items[props.keys?.indexOf(Array.from(selected).join("")) || 0].replace("_", " "),
    [selected]
  );

  useEffect(() => {
    console.log("ASA ", selected);
    props.onChange(Array.from(selected).join(""));
  }, [selected]);

  return (<>{props.defaultValue} ; {props.keys?.join(", ")}
    <Dropdown>
      <Dropdown.Button
        css={{
          margin: `${props.margin || "10px"}`,
          width: "100%",
          color: `${props.theme?.dark}`,
          backgroundColor: `${props.theme?.light}`,
        }}
        flat
      >
        {selectedValue}
      </Dropdown.Button>
      <Dropdown.Menu
        disallowEmptySelection={true}
        selectionMode="single"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        aria-label={props.label}
        items={menuItems}
      >
        {(item: any) => (
          <Dropdown.Item
            key={item.key}
            color={item.key === "delete" ? "error" : "default"}
          >
            {item.name}
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown></>
  );
}
