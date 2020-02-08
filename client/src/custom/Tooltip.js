import React from 'react';
import { Popup } from 'semantic-ui-react';

const Tooltip = ({ content, children }) => {
	return <Popup inverted content={content} trigger={children} />;
};

export default Tooltip;
