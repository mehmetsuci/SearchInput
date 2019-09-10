import classNames from 'classnames';
import React from 'react';

interface SearchInputComponentProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  runSearch: () => void;
  changeSearch: () => void;
  buttonStyle: BootstrapStyle;
  buttonIconClass: string;
  placeholder: string;
  tabIndex: number | undefined;
  keyword: string;
}

const SearchInputComponent = ({
  handleInputChange,
  runSearch,
  changeSearch,
  buttonStyle,
  buttonIconClass,
  placeholder,
  tabIndex,
  keyword,
}: SearchInputComponentProps) => {
  const btnClass = classNames('btn', {
    [`btn-${buttonStyle}`]: !!buttonStyle,
  });
  const btnIconClass = classNames('glyphicon', {
    [`glyphicon-${buttonIconClass}`]: !!buttonIconClass,
  });

  return (
    <div className="input-group searchInput">
      <input
        type="text"
        className="form-control"
        onChange={handleInputChange}
        onBlur={changeSearch}
        onKeyDown={e => {
          if (e.key === 'Enter') runSearch();
        }}
        placeholder={placeholder}
        tabIndex={tabIndex}
        value={keyword}
      />
      <span className="input-group-btn searchInputButton">
        <button
          className={btnClass}
          onClick={runSearch}
          type="button"
          tabIndex={tabIndex}
        >
          <span className={btnIconClass}></span>
        </button>
      </span>
    </div>
  );
};

export default SearchInputComponent;
