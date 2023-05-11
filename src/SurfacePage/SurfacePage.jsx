import React, { useState, useEffect } from "react";
import { SurfaceDialog } from "./SurfaceDialog";
import { SurfaceTable } from "./SurfaceTable";
import { Container, Row, Grid } from "@nextui-org/react";

export function SurfacePage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editID, setEditID] = useState("");

  //   const handleDelete = (selectedList) => {
  //     console.log("TRYING TO DELETE ", selectedList);
  //     selectedList.forEach(e => {
  //         deletePrimitive(e);
  //     });
  //   };

  const handleEdit = (id) => {
    setEditID(id);
    setDialogOpen(true);
  };

  const handleNew = () => {
    setEditID("");
    setDialogOpen(true);
  };

  return (
    <>
      <Grid.Container css={{marginTop: "10px"}}>
        <Grid gap={12} xs={12}>
          <SurfaceTable
            handleEdit={(id) => handleEdit(id)}
            handleNew={() => handleNew()}
          />
        </Grid>
      </Grid.Container>
      <SurfaceDialog
        initialID={editID}
        handleClose={() => setDialogOpen(false)}
        open={dialogOpen}
      />
    </>
  );
}
