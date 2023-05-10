
import { ReactFlowProvider } from "reactflow";
import {Graph} from "./Graph";

import "reactflow/dist/style.css";

export function MainComponent() {
  return (
      <ReactFlowProvider>
        <div style={{ width: "100vw", height: "100vh" }}>
          <Graph />
        </div>
      </ReactFlowProvider>
  );
}
