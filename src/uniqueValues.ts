import Basemap from "@arcgis/core/Basemap";
import Extent from "@arcgis/core/geometry/Extent";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SolidEdges3D from "@arcgis/core/symbols/edges/SolidEdges3D";
import FillSymbol3DLayer from "@arcgis/core/symbols/FillSymbol3DLayer";
import LabelSymbol3D from "@arcgis/core/symbols/LabelSymbol3D";
import LineSymbol3D from "@arcgis/core/symbols/LineSymbol3D";
import MeshSymbol3D from "@arcgis/core/symbols/MeshSymbol3D";
import PathSymbol3DLayer from "@arcgis/core/symbols/PathSymbol3DLayer";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";
import TextSymbol3DLayer from "@arcgis/core/symbols/TextSymbol3DLayer";

export type statisticsType = "count" | "sum";

//----------------------------------------------//
//              portalItem                      //
//----------------------------------------------//
const portalItem_url = { url: "https://gis.railway-sector.com/portal" };

export const portalItems = (id: any) => {
  return { id: id, portal: portalItem_url };
};

//----------------------------------------------//
//              Chart Parameters                //
//----------------------------------------------//
export const labelColor = "#9ca3af";
export const valueColor = "#d1d5db";

//-------------------------------------//
//           Overview Map              //
//-------------------------------------//
export const basemapUserDefined = new Basemap({
  baseLayers: [
    new VectorTileLayer({
      portalItem: { id: "824fe99ab989479f83b9a6d7f2da0bcb" },
    }),
  ],
});

export const overViewCenter = [121.02704999809504, 14.679250906627201];
const default_extent = new Extent({
  xmax: 13446763.797407571,
  ymax: 1675633.4248131101,
  xmin: 13446180.965066897,
  ymin: 1675002.8193297577,
  spatialReference: { wkid: 102100 },
});
export const overViewDefaultExtent = default_extent;
export const zoom_overview = 7;

export const lineSymbolOverview_nscrex = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "black",
    width: "2.5px",
    style: "solid",
  }),
});

//--- STATION POINT LAYER IN OVERVIEW ---//
export const station_ov_label = new LabelClass({
  symbol: new TextSymbol({ color: "#d4d1ceff", font: { size: 8 } }),
  labelExpressionInfo: { expression: "$feature.Station" },
});

//----------------------------------------------//
//              TBM Line Layer                  //
//----------------------------------------------//
export const cp_f = "Package";
export const segline_f = "line";

export const tbm_status_q = [
  { value: 1, label: "To be Constructed", color: [225, 225, 225, 0.5] },
  { value: 2, label: "Excavating (Cutter Head)", color: [232, 54, 24, 1] },
  { value: 3, label: "Segmented", color: [0, 112, 255, 0.8] },
];

const tbm_status_uniqueV = tbm_status_q.map((v: any) => {
  return {
    value: v.value,
    label: v.label,
    symbol: new LineSymbol3D({
      symbolLayers: [
        new PathSymbol3DLayer({
          profile: "circle",
          material: { color: v.color },
          width: 5,
          height: 5,
          join: "miter",
          cap: "butt",
          anchor: "bottom",
          profileRotation: "all",
        }),
      ],
    }),
  };
});

export const tbm_status_renderer = new UniqueValueRenderer({
  field: "status",
  uniqueValueInfos: tbm_status_uniqueV,
});

export const tbm_popup = {
  title: "Ring No.: <b>{segmentno}</b> (<b>{line}</b>)",
  lastEditInfoEnabled: false,
};

export const tbm_line_popup = {
  title: "<p>{Id}</p>",
  lastEditInfoEnabled: false,
  returnGeometry: true,
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "startdate", label: "Start Date" },
        { fieldName: "enddate", label: "Completion Date" },
      ],
    },
  ],
};

//----------------------------------------------//
//              TBM Line Dissolved              //
//----------------------------------------------//
export const nb_q = {
  hex: "#00B7FFC8",
  rgb: [0, 183, 255, 200],
  logo: "https://railway-sector.github.io/TBM_LOGO_nb.svg",
};

