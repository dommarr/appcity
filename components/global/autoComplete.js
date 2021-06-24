import React, { Component } from "react";
import PropTypes from "prop-types";
import { PencilIcon, SearchIcon } from "@heroicons/react/solid";

export class Autocomplete extends Component {
  static propTypes = {
    options: PropTypes.instanceOf(Array).isRequired,
  };
  state = {
    activeOption: 0,
    filteredOptions: [],
    showOptions: false,
    userInput: "",
  };

  onChange = (e) => {
    console.log("onChanges");

    const { options } = this.props;
    const userInput = e.currentTarget.value;

    const filteredOptions = options.filter((optionName) => optionName.toLowerCase().indexOf(userInput.toLowerCase()) > -1);

    this.setState({
      activeOption: 0,
      filteredOptions,
      showOptions: true,
      userInput: e.currentTarget.value,
    });
  };

  onClick = (e) => {
    this.setState({
      activeOption: 0,
      filteredOptions: [],
      showOptions: false,
      userInput: e.currentTarget.innerText,
    });
  };
  onKeyDown = (e) => {
    const { activeOption, filteredOptions } = this.state;

    if (e.keyCode === 13) {
      this.setState({
        activeOption: 0,
        showOptions: false,
        userInput: filteredOptions[activeOption],
      });
    } else if (e.keyCode === 38) {
      if (activeOption === 0) {
        return;
      }
      this.setState({ activeOption: activeOption - 1 });
    } else if (e.keyCode === 40) {
      if (activeOption === filteredOptions.length - 1) {
        console.log(activeOption);
        return;
      }
      this.setState({ activeOption: activeOption + 1 });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,

      state: { activeOption, filteredOptions, showOptions, userInput },
    } = this;
    let optionList;
    if (showOptions && userInput) {
      if (filteredOptions.length) {
        optionList = (
          <ul className="options border py-4">
            {filteredOptions.map((optionName, index) => {
              let className;
              if (index === activeOption) {
                className = "option-active bg-gray-200 px-2 py-1";
              } else {
                className = "px-2 py-1";
              }
              return (
                <li className={className} key={optionName} onClick={onClick}>
                  {optionName}
                </li>
              );
            })}
          </ul>
        );
      } else {
        optionList = (
          <div className="no-options border py-4 text-md">
            <em className="px-2 py-1">App not found</em>
          </div>
        );
      }
    }
    return (
      <div className="col-span-2 xl:col-span-1">
        <div className="mt-1 flex shadow-sm">
          <div className="relative flex items-stretch flex-grow focus-within:z-10">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="apps"
              id="apps"
              autoComplete="off"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none pl-10 sm:text-md border-gray-300"
              placeholder="Hubspot"
              onChange={onChange}
              onKeyDown={onKeyDown}
              value={userInput}
            />
          </div>
          <button
            className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            onClick={(e) => this.props.buttonClick(userInput)}
          >
            <PencilIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            <span>Edit this app</span>
          </button>
        </div>
        {optionList}
      </div>
    );
  }
}

export default Autocomplete;

// <React.Fragment>
// <div className="search col-span-1">
//   <input type="text" className="search-box" onChange={onChange} onKeyDown={onKeyDown} value={userInput} />
//   <input type="submit" value="" className="search-btn" />
// </div>
// {optionList}
// </React.Fragment>
