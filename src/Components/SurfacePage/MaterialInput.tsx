import React, { useEffect } from "react";
import {
  Modal,
  Grid,
  Row,
  Col,
  Button,
  Text,
  Collapse,
  Input,
} from "@nextui-org/react";
import {ColorPicker} from "./ColorPicker";
import { defaultMaterial } from "../../Shader/defaultMaterial";

export function MaterialInput(props: {defaultValue: Material, handleChange: Function}) {
  const [material, setMaterial] = React.useState<Material>(props.defaultValue);

  useEffect(()=>{
    props.handleChange(material);
  }, [material])

  return (
    <Grid.Container
      gap={2}
      alignContent="center"
      alignItems="center"
      justify="flex-start"
    >
      <Grid xs={3}>
        <Text h5>Diffuse</Text>
      </Grid>
      <Grid xs={3}>
        <Text h5>Specular</Text>
      </Grid>
      <Grid xs={3}>
        <Text h5>Ambient</Text>
      </Grid>
      <Grid xs={3}>
        <Text h5>Smoothness</Text>
      </Grid>
      <Grid xs={3}>
        <ColorPicker
          initialRGB={material.diffuse}
          handleChange={(c: number[]) =>
            setMaterial({ ...material, diffuse: c })
          }
        />
      </Grid>
      <Grid xs={3}>
        <ColorPicker
          initialRGB={material.specular}
          handleChange={(c: number[]) =>
            setMaterial({ ...material, specular: c })
          }
        />
      </Grid>
      <Grid xs={3}>
        <ColorPicker
        initialRGB={material.ambient}
          handleChange={(c: number[]) =>
            setMaterial({ ...material, ambient: c })
          }
        />
      </Grid>
      
      <Grid xs={3}>
        <Input
          onChange={(e) =>
            setMaterial({ ...material, smoothness: Number(e.target.value) })
          }
          type="number"
          value={material.smoothness}
          aria-label="smoothness"
          fullWidth
        />
      </Grid>
    </Grid.Container>
  );
}
