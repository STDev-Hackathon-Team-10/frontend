import React, { useState } from "react";

function Autocomplete({ options, onSelect, onChange }) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (event) => {
    const value = event.target.value;
    onChange(value);
    setInputValue(value);

    // 입력 값이 있을 때만 자동 완성 기능 활성화
    if (value) {
      const filteredSuggestions = options.filter((option) =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (option) => {
    setInputValue(option);
    setSuggestions([]);
    setShowSuggestions(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div className="autocomplete-container">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setShowSuggestions(suggestions.length > 0)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // 클릭 처리 위해 잠시 딜레이
      />
      {showSuggestions && (
        <ul className="suggestions-list">
          {suggestions.map((option, index) => (
            <li key={index} onClick={() => handleSelect(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
      <style jsx>{`
        .autocomplete-container {
          position: relative;
          width: 100%; /* 적절한 너비 설정 */
        }

        input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
        }

        .suggestions-list {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background-color: white;
          border: 1px solid #ccc;
          border-top: none;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          z-index: 10;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .suggestions-list li {
          padding: 10px;
          cursor: pointer;
          font-size: 16px;
        }

        .suggestions-list li:hover {
          background-color: #f0f0f0;
        }
      `}</style>
    </div>
  );
}

export default Autocomplete;
