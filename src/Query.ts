/* eslint-disable @typescript-eslint/no-unused-expressions */
import { cutterHeadSpotLayer, dateTable, tbmTunnelLayer } from "./layers";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import IconSymbol3DLayer from "@arcgis/core/symbols/IconSymbol3DLayer.js";
import PointSymbol3D from "@arcgis/core/symbols/PointSymbol3D.js";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Query from "@arcgis/core/rest/support/Query";
import * as am5 from "@amcharts/amcharts5";

// Updat date
export async function dateUpdate() {
  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const query = dateTable.createQuery();
  query.where = "category = 'TBM Tunnel'";

  return dateTable.queryFeatures(query).then((response: any) => {
    const stats = response.features;
    const dates = stats.map((result: any) => {
      const date = new Date(result.attributes.date);
      const year = date.getFullYear();
      const month = monthList[date.getMonth()];
      const day = date.getDate();
      const final = year < 1990 ? "" : `${month} ${day}, ${year}`;
      return final;
    });
    return dates;
  });
}

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
  if (queryExpression) {
    if (featureLayer) {
      if (Array.isArray(featureLayer)) {
        featureLayer.forEach((layer) => {
          if (layer) {
            layer.definitionExpression = queryExpression;
            // layer.visible = true;
          }
        });
      } else {
        featureLayer.definitionExpression = queryExpression;
        // featureLayer.visible = true;
      }
    }
  }
}

export async function totalFieldCount({
  qChart,
  layer,
  idField,
}: statusDataType) {
  const statsCollect = new StatisticDefinition({
    onStatisticField: idField,
    outStatisticFieldName: "statsCollect",
    statisticType: "count",
  });

  //--- Query
  const query = new Query();
  query.outStatistics = [statsCollect];
  query.where = qChart;

  return layer?.queryFeatures(query).then((response: any) => {
    return response.features[0].attributes.statsCollect;
  });
}

interface statusDataType {
  qChart: any;
  layer: any;
  statusList?: any;
  statusColor?: any;
  statusField?: any;
  idField?: any;
  valueSumField?: any;
  queryField?: any;
  statisticType?: "count" | "sum";
}

export async function totalFieldSum({
  qChart,
  layer,
  valueSumField,
}: statusDataType) {
  const statsCollect = new StatisticDefinition({
    onStatisticField: valueSumField,
    outStatisticFieldName: "statsCollect",
    statisticType: "sum",
  });

  //--- Query
  const query = new Query();
  query.outStatistics = [statsCollect];
  query.where = qChart;

  return layer?.queryFeatures(query).then((response: any) => {
    return response.features[0].attributes.statsCollect;
  });
}

//---------------------------------------------------------//
//    Cutter head spot segment number                      //
//---------------------------------------------------------//
export async function cutterHeadPositionData(queryExpression: any) {
  const query = tbmTunnelLayer.createQuery();
  query.where = queryExpression;
  query.groupByFieldsForStatistics = ["segmentno", "line"];

  return tbmTunnelLayer.queryFeatures(query).then((response: any) => {
    const stats = response.features[0]?.attributes;
    const segmentN = stats?.segmentno;
    const tbmN = stats?.line;
    return [segmentN, tbmN];
  });
}

//---------------------------------------------------------//
//    Cutter head spot data and time series chart data     //
//---------------------------------------------------------//
const spatialReference = SpatialReference.WebMercator;
export async function tbmCutterHeadSpotData0(queryExpression: any) {
  cutterHeadSpotLayer.removeAll();
  const query = tbmTunnelLayer.createQuery();
  query.returnGeometry = true;
  query.groupByFieldsForStatistics = ["line"];
  query.where = queryExpression;

  return tbmTunnelLayer.queryFeatures(query).then((response: any) => {
    const stats = response.features;
    stats.forEach((result: any) => {
      const vertex = result.geometry.paths[0];
      const long = (vertex[0][0] + vertex[1][0]) / 2;
      const lat = (vertex[0][1] + vertex[1][1]) / 2;

      const point: any = {
        spatialReference: spatialReference,
        type: "point",
        x: long,
        y: lat,
        z: 5,
      };

      const symbol = new PointSymbol3D({
        symbolLayers: [
          new IconSymbol3DLayer({
            resource: {
              href: "https://EijiGorilla.github.io/Symbols/TBM_LOGO2.png",
            },
            size: 40,
          }),
        ],
        verticalOffset: {
          screenLength: 100,
          maxWorldLength: 500,
          minWorldLength: 40,
        },
        callout: {
          type: "line",
          size: 1.5,
          color: "#E83618",
          border: {
            color: "#E83618",
          },
        },
        // maxScale: 1000,
        // minScale: 25000000,
      });

      const myGraphic = new Graphic({
        geometry: point,
        symbol: symbol,
      });
      return cutterHeadSpotLayer.add(myGraphic);
    });
  });
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

  const query = tbmTunnelLayer.createQuery();
  query.where = queryExpression;
  query.outStatistics = [total_segment_comp];
  query.outFields = ["enddate"];
  query.orderByFields = ["enddate"];
  query.groupByFieldsForStatistics = ["enddate"];

  return tbmTunnelLayer.queryFeatures(query).then((response: any) => {
    const stats = response.features;

    // collect all dates for each viaduct type
    const data = stats.map((result: any) => {
      const attributes = result.attributes;
      const date = attributes.enddate;
      const value = attributes.total_segment_comp;

      // compile in object
      return Object.assign(
        {},
        {
          date: date,
          value: value,
        },
      );
    });
    return data;
  });
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

// Thousand separators function
export function thousands_separators(num: any) {
  if (num) {
    const num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }
}

export function zoomToLayer(layer: any, view: any) {
  return layer.queryExtent().then((response: any) => {
    view
      ?.goTo(response.extent, {
        //response.extent
        speedFactor: 2,
      })
      .catch((error: any) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });
  });
}

// Layer list
export const defineActions = (event: any) => {
  const item = event.item;
  if (item.layer.type !== "group") {
    item.panel = {
      content: "legend",
      open: true,
    };
  }

  item.title === "Soil Profile" ||
  item.title === "Land Acquisition" ||
  item.title === "Lot Boundary" ||
  item.title === "Station Structure"
    ? (item.visible = false)
    : (item.visible = true);
};
