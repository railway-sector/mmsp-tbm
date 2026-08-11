import "@esri/calcite-components/dist/components/calcite-panel";
import "@esri/calcite-components/dist/components/calcite-list-item";
import "@esri/calcite-components/dist/components/calcite-shell-panel";
import "@esri/calcite-components/dist/components/calcite-action";
import "@esri/calcite-components/dist/components/calcite-action-bar";
import "@arcgis/map-components/components/arcgis-building-explorer";
import { use, useEffect, useState } from "react";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-direct-line-measurement-3d";
import "@arcgis/map-components/components/arcgis-area-measurement-3d";
import { defineActions } from "../query";
import ProgressChart from "./ProgressChart";
import TimeSlider from "./TimeSlider";
import { MyContext } from "../contexts/MyContext";

function ActionPanel() {
  const { layerView } = use(MyContext);
  const shellPanel: any = document.getElementById("left-shell-panel");
  const timeSlider = document.querySelector("arcgis-time-slider");

  //-----------------------------------------
  //   Define active & next widget states
  //-----------------------------------------
  const [activeWidget, setActiveWidget] = useState(null);
  const [nextWidget, setNextWidget] = useState(null);

  const [hasOpenedBasemaps, setHasOpenedBasemaps] = useState(false);
  useEffect(() => {
    if (nextWidget === "basemaps") setHasOpenedBasemaps(true);
  }, [nextWidget]);

  //--- Click action handler function for active & next widget
  const handleActionClick = (event: any) => {
    const id = event.target.id;
    setNextWidget(id);
    setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
  };

  const directLineMeasure = document.querySelector(
    "arcgis-direct-line-measurement-3d",
  );

  useEffect(() => {
    if (activeWidget) {
      const actionActiveWidget: any = document.querySelector(
        `[data-panel-id=${activeWidget}]`,
      );
      actionActiveWidget.hidden = true;
      shellPanel.collapsed = true;

      directLineMeasure && directLineMeasure.clear();

      //--- Reset tbm tunnel layer when closed.
      if (timeSlider) {
        timeSlider.timeExtent = null;
        layerView.filter = null;
      }
    }

    if (nextWidget !== activeWidget) {
      const actionNextWidget: any = document.querySelector(
        `[data-panel-id=${nextWidget}]`,
      );
      actionNextWidget.hidden = false;
      shellPanel.collapsed = false;

      if (nextWidget === "charts") {
        shellPanel.collapsed = true;
      }

      // Collapse shellPanel for timeslider
      if (nextWidget === "timeslider") {
        shellPanel.collapsed = true;
      }
    }
  });

  return (
    <>
      <calcite-shell-panel
        slot="panel-start"
        id="left-shell-panel"
        displayMode="dock"
        collapsed
      >
        <calcite-action-bar
          slot="action-bar"
          style={{
            borderStyle: "solid",
            borderWidth: 0.5,
            borderLeftWidth: 1,
            borderColor: "#555555",
          }}
        >
          <calcite-action
            data-action-id="layers"
            icon="layers"
            text="layers"
            id="layers"
            onClick={handleActionClick}
          ></calcite-action>

          <calcite-action
            data-action-id="basemaps"
            icon="basemap"
            text="basemaps"
            id="basemaps"
            onClick={handleActionClick}
          ></calcite-action>

          <calcite-action
            data-action-id="charts"
            icon="graph-time-series"
            text="Progress Chart"
            id="charts"
            onClick={handleActionClick}
          ></calcite-action>

          <calcite-action
            data-action-id="directline-measure"
            icon="measure-line"
            text="Line Measurement"
            id="directline-measure"
            onClick={handleActionClick}
          ></calcite-action>

          <calcite-action
            data-action-id="timeslider"
            icon="sliders-horizontal"
            text="Time Slider"
            id="timeslider"
            onClick={handleActionClick}
          ></calcite-action>

          <calcite-action
            data-action-id="information"
            icon="information"
            text="Information"
            id="information"
            onClick={handleActionClick}
          ></calcite-action>
        </calcite-action-bar>

        <calcite-panel heading="Layers" data-panel-id="layers" hidden>
          <arcgis-layer-list
            referenceElement="arcgis-scene"
            selectionMode="multiple"
            visibilityAppearance="checkbox"
            filter-placeholder="Filter layers"
            listItemCreatedFunction={defineActions}
          ></arcgis-layer-list>
        </calcite-panel>

        <calcite-panel heading="Basemaps" data-panel-id="basemaps" hidden>
          {hasOpenedBasemaps ? (
            <arcgis-basemap-gallery referenceElement="arcgis-map"></arcgis-basemap-gallery>
          ) : null}{" "}
        </calcite-panel>

        <calcite-panel
          className="timeSeries-panel"
          height-scale="l"
          data-panel-id="charts"
          hidden
        ></calcite-panel>

        <calcite-panel
          heading="Direct Line Measure"
          data-panel-id="directline-measure"
          hidden
        >
          <arcgis-direct-line-measurement-3d
            id="directLineMeasurementAnalysisButton"
            referenceElement="arcgis-scene"
          ></arcgis-direct-line-measurement-3d>
        </calcite-panel>

        <calcite-panel
          className="timeslider"
          data-panel-id="timeslider"
          hidden
        ></calcite-panel>

        <calcite-panel heading="Description" data-panel-id="information" hidden>
          {nextWidget === "information" ? (
            <div style={{ paddingLeft: "20px" }}>
              This smart map shows the construction progress on TBM tunnel
              segments.
              <div style={{ paddingLeft: "20px" }}>
                <li>
                  The source of data: <b>CAD files</b>.
                </li>
                <li>
                  {" "}
                  The construction progress is manually updated based on the
                  information provided by the RE Team.
                </li>
              </div>
            </div>
          ) : (
            <div className="informationDiv" hidden></div>
          )}
        </calcite-panel>
      </calcite-shell-panel>

      {/* Monthly progress */}
      {nextWidget === "charts" && nextWidget !== activeWidget && (
        <ProgressChart />
      )}

      {nextWidget === "timeslider" && nextWidget !== activeWidget && (
        <TimeSlider />
      )}
    </>
  );
}

export default ActionPanel;
