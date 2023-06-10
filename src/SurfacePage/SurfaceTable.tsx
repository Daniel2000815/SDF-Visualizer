import {
  Table,
  Text,
  Row,
  Col,
  Tooltip,
  Badge,
  Button,
  Container,
} from "@nextui-org/react";
import "@fontsource/fira-code";
import React, { useEffect, useState } from "react";

import { CiCirclePlus, CiRedo, CiTrash, CiEdit } from "react-icons/ci";

import { InputMode } from "../Types/InputMode";
// import { useStore } from "../graphStore";
import { usePrimitiveStore } from "../primitiveStore";
import { shallow } from "zustand/shallow";

import "katex/dist/katex.min.css";

var Latex = require("react-latex");

const columns = [
  { name: "", uid: "actions", width: 10 },
  { name: "NAME", uid: "name", width: 50 },
  { name: "TYPE", uid: "inputMode", width: 20 },
  { name: "PARAMETERS", uid: "parameters", width: 100 },
  { name: "INPUT", uid: "input", width: 700 },

  //   { name: "SDF", uid: "sdf", minWidth: 100 },
];

const renderCell = (
  data: EquationData,
  col: React.Key,
  handleEdit: Function,
  handleDelete: Function
) => {
  if (col === "name") {
    return <Text>{data.name}</Text>;
  } else if (col === "inputMode") {
    return <Badge isSquared>{data.inputMode}</Badge>;
  } else if (col === "input") {
    return (
      <Row>
        {data.inputMode === InputMode.SDF ? (
          <Text css={{ fontFamily: "Fira Code" }}>{data.input}</Text>
        ) : (
          <Latex>{` $$ ${
            data.inputMode === InputMode.Implicit
              ? data.input[0]
              : data.input.join(",")
          } $$`}</Latex>
        )}
      </Row>
    );
  } else if (col === "parameters") {
    return (
      <Latex>{`$$ ${data.parameters.map((p) => p.symbol).join(",")} $$`}</Latex>
    );
  }
  //   else if (col === "sdf") {
  //     return <Text css={{ fontFamily: "Fira Code" }}>{data.parsedInput}</Text>;
  //   }
  else if (col === "actions") {
    return (
      <Row>
        <Tooltip content="Edit">
          <Button
            auto
            light
            icon={<CiEdit size={24} />}
            onClick={() => handleEdit(data.id)}
          />
        </Tooltip>

        <Tooltip content="Delete" color="error">
          <Button
            auto
            light
            color="error"
            icon={<CiTrash size={24} />}
            onClick={() => handleDelete(data.id)}
          />
        </Tooltip>
      </Row>
    );
  }
};


const selector = () => (store: any) => ({
  primitives: store.primitives,
  restorePrimitives: () => store.restorePrimitives(),
  deletePrimitive: (deleteKey: string) => store.deletePrimitive(deleteKey),
  rows: Object.values(store.primitives) as EquationData[],
});

export function SurfaceTable(props: {
  handleNew: Function;
  handleEdit: Function;
}) {
  const { primitives, restorePrimitives, deletePrimitive } = usePrimitiveStore(
    selector(),
    shallow
  );

  const rows : EquationData[] = usePrimitiveStore(state => Object.values(state.primitives) as EquationData[]);
  const handleEdit = (id: string) => {
    props.handleEdit(id);
  };

  const handleDelete = (id: string) => {
    deletePrimitive(id);
  };

  const handleRestore = () => {
    restorePrimitives();
  };

  const handleNew = () => {};

  function AddButton(){
    return (<Tooltip content="New surface"><Button auto light icon={<CiCirclePlus size={24} />} onClick={() => props.handleNew()}/></Tooltip>);
  }

  function RestoreButton(){
    return (<Tooltip content="Restore dafult"><Button auto light icon={<CiRedo size={24} />} onClick={() => handleRestore()}/></Tooltip>);
  }

  return(
  <Table
    key={JSON.stringify(rows)}
    bordered
    shadow={true}
    aria-label="Surface Table"
    // css={{overflow: "auto"}}
    // css={{
    //   // height: "auto",
    //   alignContent: "space-around",
    //   justifyContent: "flex-start",
    // }}
  >
    <Table.Header columns={columns}>
      {(column) => (
        <Table.Column
          key={column.uid}
          align={column.uid === "actions" ? "center" : "start"}
          // width={column.width}
          css={{width: `5px`}}
          
        >
          {column.uid !== "actions" ? (
            column.name
          ) : (
            <>
              <AddButton />
              <RestoreButton />
            </>
          )}
        </Table.Column>
      )}
    </Table.Header>
    <Table.Body items={rows}>
      {(item) => (
        <Table.Row key={item.id}>
          {(columnKey) => (
            <Table.Cell>
              {renderCell(item, columnKey, handleEdit, handleDelete)}
            </Table.Cell>
          )}
        </Table.Row>
      )}
    </Table.Body>
  </Table>);
}
