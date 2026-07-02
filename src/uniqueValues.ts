export type statisticsType = "count" | "sum";

export const cp_field = "Package";
export const line_field = "line";

//-- Dropdown list for contract package and segment line

// dropdown data
const cp101 = ["SG1-NB", "SG1-SB", "SG2-NB", "SG2-SB", "SG3-NB", "SG3-SB"];
const cp102 = ["SG4-NB", "SG4-SB", "SG5-NB", "SG5-SB"];
const cp103 = ["SG6-NB", "SG6-SB", "SG7-NB", "SG7-SB", "SG8-NB", "SG8-SB"];
const cp104 = ["SG9-NB", "SG9-SB", "SG10-NB", "SG10-SB"];
const cp105 = ["SG11-NB", "SG11-SB"];
const cp108 = ["SG12-NB", "SG12-SB", "SG13-NB", "SG13-SB"];

export const cp101_field2 = cp101.map((line: any) => {
  return { name: line };
});

export const cp102_field2 = cp102.map((line: any) => {
  return { name: line };
});

export const cp103_field2 = cp103.map((line: any) => {
  return { name: line };
});

export const cp104_field2 = cp104.map((line: any) => {
  return { name: line };
});

export const cp105_field2 = cp105.map((line: any) => {
  return { name: line };
});

export const cp108_field2 = cp108.map((line: any) => {
  return { name: line };
});

export const defaultList: any = {
  field1: "CP101",
  field2: cp101_field2,
};

export const dropdownDataObject = [
  {
    field1: "CP101",
    field2: cp101_field2,
  },
  {
    field1: "CP102",
    field2: cp102_field2,
  },
  {
    field1: "CP103",
    field2: cp103_field2,
  },
  {
    field1: "CP104",
    field2: cp104_field2,
  },
  {
    field1: "CP105",
    field2: cp105_field2,
  },
  {
    field1: "CP108",
    field2: cp108_field2,
  },
];
