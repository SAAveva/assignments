import pino from 'pino';

export const logger = pino(
	pino.destination({
		sync: true,
	}
));


