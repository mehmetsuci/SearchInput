import { Widget } from '.';

export interface SearchInputProps extends Widget {
  targetAttribute: string;
  mfToExecute: string;
  mfToExecuteOnChange?: string;
  showProgressBar: boolean;
  progressBarMessage?: string;
  isModal: boolean;
  buttonIconClass: string;
  buttonstyle: React.CSSProperties;
  placeholder: string;
  keyword: string;
}
