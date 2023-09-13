import {
	useEffect,
	useLayoutEffect,
	useState,
} from 'react';

interface UseVirtualScrollParams {
	containerHeight: number;
	itemHeight: number;
	itemCount: number;
	getScrollElement: () => HTMLElement | null;
	overScan?: number;
	scrollingDelay?: number;
}

interface VirtualItem {
	index: number;
	offsetTop: number;
}

export function useVirtualScroll(params: UseVirtualScrollParams): [VirtualItem[], boolean] {
	const {
		containerHeight,
		itemHeight,
		itemCount,
		getScrollElement,
		overScan = 3,
		scrollingDelay = 100,
	} = params;

	const [scrollTop, setScrollTop] = useState(0);
	const [isScrolling, setIsScrolling] = useState(false);

	useLayoutEffect(() => {
		const scrollElement = getScrollElement();

		if (scrollElement === null) {
			return;
		}

		const handleScroll = (): void => {
			setScrollTop(scrollElement.scrollTop);
		};

		handleScroll();

		scrollElement.addEventListener('scroll', handleScroll);

		return () => scrollElement.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		const scrollElement = getScrollElement();

		if (scrollElement === null) {
			return;
		}

		let timerId: number | null = null;

		const handleScroll = (): void => {
			setIsScrolling(true);

			if (timerId !== null) {
				clearTimeout(timerId);
			}

			timerId = setTimeout(() => {
				setIsScrolling(false);
			}, scrollingDelay) as unknown as number;
		};

		scrollElement.addEventListener('scroll', handleScroll);

		return () => {
			scrollElement.removeEventListener('scroll', handleScroll);

			if (timerId !== null) {
				clearTimeout(timerId);
			}
		};
	}, []);

	const rangeStart = scrollTop;
	const rangeEnd = scrollTop + containerHeight;

	let startIndex = Math.floor(rangeStart / itemHeight);
	let endIndex = Math.ceil(rangeEnd / itemHeight);

	startIndex = Math.max(0, startIndex - overScan);
	endIndex = Math.min(itemCount - 1, endIndex + overScan);

	const virtualItems: VirtualItem[] = [];

	for (let index = startIndex; index <= endIndex; index++) {
		virtualItems.push({
			index,
			offsetTop: index * itemHeight,
		});
	}

	return [virtualItems, isScrolling];
}
