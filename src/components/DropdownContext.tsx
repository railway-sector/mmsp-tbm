import { useState } from "react";
import Select from "react-select";
import "../index.css";
import { dropdownDataObject, defaultList } from "../uniqueValues";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { locationKeys } from "../interfaceKeys";
import type { SelectedLocation } from "../interfaceKeys";

export default function DropdownData() {
  const queryClient = useQueryClient();
  const [cpSelected, setCpSelected] = useState<null | any>(defaultList);
  const [lineSelected, setLineSelected] = useState<null | any>(null);
  const [lineList, setLineList] = useState<null | undefined | any>(
    defaultList.field2,
  );

  const { data: cplist } = useQuery<any>({
    queryKey: ["dropdownData"], // Do not add lotLayer as a dependency. The dropdown list will not be updated properly.
    queryFn: async () => {
      return dropdownDataObject;
    },
    // staleTime: Infinity, // never refetch in the backround on its own.
  });

  function updateDropdownListValues(
    cp_obj_field: SelectedLocation["cpackage"],
    line_obj_field: SelectedLocation["segline"],
  ) {
    return queryClient.setQueryData<SelectedLocation>(locationKeys.selected, {
      cpackage: cp_obj_field,
      segline: line_obj_field,
    });
  }

  // handle change event of the Municipality dropdown
  const handleContractPackageChange = (obj: any) => {
    updateDropdownListValues(obj.field1, undefined);
    setCpSelected(obj);
    setLineList(obj.field2);
    setLineSelected(null);
  };

  // handle change event of the segmentLine dropdown
  const handleSegmentLineChange = (obj: any) => {
    updateDropdownListValues(cpSelected?.field1, obj.name);
    setLineSelected(obj);
  };

  // Style CSS
  const customstyles = {
    option: (styles: any, { isFocused, isSelected }: any) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isFocused
          ? "#999999"
          : isSelected
            ? "#2b2b2b"
            : "#2b2b2b",
        color: "#ffffff",
      };
    },

    control: (defaultStyles: any) => ({
      ...defaultStyles,
      backgroundColor: "#2b2b2b",
      borderColor: "#949494",
      color: "#ffffff",
      touchUi: false,
    }),
    singleValue: (defaultStyles: any) => ({ ...defaultStyles, color: "#fff" }),
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        margin: "auto",
        padding: "5px",
        borderRadius: "5px",
        zIndex: 999,
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: "0.85rem",
          margin: "auto",
          paddingRight: "0.5rem",
        }}
      >
        Contract Package
      </div>

      <Select
        placeholder="Select Contract Package"
        value={cpSelected}
        options={Array.isArray(cplist) ? cplist : []}
        onChange={handleContractPackageChange}
        getOptionLabel={(x: any) => x.field1}
        styles={customstyles}
      />
      <br />
      <div
        style={{
          color: "white",
          fontSize: "0.85rem",
          margin: "auto",
          paddingRight: "0.5rem",
          marginLeft: "15px",
        }}
      >
        Segment Line
      </div>
      <Select
        placeholder="Select Segment Line"
        value={lineSelected}
        options={lineList && lineList}
        onChange={handleSegmentLineChange}
        getOptionLabel={(x: any) => x.name}
        styles={customstyles}
      />
    </div>
  );
}