export const sb_q = {
  hex: "#ff4a0df8",
  rgb: [255, 74, 13, 248],
  logo: "https://railway-sector.github.io/TBM_LOGO.svg",
};

// export const tbm_line_diss_renderer = new SimpleRenderer({
//   symbol: new SimpleLineSymbol({
//     color: "#ff4a0dff",
//     width: "1px",
//     style: "solid",
//   }),
// });

export const tbm_line_diss_renderer = new UniqueValueRenderer({
  field: "Direction",
  uniqueValueInfos: [
    {
      value: "NB",
      symbol: new SimpleLineSymbol({
        color: nb_q.hex,
        width: "2px",
        style: "solid",
      }),
    },
    {
      value: "SB",
      symbol: new SimpleLineSymbol({
        color: sb_q.hex,
        width: "2px",
        style: "solid",
      }),
    },
  ],
});

export const tbm_cp_q: any = {
  CP101: {
    p1: [13471595.345, 1654558.218],
    p2: [13473743.811, 1649966.701],
    zoom: 13,
  },
  CP102: {
    p1: [13473654.756, 1649575.483],
    p2: [13474968.326, 1647446.901],
    zoom: 14,
  },
  CP103: {
    p1: [13475302.284, 1647377.869],
    p2: [13476827.361, 1641970.942],
    zoom: 13,
  },
  CP104: {
    p1: [13476749.438, 1641108.242],
    p2: [13475925.673, 1638451.308],
    zoom: 14,
  },
  CP105: {
    p1: [13475847.75, 1638209.783],
    p2: [13475836.618, 1637554.225],
    zoom: 16,
  },
  CP108: {
    p1: [13475714.166, 1637128.697],
    p2: [13473365.325, 1635507.153],
    zoom: 14,
  },
};

interface TbmSpotEntry {
  p1: number[];
  p2: number[];
  zoom: number;
}

const tbm_spot_list: Record<string, TbmSpotEntry> = {
  "SG1-NB|SG1-SB": {
    p1: [13471584.213, 1654546.71],
    p2: [13472753.068, 1653499.448],
    zoom: 15,
  },
  "SG2-NB|SG2-SB": {
    p1: [13472886.651, 1653349.843],
    p2: [13473246.213, 1651922.884],
    zoom: 14,
  },
  "SG3-NB|SG3-SB": {
    p1: [13473254.006, 1651658.215],
    p2: [13473743.811, 1649966.701],
    zoom: 14,
  },
  "SG4-NB|SG4-SB": {
    p1: [13473643.624, 1649586.989],
    p2: [13473699.284, 1648516.923],
    zoom: 15,
  },
  "SG5-NB|SG5-SB": {
    p1: [13473832.867, 1648321.324],
    p2: [13475035.117, 1647446.901],
    zoom: 15,
  },
  "SG6-NB|SG6-SB": {
    p1: [13475302.284, 1647377.869],
    p2: [13476771.701, 1646307.896],
    zoom: 14,
  },
  "SG7-NB|SG7-SB": {
    p1: [13476927.549, 1646112.315],
    p2: [13477361.695, 1644766.294],
    zoom: 15,
  },
  "SG8-NB|SG8-SB": {
    p1: [13477428.486, 1644478.692],
    p2: [13476793.965, 1641763.892],
    zoom: 14,
  },
  "SG9-NB|SG9-SB": {
    p1: [13476793.965, 1641395.805],
    p2: [13476638.118, 1640475.613],
    zoom: 15,
  },
  "SG10-NB|SG10-SB": {
    p1: [13476471.139, 1640268.575],
    p2: [13475914.541, 1638439.807],
    zoom: 14,
  },
  "SG11-NB|SG11-SB": {
    p1: [13475870.014, 1638209.783],
    p2: [13475847.75, 1637554.225],
    zoom: 16,
  },
  "SG12-NB|SG12-SB": {
    p1: [13475703.034, 1637128.697],
    p2: [13474233.617, 1635898.154],
    zoom: 14,
  },
  "SG13-NB|SG13-SB": {
    p1: [13473977.582, 1635783.153],
    p2: [13473365.325, 1635484.153],
    zoom: 16,
  },
  "SG14-NB|SG14-SB": {
    p1: [13472396.845, 1635035.66],
    p2: [13471038.748, 1634288.189],
    zoom: 15,
  },
};

