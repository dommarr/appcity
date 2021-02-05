import {
    InstantSearch,
    SearchBox,
    // Pagination,
    Highlight,
    RangeInput,
    HierarchicalMenu,
    Stats,
    SortBy,
    ClearRefinements,
    RefinementList,
    Configure,
    connectHits,
    connectPagination
  } from 'react-instantsearch-dom';
import { Transition } from "@headlessui/react"
import RefinementBlock from '../components/refinementBlock'
import PropTypes from 'prop-types';

const Hits = ({ hits, monthlyPrice }) => (
  <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {hits.map(hit => (
      <li key={hit.objectID} className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
      <div className="flex-1 flex flex-col p-4">
        <img className="object-contain object-center w-32 h-32 flex-shrink-0 mx-auto rounded-lg" src={hit.logo} alt={`${hit.vendor} logo`} />
        {/* Header Block */}
        <div className="flex flex-col justify-center items-center h-32">
          <h2 className="text-gray-900 text-md font-medium">{hit.product}</h2>
          <h3 className="mt-2 text-gray-500 text-md font-normal">{hit.tier}</h3>
        </div>
        {/* Price Block */}
        <div className="relative h-32">
          <span className="absolute left-0 top-0 text-gray-300 text-xs">Paid monthly</span>
          <div className="flex flex-col justify-center items-center h-5/6 w-full mt-4 border border-gray-100 rounded">
            

            
            {/* Starting Price */}
            {/* Monthly */}
            <div className={`${monthlyPrice ? 'block' : 'hidden'} mb-2`}>
                <h3 className="text-gray-900 text-sm font-medium">{hit.starting_price_monthly}</h3>
                <dl className="mt-0.5 flex-grow flex flex-col justify-between">
                  <dt className="sr-only">Price Paid Monthly</dt>
                  <dd className="text-gray-500 text-xs">{hit.starting_price_unit}</dd>
                </dl>
              </div>
              {/* Yearly */}
              <div className={`${monthlyPrice ? 'hidden' : 'block'} mb-2`}>
                <h3 className="text-gray-900 text-sm font-medium">{hit.starting_price_yearly}</h3>
                  <dl className="mt-0.5 flex-grow flex flex-col justify-between">
                    <dt className="sr-only">Price Paid Yearly</dt>
                    <dd className="text-gray-500 text-xs">{hit.starting_price_unit}</dd>
                  </dl>
              </div>

              {/* Comparison Price */}
              {/* Monthly */}
              <div className={`${monthlyPrice ? 'block' : 'hidden'}`}>
                <h3 className="text-gray-900 text-sm font-medium">{hit.price_pay_monthly}</h3>
                {hit.price_pay_monthly.startsWith('$') &&
                <dl className="mt-0.5 flex-grow flex flex-col justify-between">
                  <dt className="sr-only">Price Paid Monthly</dt>
                  <dd className="text-gray-500 text-xs">{hit.price_unit}</dd>
                </dl>
                }
              </div>
            {/* Yearly */}
              <div className={`${monthlyPrice ? 'hidden' : 'block'}`}>
                <h3 className="text-gray-900 text-sm font-medium">{hit.price_pay_yearly}</h3>
                {hit.price_pay_yearly.startsWith('$') &&
                  <dl className="mt-0.5 flex-grow flex flex-col justify-between">
                    <dt className="sr-only">Price Paid Yearly</dt>
                    <dd className="text-gray-500 text-xs">{hit.price_unit}</dd>
                  </dl>
                }
              </div>
          </div>
 
        </div>

      </div>
    </li>
    ))}
  </ol>
);
  
const CustomHits = connectHits(Hits);

const Pagination = ({ currentRefinement, nbPages, refine, createURL }) => (
  <>
  <div className="-mt-px w-0 flex-1 flex">
      <a href='#top'
        onClick={event => {
          if (currentRefinement === 1) {
          } else {
            event.preventDefault();
            refine(currentRefinement - 1);
          }
        }}
        className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
      >
        {/* Heroicon name: arrow-narrow-left */}
        <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Previous
      </a>
  </div>

  <ul className="hidden md:-mt-px md:flex">
    {new Array(nbPages).fill(null).map((_, index) => {
      const page = index + 1;
      const style = (currentRefinement === page ? 'border-purple text-purple border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium');

      return (
        <li key={index} className={style}>
          <a
            href={createURL(page)}
            // style={style}
            onClick={event => {
              event.preventDefault();
              refine(page);
            }}
          >
            {page}
          </a>
        </li>
      );
    })}
  </ul>

  <div className="-mt-px w-0 flex-1 flex justify-end">
    <a href='#top'
      onClick={event => {
        if (currentRefinement === nbPages) {
        } else {
          event.preventDefault();
          refine(currentRefinement + 1);
        }
      }}
      className="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
      Next
      {/* Heroicon name: arrow-narrow-right */}
      <svg className="ml-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </a>
  </div>
  </>
);
  
const CustomPagination = connectPagination(Pagination);

export default class SearchApp extends React.Component {
  constructor(props) {
    super(props);
    this.flipPrice = this.flipPrice.bind(this)
    this.state = {
      showSidebar: false,
      monthlyPrice: false
    };
  }

  flipPrice() {
    this.setState(!this.state.monthlyPrice)
    console.log(monthlyPrice)
  }

