import { labelColor, nb_q, sb_q } from "../uniqueValues";

const legendItems = [
  { label: "SB", color: sb_q.hex, direction: "down" as const },
  { label: "NB", color: nb_q.hex, direction: "up" as const },
];

const DirectionLegend = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "row", // items now sit side-by-side
      alignItems: "flex-end",
      justifyContent: "center",
      gap: 16,
      backgroundColor: "#2b2b2b",
      padding: 4,
      width: "60px",
      margin: 3,
      borderStyle: "solid",
      borderWidth: 0.5,
      borderColor: "#555555",
      borderRadius: "17px",
      whiteSpace: "nowrap",
      position: "absolute",
      top: 3,
    }}
  >
    {legendItems.map(({ label, color, direction }) => (
      <div
        key={label}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        {/* Arrow group, built vertically instead of rotated */}
        <div
          style={{
            display: "flex",
            flexDirection: direction === "up" ? "column" : "column-reverse",
            alignItems: "center",
          }}
        >
          {/* Arrowhead (CSS triangle, pointing up or down) */}
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              ...(direction === "up"
                ? { borderBottom: `7px solid ${color}` }
                : { borderTop: `7px solid ${color}` }),
              marginBottom: direction === "up" ? -1 : 0,
              marginTop: direction === "down" ? -1 : 0,
            }}
          />

          {/* Arrow shaft */}
          <div
            style={{
              width: 2,
              height: 20,
              backgroundColor: color,
              marginTop: label === "NB" ? 1 : 5,
            }}
          />

          {/* Dot (tail end) */}
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: color,
              marginTop: 6,
            }}
          />
        </div>

        {/* Label (upright, no rotation needed) */}
        <span
          style={{
            fontSize: 14,
            fontFamily: "calibri",
            color: labelColor,
          }}
        >
          {label}
        </span>
      </div>
    ))}
  </div>
);

export default DirectionLegend;
