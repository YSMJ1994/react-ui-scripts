import React, {CSSProperties, FC} from 'react';
import cs from 'classnames'
import './style.scss'

interface IconProps {
    name: string
    size?: number
    className?: string
    style?: CSSProperties
}

const Icon: FC<IconProps> = ({name = '', size, className, style}) => {
	const calcStyle = {
		...style,
		fontSize: size
	}
	return (
		<i className={cs('cru-icon', 'cru-iconfont', className, `cru-icon-${name}`)} style={calcStyle}/>
	);
};

export default Icon;
