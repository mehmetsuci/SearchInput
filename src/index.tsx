import './style/style.scss';

import React from 'react';
import { SearchInput } from './containers';
import { SearchInputProps } from './typings';
import { getValue } from './utils/mxHelpers';
import parseStyle from './utils/parseStyle';

interface Props extends SearchInputProps {
  style: string;
  class?: string;
}

interface States {
  keyword: string;
}

class wrapper extends React.Component<Props, States> {
  state = { keyword: '' };
  private subscriptionHandles: number[] = [];

  componentWillReceiveProps(newProps: SearchInputProps) {
    this.resetSubscriptions(newProps.mxObject);
  }

  resetSubscriptions = (mxObject?: mendix.lib.MxObject) => {
    this.subscriptionHandles.forEach(window.mx.data.unsubscribe);
    this.subscriptionHandles = [];

    if (mxObject) {
      const commonOptions = {
        callback: this.handleSubscriptions,
        guid: mxObject.getGuid(),
      };
      this.subscriptionHandles = [
        window.mx.data.subscribe(commonOptions),
        window.mx.data.subscribe({
          attr: this.props.targetAttribute,
          ...commonOptions,
        }),
      ];
    }
  };

  handleSubscriptions = () => {
    const keyword = getValue(
      this.props.targetAttribute!,
      '',
      this.props.mxObject
    ) as string;
    if (keyword !== this.state.keyword) {
      this.setState({ keyword });
    }
  };

  handleKeywordChange = (newKeyword: string) => {
    this.setState({ keyword: newKeyword });
  };

  render() {
    if (!this.props.mxObject) return <div>Loading...</div>;

    const nextProps: SearchInputProps = {
      ...this.props,
      className: this.props.class,
      style: parseStyle(this.props.style),
    };

    return (
      <SearchInput
        {...nextProps}
        handleKeywordChange={this.handleKeywordChange}
        keyword={this.state.keyword}
      />
    );
  }
}

export default wrapper;
