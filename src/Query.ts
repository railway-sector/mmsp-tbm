/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  cutterHeadSpotLayer,
  dateTable,
  tbmTunnelLayer,
  tbm_cutterhead,
} from "./layers";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import IconSymbol3DLayer from "@arcgis/core/symbols/IconSymbol3DLayer.js";
import PointSymbol3D from "@arcgis/core/symbols/PointSymbol3D.js";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Query from "@arcgis/core/rest/support/Query";
import * as am5 from "@amcharts/amcharts5";
import { cp_f, nb_q, sb_q, segline_f } from "./uniqueValues";
import QueryExpressionLayers from "query-layers-expression";

//---------------------------------------------------------//
//                 Add Layers to Map                      //
//---------------------------------------------------------//
export function addLayersToMap(map: any, layersList: any[]) {
  layersList.forEach((layer: any) => {
    map.add(layer);
  });
}

//---------------------------------------------------------//
//                Date Function                           //
//---------------------------------------------------------//
export function yearMonthDay(date: Date) {
  return {
    year: date?.getFullYear() ?? 0,
    month: date?.getMonth() + 1,
    day: date?.getDate(),
  };
}

export function toAsofdate(date: Date) {
  //--- Return displayed date: (as of date)
  const { year, day } = yearMonthDay(date);
  const cmonth = date?.toLocaleString("en-US", { month: "long" });

  return year <= 1970 ? "" : `${cmonth} ${day}, ${year}`;
}

export async function dateUpdate(category: string) {
  //--- Only executed during an initial render
  const query = dateTable.createQuery();
  query.where = `category = '${category}'`; //'TBM Tunnel'

  const { features } = await dateTable.queryFeatures(query);
  return features.map(({ attributes }: any) => {
    const asofdate = toAsofdate(new Date(attributes.date));

    return asofdate;
  });
}

//--- Returns query expression
export const makeQuery = (
  qValues: string[],
  qFields: string[],
  qExpression?: string,
  q2Expression?: string,
) => {
  const q = new QueryExpressionLayers({});
  q.qValues = qValues;
  q.qFields = qFields;
  if (qExpression) q.qExpression = qExpression;
  if (q2Expression) q.q2Expression = q2Expression;
  return q;
};

//---------------------------------------------------------//
//    Definition Expression using queryExpression          //
//---------------------------------------------------------//
interface queryDefinitionExpressionType {
  queryExpression?: string;
  featureLayer?:
    | [FeatureLayer, FeatureLayer?, FeatureLayer?, FeatureLayer?, FeatureLayer?]
    | any;
}

export function queryDefinitionExpression({
  queryExpression,
  featureLayer,
}: queryDefinitionExpressionType) {
  if (!queryExpression || !featureLayer) return;
  const layers = Array.isArray(featureLayer) ? featureLayer : [featureLayer];
  layers.forEach(
    (layer: any) => layer && (layer.definitionExpression = queryExpression),
  );
}

interface fieldStatisticType {
  qChart: any;
  layer: any;
}

export async function fieldStatistic({ qChart, layer }: fieldStatisticType) {
  //--- Total number of rings
  const rings = new StatisticDefinition({
    onStatisticField: "line",
    outStatisticFieldName: "rings",
    statisticType: "count",
  });

  //--- Total number of completed rings
  const rcomp = new StatisticDefinition({
    onStatisticField: `CASE WHEN status = 3 THEN 1 ELSE 0 END`,
    outStatisticFieldName: "rcomp",
    statisticType: "sum",
  });

  //--- Segmented Length
  const lcomp = new StatisticDefinition({
    onStatisticField: `SegmentLength`,
    outStatisticFieldName: "lcomp",
    statisticType: "sum",
  });

  //--- Query
  const isLine = qChart.includes(segline_f);

  const statsList = isLine ? [cp_f, segline_f] : [cp_f];
  const query = new Query({
    where: qChart,
    outStatistics: [rings, rcomp, lcomp],
    groupByFieldsForStatistics: statsList,
    orderByFields: statsList,
  });

  const response = await layer?.queryFeatures(query);
  const attrs = response.features[0]?.attributes ?? {};
  const totalr = attrs.rings;
  const totalc = attrs.rcomp ?? 0;

  return {
    totalr: totalr,
    totalc: totalc,
    totall: attrs.lcomp ?? 0,
    perc: totalr ? (totalc / totalr) * 100 : 0,
  };
}

