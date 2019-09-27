import React, {useContext, useEffect} from 'react'
import {withRouter} from 'react-router-dom'
import navMenuControl from '../ctx/NavMenuControl'

export default function withNavMenuControl(Target, id) {
	return withRouter((props) => {
		const [,setActiveId] = useContext(navMenuControl)
		useEffect(() => {
			setActiveId(id);
		}, [])
		return <Target {...props}/>
	})
}
