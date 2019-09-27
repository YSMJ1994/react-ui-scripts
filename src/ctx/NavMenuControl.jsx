import React, {useState} from "react";

const navMenuControl = React.createContext('');

export const Provider = ({children}) => {
	const [activeId, setActiveId] = useState('')
	const P = navMenuControl.Provider
	return <P value={[activeId, setActiveId]}>{children}</P>
}

export default navMenuControl
