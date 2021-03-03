import { getByTitle } from '@testing-library/react';
import React from 'react';
import './article.scss';

interface Props {
	title: String | undefined;
	extract: String | undefined;
}

const Article: React.FC<Props> = ({ title, extract }) => {
	return (
		<div className='article__wrapper'>
			<h1 className='title'>{title}</h1>
			<div className='extract'>{extract}</div>
		</div>
	);
};

export default Article;
