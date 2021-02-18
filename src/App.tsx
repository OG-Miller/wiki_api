import React, { useEffect } from 'react';
import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import SearchResultItem from './SearchResultItem';
import { createNoSubstitutionTemplateLiteral } from 'typescript';

interface dataItem {
	title: String;
	extracts?: String;
	pageid: number;
}

// here we set the component as a React Functional Component
const App: React.FC = () => {
	const [info, setInfo] = useState<dataItem[]>([]);

	// objArr: {
	//   id: string;
	//   title: string;
	// }[];

	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		console.log(info);
		// console.log(info[0].pageid);
	}, [info]);

	const getSearchData = async () => {
		const pageIdSearchUrl = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&pageids=38940`;
		const url = `http://en.wikipedia.org/w/api.php?prop=extracts&exintro&explaintext=true&redirects=1&action=query&list=search&srlimit=5&srsearch=${searchQuery}&utf8=&format=json&origin=*`;
		const pageId = '';
		const searchResponse = await fetch(url);
		const searchData = await searchResponse.json();
		setInfo(searchData.query.search);
		console.log(searchData);
	};

	// const getPageFromId = (id: Number) => {
	// 	const pageUrl = id;
	// 	const pageResponse = await fetch(pageUrl);
	// };

	const handleClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void = e => {
		e.preventDefault();
		getSearchData();
	};

	return (
		<div className='App'>
			{info.map(item => (
				<SearchResultItem key={item.pageid} pageid={item.pageid} title={item.title} />
			))}

			<input className='searchBar' onChange={e => setSearchQuery(e.target.value)} />
			<button onClick={handleClick}>search</button>
			{/* <SearchResultItem title={info[0].title} pageid={info[0].pageid} /> */}
		</div>
	);
};

export default App;
