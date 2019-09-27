import React from "react";
import docs from '../../assets/docs';

const docsCtx = React.createContext([]);

export const Provider = ({children}) => {
	const P = docsCtx.Provider
	return <P value={docs}>{children}</P>
}

export default docsCtx
