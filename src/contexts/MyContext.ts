import { createContext } from "react";

type MyDropdownContextType = {
  contractpackages: any;
  segmentlines: any;
  chartPanelwidth: any;
  updateContractpackages: any;
  updateSegmentlines: any;
  updateChartPanelwidth: any;
};

const initialState = {
  contractpackages: undefined,
  segmentlines: undefined,
  chartPanelwidth: undefined,
  updateContractpackages: undefined,
  updateSegmentlines: undefined,
  updateChartPanelwidth: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