// Build a flat lookup so either alias resolves to the same entry
export const tbm_spot_q: Record<string, TbmSpotEntry> = Object.entries(
  tbm_spot_list,
).reduce(
  (acc, [compoundKey, value]) => {
    compoundKey.split("|").forEach((key) => {
      acc[key.trim()] = value;
    });
    return acc;
  },
  {} as Record<string, TbmSpotEntry>,
);

//----------------------------------------------//
//   TBM Cutter Head Position Point Parameters  //
//----------------------------------------------//

//--- Correct orientation
export function getRotationStartOnTop(
  startVertex: number[],
  endVertex: number[],
): number {
  const dx = endVertex[0] - startVertex[0];
  const dy = endVertex[1] - startVertex[1];

  // compass bearing from start -> end, clockwise from north
  let bearing = Math.atan2(dx, dy) * (180 / Math.PI);
  if (bearing < 0) bearing += 360;

  // rotate so that the END direction points DOWN (south),
  // which puts the START vertex at the TOP of the screen
  const rotation = (180 - bearing + 360) % 360;

  return rotation;
}

// Generates a simple circle polygon (in symbol-local coordinates) used
// as the marker graphic geometry for both CIMVectorMarker layers.
function generateCircleGeometry() {
  const cx = 8.5,
    cy = 8.5,
    r = 8.5;
  const ring = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * 2 * Math.PI;
    ring.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  return { rings: [ring] };
}

export const cimSymbol: any = (bearing: any) => {
  return {
    type: "cim", // autocasts as new CIMSymbol
    data: {
      type: "CIMSymbolReference",
      symbol: {
        type: "CIMPointSymbol",
        symbolLayers: [
          {
            type: "CIMVectorMarker",
            enable: true,
            animations: [
              {
                type: "CIMSymbolAnimationScale",
                scaleFactor: 3, // grows to 3x size over the animation
                animatedSymbolProperties: {
                  type: "CIMAnimatedSymbolProperties",
                  primitiveName: "animationOverride",
                  playAnimation: true,
                  randomizeStartTime: false,
                  repeatType: "Loop",
                  repeatDelay: 1.5,
                  duration: 1.5,
                },
              },
              {
                type: "CIMSymbolAnimationTransparency",
                toTransparency: 100, // fades to fully transparent
                animatedSymbolProperties: {
                  type: "CIMAnimatedSymbolProperties",
                  primitiveName: "animationOverride",
                  playAnimation: true,
                  randomizeStartTime: false,
                  repeatType: "Loop",
                  repeatDelay: 1.5,
                  duration: 1.5,
                  easing: "EaseIn",
                },
              },
            ],
            size: 4,
            frame: { xmin: 0, ymin: 0, xmax: 17, ymax: 17 },
            markerGraphics: [
              {
                type: "CIMMarkerGraphic",
                geometry: generateCircleGeometry(),
                symbol: {
                  type: "CIMPolygonSymbol",
                  symbolLayers: [
                    {
                      type: "CIMSolidStroke",
                      primitiveName: "strokeOverride",
                      enable: true,
                      width: 1,
                      color: bearing === "NB" ? nb_q.rgb : sb_q.rgb,
                    },
                  ],
                },
              },
            ],
          },
          {
            // Static center dot (no animation)
            type: "CIMVectorMarker",
            enable: true,
            size: 4,
            frame: { xmin: 0, ymin: 0, xmax: 17, ymax: 17 },
            markerGraphics: [
              {
                type: "CIMMarkerGraphic",
                geometry: generateCircleGeometry(),
                symbol: {
                  type: "CIMPolygonSymbol",
                  symbolLayers: [
                    {
                      type: "CIMSolidFill",
                      enable: true,
                      color: bearing === "NB" ? nb_q.rgb : sb_q.rgb,
                    },
                  ],
                },
              },
            ],
            scaleSymbolsProportionally: true,
            respectFrame: true,
          },
        ],
      },
    },
  };
};

