import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import SceneLayer from "@arcgis/core/layers/SceneLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import {
  lot_bdry_label,
  lot_bdry_renderer,
  lot_boundary_renderer,
  lot_id_label,
  lot_popup,
  lot_status_renderer,
  portalItems,
  st_structure_renderer,
  station_box_renderer,
  station_label,
  station_ov_label,
  tbm_line_diss_renderer,
  tbm_line_popup,
  tbm_status_renderer,
} from "./uniqueValues";

//----------------------------------------------//
//              Other Layers                    //
//----------------------------------------------//
export const dateTable = new FeatureLayer({
  portalItem: portalItems("a084d9cae5234d93b7aa50f7eb782aec"),
});

//----------------------------------------------//
//                Alignment Layers              //
//----------------------------------------------//
//--- CONSTRUCTION BOUNDARY LAYER ---//
export const constructionBoundaryLayer = new FeatureLayer({
  portalItem: portalItems("0c172b82ddab44f2bb439542dd75e8ae"),
  layerId: 4,
  renderer: lot_boundary_renderer,
  definitionExpression: "MappingBoundary = 1",
  title: "Construction Boundary",
  elevationInfo: { mode: "on-the-ground" },
  popupEnabled: false,
  minScale: 70000,
  maxScale: 0,
});

//--- STATION BOX LAYER ---//
export const stationBoxLayer = new FeatureLayer({
  portalItem: portalItems("52d4f29105934e3f95f6b39c7e5fba6e"),
  layerId: 2,
  renderer: station_box_renderer,
  minScale: 70000,
  maxScale: 0,
  title: "Station Box",
  popupEnabled: false,
  elevationInfo: { mode: "on-the-ground" },
});

//--- STATION POINT FEATURE ---//
export const stationLayer = new FeatureLayer({
  portalItem: portalItems("52d4f29105934e3f95f6b39c7e5fba6e"),
  layerId: 1,
  title: "Station",
  labelingInfo: [station_label],
  definitionExpression: "Project = 'MMSP'",
  elevationInfo: { mode: "relative-to-ground" },
});
stationLayer.listMode = "hide";

//--- STATION POINT FEATURE (OVERVIEW) ---//
export const stationLayer_ov = new FeatureLayer({
  portalItem: portalItems("52d4f29105934e3f95f6b39c7e5fba6e"),
  layerId: 1,
  title: "Station",
  labelingInfo: [station_ov_label],
  definitionExpression: "Project = 'MMSP'",
  elevationInfo: { mode: "on-the-ground" },
});
stationLayer_ov.listMode = "hide";

//----------------------------------------------//
//                Lot Layers                    //
//----------------------------------------------//
export const lotLayer = new FeatureLayer({
  portalItem: portalItems("0c172b82ddab44f2bb439542dd75e8ae"),
  layerId: 8,
  title: "Land Acquisition",
  labelsVisible: false,
  labelingInfo: [lot_id_label],
  renderer: lot_status_renderer,
  popupTemplate: lot_popup,
});

//--- LOT BOUNDARY LAYER ---//
export const lotLayerBoundary = new FeatureLayer({
  portalItem: portalItems("0c172b82ddab44f2bb439542dd75e8ae"),
  layerId: 8,
  title: "Lot Boundary",
  renderer: lot_bdry_renderer,
  labelingInfo: [lot_bdry_label],
});

//----------------------------------------------//
//                TBM Tunnel Layer              //
//----------------------------------------------//
export const tbmTunnelLayer = new FeatureLayer({
  portalItem: portalItems("4d91f3211c554315a4206f941d50dba2"),
  elevationInfo: { mode: "absolute-height", offset: -2 },
  hasZ: true,
  renderer: tbm_status_renderer,
  title: "TBM Segment",
  outFields: ["enddate", "Package", "line", "OBJECTID"],
  definitionExpression: "Package = 'CP101'",
  popupTemplate: tbm_line_popup,
  minScale: 7000,
});

//--- TBM TUNNEL LINE (DISSOLVED) ---//
export const tbm_tunnel_disolved_layer = new FeatureLayer({
  portalItem: portalItems("edfa4c005ece49298b5ccc19f6a6caca"),
  elevationInfo: { mode: "on-the-ground" },
  title: "TBM Line (Dissolved)",
  popupEnabled: false,
  renderer: tbm_line_diss_renderer,
});

export const cutterHeadSpotLayer = new GraphicsLayer({
  title: "Cutter Head Position",
});

//----------------------------------------------//
//       TBM Cutter Head Position Point         //
//----------------------------------------------//
export const tbm_cutterhead = new GraphicsLayer();

//----------------------------------------------//
//         Station Structure Layer              //
//----------------------------------------------//
export const stationStructureLayer = new SceneLayer({
  portalItem: portalItems("fbb99839306e4e9fbf94818b53b4f142"),
  popupEnabled: false,
  renderer: st_structure_renderer,
  elevationInfo: { mode: "absolute-height", offset: 0 },
  title: "Station Structure",
});

//----------------------------------------------//
//               Group Layers                   //
//----------------------------------------------//
export const lotGroupLayer = new GroupLayer({
  title: "Land Acquisition",
  visible: false,
  visibilityMode: "independent",
  layers: [lotLayer, lotLayerBoundary],
});

export const alignmentGroupLayer = new GroupLayer({
  title: "Alignment",
  visible: true,
  visibilityMode: "independent",
  layers: [stationBoxLayer, constructionBoundaryLayer], //stationLayer,
});

export const tbmGroupLayer = new GroupLayer({
  title: "TBM Tunnel",
  visible: false,
  visibilityMode: "independent",
  layers: [tbmTunnelLayer, cutterHeadSpotLayer],
});
