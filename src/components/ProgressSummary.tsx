import { use } from "react";
import { MyContext } from "../contexts/MyContext";
import {
  fieldStatistic,
  makeQuery,
  thousands_separators,
  zoomToLayer,
} from "../query";
import { cp_f, labelColor, segline_f, valueColor } from "../uniqueValues";
import { useQuery } from "@tanstack/react-query";
import { tbm_tunnel_disolved_layer, tbmTunnelLayer } from "../layers";

function ProgressSummary() {
  const { cpackage, segline } = use(MyContext);
  const arcgisScene: any = document.querySelector("arcgis-scene");

  //--- make query
  const q = makeQuery([cpackage, segline], [cp_f, segline_f]);
  const qe = q.queryExpression();

  //--- Calculate statistics
  const { data, isLoading } = useQuery<any>({
    queryKey: [cpackage, segline, tbm_tunnel_disolved_layer],
    queryFn: async () => {
      const stats = await fieldStatistic({ qChart: qe, layer: tbmTunnelLayer });

      return {
        totalr: stats.totalr,
        totalc: stats.totalc,
        totall: stats.totall,
        perc: stats.perc,
      };
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const totalr = data?.totalr ?? 0;
  const totalc = data?.totalc ?? 0;
  const totall = data?.totall ?? 0;
  const perc = data?.perc ?? 0;

  tbm_tunnel_disolved_layer.definitionExpression = qe;
  zoomToLayer(tbm_tunnel_disolved_layer, arcgisScene?.view);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end", // aligns the group to the left
        // border: "1px solid #555", // border color/style here
        width: "400px", // adjust to fit 9% + 14% + 15% + gaps
        marginLeft: "auto",
        marginTop: 0,
        marginRight: 10,
        borderStyle: "solid",
        borderWidth: 0.5,
        borderColor: "#555555",
        borderRadius: "17px",
        whiteSpace: "nowrap",
        backgroundColor: "#2b2b2b",
      }}
    >
      {/* Total Rings */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "25%",
        }}
      >
        <dl style={{ width: "100%", margin: 5, textAlign: "center" }}>
          <dt style={{ color: labelColor, fontSize: "14px" }}>TOTAL RINGS</dt>
          <dd
            style={{
              color: valueColor,
              fontSize: "1.1rem",
              fontWeight: "bold",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: 0,
              opacity: isLoading ? 0 : 1,
            }}
          >
            {thousands_separators(totalr)}
          </dd>
        </dl>
      </div>

      {/* Segmented Rings (% completion) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "36%",
        }}
      >
        <dl style={{ width: "100%", margin: 5, textAlign: "center" }}>
          <dt style={{ color: labelColor, fontSize: "14px" }}>
            SEGMENTED RINGS
          </dt>
          <dd
            style={{
              color: valueColor,
              fontSize: "1.1rem",
              fontWeight: "bold",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: 0,
              opacity: isLoading ? 0 : 1,
            }}
          >
            {thousands_separators(totalc)} ({perc.toFixed(0)}%)
          </dd>
        </dl>
      </div>

      {/* Segmented Length (m) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "40%",
        }}
      >
        <dl style={{ width: "100%", margin: 5, textAlign: "center" }}>
          <dt style={{ color: labelColor, fontSize: "14px" }}>
            SEGMENTED LENGTH
          </dt>
          <dd
            style={{
              color: valueColor,
              fontSize: "1.1rem",
              fontWeight: "bold",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: 0,
              opacity: isLoading ? 0 : 1,
            }}
          >
            {thousands_separators(totall)} m
          </dd>
        </dl>
      </div>
    </div>
  );
}

export default ProgressSummary;
