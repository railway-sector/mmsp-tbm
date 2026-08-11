import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import "@esri/calcite-components/components/calcite-select";
import "@esri/calcite-components/components/calcite-option";
import { tbmTunnelLayer } from "../layers";

import "@arcgis/map-components/components/arcgis-time-slider";
import { MyContext } from "../contexts/MyContext";
import { use, useEffect } from "react";
import TimeInfo from "@arcgis/core/layers/support/TimeInfo";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import FeatureLayerView from "@arcgis/core/views/layers/FeatureLayerView";

export function yearMonthDay(date: Date) {
  return {
    year: date?.getFullYear() ?? 0,
    month: date?.getMonth() + 1,
    day: date?.getDate(),
  };
}

export default function TimeSlider() {
  const { cpackage, segline, updateLayerView } = use(MyContext); // <-- get the layer from context

  useEffect(() => {
    const arcgisScene: any = document.querySelector("arcgis-scene");

    arcgisScene?.viewOnReady(async () => {
      const timeSlider: any = document.querySelector("arcgis-time-slider");

      await tbmTunnelLayer.load();

      if (!tbmTunnelLayer.timeInfo) {
        tbmTunnelLayer.timeInfo = new TimeInfo({
          startField: "enddate",
          interval: { unit: "days", value: 1 },
        });
      }

      const fullTimeExtent = tbmTunnelLayer.timeInfo?.fullTimeExtent;
      const initialEnd = fullTimeExtent?.start;

      timeSlider.fullTimeExtent = fullTimeExtent;
      timeSlider.timeExtent = { start: null, end: initialEnd };
      timeSlider.stops = { interval: { value: 1, unit: "days" } };

      // Get the LayerView for the tunnel layer on this view
      const layerView = (await arcgisScene.view.whenLayerView(
        tbmTunnelLayer,
      )) as FeatureLayerView;
      updateLayerView(layerView);

      reactiveUtils.watch(
        () => timeSlider?.timeExtent,
        (timeExtent) => {
          if (timeExtent) {
            layerView.filter = new FeatureFilter({ timeExtent });
          }
        },
      );
    });
  }, [cpackage, segline]);

  return (
    <arcgis-time-slider
      style={{
        position: "fixed",
        zIndex: 1,
        width: "40%",
        bottom: "0.75rem",
        left: "0.75rem",
        right: "0.75rem",
        marginLeft: "7%",
      }}
      referenceElement="arcgis-scene"
      layout="compact"
      mode="cumulative-from-start"
    ></arcgis-time-slider>
  );
}
