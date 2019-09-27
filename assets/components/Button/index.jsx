import React from 'react'
import demos from './demo';
import DemoWrap from 'toolSrc/components/DemoWrap';


export default {
	order: 0,
	type: '通用',
	name: 'Button',
	sub: '按钮',
	demos: demos,
	html: '',
	component: () => {
		return (
			<div>
				<h1>123</h1>
				<h1>代码演示</h1>
				<p><DemoWrap list={demos}/></p>
			</div>  
		)
	}
}
