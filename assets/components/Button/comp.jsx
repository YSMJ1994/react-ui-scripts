import React from 'react';
import DemoWrap from "toolSrc/components/DemoWrap";

export default ({demos}) => (<article><h1>Button 按钮</h1>
<p>按钮用于开始一个即时操作。</p>
<h2 id="何时使用">何时使用 <a className="header-anchor" href="#何时使用" aria-hidden="true">#</a></h2>
<p>标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。</p>
<h2 id="代码演示">代码演示 <a className="header-anchor" href="#代码演示" aria-hidden="true">#</a></h2>
<DemoWrap list={demos}/>
<h2 id="api">API <a className="header-anchor" href="#api" aria-hidden="true">#</a></h2>
<p>通过设置 Button 的属性来产生不同的按钮样式，推荐顺序为：<code>type</code> -&gt; <code>fill</code> -&gt; <code>size</code> -&gt; <code>loading</code> -&gt; <code>disabled</code> 。</p>
<p>按钮的属性说明如下：</p>
<table>
<thead>
<tr>
<th>属性</th>
<th>说明</th>
<th>类型</th>
<th>默认值</th>
<th>版本</th>
</tr>
</thead>
<tbody>
<tr>
<td>disabled</td>
<td>按钮失效状态</td>
<td><strong>boolean</strong></td>
<td><code>false</code></td>
<td></td>
</tr>
<tr>
<td>fill</td>
<td>设置按钮填充状态</td>
<td><strong>boolean</strong></td>
<td><code>false</code></td>
<td></td>
</tr>
<tr>
<td>loading</td>
<td>设置按钮载入状态</td>
<td><strong>boolean</strong></td>
<td><code>false</code></td>
<td></td>
</tr>
<tr>
<td>size</td>
<td>设置按钮大小，可选值为<code>default</code> <code>large</code> <code>small</code>或者不设</td>
<td><strong>string</strong></td>
<td><code>default</code></td>
<td></td>
</tr>
<tr>
<td>todo…</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
</tbody>
</table>
</article>);
