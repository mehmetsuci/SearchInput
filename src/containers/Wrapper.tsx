import '../style/style.scss';

import { Container } from './Container';
import React from 'react';
import { SearchInputProps } from '../typings';

interface WrapperStates {
  keyword: string;
}

export class Wrapper extends React.Component<SearchInputProps, WrapperStates> {
  constructor(props: SearchInputProps) {
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

    return (
      <Container
        {...this.props}
        handleKeywordChange={this.handleKeywordChange}
        keyword={this.state.keyword}
      />
    );
  }
}
