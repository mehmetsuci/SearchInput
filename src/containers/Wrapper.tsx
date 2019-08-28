import '../style/style.scss';

import { Container } from './Container';
import React from 'react';
import { SearchInputProps } from '../typings';
import parseStyle from '../utils/parseStyle';

export interface WrapperProps extends SearchInputProps {
  style: string;
  class?: string;
}

interface WrapperStates {
  keyword: string;
}

export class Wrapper extends React.Component<WrapperProps, WrapperStates> {
  constructor(props: WrapperProps) {
    super(props);
    this.state = { keyword: props.keyword };
  }

  componentWillReceiveProps(newProps: SearchInputProps) {
    if (newProps.keyword !== this.state.keyword) {
      this.setState({ keyword: newProps.keyword });
    }
  }

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
      <Container
        {...nextProps}
        handleKeywordChange={this.handleKeywordChange}
        keyword={this.state.keyword}
      />
    );
  }
}
