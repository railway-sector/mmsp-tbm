import { useEffect, useRef, useState } from "react";
import { queryc, tbmTunnelLayer } from "../layers";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";
import {
  queryDefinitionExpression,
  responsiveChart,
  tbmCutterHeadSpotData0,
  thousands_separators,
  fieldStatistic,
  zoomToLayer,
} from "../Query";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import { rootSetter } from "../chartSetter";
import { useQuery } from "@tanstack/react-query";
import { locationKeys } from "../interfaceKeys";
import type { SelectedLocation } from "../interfaceKeys";
import RippleImage from "./RippleImage";

// Draw chart
const Chart = () => {
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;

  //--- Location state
  const { data: selectedLocation } = useQuery<SelectedLocation | any>({
    queryKey: locationKeys.selected,
    queryFn: async () => ({}),
    staleTime: Infinity,
  });
  const cpackage = selectedLocation?.cpackage;
  const segline = selectedLocation?.segline;

  const chartRef = useRef<unknown | any | undefined>({});
  const chartID = "gauge-bar";
  const primaryLabelColor = "#9ca3af";
  const valueLabelColor = "#d1d5db";

  const { data } = useQuery<any>({
    queryKey: [cpackage, segline, tbmTunnelLayer],
    queryFn: async () => {
      queryc.qValues = [cpackage, segline];
      queryDefinitionExpression({
        queryExpression: queryc.queryExpression(),
        featureLayer: [tbmTunnelLayer],
      });

      //--- Total number of rings
      const totalR = await fieldStatistic({
        qChart: queryc.queryExpression(),
        layer: tbmTunnelLayer,
        statisticField: "line",
        statisticType: "count",
      });

      //--- total number of completed rings
      const totalC = await fieldStatistic({
        qChart: `${queryc.queryExpression()} AND status = 3`,
        layer: tbmTunnelLayer,
        statisticField: "status",
        statisticType: "count",
      });

      //--- Segmented Length
      const totalL = await fieldStatistic({
        qChart: `${queryc.queryExpression()} AND segmentno = 1`,
        layer: tbmTunnelLayer,
        statisticField: "SegmentLength",
        statisticType: "sum",
      });

      //--- Percent progress
      const perc_comp = (totalC / totalR) * 100;

      //--- Draw TBM Cutter head Points
      tbmCutterHeadSpotData0(`${queryc.queryExpression()} AND tbmSpot= 1`);

      zoomToLayer(tbmTunnelLayer, arcgisScene);

      return {
        totalR: totalR || 0,
        totalC: totalC || 0,
        totalL: totalL || 0,
        perc_comp: perc_comp || 0,
      };
    },
  });
  const totalR = data?.totalR || 0;
  const totalC = data?.totalC || 0;
  const totalL = data?.totalL || 0;
  const perc_comp = data?.perc_comp || 0;

  //-- Chart properties --//
  const percentProgressLabelColor = am5.color("#00C3FF"); // light blue
  const strokeOtherColor = am5.color("#c5c5c5"); // grey
  const new_fontSize = chartPanelwidth / 15;
  const new_valueSize = new_fontSize * 1.55;
  const new_imageSize = chartPanelwidth * 0.05;

  // Utility Chart
  useEffect(() => {
    const root = rootSetter({ chartID: chartID });
    const chart = root.container.children.push(
      am5radar.RadarChart.new(root, {
        panX: false,
        panY: false,
        startAngle: -180,
        endAngle: 0,
        radius: am5.percent(90), // size of overall chart
        innerRadius: -20, // expand inward,
        y: -50,
      }),
    );
    chartRef.current = chart;

    const axisRenderer = am5radar.AxisRendererCircular.new(root, {
      innerRadius: am5.percent(120), //gagues width becomes thicker outward
      strokeOpacity: 1,
      minGridDistance: 30,
    });

    // Enable ticks
    axisRenderer.ticks.template.setAll({
      visible: true,
      strokeOpacity: 0.5,
      length: -6,
      //inside: true,
      stroke: strokeOtherColor,
    });

    axisRenderer.grid.template.setAll({
      stroke: root.interfaceColors.get("background"),
      visible: false,
      strokeOpacity: 0,
    });

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        max: 100,
        strictMinMax: true,
        renderer: axisRenderer,
      }),
    );

    // Axis labels properties
    xAxis.get("renderer").labels.template.setAll({
      fill: strokeOtherColor,
      fontSize: 10,
      textAlign: "center",
      inside: true, // move labels inside ticks
      //radius: 20,
    });

    // Add clock hand
    const axisDataItem = xAxis.makeDataItem({});
    const clockHand = am5radar.ClockHand.new(root, {
      //pinRadius: 10,
      radius: am5.percent(-3),
      innerRadius: -30,
      bottomWidth: 10,
      topWidth: 0,
    });

    clockHand.pin.setAll({
      fillOpacity: 0,
      strokeOpacity: 0,
    });

    clockHand.hand.setAll({
      fillOpacity: 0.5,
      strokeOpacity: 0.7,
      stroke: percentProgressLabelColor,
      fill: percentProgressLabelColor,
      strokeWidth: 1,
    });

    const bullet = axisDataItem.set(
      "bullet",
      am5xy.AxisBullet.new(root, {
        sprite: clockHand,
      }),
    );

    chart.onPrivate("width", (width: any) => {
      setChartPanelwidth(width);
    });
    responsiveChart(root, chart, totalC, new_valueSize);

    xAxis.createAxisRange(axisDataItem);

    // Label for percent progress
    const label = chart.radarContainer.children.push(
      am5.Label.new(root, {
        centerX: am5.percent(50),
        textAlign: "center",
        centerY: am5.percent(90),
        y: am5.percent(25),
        fontSize: `${new_valueSize * 0.8}px`,
        fill: percentProgressLabelColor,
      }),
    );

    // Add percent progress values
    bullet.get("sprite").on("rotation", function () {
      const value = axisDataItem.get("value");
      label.set(
        "text",
        value === undefined ? "" : value.toFixed(1).toString() + "%",
      );
    });

    axisDataItem.animate({
      key: "value",
      to: perc_comp,
      duration: 500,
      easing: am5.ease.out(am5.ease.cubic),
    });

    chart.bulletsContainer.set("mask", undefined);

    xAxis.createAxisRange(
      xAxis.makeDataItem({
        above: true,
        value: 0,
        endValue: 100,
      }),
    );

    xAxis.createAxisRange(
      xAxis.makeDataItem({
        above: true,
        value: perc_comp,
        endValue: 100,
      }),
    );

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  });

  return (
    <>
      <div
        slot="panel-end"
        style={{
          width: "26vw",
          borderStyle: "solid",
          borderRightWidth: 4,
          borderLeftWidth: 4,
          borderBottomWidth: 4,
          borderTopWidth: 0,
          borderColor: "#555555",
        }}
      >
        <div
          style={{
            display: "flex",
            borderStyle: "solid",
            borderColor: "#555555",
            paddingBottom: "10px",
          }}
        >
          <img
            src="https://EijiGorilla.github.io/Symbols/TBM.png"
            alt="TBM Logo"
            height={`${new_imageSize}%`}
            width={`${new_imageSize}%`}
            style={{
              marginLeft: "15px",
              marginRight: "15px",
              marginTop: "auto",
              marginBottom: "auto",
            }}
          />
          <dl style={{ marginTop: "2vh", marginLeft: "3.5vw" }}>
            <dt
              style={{
                color: primaryLabelColor,
                fontSize: `${new_fontSize}px`,
              }}
            >
              TOTAL RINGS
            </dt>
            <dd
              style={{
                color: valueLabelColor,
                fontSize: `${new_valueSize}px`,
                fontWeight: "bold",
                fontFamily: "calibri",
                lineHeight: "1.2",
                margin: "auto",
              }}
            >
              {thousands_separators(totalR)}
            </dd>
          </dl>
        </div>
        {/* Progress Chart */}
        <div
          style={{
            borderStyle: "solid",
            borderTopWidth: "6px",
            paddingTop: "5px",
            borderColor: "#555555",
          }}
        >
          <div
            style={{
              color: primaryLabelColor,
              fontSize: `${new_fontSize}px`,
              textIndent: "20px",
              marginBottom: "20px",
            }}
          >
            SEGMENTED RINGS
          </div>
          <div
            id={chartID}
            style={{
              // width: '23vw',
              height: "31vh",
              color: "white",
              // paddingBottom: "20px",
            }}
          ></div>
        </div>
        {/* Segmented Length */}
        <dl
          style={{
            textIndent: "20px",
            margin: "0",
            borderStyle: "solid",
            borderTopWidth: "6px",
            borderBottomWidth: "6px",
            borderColor: "#555555",
            height: "20%",
          }}
        >
          <dt
            style={{
              color: primaryLabelColor,
              fontSize: `${new_fontSize}px`,
              paddingTop: "10px",
            }}
          >
            SEGMENTED LENGTH
          </dt>{" "}
          {totalL === null ? (
            <dd
              style={{
                fontSize: `${new_valueSize}px`,
                fontWeight: "bold",
                color: valueLabelColor,
                paddingTop: "5px",
              }}
            >
              ------- m
            </dd>
          ) : (
            <dd
              style={{
                fontSize: "1.5rem",
                color: "white",
                paddingTop: "5px",
              }}
            >
              <span
                style={{
                  color: valueLabelColor,
                  fontSize: `${new_valueSize}px`,
                  fontWeight: "bold",
                  paddingLeft: "10px",
                }}
              >
                {totalL === 0 ? totalL : thousands_separators(totalL)} m
              </span>
            </dd>
          )}
        </dl>
        {/* TBM Cutter head Logot */}
        <div
          style={{
            display: "flex",
            borderStyle: "solid",
            // borderColor: "#555555",
            borderLeftColor: "#555555",
            borderRightColor: "#555555",
            borderTopColor: "#555555",
            borderBottomColor: "#555555",
            borderLeftWidth: "3px",
            height: "21%",
            // paddingBottom: "10px",
          }}
        >
          <RippleImage height={new_imageSize} width={new_imageSize} />
          <dl style={{ marginTop: "2vh", marginLeft: "3.5vw" }}>
            <dt
              style={{
                color: primaryLabelColor,
                fontSize: `${new_fontSize}px`,
              }}
            >
              CUTTER HEAD POSITION
            </dt>
          </dl>
        </div>
      </div>
    </>
  );
};

export default Chart;
