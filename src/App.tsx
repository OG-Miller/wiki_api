import React, { useEffect } from 'react';
import { useState } from 'react';
import logo from './logo.svg';
import '././scss/App.scss';
import SearchResultItem from './SearchResultItem';
import Article from './Article';
import { createNoSubstitutionTemplateLiteral } from 'typescript';
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

// here we set the component as a React Functional Component
const App: React.FC = () => {
	const [infoFromSearch, setInfoFromSearch] = useState<dataObj[]>([]);
	const [infoFromPageData, setInfoFromPageData] = useState<pageDataObj>();
	const [showArticle, setShowArticle] = useState<boolean>(false);
	const [showSearchResults, setShowSearchResults] = useState<boolean>(true);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		console.log(infoFromPageData?.title);
	}, [infoFromPageData]);

	useEffect(() => {
		setShowArticle(true);
	}, [infoFromPageData]);

	const getSearchData = async () => {
		const url = `http://en.wikipedia.org/w/api.php?prop=extracts&exintro&explaintext=true&redirects=1&action=query&list=search&srlimit=5&srsearch=${searchQuery}&utf8=&format=json&origin=*`;
		const searchResponse = await fetch(url);
		const searchData = await searchResponse.json();
		setInfoFromSearch(searchData.query.search);
		console.log(searchData);
	};

	const handleSearch: (e: React.FormEvent<HTMLFormElement>) => void = e => {
		e.preventDefault();
		getSearchData();
		setSearchQuery('');
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
		setShowSearchResults(false);
		// setShowArticle(true);
	};

	return (
		<div className='App'>
			<form className='searchBar' onSubmit={e => handleSearch(e)}>
				<input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
				<button>search</button>
			</form>

			{showSearchResults === true
				? infoFromSearch.map(item => (
						<div
							key={item.pageid}
							onClick={(e: React.MouseEvent<HTMLDivElement>) =>
								handleSearchResultClick(e, item.pageid)
							}>
							<SearchResultItem pageid={item.pageid} title={item.title} />
						</div>
				  ))
				: null}

			{infoFromPageData ? (
				<Article title={infoFromPageData.title} extract={infoFromPageData.extract} />
			) : null}
		</div>
	);
};

export default App;
