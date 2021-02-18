import React from 'react';
import './searchResultItem.css';

interface Props {
	title: String;
	key: number;
	pageid: number;
}

const SearchResultItem: React.FC<Props> = ({ title, pageid }) => {
	return (
		<div className='searchResultItem'>
			<h1>title: {title}</h1>
			<p>id: {pageid}</p>
		</div>
	);
};

export default SearchResultItem;
