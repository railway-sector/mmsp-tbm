import { use, useMemo, useState } from "react";
import Select from "react-select";
import "../index.css";
import { dropdownDataObject, initialState } from "../uniqueValues";
import { useQuery } from "@tanstack/react-query";
import { MyContext } from "../contexts/MyContext";

const theme = {
  bg: "#2b2b2b",
  bgDisabled: "#232323",
  border: "#444444",
  borderHover: "#5a5a5a",
  borderFocus: "#6aa9ff",
  text: "#ffffff",
  textMuted: "#9a9a9a",
  optionFocused: "#3a3a3a",
  optionSelected: "#353535",
};

const customStyles = {
  container: (s: any) => ({ ...s, width: "180px" }),
  control: (s: any, { isDisabled, isFocused }: any) => ({
    ...s,
    backgroundColor: isDisabled ? theme.bgDisabled : theme.bg,
    borderColor: isFocused ? theme.borderFocus : theme.border,
    borderRadius: "6px",
    minHeight: "36px",
    boxShadow: "none",
    opacity: isDisabled ? 0.6 : 1,
    "&:hover": {
      borderColor: isFocused ? theme.borderFocus : theme.borderHover,
    },
  }),
  placeholder: (s: any) => ({ ...s, color: theme.textMuted }),
  singleValue: (s: any) => ({ ...s, color: theme.text }),
  input: (s: any) => ({ ...s, color: theme.text }),
  indicatorSeparator: (s: any) => ({ ...s, backgroundColor: theme.border }),
  dropdownIndicator: (s: any) => ({
    ...s,
    color: theme.textMuted,
    "&:hover": { color: theme.text },
  }),
  clearIndicator: (s: any) => ({
    ...s,
    color: theme.textMuted,
    "&:hover": { color: theme.text },
  }),
  menu: (s: any) => ({
    ...s,
    backgroundColor: theme.bg,
    border: `1px solid ${theme.border}`,
    overflow: "hidden",
  }),
  option: (s: any, { isFocused, isSelected }: any) => ({
    ...s,
    backgroundColor: isFocused
      ? theme.optionFocused
      : isSelected
        ? theme.optionSelected
        : theme.bg,
    color: theme.text,
    cursor: "pointer",
  }),
};

export default function DropdownData() {
  const { updateCpackage, updateSegline } = use(MyContext);

  const [cpSelected, setCpSelected] = useState<null | any>(initialState);
  const [lineSelected, setLineSelected] = useState<null | any>(null);

  //--- Initial list
  const { data: cplist } = useQuery<any>({
    queryKey: ["dropdownData"],
    queryFn: async () => {
      return dropdownDataObject;
    },
  });

  //--- Without useMemo, the code above returns and collects [] in memory every time
  //--- the component renders => waster of memory.
  const seglineList = useMemo(() => cpSelected?.field2 ?? [], [cpSelected]);

  //--- Update Contract package
  const handleContractPackageChange = (obj: any) => {
    updateCpackage(obj?.field1 ?? null);
    updateSegline(null);
    setCpSelected(obj);
    setLineSelected(null);
  };

  //--- Update Segment Line
  const handleSegmentLineChange = (obj: any) => {
    updateSegline(obj?.name ?? null);
    setLineSelected(obj);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        margin: "auto",
        gap: "12px",
      }}
    >
      <Select
        placeholder="Select Contract Package"
        value={cpSelected}
        options={Array.isArray(cplist) ? cplist : []}
        onChange={handleContractPackageChange}
        getOptionLabel={(x: any) => x.field1}
        styles={customStyles}
      />
      <br />
      <Select
        placeholder="Select Line"
        value={lineSelected}
        options={seglineList && seglineList}
        onChange={handleSegmentLineChange}
        getOptionLabel={(x: any) => x.name}
        isClearable
        styles={customStyles}
      />
    </div>
  );
}
