export interface Widget {
  mxform: mxui.lib.form._FormBase;
  mxObject: mendix.lib.MxObject;
  style?: React.CSSProperties | string;
  className?: string;
  tabIndex: number | undefined;
}