export const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
//----------------------------------------------//
//              Station Structure Layer          //
//----------------------------------------------//
export const st_structure_renderer = new SimpleRenderer({
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: { color: [225, 225, 225, 0], colorMixMode: "replace" },
        edges: new SolidEdges3D({ color: [225, 225, 225, 0.3] }),
      }),
    ],
  }),
});

//----------------------------------------------//
//              Dropdown parameters             //
//----------------------------------------------//
const cp101 = ["SG1-NB", "SG1-SB", "SG2-NB", "SG2-SB", "SG3-NB", "SG3-SB"];
const cp102 = ["SG4-NB", "SG4-SB", "SG5-NB", "SG5-SB"];
const cp103 = ["SG6-NB", "SG6-SB", "SG7-NB", "SG7-SB", "SG8-NB", "SG8-SB"];
const cp104 = ["SG9-NB", "SG9-SB", "SG10-NB", "SG10-SB"];
const cp105 = ["SG11-NB", "SG11-SB"];
const cp108 = ["SG12-NB", "SG12-SB", "SG13-NB", "SG13-SB"];

export const cp101_f2 = cp101.map((line: any) => {
  return { name: line };
});

export const cp102_f2 = cp102.map((line: any) => {
  return { name: line };
});

export const cp103_f2 = cp103.map((line: any) => {
  return { name: line };
});

export const cp104_f2 = cp104.map((line: any) => {
  return { name: line };
});

export const cp105_f2 = cp105.map((line: any) => {
  return { name: line };
});

export const cp108_f2 = cp108.map((line: any) => {
  return { name: line };
});

export const initialState: any = { field1: "CP101", field2: cp101_f2 };

export const dropdownDataObject = [
  { field1: "CP101", field2: cp101_f2 },
  { field1: "CP102", field2: cp102_f2 },
  { field1: "CP103", field2: cp103_f2 },
  { field1: "CP104", field2: cp104_f2 },
  { field1: "CP105", field2: cp105_f2 },
  { field1: "CP108", field2: cp108_f2 },
];

//----------------------------------------------//
//                Alignment Layers              //
//----------------------------------------------//
//--- CONSTRUCTION BOUNDARY
export const lot_boundary_renderer = new UniqueValueRenderer({
  field: "MappingBoundary",
  uniqueValueInfos: [
    {
      value: 1,
      symbol: new SimpleFillSymbol({
        color: [0, 0, 0, 0],
        outline: { width: 1.5, color: [220, 220, 220], style: "short-dash" },
      }),
    },
  ],
});

export const station_box_renderer = new UniqueValueRenderer({
  field: "Layer",
  uniqueValueInfos: [
    {
      value: "U-Shape Retaining Wall",
      symbol: new SimpleFillSymbol({
        color: [104, 104, 104],
        style: "backward-diagonal",
        outline: { width: 1, color: "black" },
      }),
    },
    {
      value: "Cut & Cover Box",
      symbol: new SimpleFillSymbol({
        color: [104, 104, 104],
        style: "backward-diagonal",
        outline: { width: 1, color: "black" },
      }),
    },
    {
      value: "TBM Shaft",
      symbol: new SimpleFillSymbol({
        color: [104, 104, 104],
        style: "backward-diagonal",
        outline: { width: 1, color: "black" },
      }),
    },
    {
      value: "TBM",
      symbol: new SimpleFillSymbol({
        color: [178, 178, 178],
        style: "backward-diagonal",
        outline: { width: 0.5, color: "black" },
      }),
    },
    {
      value: "Station Platform",
      symbol: new SimpleFillSymbol({
        color: [240, 204, 230],
        style: "backward-diagonal",
        outline: { width: 0.4, color: "black" },
      }),
    },
    {
      value: "Station Box",
      symbol: new SimpleFillSymbol({
        color: [0, 0, 0, 0],
        outline: { width: 2, color: "red" },
      }),
    },
    {
      value: "NATM",
      symbol: new SimpleFillSymbol({
        color: [178, 178, 178, 0],
        style: "backward-diagonal",
        outline: { width: 0.5, color: "grey" },
      }),
    },
  ],
});

