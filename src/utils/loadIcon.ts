export function load() {
	const linkId = '__load_icon';

	let iconLink = document.querySelector<HTMLLinkElement>(`#${linkId}`);
	if (iconLink) {
		document.head.removeChild(iconLink);
	}
	iconLink = document.createElement('link');
	iconLink.id = linkId;
	iconLink.rel = 'stylesheet';
	iconLink.href = '//at.alicdn.com/t/font_1438568_rh0ig51mjl8.css';
	document.head.appendChild(iconLink);
}

export default {
	load
};
