/* eslint-disable jsx-a11y/alt-text */
import { use, useEffect } from "react";
import "../index.css";
import "@arcgis/map-components/dist/components/arcgis-map";
import {
  stationLayer_ov,
  tbm_tunnel_disolved_layer,
  tbmTunnelLayer,
  tbm_cutterhead,
} from "../layers";
import {
  basemapUserDefined,
  cimSymbol,
  cp_f,
  getRotationStartOnTop,
  overViewCenter,
  segline_f,
  tbm_cp_q,
  tbm_spot_q,
} from "../uniqueValues";
import { MyContext } from "../contexts/MyContext";
import type { ArcgisMap } from "@arcgis/map-components/dist/components/arcgis-map";
import {
  addLayersToMap,
  animatedPointXY,
  disableZooming,
  makeQuery,
  sf,
  tbmCutterHeadSpotData,
} from "../query";
import Query from "@arcgis/core/rest/support/Query";
import Polyline from "@arcgis/core/geometry/Polyline.js";
import DirectionLegend from "./DirectionLegend";

const MapOverview = () => {
  const { cpackage, segline } = use(MyContext);

  useEffect(() => {
    const overviewMap = document.querySelector(
      "#arcgis-overview-map",
    ) as ArcgisMap;
    if (!overviewMap) return;

    let cancelled = false;

    //--- Clear stale cutterhead graphics from any previous selection
    tbm_cutterhead.removeAll();

    //--- Ensure overview layers are on the map
    addLayersToMap(overviewMap.map, [
      tbm_tunnel_disolved_layer,
      stationLayer_ov,
      tbm_cutterhead,
    ]);

    overviewMap.viewOnReady(async () => {
      overviewMap.hideAttribution = true;
      disableZooming(overviewMap.view);

      //--- Ensure both layers are loaded before using them
      await Promise.all([
        tbmTunnelLayer.load(),
        tbm_tunnel_disolved_layer.load(),
      ]);

      const qe = makeQuery(
        [cpackage, segline],
        [cp_f, segline_f],
      ).queryExpression();

      //--- Filter TBM tunnel alignment layers
      tbm_tunnel_disolved_layer.definitionExpression = qe;
      tbmTunnelLayer.definitionExpression = qe;

      await tbmCutterHeadSpotData(qe, tbmTunnelLayer);
      if (cancelled) return;

      //--- Get the center point of the selected line feature
      const query = new Query({ where: qe, returnGeometry: true });
      const results = await tbm_tunnel_disolved_layer.queryFeatures(query);
      if (cancelled || results.features.length === 0) return;

      //--- 1. Start (p1) and end (p2) points for the selected line
      const { p1, p2, zoom } = segline
        ? tbm_spot_q[segline]
        : tbm_cp_q[cpackage];

      //--- 2. Connecting line between p1 and p2
      const cLine: any = new Polyline({
        paths: [[p1, p2]],
        spatialReference: sf,
      });

      if (cancelled) return;

      //--- 4. Rotate to bearing, then zoom to the connecting line
      overviewMap.view.rotation = getRotationStartOnTop(p1, p2);
      await overviewMap.view.goTo({ target: cLine, zoom });

      //--- 5. Animated CIM symbol
      await animatedPointXY(qe, tbmTunnelLayer, cimSymbol);
    });

    return () => {
      cancelled = true;
    };
  }, [cpackage, segline]);

  return (
    <arcgis-map
      style={{
        width: "26%",
        maxHeight: "100%",
        position: "relative",
        float: "right",
        borderStyle: "solid",
        borderWidth: 0.5,
        borderRightWidth: 1,
        borderColor: "#555555",
        outline: "none",
        aspectRatio: "948/1557",
      }}
      id="arcgis-overview-map"
      basemap={basemapUserDefined}
      ground="world-elevation"
      zoom={13}
      rotation={25.075868249551263}
      center={overViewCenter}
    >
      <div
        style={{
          fontSize: "0.7rem",
          color: "white",
          marginTop: 4,
          margin: "auto",
          padding: 3,
          backgroundColor: "#2b2b2b",
          borderStyle: "solid",
          borderWidth: 0.5,
          borderColor: "#555555",
          borderRadius: "17px",
          whiteSpace: "nowrap",
          width: "90px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        CUTTER HEAD
      </div>
      <DirectionLegend />
      <arcgis-compass slot="bottom-right"></arcgis-compass>
    </arcgis-map>
  );
};

export default MapOverview;
