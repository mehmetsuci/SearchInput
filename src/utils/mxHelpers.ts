export const callMicroflowWithProgress = (
  mfName: string,
  mxObject: mendix.lib.MxObject,
  mxform: mxui.lib.form._FormBase,
  progressId: number | null
) => {
  mx.data.action({
    origin: mxform,
    params: {
      actionname: mfName,
      applyto: 'selection',
      guids: [mxObject.getGuid()],
    },
    callback: function() {
      if (progressId !== null) mx.ui.hideProgress(progressId);
    },
    error: function(error) {
      if (progressId !== null) mx.ui.hideProgress(progressId);
      mx.ui.error(
        mxform.id +
          '\n executeMicroFlow: XAS error executing microflow.\n' +
          error.message
      );
    },
  });
};

export const getValue = (
  attribute: string,
  defaultValue: string | number | boolean,
  mxObject?: mendix.lib.MxObject
) => {
  return mxObject && attribute.trim()
    ? mxObject.get(attribute) || defaultValue
    : defaultValue;
};

export const showProgress = (progressBarMessage: string, isModal: boolean) => {
  return mx.ui.showProgress(progressBarMessage, isModal);
};
