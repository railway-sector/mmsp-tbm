import { useRef, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import { queryDefinitionExpression, timeSeriesChartData } from "../Query";
import { useQuery } from "@tanstack/react-query";
import { locationKeys } from "../interfaceKeys";
import type { SelectedLocation } from "../interfaceKeys";
import { queryc2, tbmTunnelLayer } from "../layers";
import { rootSetter } from "../chartSetter";

const ProgressChart = () => {
  // const { contractpackages, segmentlines } = use(MyContext);
  const barSeriesRef = useRef<unknown | any | undefined>({});
  const legendRef = useRef<unknown | any | undefined>({});
  const xAxisRef = useRef<unknown | any | undefined>({});
  const yAxisRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const chartID = "progress-bar";

  //--- Location state
  const { data: selectedLocation } = useQuery<SelectedLocation | any>({
    queryKey: locationKeys.selected,
    queryFn: async () => ({}),
    staleTime: Infinity,
  });
  const cpackage = selectedLocation?.cpackage;
  const segline = selectedLocation?.segline;

  const { data } = useQuery<any>({
    queryKey: [cpackage, segline, tbmTunnelLayer],
    queryFn: async () => {
      queryc2.qValues = [cpackage, segline];
      queryDefinitionExpression({
        queryExpression: queryc2.queryExpression(),
        featureLayer: [tbmTunnelLayer],
      });

      const qe = `${queryc2.queryExpression()} AND enddate IS NOT NULL`;
      const chartData = await timeSeriesChartData(qe);

      return {
        chartData: chartData || [],
      };
    },
  });
  const chartData = data?.chartData || [];

  useEffect(() => {
    const root = rootSetter({ chartID: chartID });
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        paddingBottom: 35,
      }),
    );
    chartRef.current = chart;

    // Chart title
    chart.children.unshift(
      am5.Label.new(root, {
        text: "Monthly Progress of Segmented Rings",
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        fill: am5.color("#ffffff"),
        x: am5.percent(50),
        centerX: am5.percent(50),
        paddingTop: 0,
        paddingBottom: 0,
      }),
    );

    const cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "zoomX",
      }),
    );
    cursor.lineY.set("visible", false);

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0,
        groupData: true,
        baseInterval: {
          timeUnit: "day",
          count: 1,
        },
        groupIntervals: [{ timeUnit: "month", count: 1 }],
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 60,
          strokeOpacity: 1,
          strokeWidth: 1,
          stroke: am5.color("#ffffff"),
        }),

        //tooltip: am5.Tooltip.new(root, {})
      }),
    );

    const xRenderer = xAxis.get("renderer");
    xRenderer.labels.template.setAll({
      //oversizedBehavior: "wrap",
      textAlign: "center",
      fill: am5.color("#ffffff"),
      //maxWidth: 150,
      fontSize: 12,
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        calculateTotals: true,
        min: 0,
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 60,
          strokeOpacity: 1,
          strokeWidth: 1,
          stroke: am5.color("#ffffff"),
        }),
      }),
    );

    yAxis.get("renderer").labels.template.setAll({
      //oversizedBehavior: "wrap",//
      textAlign: "center",
      fill: am5.color("#ffffff"),
      //maxWidth: 150,
      fontSize: 12,
    });
    xAxisRef.current = xAxis;
    yAxisRef.current = yAxis;

    // Add yaxix title
    yAxis.children.unshift(
      am5.Label.new(root, {
        rotation: -90,
        text: "No. of Segmented Rings",
        y: am5.p50,
        centerX: am5.p50,
        fill: am5.color("#ffffff"),
        fontSize: 11,
      }),
    );

    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        centerY: am5.percent(50),
        x: am5.p50,
        y: am5.percent(108),
      }),
    );
    legendRef.current = legend;

    legend.labels.template.setAll({
      oversizedBehavior: "truncate",
      fill: am5.color("#ffffff"),
      fontSize: 17,
      scale: 0.8,
      //textDecoration: "underline"
      //width: am5.percent(200)
      //fontWeight: "300"
    });

    // check this;
    // newDataItem = new DataItem(series, dataContext, series._makeDataItem(dataContext));
    // dataItem is of dataItems
    // dataContext: dataItem.dataContext

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series",
        stacked: true,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        valueYGrouped: "sum",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}",
        }),
      }),
    );
    barSeriesRef.current = series;
    chart.series.push(series);

    series.columns.template.setAll({
      tooltipText: "{name}, {categoryX}: {valueY}",
      tooltipY: am5.percent(10),
      strokeOpacity: 0,
    });
    series.data.setAll(chartData);
    series.appear(1000);

    // Add Label bullet
    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationY: 1,
        locationX: 0.5,
        sprite: am5.Label.new(root, {
          text: "{valueY}",
          fill: root.interfaceColors.get("alternativeText"),
          centerY: 0,
          centerX: am5.p50,
          populateText: true,
          fontSize: 10,
        }),
      });
    });

    legend.data.push(series);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [chartID, chartData]);

  useEffect(() => {
    barSeriesRef.current?.data.setAll(chartData);

    xAxisRef.current?.data.setAll(chartData);
    yAxisRef.current?.data.setAll(chartData);
  });

  return (
    <>
      <div
        id={chartID}
        style={{
          height: "32vh",
          width: "60%",
          backgroundColor: "#2b2b2b",
          color: "white",
          position: "absolute",
          zIndex: 99,
          bottom: 10,
          marginLeft: "1vw",
          marginRight: "auto",
        }}
      ></div>
    </>
  );
};

export default ProgressChart;
