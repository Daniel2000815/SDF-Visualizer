
import React, { useState, useEffect } from 'react';
import {SurfaceDialog} from './SurfaceDialog';
import {SurfaceTable} from './SurfaceTable';
import { Container } from "@nextui-org/react";


export function SurfacePage(){
    
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
  }

  const handleNew = () => {
    setEditID("");
    setDialogOpen(true);
  }

  return (
    <Container responsive >
      <SurfaceTable handleEdit={(id) => handleEdit(id)} handleNew={()=>handleNew()}/>
      <SurfaceDialog
        initialID={editID} 
        handleClose={() => setDialogOpen(false)}
        open={dialogOpen}
      />

    </Container>
  );
}