import React from "react";
import Comps from '../../assets/components';

const compsCtx = React.createContext([]);

export const Provider = ({children}) => {
	const P = docsCtx.Provider
	return <P value={Comps}>{children}</P>
}

export default compsCtx
