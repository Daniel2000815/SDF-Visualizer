import React from "react";
import { Dropdown } from "@nextui-org/react";
import { useEffect } from "react";

export function DropdownTS(props:{items: string[], defaultValue: string, onChange: (sel: string)=>void, label: string, theme: Theme} ) {
  const [menuItems, setMenuItems] = React.useState<{key:string, name:string}[]>([]);
  const [selected, setSelected] = React.useState<any>(new Set([props.defaultValue]));

  useEffect(() => {
    console.log("what");
    let newItems : {key:string, name:string}[]  = [];
    props.items.forEach((i) => newItems.push({ key: i, name: i }));
    setMenuItems(newItems);
  }, [props.items]);

  

  const selectedValue = React.useMemo(
    () => Array.from(selected).join(", ").replaceAll("_", " "),
    [selected]
  );

  useEffect(() => {
    props.onChange(selectedValue);
  }, [selected]);

  return (
    <Dropdown>
      <Dropdown.Button css={{ margin: "10px", width: "100%", color: `${props.theme.dark}`, backgroundColor: `${props.theme.light}` }} flat>
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
        {(item:any) => (
          <Dropdown.Item
            key={item.key}
            color={item.key === "delete" ? "error" : "default"}
          >
            {item.name}
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
