import './style/style.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { SearchInputProps } from './@typings';
import { Wrapper } from './containers/Wrapper';
import _widgetBase from 'MxWidgetBase';
import declare from 'dojoBaseDeclare';
import { getValue } from './utils/mxHelpers';
import { widgetName } from '../package.json';

export default declare(`${widgetName}.widget.${widgetName}`, [_widgetBase], {
  constructor() {
    this.subscriptionHandles = [];
    this.keyword = '';
  },
  postCreate() {
    console.debug(`${this.id} >> postCreate`);
  },
  update(contextObject: mendix.lib.MxObject, callback: () => void) {
    console.debug(`${this.id} >> update`);
    this.resetSubscriptions(contextObject);
    this.render(this.params, this.keyword, contextObject, this.domNode);
    callback();
  },
  resetSubscriptions(mxObject: mendix.lib.MxObject) {
    this.subscriptionHandles.forEach(window.mx.data.unsubscribe);
    this.subscriptionHandles = [];
    let self = this;
    if (mxObject) {
      const commonOptions = {
        callback: function() {
          const keyword = getValue(
            self.params.targetAttribute,
            '',
            mxObject
          ) as string;
          if (keyword !== self.keyword) {
            self.keyword = keyword;
            self.render(self.params, self.keyword, mxObject, self.domNode);
          }
        },
        guid: mxObject.getGuid(),
      };
      self.subscriptionHandles = [
        window.mx.data.subscribe(commonOptions),
        window.mx.data.subscribe({
          attr: self.params.targetAttribute,
          ...commonOptions,
        }),
      ];
    }
  },
  render(
    params: SearchInputProps,
    keyword: string,
    mxObject: mendix.lib.MxObject,
    parent: HTMLElement
  ) {
    const props: SearchInputProps = {
      mxform: params.mxform,
      mxObject: mxObject,
      style: params.style as string,
      targetAttribute: params.targetAttribute,
      mfToExecute: params.mfToExecute,
      mfToExecuteOnChange: params.mfToExecuteOnChange,
      showProgressBar: params.showProgressBar,
      progressBarMessage: params.progressBarMessage,
      isModal: params.isModal,
      buttonIconClass: params.buttonIconClass,
      buttonstyle: params.buttonstyle,
      placeholder: params.placeholder,
      keyword: keyword,
      tabindex: parent.tabIndex,
    };
    ReactDOM.render(<Wrapper {...props} />, parent);
  },
});
