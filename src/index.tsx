import "./init"

/*
import React from "react";
import ReactDOM from "react-dom";
import { MainComponent } from "./Graph/MainComponent";
import { createRoot } from "react-dom/client";
import { createTheme, NextUIProvider } from "@nextui-org/react"
// import { PersistGate } from 'zustand-persist'

function App() {
  return (
      <MainComponent />
  );
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
*/
import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import {
  Navbar,
  Button,
  Text,
  Container,
  Tooltip,
  Modal,
  Grid,
  Badge,
} from "@nextui-org/react";

import { createTheme, NextUIProvider } from "@nextui-org/react";
import { MainComponent } from "./Graph/MainComponent";
import { SurfacePage } from "./SurfacePage/SurfacePage";
import help from "react-useanimations/lib/help";
import UseAnimations from "react-useanimations";
import { graphControls, GraphHelpText, SurfaceHelpText } from "./Utils/help";

const lightTheme = createTheme({
  type: "light", // it could be "light" or "dark"
  theme: {
    colors: {
      // brand colors
      primaryLight: "$green200",
      primaryLightHover: "$green300",
      primaryLightActive: "$green400",
      primaryLightContrast: "$green600",
      primary: "#4ADE7B",
      primaryBorder: "$green500",
      primaryBorderHover: "$green600",
      primarySolidHover: "$green700",
      primarySolidContrast: "$white",
      primaryShadow: "$green500",

      gradient:
        "linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)",
      link: "#5E1DAD",

      // you can also create your own color
      myColor: "#ff4ecd",

      // ...  more colors
    },
    space: {},
    fonts: {},
  },
});

const darkTheme = createTheme({
  type: "dark", // it could be "light" or "dark"
  theme: {
    colors: {
      // brand colors
      primaryLight: "$green200",
      primaryLightHover: "$green300",
      primaryLightActive: "$green400",
      primaryLightContrast: "$green600",
      primary: "#4ADE7B",
      primaryBorder: "$green500",
      primaryBorderHover: "$green600",
      primarySolidHover: "$green700",
      primarySolidContrast: "$white",
      primaryShadow: "$green500",

      gradient:
        "linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)",
      link: "#5E1DAD",

      // you can also create your own color
      myColor: "#ff4ecd",

      // ...  more colors
    },
    space: {},
    fonts: {},
  },
});

function App() {
  const [tab, setTab] = React.useState(0);
  const [theme, setTheme] = React.useState(lightTheme);
  const [showHelp, setShowHelp] = React.useState(false);

  function Help() {
    return (
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={showHelp}
        width="40%"
        onClose={() => setShowHelp(false)}
      >
        <Modal.Header>
          <Text b size={18}>
            Help
          </Text>
        </Modal.Header>

        <Modal.Body>
          <Text>
            {tab===0 ? <GraphHelpText/> : <SurfaceHelpText/>}
          </Text>
          {tab==0 &&
          <Grid.Container gap={1}>
          {Object.entries(graphControls).map((val: [string, string]) =>
          <>
          <Grid xs={4}>
            <Badge isSquared variant="bordered">
              {val[0]}
            </Badge>
            </Grid>

            <Grid xs={8}>
            {val[1]}
            </Grid>
            </>
          )}
          </Grid.Container>
        }

        

        </Modal.Body>
      
      </Modal>
    );
  }

  return (
    <NextUIProvider>
      <Navbar maxWidth="fluid" isCompact isBordered variant="sticky">
        <Navbar.Brand>
          <Text b color="inherit" hideIn="xs">
            SDF Visualizer
          </Text>
        </Navbar.Brand>
        <Navbar.Content variant="underline">
          <Navbar.Link isActive={tab === 0} onClick={() => setTab(0)}>
            Graph
          </Navbar.Link>
          <Navbar.Link isActive={tab === 1} onClick={() => setTab(1)}>
            Surfaces
          </Navbar.Link>
        </Navbar.Content>
        <Navbar.Content hideIn="xs">
          <Navbar.Item>
            <Tooltip content="Help">
              <Button
                light
                onClick={() => setShowHelp(true)}
                icon={<UseAnimations size={32} animation={help} />}
                auto
              />
            </Tooltip>
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>
      <Container gap={2} xl fluid>
        {tab === 0 && <MainComponent />}
        {tab === 1 && <SurfacePage />}
        <Help />
      </Container>
    </NextUIProvider>
  );
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}