//---------------------------------------------------------//
//    Cutter head spot segment number                      //
//---------------------------------------------------------//
export async function cutterHeadPositionData(queryExpression: any) {
  const query = tbmTunnelLayer.createQuery();
  query.where = queryExpression;
  query.groupByFieldsForStatistics = ["segmentno", "line"];

  const response = await tbmTunnelLayer.queryFeatures(query);
  const stats = response.features[0]?.attributes;
  return [stats?.segmentno, stats?.line];
}

//---------------------------------------------------------//
//    Cutter head spot data and time series chart data     //
//---------------------------------------------------------//
export const sf = SpatialReference.WebMercator;

export async function tbmCutterHeadSpotQuery(qe: any, layer: FeatureLayer) {
  const query = layer.createQuery();
  query.returnGeometry = true;
  query.groupByFieldsForStatistics = ["line"];
  query.outFields = ["line", "tbmSpot", "Package"];
  query.where = `${qe} AND tbmSpot= 1`;

  return await layer.queryFeatures(query);
}

export async function tbmCutterHeadSpotData(qe: any, layer: FeatureLayer) {
  cutterHeadSpotLayer.removeAll();

  const response = await tbmCutterHeadSpotQuery(qe, layer);
  response.features.forEach((result: any) => {
    const vertex = result.geometry.paths[0];
    const long = (vertex[0][0] + vertex[1][0]) / 2;
    const lat = (vertex[0][1] + vertex[1][1]) / 2;

    const point: any = {
      spatialReference: sf,
      type: "point",
      x: long,
      y: lat,
      z: 5,
    };

    const isNorth = result.attributes.line.includes("NB");

    const symbol = new PointSymbol3D({
      symbolLayers: [
        new IconSymbol3DLayer({
          resource: { href: isNorth ? nb_q.logo : sb_q.logo },
          size: 30,
        }),
      ],
      verticalOffset: {
        screenLength: 100,
        maxWorldLength: 500,
        minWorldLength: 40,
      },
      callout: {
        type: "line",
        size: 0.7,
        color: isNorth ? nb_q.hex : sb_q.hex,
        border: { color: isNorth ? nb_q.hex : sb_q.hex },
      },
    });

    const myGraphic = new Graphic({ geometry: point, symbol: symbol });
    return cutterHeadSpotLayer.add(myGraphic);
  });
}

export async function animatedPointXY(qe: any, layer: any, cimSymbol: any) {
  const response = await tbmCutterHeadSpotQuery(qe, layer);

  //-- Create a point for each queries
  response.features.forEach((result: any) => {
    //- Nourth-Bound or South-Bound
    const bound = result.attributes["line"].includes("NB") ? "NB" : "SB";

    //-- Get lat and long
    const vertex = result?.geometry?.paths[0];
    const long = (vertex[0][0] + vertex[1][0]) / 2;
    const lat = (vertex[0][1] + vertex[1][1]) / 2;

    //- Create a point graphic
    const point: any = { spatialReference: sf, type: "point", x: long, y: lat };
    const pointGraphic = new Graphic({
      geometry: point,
      symbol: cimSymbol(bound),
    });

    //- Add to GraphicsLayer
    return tbm_cutterhead.add(pointGraphic);
  });
}

//------------------------------------------------//
//            Overview Map constraint             //
//------------------------------------------------//
const PROHIBITED_ZOOM_KEYS = new Set([
  "+",
  "-",
  "Shift",
  "_",
  "=",
  "ArrowUp",
  "ArrowDown",
  "ArrowRight",
  "ArrowLeft",
]);

