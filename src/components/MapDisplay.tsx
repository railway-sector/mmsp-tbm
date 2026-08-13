import "../index.css";
import "@arcgis/map-components/dist/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-compass";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-search";
import {
  stationLayer,
  lotGroupLayer,
  tbmGroupLayer,
  stationStructureLayer,
  alignmentGroupLayer,
} from "../layers";
import "@esri/calcite-components/dist/components/calcite-button";
import { useState } from "react";
import MapOverview from "./MapOverView";
import { addLayersToMap } from "../query";
import UndergroundSwitch from "./UndergroundSwitch";
import ProgressSummary from "./ProgressSummary";
import type { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";

function MapDisplay() {
  const arcgisScene: any = document.querySelector(
    "arcgis-scene",
  ) as ArcgisScene;

  const [_mapView, setMapView] = useState<any>();

  arcgisScene?.viewOnReady(async () => {
    addLayersToMap(arcgisScene?.map, [
      alignmentGroupLayer,
      lotGroupLayer,
      stationStructureLayer,
      tbmGroupLayer,
      stationLayer,
    ]);

    arcgisScene.view.environment.atmosphereEnabled = false;
    arcgisScene.view.environment.starsEnabled = false;
    arcgisScene.hideAttribution = true;
    if (arcgisScene?.map?.ground) {
      arcgisScene.map.ground.navigationConstraint = { type: "none" };
      arcgisScene.map.ground.opacity = 0.7;
    }
  });

  return (
    <arcgis-scene
      basemap="dark-gray-vector"
      ground="world-elevation"
      viewingMode="local"
      // zoom={13}
      center="121.0272413487, 14.67923084128"
      onarcgisViewReadyChange={(event: any) => {
        setMapView(event.target.id);
      }}
    >
      <arcgis-compass slot="top-left"></arcgis-compass>
      <arcgis-zoom slot="bottom-left"></arcgis-zoom>
      <MapOverview />

      {/* Underground switch */}
      <UndergroundSwitch />

      {/* Progress Summary Statiatics*/}
      <ProgressSummary />
    </arcgis-scene>
  );
}

export default MapDisplay;
