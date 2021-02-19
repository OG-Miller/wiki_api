import React, { useEffect } from 'react';
import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import SearchResultItem from './SearchResultItem';
import { createNoSubstitutionTemplateLiteral } from 'typescript';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

interface dataItem {
	title: String;
	extracts?: String;
	pageid: number;
	key: number;
}

// here we set the component as a React Functional Component
const App: React.FC = () => {
	const [infoFromSearch, setInfoFromSearch] = useState<dataItem[]>([]);
	const [infoFromPage, setInfoFromPage] = useState<dataItem[]>([]);
	const [showArticle, setShowArticle] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState('');

	const getSearchData = async () => {
		const url = `http://en.wikipedia.org/w/api.php?prop=extracts&exintro&explaintext=true&redirects=1&action=query&list=search&srlimit=5&srsearch=${searchQuery}&utf8=&format=json&origin=*`;
		const searchResponse = await fetch(url);
		const searchData = await searchResponse.json();
		setInfoFromSearch(searchData.query.search);
		console.log(searchData);
	};

	const getPageFromId = async (id: number) => {
		const chosenPageUrl = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&pageids=${id}&origin=*`;
		const chosenPageResponse = await fetch(chosenPageUrl);
		const chosenPageData = await chosenPageResponse.json();
		setInfoFromPage(chosenPageData);
		console.log(infoFromPage);
	};

	const handleSearchClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void = e => {
		e.preventDefault();
		getSearchData();
	};

	const handleSearchResultClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: number) => {
		e.stopPropagation();
		getPageFromId(id);
	};

	return (
		<div className='App'>
			<input className='searchBar' onChange={e => setSearchQuery(e.target.value)} />
			<button onClick={handleSearchClick}>search</button>

			{infoFromSearch.map(item => (
				<div
					onClick={(e: React.MouseEvent<HTMLDivElement>) =>
						handleSearchResultClick(e, item.pageid)
					}>
					<SearchResultItem key={item.pageid} pageid={item.pageid} title={item.title} />
				</div>
			))}

			{/* {showArticle && <Article title={''} />} */}
		</div>
	);
};

export default App;
