import React from 'react';
import SearchInputComponent from './components/SearchInputComponent';
import styleAsString from './style/style.scss';

interface PreviewProps {
  style: string;
  class: string;
  [key: string]: any;
}

export const preview = ({
  style,
  class: className,
  ...props
}: PreviewProps) => {
  const nextProps = {
    handleInputChange: () => {},
    runSearch: () => {},
    changeSearch: () => {},
    buttonStyle: props.buttonStyle,
    buttonIconClass: props.buttonIconClass,
    placeholder: props.placeholder,
    tabIndex: props.tabIndex,
    keyword: '',
    className: className,
  };

  return <SearchInputComponent {...nextProps} />;
};

export function getPreviewCss() {
  return styleAsString;
}
