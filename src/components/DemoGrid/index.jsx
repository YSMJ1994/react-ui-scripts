import React, {useState} from 'react';
import styles from './style.module.scss';
import arrow_down from '../../assets/svg/arrow_down.svg'
const DemoGrid = ({Comp, title, desc}) => {
	const [showCode, setShowCode] = useState(false)
	return (
		<div className={styles.demoGrid}>
			<div className={styles.compWrap}><Comp/>
				<div className={styles.compTitleBox}>{title}</div>
			</div>
			<div className={styles.descWrap} dangerouslySetInnerHTML={{__html: desc}}/>
			<div className={styles.codeWrap}>
				<div className={styles.codeNav} onClick={() => setShowCode(!showCode)}>
					<img className={styles.codeNavIcon} src={arrow_down} alt="arrow"/>
					<span className={styles.codeNavText}>{showCode ? '隐藏' : '显示'}代码</span>
				</div>
			</div>
		</div>
	);
};

export default DemoGrid;