  static propTypes = {
    searchState: PropTypes.object,
    resultsState: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onSearchStateChange: PropTypes.func,
    createURL: PropTypes.func,
    indexName: PropTypes.string,
    searchClient: PropTypes.object,
  };

  render() {
    return (
      <div id="top" className="flex bg-gray-100">
        <InstantSearch
          searchClient={this.props.searchClient}
          resultsState={this.props.resultsState}
          onSearchStateChange={this.props.onSearchStateChange}
          searchState={this.props.searchState}
          createURL={this.props.createURL}
          indexName={this.props.indexName}
          onSearchParameters={this.props.onSearchParameters}
          {...this.props}
        >
          <Transition
            className="md:hidden"
            show={this.state.showSidebar}
          >
            <div className="fixed inset-0 flex z-40">
              <Transition.Child 
                className="fixed inset-0"
                aria-hidden="true"
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
              </Transition.Child>
              <Transition.Child
                className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white"
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => this.setState({ showSidebar: false })}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>

                  </button>
                </div>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <nav className="px-2 space-y-1">
                  <ClearRefinements />
                  <RefinementBlock header="vendors">
                    <RefinementList attribute="vendor_name" />
                  </RefinementBlock>
                  </nav>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 w-14" aria-hidden="true">

              </div>
            </div>
          </Transition>
          
          {/* Static sidebar for desktop */}
          <div className="hidden md:flex md:flex-shrink-0">
            <div className="flex flex-col w-64">
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex flex-col flex-grow border-r border-gray-200 py-2 bg-white overflow-y-auto">
                <div className="flex-grow flex flex-col">
                  <nav className="flex-1 px-2 bg-white space-y-1">
                  {/* <CustomRefinementList attribute="vendor_name" /> */}
                  <ClearRefinements />
                  <Configure hitsPerPage={24} />
                  <RefinementBlock header="Price">
                    <RangeInput 
                      attribute="sort_price_monthly"
                      className={`${this.state.monthlyPrice ? 'block' : 'hidden'}`}
                    />
                    <RangeInput 
                      attribute="sort_price_yearly"
                      className={`${this.state.monthlyPrice ? 'hidden' : 'block'}`}
                    />
                    <div className="flex items-center mt-2">
                      {/* Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" */}
                      <button type="button" className={`${this.state.monthlyPrice ? 'bg-indigo-600' : 'bg-indigo-300'} relative inline-flex flex-shrink-0 h-5 w-10 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-pressed="false" aria-labelledby="annual-billing-label`}
                        onClick={() => this.setState(prevState => ({monthlyPrice: !prevState.monthlyPrice}))}
                      >
                        <span className="sr-only">Use setting</span>
                        {/* Enabled: "translate-x-5", Not Enabled: "translate-x-0" */}
                        <span aria-hidden="true" className={`${this.state.monthlyPrice ? 'translate-x-5' : 'translate-x-0'}  pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
                      </button>
                      <span className="ml-3" id="annual-billing-label">
                        <span className="text-sm font-normal text-gray-900">{this.state.monthlyPrice ? 'Pay monthly' : 'Pay yearly'}</span>
                      </span>
                    </div>
                  </RefinementBlock>
                  <RefinementBlock header="Category">
                    <HierarchicalMenu 
                      attributes={['categories.lvl0', 'categories.lvl1']} 
                      limit={10}
                      showMore
                    />
                  </RefinementBlock>
                  <RefinementBlock header="vendors">
                    <RefinementList
                      attribute="vendor" 
                      limit={10}
                      showMore

                    />
                  </RefinementBlock>
                  
                  {/* <RefinementBlock header="vendors">
                    <RefinementList attribute="vendor" />
                  </RefinementBlock> */}
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-0 flex-1 overflow-hidden">
            <div className="relative z-10 flex-shrink-0 flex h-12 bg-white shadow">
              <button className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                onClick={() => this.setState({ showSidebar: true })}
              >
                <span className="sr-only">Open sidebar</span>
                {/* Heroicon name: menu-alt-2 */}
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>

              <div className="flex-1 px-4 flex justify-between">
                <SearchBox 
                  searchAsYouType={false}
                  submit={
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                    </svg>
                  }
                  reset={
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" clipRule="evenodd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  }
                />
              </div>
            </div>
            <div className="z-10 flex-shrink-0 flex justify-between items-center bg-white shadow px-5 py-0.5">
              {/* <CurrentRefinements /> */}
              <Stats />
              <SortBy 
                defaultRefinement="catalog"
                items={[
                  { label: 'Relevance', value: 'catalog' },
                  { label: 'Price Low to High (pay yearly)', value: 'catalog_price_low_to_high_yearly' },
                  { label: 'Price Low to High (pay monthly)', value: 'catalog_price_low_to_high_monthly' },
                  { label: 'Price High to Low (pay yearly)', value: 'catalog_price_high_to_low_yearly' },
                  { label: 'Price High to Low (pay monthly)', value: 'catalog_price_high_to_low_monthly' },
                ]}
              />
            </div>         
            <main className="flex-1 relative overflow-y-auto focus:outline-none" tabIndex={0}>
              <div className="py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-4">
                  <CustomHits monthlyPrice={this.state.monthlyPrice}/>
                  {/* Pagination */}
                  <nav className="border-t border-gray-200 px-4 mt-6 flex items-center justify-between sm:px-0">
                    <CustomPagination />      
                  </nav>
                </div>
              </div>
            </main>
          </div>

        </InstantSearch>
      </div>
    );
  }
}