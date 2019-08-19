import React, { CSSProperties } from 'react';

interface SearchInputComponentProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  run: () => void;
  change: () => void;
  buttonstyle?: React.CSSProperties;
  buttonIconClass?: string;
  placeholder?: string;
  style?: React.CSSProperties | string;
  className?: string;
  tabindex?: number;
  keyword: string;
}

const SearchInputComponent = ({
  handleInputChange,
  run,
  change,
  style,
  buttonstyle,
  buttonIconClass,
  className,
  placeholder,
  tabindex,
  keyword,
}: SearchInputComponentProps) => {
  let btnClass = 'btn';
  if (buttonstyle) btnClass += ' btn-' + buttonstyle;
  let iconClass = 'glyphicon';
  if (buttonIconClass) iconClass += ' glyphicon-' + buttonIconClass;
  let componentClassName = 'searchInput';
  if (className) componentClassName += ' ' + className;

  return (
    <div className={componentClassName} style={style as CSSProperties}>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          onChange={handleInputChange}
          onBlur={change}
          onKeyDown={e => {
            if (e.key === 'Enter') run();
          }}
          placeholder={placeholder}
          tabIndex={tabindex}
          value={keyword}
        />
        <span className="input-group-btn searchInputButton">
          <button
            className={btnClass}
            onClick={run}
            type="button"
            tabIndex={tabindex}
          >
            <span className={iconClass}></span>
          </button>
        </span>
      </div>
    </div>
  );
};

export default SearchInputComponent;
