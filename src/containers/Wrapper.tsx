import '../style/style.scss';

import React from 'react';

import { Widget } from '../@typings';
import { Container } from './Container';

interface WrapperStates {
  keyword: string;
}

export interface WrapperProps extends Widget {
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

export class Wrapper extends React.Component<WrapperProps, WrapperStates> {
  constructor(props: WrapperProps) {
    super(props);
    this.state = { keyword: props.keyword };
  }

  componentWillReceiveProps(newProps: WrapperProps) {
    if (newProps.keyword !== this.state.keyword) {
      this.setState({ keyword: newProps.keyword });
    }
  }

  handleKeywordChange = (newKeyword: string) => {
    this.setState({ keyword: newKeyword });
  };

  render() {
    if (!this.props.mxObject) return <div>Loading...</div>;

    return (
      <Container
        {...this.props}
        handleKeywordChange={this.handleKeywordChange}
        keyword={this.state.keyword}
      />
    );
  }
}
