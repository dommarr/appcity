import Head from "../components/global/head";
import SearchApp from "../components/search/searchApp";
import { isEqual } from "lodash";
import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "next/router";
import qs from "qs";
import algoliasearch from "algoliasearch/lite";
import { findResultsState } from "react-instantsearch-dom/server";

const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY);

const updateAfter = 700;

const createURL = (state) => `?${qs.stringify(state)}`;

const pathToSearchState = (path) => (path.includes("?") ? qs.parse(path.substring(path.indexOf("?") + 1)) : {});

const searchStateToURL = (searchState) => (searchState ? `${window.location.pathname}?${qs.stringify(searchState)}` : "");

const DEFAULT_PROPS = {
  searchClient,
  indexName: "catalog",
};

class Search extends React.Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    resultsState: PropTypes.object,
    searchState: PropTypes.object,
  };

  state = {
    searchState: this.props.searchState,
    lastRouter: this.props.router,
  };

  static async getInitialProps({ asPath }) {
    const searchState = pathToSearchState(asPath);
    const resultsState = await findResultsState(SearchApp, {
      ...DEFAULT_PROPS,
      searchState,
    });

    return {
      resultsState,
      searchState,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!isEqual(state.lastRouter, props.router)) {
      return {
        searchState: pathToSearchState(props.router.asPath),
        lastRouter: props.router,
      };
    }
    return null;
  }

  onSearchStateChange = (searchState) => {
    clearTimeout(this.debouncedSetState);

    this.debouncedSetState = setTimeout(() => {
      const href = searchStateToURL(searchState);

      this.props.router.push(href, href, {
        shallow: true,
      });
    }, updateAfter);

    this.setState({ searchState });
  };

  render() {
    return (
      <>
        <Head title="Search | AppCity" description="Search for apps to take your business to the next level." url="https://www.appcity.com/search" />
        <SearchApp {...DEFAULT_PROPS} searchState={this.state.searchState} resultsState={this.props.resultsState} onSearchStateChange={this.onSearchStateChange} createURL={createURL} />
      </>
    );
  }
}

export default withRouter(Search);
