import React from 'react';
import SearchInputComponent from '../components/SearchInputComponent';
import { SearchInputProps } from '../typings';
import { callMicroflowWithProgress } from '../utils/mxHelpers';

interface SearchInputSate {
  progressId: number | null;
}

export class Container extends React.Component<
  SearchInputProps,
  SearchInputSate
> {
  state = { progressId: null };

  run = () => {
    this.setState({ progressId: this.showProgress() }, () => {
      this.callMicroflow(this.props.mfToExecute, this.state.progressId);
    });
  };

  change = () => {
    if (!!this.props.mfToExecuteOnChange) {
      this.setState({ progressId: this.showProgress() }, () => {
        this.callMicroflow(
          this.props.mfToExecuteOnChange!,
          this.state.progressId
        );
      });
    }
  };

  showProgress = () => {
    const { showProgressBar, progressBarMessage, isModal } = this.props;
    let progressId: number | null = null;
    if (showProgressBar)
      progressId = mx.ui.showProgress(progressBarMessage, isModal);
    return progressId;
  };

  callMicroflow = (mfName: string, progressId: number | null) => {
    const { targetAttribute, mxObject, mxform, keyword } = this.props;
    mxObject.set(targetAttribute!, keyword);
    callMicroflowWithProgress(mfName, mxObject, mxform, progressId);
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.handleKeywordChange(e.target.value);
  };

  render() {
    const {
      buttonstyle,
      buttonIconClass,
      placeholder,
      tabindex,
      keyword,
    } = this.props;
    return (
      <SearchInputComponent
        run={this.run}
        change={this.change}
        handleInputChange={this.handleInputChange}
        buttonstyle={buttonstyle}
        buttonIconClass={buttonIconClass}
        placeholder={placeholder}
        tabindex={tabindex}
        keyword={keyword}
      />
    );
  }
}
