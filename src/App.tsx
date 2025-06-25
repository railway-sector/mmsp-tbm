import React, { createContext, useState } from "react";
import "./App.css";
import "./index.css";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@esri/calcite-components/dist/components/calcite-shell";
import "@esri/calcite-components/dist/calcite/calcite.css";
import { CalciteShell } from "@esri/calcite-components-react";
import MapDisplay from "./components/MapDisplay";
import ActionPanel from "./components/ActionPanel";
import Header from "./components/Header";
import UndergroundSwitch from "./components/UndergroundSwitch";
import Chart from "./components/Chart";
// import MainChart from "./components/MainChart";

type MyDropdownContextType = {
  contractpackages: any;
  segmentlines: any;
  updateContractpackages: any;
  updateSegmentlines: any;
};

const initialState = {
  contractpackages: undefined,
  segmentlines: undefined,
  updateContractpackages: undefined,
  updateSegmentlines: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});

function App() {
  const [contractpackages, setContractpackages] = useState<any>("CP101");
  const [segmentlines, setSegmentlines] = useState<any>();

  const updateContractpackages = (newPackage: any) => {
    setContractpackages(newPackage);
  };

  const updateSegmentlines = (newLine: any) => {
    setSegmentlines(newLine);
  };

  return (
    <div>
      <CalciteShell>
        <MyContext
          value={{
            contractpackages,
            segmentlines,
            updateContractpackages,
            updateSegmentlines,
          }}
        >
          <ActionPanel />
          <UndergroundSwitch />
          <MapDisplay />
          <Chart />
          <Header />
        </MyContext>
      </CalciteShell>
    </div>
  );
}

export default App;