//--- STATION POINT FEATURE ---//
export const station_label = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: { color: "#d4d1ceff" },
        size: 13,
        halo: { color: "black", size: 0.5 },
      }),
    ],
    verticalOffset: {
      screenLength: 100,
      maxWorldLength: 700,
      minWorldLength: 80,
    },
    callout: {
      type: "line",
      color: [128, 128, 128, 0.5],
      size: 0.2,
      border: { color: "grey" },
    },
  }),
  labelExpressionInfo: { expression: "$feature.Station" },
});

//----------------------------------------------//
//          Lot Layer Parameters                //
//----------------------------------------------//
export const lot_id_f = "Id";
export const lot_status_f = "StatusNVS3";
export const lot_xho_f = "not_yet";
export const lot_ho_f = "HandedOver";
export const lot_hod_f = "HandOverDate";
export const lot_hoy_f = "HandedOverYear";
export const lot_type_f = "Type";
export const lot_section_f = "Station1";
export const lot_remarks_f = "REMARKS";
export const lot_issue_f = "Issue";

export const lot_status_q = [
  { value: 1, category: "Paid", color: "#70ad47" },
  { value: 2, category: "For Payment Processing", color: "#0070ff" },
  { value: 3, category: "For Legal Pass", color: "#ffff00" },
  { value: 4, category: "For Appraisal/Offer to Buy", color: "#ffaa00" },
  { value: 5, category: "For Expro", color: "#ff0000" },
  { value: 6, category: "with WOP Fully Turned-over", color: "#00734c" },
  { value: 7, category: "ROWUA/TUA", color: "#55ff00" },
  { value: 8, category: "Signed ROWUA/TUA", color: "#C1E1C1" },
];

export const lot_symbol = new SimpleFillSymbol({
  color: [0, 0, 0, 0],
  style: "solid",
  outline: { color: [110, 110, 110], width: 0.7 },
});

export const lot_uniqueV: any = lot_status_q.map((f: any) => {
  return {
    value: f.value,
    label: f.category,
    symbol: new SimpleFillSymbol({ color: f.color }),
  };
});

export const lot_status_renderer = new UniqueValueRenderer({
  field: lot_status_f,
  defaultSymbol: lot_symbol,
  uniqueValueInfos: lot_uniqueV,
});

export const lot_id_label = new LabelClass({
  symbol: new TextSymbol({ color: "black", font: { size: 8 } }),
  labelExpressionInfo: { expression: "$feature.CN" },
});

export const lot_popup = {
  title: "<p>{Id}</p>",
  lastEditInfoEnabled: false,
  returnGeometry: true,
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "OWNER", label: "Land Owner" },
        { fieldName: "Station1" },
        { fieldName: "StatusNVS3", label: "<p>Status of Land Acquisition</p>" },
        { fieldName: "HandOverDate", label: "Handed-over date" },
      ],
    },
  ],
};

//--- LOT BOUNDARY LAYER ---//
export const lot_bdry_renderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: [0, 0, 0, 0],
    style: "solid",
    outline: { color: [110, 110, 110], width: 1.5 },
  }),
});

export const lot_bdry_label = new LabelClass({
  symbol: new TextSymbol({
    color: "white",
    font: { family: "Gill Sans", size: 8 },
  }),
  labelExpressionInfo: { expression: "$feature.CN" },
});
