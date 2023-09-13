import { CSSProperties } from 'react';

export function createItemStyles(offsetTop: number): CSSProperties {
	return {
		position: 'absolute',
		top: 0,
		transform: `translateY(${offsetTop}px)`,
	};
}

export function createContainerStyles(): CSSProperties {
	return {
		position: 'relative',
	};
}
