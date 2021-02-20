import React from 'react';
import './searchResultItem.css';

interface Props {
	title: String | undefined;
	pageid: number;
}

const SearchResultItem: React.FC<Props> = ({ title, pageid }) => {
	return (
		<div className='searchResultItem'>
			<h1>{title}</h1>
			<p>{pageid}</p>
		</div>
	);
};

export default SearchResultItem;
