import { render } from '@testing-library/react';
import React from 'react';

import parseStyle from '../../utils/parseStyle';
import SearchInputComponent from '../SearchInputComponent';

describe('SearchInput Component Test Unit', () => {
  it('should render correctly', () => {
    const props = {
      keyword: 'something',
      runSearch: () => {},
      changeSearch: () => {},
      handleInputChange: () => {},
      className: 'awsomeClass',
      tabIndex: 2,
      style: parseStyle(
        'border-style:solid;border-color:#39c;border-width:5px;'
      ),
      buttonStyle: undefined,
      buttonIconClass: '',
      placeholder: '',
    };

    const { container } = render(<SearchInputComponent {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
