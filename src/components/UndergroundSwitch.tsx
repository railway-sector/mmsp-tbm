import "../index.css";
import "@esri/calcite-components/dist/components/calcite-switch";
import { useEffect, useState } from "react";

function UndergroundSwitch() {
  const arcgisScene = document.querySelector("arcgis-scene");
  const [underground, setUnderground] = useState(false);

  useEffect(() => {
    if (arcgisScene?.map?.ground) {
      arcgisScene.map.ground.opacity = underground === true ? 1 : 0.7;
    }
  }, [underground]);

  return (
    <>
      <div
        className="groundSwitchDiv"
        style={{
          position: "fixed",
          zIndex: 10,
          bottom: 5,
          // left: 0,
          color: "white",
          backgroundColor: "#2b2b2b",
          paddingLeft: 5,
          paddingRight: 5,
          paddingTop: 4,
          paddingBottom: 4,
          borderStyle: "solid",
          borderColor: "gray",
        }}
      >
        Ground: {""}
        Off{" "}
        <calcite-switch
          oncalciteSwitchChange={(event: any) =>
            setUnderground(event.target.checked)
          }
        ></calcite-switch>{" "}
        On
      </div>
    </>
  );
}

export default UndergroundSwitch;
