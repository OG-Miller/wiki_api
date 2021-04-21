import React, { ButtonHTMLAttributes, useEffect } from 'react';
import { useState } from 'react';
import logo from './logo.svg';
import '././scss/App.scss';
import SearchResultItem from './SearchResultItem';
import Article from './Article';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

interface dataObj {
	title: String;
	pageid: number;
	key?: number;
}

interface pageDataObj {
	title: String;
	extract: String | undefined;
}

// here we set the component to a React Functional Component
const App: React.FC = () => {
	const [infoFromSearch, setInfoFromSearch] = useState<dataObj[]>([]);
	const [infoFromPageData, setInfoFromPageData] = useState<pageDataObj>();
	const [showArticle, setShowArticle] = useState<boolean>(false);
	const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState('');

	// check if previous data is in local storage then set state to that data
	useEffect(() => {
		const localSearchData = localStorage.getItem('search-results');
		if (localSearchData) {
			setInfoFromSearch(JSON.parse(localSearchData));
		}
	}, []);

	// set local storage to state
	useEffect(() => {
		localStorage.setItem('search-results', JSON.stringify(infoFromSearch));
	}, [infoFromSearch]);

	// NOTE for testing
	useEffect(() => {
		console.log(showArticle);
	}, [showArticle]);

	const getSearchData = async () => {
		if (searchQuery) {
			const url = `http://en.wikipedia.org/w/api.php?prop=extracts&exintro&explaintext=true&redirects=1&action=query&list=search&srlimit=5&srsearch=${searchQuery}&utf8=&format=json&origin=*`;
			const searchResponse = await fetch(url);
			const searchData = await searchResponse.json();
			setInfoFromSearch(searchData.query.search);
			console.log(searchData);
		}
	};
	// currently this sets everything to hidden, which isn't what we want
	const handleHomeClick: (e: React.MouseEvent<HTMLButtonElement>) => void = e => {
		setInfoFromSearch([]);
		setInfoFromPageData(undefined);
		setShowArticle(false);
		setShowSearchResults(false);
	};

	const handleSearch: (e: React.FormEvent<HTMLFormElement>) => void = e => {
		e.preventDefault();
		getSearchData();
		setSearchQuery('');
		setShowArticle(false);
		setShowSearchResults(true);
	};

	const getPageData = async (id: number) => {
		const chosenPageUrl = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&pageids=${id}&origin=*`;
		const chosenPageResponse = await fetch(chosenPageUrl);
		const chosenPageData = await chosenPageResponse.json();
		const stringId = id;
		setInfoFromPageData(chosenPageData.query.pages[stringId]);
		console.log(chosenPageData.query.pages[stringId]);
	};

	const handleSearchResultClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: number) => {
		e.stopPropagation();
		getPageData(id);
		// setShowSearchResults(false);
		setShowArticle(true);
	};

	return (
		<div className='App'>
			<div className='searchBar__wrapper'>
				<button
					onClick={e => {
						handleHomeClick(e);
					}}
					className='home__button'>
					home
				</button>
				<form className='searchBar' onSubmit={e => handleSearch(e)}>
					<input type='text' value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
					<button className='searchBar__button'>search</button>
				</form>
			</div>
			{showSearchResults && (
				<div className='searchResult_holder'>
					{infoFromSearch.map(item => (
						<div
							key={item.pageid}
							onClick={(e: React.MouseEvent<HTMLDivElement>) =>
								handleSearchResultClick(e, item.pageid)
							}>
							<SearchResultItem pageid={item.pageid} title={item.title} />
						</div>
					))}
				</div>
			)}
			{showArticle && (
				<div className='article_holder'>
					{showArticle && infoFromPageData ? (
						<Article title={infoFromPageData.title} extract={infoFromPageData.extract} />
					) : null}
				</div>
			)}
		</div>
	);
};

export default App;
