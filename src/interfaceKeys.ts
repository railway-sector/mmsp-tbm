export interface SelectedLocation {
  cpackage: string | any;
  segline: string | any;
}

export const locationKeys = {
  selected: ["selectedLocation"] as const,
};
