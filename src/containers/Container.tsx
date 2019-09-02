import React from 'react';

import { Widget } from '../@typings';
import SearchInputComponent from '../components/SearchInputComponent';
import { callMicroflowWithProgress, showProgress } from '../utils/mxHelpers';

interface ContainerProps extends Widget {
  handleKeywordChange: (e: string) => void;
  targetAttribute: string;
  mfToExecute: string;
  mfToExecuteOnChange?: string;
  showProgressBar: boolean;
  progressBarMessage?: string;
  isModal: boolean;
  buttonIconClass: string;
  buttonStyle: React.CSSProperties;
  placeholder: string;
  keyword: string;
}

const callMicroflow = (
  targetAttribute: string,
  mfName: string,
  keyword: string,
  mxform: mxui.lib.form._FormBase,
  mxObject: mendix.lib.MxObject,
  progressObject: {
    showProgressBar: boolean;
    progressBarMessage: string | undefined;
    isModal: boolean;
  }
) => {
  let progressId: number | null = null;
  if (progressObject.showProgressBar && progressObject.progressBarMessage)
    progressId = showProgress(
      progressObject.progressBarMessage,
      progressObject.isModal
    );
  mxObject.set(targetAttribute, keyword);
  callMicroflowWithProgress(mfName, mxObject, mxform, progressId);
};

export const Container = ({
  handleKeywordChange,
  targetAttribute,
  mfToExecute,
  mfToExecuteOnChange,
  showProgressBar,
  progressBarMessage,
  isModal,
  buttonStyle,
  buttonIconClass,
  placeholder,
  tabIndex,
  keyword,
  mxform,
  mxObject,
}: ContainerProps) => {
  return (
    <SearchInputComponent
      runSearch={() => {
        callMicroflow(targetAttribute, mfToExecute, keyword, mxform, mxObject, {
          showProgressBar,
          progressBarMessage,
          isModal,
        });
      }}
      changeSearch={() => {
        if (!mfToExecuteOnChange) return;
        callMicroflow(
          targetAttribute,
          mfToExecuteOnChange,
          keyword,
          mxform,
          mxObject,
          {
            showProgressBar,
            progressBarMessage,
            isModal,
          }
        );
      }}
      handleInputChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        handleKeywordChange(e.target.value);
      }}
      buttonStyle={buttonStyle}
      buttonIconClass={buttonIconClass}
      placeholder={placeholder}
      tabIndex={tabIndex}
      keyword={keyword}
    />
  );
};