export function disableZooming(view: any) {
  view.popup.dockEnabled = true;
  view.popup.actions = [];
  view.ui.components = [];

  // stops propagation of default behavior when an event fires
  function stopEvtPropagation(event: any) {
    event.stopPropagation();
  }

  const blockedInteractions: [string, string[]?][] = [
    ["mouse-wheel"],
    ["double-click"],
    ["double-click", ["Control"]],
    ["drag"],
    ["drag", ["Shift"]],
    ["drag", ["Shift", "Control"]],
  ];

  blockedInteractions.forEach(([eventName, modifiers]) => {
    modifiers
      ? view.on(eventName, modifiers)
      : view.on(eventName, stopEvtPropagation);
  });

  // prevents zooming with the + and - keys
  view.on("key-down", (event: any) => {
    if (PROHIBITED_ZOOM_KEYS.has(event.key)) {
      event.stopPropagation();
    }
  });

  return view;
}

//---------------------------------------------------------//
//    Time-series progress chart                           //
//---------------------------------------------------------//
export async function timeSeriesChartData(queryExpression: any) {
  const total_segment_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN status = 3 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_segment_comp",
    statisticType: "sum",
  });

  const query = new Query({
    where: queryExpression,
    outStatistics: [total_segment_comp],
    outFields: ["enddate"],
    orderByFields: ["enddate"],
    groupByFieldsForStatistics: ["enddate"],
  });

  const response = await tbmTunnelLayer.queryFeatures(query);
  const data = response.features.map((result: any) => {
    const attrs = result.attributes;
    return { date: attrs.enddate, value: attrs.total_segment_comp };
  });
  return data;
}

//---------------------------------------------------------//
//    Responsive chart for segemented ring Gauge           //
//---------------------------------------------------------//
export function responsiveChart(
  root: any,
  chart: any,
  completedRings: any,
  new_fontSize: any,
) {
  chart.onPrivate("width", (_width: any) => {
    const percentProgressLabelColor = am5.color("#00C3FF");
    const chartTitleColor = am5.color("#d1d5db");

    // Number of completed segments label inside the Gauge
    chart.children.unshift(
      am5.Label.new(root, {
        text: !completedRings
          ? "0"
          : "[bold]" + thousands_separators(completedRings),
        fontSize: `${new_fontSize}px`,
        textAlign: "center",
        fill: chartTitleColor,
        x: am5.percent(50),
        centerX: am5.percent(50),
        y: am5.percent(65),
        centerY: am5.percent(80),
      }),
    );

    // 'Completed' label at the bottom of the Gauge
    chart.children.unshift(
      am5.Label.new(root, {
        text: "Completed",
        fontSize: `${new_fontSize * 0.8}px`,
        textAlign: "center",
        fill: percentProgressLabelColor,
        x: am5.percent(50),
        centerX: am5.percent(50),
        y: am5.percent(100),
        centerY: am5.percent(10),
      }),
    );
  });
}

//--------------------------------------//
//               Other tools            //
//--------------------------------------//
//--- Thousand separators function
export function thousands_separators(num: any) {
  if (num) {
    const num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }

  if (num == 0) return "0";
}

export function zoomToLayer(layer: any, view: any) {
  return layer.queryExtent().then((response: any) => {
    view?.goTo(response.extent, { speedFactor: 2 }).catch((error: any) => {
      if (error.name !== "AbortError") {
        console.error(error);
      }
    });
  });
}

//--------------------------------------//
//            Layer List                //
//--------------------------------------//
export const defineActions = (event: any) => {
  const item = event.item;
  if (item.layer.type !== "group") {
    item.panel = { content: "legend", open: true };
  }

  item.title === "Soil Profile" ||
  item.title === "Land Acquisition" ||
  item.title === "Lot Boundary" ||
  item.title === "Station Structure"
    ? (item.visible = false)
    : (item.visible = true);
};
