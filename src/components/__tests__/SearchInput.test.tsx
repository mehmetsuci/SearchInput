import React from 'react';
import SearchInputComponent from '../SearchInputComponent';
import parseStyle from '../../utils/parseStyle';
import { render } from '@testing-library/react';

describe('SearchInput Component Test Unit', () => {
  it('should render correctly', () => {
    const props = {
      keyword: 'something',
      run: () => {},
      change: () => {},
      handleInputChange: () => {},
      className: 'awsomeClass',
      tabindex: 2,
      style: parseStyle(
        'border-style:solid;border-color:#39c;border-width:5px;'
      ),
    };

    const { container } = render(<SearchInputComponent {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
