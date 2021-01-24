import {
    InstantSearch,
    // Hits,
    // SearchBox,
    // Pagination,
    Highlight,
    ClearRefinements,
    RefinementList,
    CurrentRefinements,
    Configure,
    connectSearchBox,
    connectHits,
    connectPagination,
    connectRefinementList
  } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import { Transition } from "@headlessui/react"
import { useState } from 'react';
import { Component } from 'react'
import GridContainer from '../components/gridContainer'
import RefinementBlock from '../components/refinementBlock'
// import CustomSearchBox from '../components/searchbox'
const searchClient = algoliasearch('2MSQ1OBQ7T', 'dc7a5fd7ebd0b77ab30f1c0ce9d2334a');
const indexName = "wf_products";

// const SearchApp = () => (
//   <InstantSearch searchClient={searchClient} indexName={indexName}>
//     <SearchBox />
//     <Hits />
//   </InstantSearch>
// );

const SearchBox = ({ currentRefinement, isSearchStalled, refine }) => (
  <>
    <div className="flex-1 px-4 flex justify-between">
      <div className="flex-1 flex">
        <form className="w-full flex md:ml-0" noValidate action="" role="search">
          <label htmlFor="search_field" className="sr-only">Search</label>
          <div className="relative w-full text-gray-400 focus-within:text-gray-600">
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
              {/* Heroicon name: search */}
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            
            <input 
              id="search_field"
              className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
              // placeholder="Search" 
              type="search"
              name="search"
              value={currentRefinement} 
              onChange={event => refine(event.currentTarget.value)}
            />
          </div>
        </form>
      </div>
    </div>

  {/* {isSearchStalled ? 'Loading...' : ''}
    <button onClick={() => refine('')}>Reset query</button> */}
  </>
);

const CustomSearchBox = connectSearchBox(SearchBox);

const Hits = ({ hits }) => (
  <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {hits.map(hit => (
      <li key={hit.objectID} className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
      <div className="flex-1 flex flex-col p-8">
        <img className="w-32 h-32 flex-shrink-0 mx-auto bg-black rounded-full" src={`//logo.clearbit.com/${hit['vendor_logo-link-2']}?size=80`} alt="" />
        <h3 className="mt-6 text-gray-900 text-sm font-medium">Jane Cooper</h3>
        <dl className="mt-1 flex-grow flex flex-col justify-between">
          <dt className="sr-only">Title</dt>
          <dd className="text-gray-500 text-sm">Paradigm Representative</dd>
          <dt className="sr-only">Role</dt>
          <dd className="mt-3">
            <span className="px-2 py-1 text-green-800 text-xs font-medium bg-green-100 rounded-full">Admin</span>
          </dd>
        </dl>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="w-0 flex-1 flex">
            <a href="/" className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500">
              {/* Heroicon name: mail */}
              <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="ml-3">Email</span>
            </a>
          </div>
          <div className="-ml-px w-0 flex-1 flex">
            <a href="/" className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500">
              {/* Heroicon name: phone */}
              <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="ml-3">Call</span>
            </a>
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
              console.log(nbPages)
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





const cRefinementList = ({
  items,
  refine,
  createURL,
}) => (

  <div className="mt-4 sm:mt-0 sm:col-span-2">
    <div className="max-w-lg space-y-2">

    {items.map(item => (

      <div className="relative flex items-start" key={item.label}>
        <div className="flex items-center h-5">
          <input 
            id={item.label}
            name={item.label}
            type="checkbox"
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            onClick={event => {
              event.preventDefault();
              refine(item.value);
              
            }}
          />
        </div>
        <div className="ml-3 text-sm">
          <label 
            htmlFor={item.label}
          >
            <span className="font-medium text-gray-700">{item.label}</span>
            <span className="font-medium text-gray-700">({item.count})</span>
          </label>
        </div>
      </div>

      ))}
    </div>
  </div>

);

const CustomRefinementList = connectRefinementList(cRefinementList);


export default function SearchApp(props){
  const [showSidebar, setShowSidebar] = useState(false)

    return (
      <div id="top" className="h-screen flex overflow-hidden bg-gray-100">
      <InstantSearch indexName={indexName} searchClient={searchClient}>
        <Transition
          className="md:hidden"
          show={showSidebar}
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
                onClick={() => 
                setShowSidebar(false)}>
                  <span className="sr-only">Close sidebar</span>
                  {/* Heroicon name: x */}
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
                <RefinementBlock header="vendors">
                  <RefinementList attribute="vendor_name" />
                </RefinementBlock>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
  <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
    <button className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
    onClick={() => setShowSidebar(true)}>
      <span className="sr-only">Open sidebar</span>
      {/* Heroicon name: menu-alt-2 */}
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    </button>
        <Configure
          // filters="free_shipping:true"
          hitsPerPage={16}
          // analytics={false}
          // enablePersonalization={true}
          // distinct
        />
        <CustomSearchBox />
      </div>
      {/* <div className="relative z-10 flex-shrink-0 flex bg-white shadow px-2 py-1">
        <CurrentRefinements />
      </div>          */}

          <main className="flex-1 relative overflow-y-auto focus:outline-none" tabIndex={0}>
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <CustomHits />
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
    
























      // <div className="ais-InstantSearch">
      //   <h1>React InstantSearch e-commerce demo</h1>
      //   <InstantSearch indexName={indexName} searchClient={searchClient}>
      //     <div className="left-panel">
      //       <ClearRefinements />
      //       <h2>Brands</h2>
      //       <RefinementList attribute="brand" />
      //       <Configure hitsPerPage={8} />
      //     </div>
      //     <div className="right-panel">
      //       <SearchBox />
              
      //       <GridContainer>
      //         <Hits hitComponent={Hit} />
      //       </GridContainer>
      //       <Pagination />
      //     </div>
      //   </InstantSearch>
      // </div>
    );
  }
// }

// export default SearchApp