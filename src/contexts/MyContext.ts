import { createContext } from "react";

type MyDropdownContextType = {
  cpackage: any;
  updateCpackage: any;
  segline: any;
  updateSegline: any;
  layerView: any;
  updateLayerView: any;
};

const initialState = {
  cpackage: undefined,
  updateCpackage: undefined,
  segline: undefined,
  updateSegline: undefined,
  layerView: undefined,
  updateLayerView: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
