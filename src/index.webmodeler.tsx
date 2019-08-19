import React from 'react';
import SearchInputComponent from './components/SearchInputComponent';
import parseStyle from './utils/parseStyle';
import styleAsString from './style/style.scss';

/**
 * This file is to define how your widget is shown in
 *  - Studio Pro: Design Mode (Mendix 8) / View Mode (Mendix 7)
 *  - Studio
 *
 * You need to export `preview` as a normal React component.
 * NOTE: it has to be lower-case, named export.
 *
 * It's better that `preview` is only a dumb component,
 * because the whole purpose of this file is to show "HOW IT LOOKS".
 * Smart components might fail to render in some cases.
 *
 * To inject css for your `preview`, export another named function `getPreviewCss`
 * This function should return compiled css as string.
 * We use `@researchgate/babel-plugin-transform-scss-import-to-string`
 * so we can just import our scss as string.
 */

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
  const nextProps = { ...props, className, style: parseStyle(style) };
  return (
    <SearchInputComponent
      {...nextProps}
      run={() => {}}
      change={() => {}}
      handleInputChange={() => {}}
      keyword={''}
    />
  );
};

export function getPreviewCss() {
  return styleAsString;
}
