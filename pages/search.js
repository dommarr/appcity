import Footer from '../components/footer'
import Header from '../components/header'
import SearchApp from '../components/searchApp'
import { isEqual } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import qs from 'qs';
import algoliasearch from 'algoliasearch/lite';
import { findResultsState } from 'react-instantsearch-dom/server';

const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
);

const updateAfter = 700;

const createURL = state => `?${qs.stringify(state)}`;

const pathToSearchState = path =>
    path.includes('?') ? qs.parse(path.substring(path.indexOf('?') + 1)) : {};

const searchStateToURL = searchState =>
    searchState ? `${window.location.pathname}?${qs.stringify(searchState)}` : '';

const DEFAULT_PROPS = {
    searchClient,
    indexName: 'catalog',
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
        //console.log(asPath)
        const searchState = pathToSearchState(asPath);
        const resultsState = await findResultsState(SearchApp, {
        ...DEFAULT_PROPS,
        searchState,
        });
        //console.log(searchState)

        return {
        resultsState,
        searchState,
        };
    }

    static getDerivedStateFromProps(props, state) {
        //console.log(props.router.asPath)
        console.log(state)
        if (!isEqual(state.lastRouter, props.router)) {
            console.log("not equal")
            return {
                searchState: pathToSearchState(props.router.asPath),
                lastRouter: props.router,
            };
        }
        return null;
    }

    onSearchStateChange = searchState => {
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
            <Header dark='true'/>
            <SearchApp
            {...DEFAULT_PROPS}
            searchState={this.state.searchState}
            resultsState={this.props.resultsState}
            onSearchStateChange={this.onSearchStateChange}
            createURL={createURL}
            />
            <Footer />
        </>
        );
    }
}

export default withRouter(Search);