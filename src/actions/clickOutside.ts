let timeout: NodeJS.Timeout | null = null;

export function clickOutside(
	element: HTMLElement,
	callbackFunction: () => void,
	delay = 1000
): { update(newCallbackFunction: () => void): void; destroy(): void } {
	console.log('click outside');
	timeout = setTimeout(() => {
		console.log('timeout null');
		timeout = null;
	}, delay);

	function onClick(event) {
		console.log('on click');
		if (!element.contains(event.target) && !timeout) {
			callbackFunction();
		}
	}

	document.body.addEventListener('click', onClick);

	return {
		update(newCallbackFunction: () => void) {
			console.log('update');
			callbackFunction = newCallbackFunction;
		},
		destroy() {
			console.log('destroy');
			document.body.removeEventListener('click', onClick);
		}
	};
}
