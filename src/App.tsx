import { useState, useEffect, useCallback } from "react";
import "./index.css";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@esri/calcite-components/dist/components/calcite-shell";
import MapDisplay from "./components/MapDisplay";
import ActionPanel from "./components/ActionPanel";
import Header from "./components/Header";
import { authenticate } from "./autho";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MyContext } from "./contexts/MyContext";

const queryClient = new QueryClient();

export function App(): React.JSX.Element {
  //------------------------
  //  Authenticate viewers
  //------------------------
  const [loggedInState, setLoggedInState] = useState<boolean>(false);
  useEffect(() => {
    authenticate(setLoggedInState, "eRLDoiO5CEHxcFiR");
  }, []);

  //------------------------
  //  Create Context
  //------------------------
  const [cpackage, setCpackage] = useState<any>("CP101");
  const updateCpackage = useCallback((newcp: any) => {
    setCpackage(newcp);
  }, []);

  const [segline, setSegline] = useState<any>(null);
  const updateSegline = useCallback((newline: any) => {
    setSegline(newline);
  }, []);

  const [layerView, setLayerView] = useState<any>(null);
  const updateLayerView = useCallback((newView: any) => {
    setLayerView(newView);
  }, []);
  return (
    <>
      {loggedInState === true && (
        <div>
          <calcite-shell
            style={{ scrollbarWidth: "thin", scrollbarColor: "#888 #555" }}
          >
            <MyContext
              value={{
                cpackage,
                updateCpackage,
                segline,
                updateSegline,
                layerView,
                updateLayerView,
              }}
            >
              <QueryClientProvider client={queryClient}>
                <ActionPanel />
                <MapDisplay />
                <Header />
              </QueryClientProvider>
            </MyContext>
          </calcite-shell>
        </div>
      )}
    </>
  );
}

export default App;
