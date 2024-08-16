import { rateLimit, Options } from 'express-rate-limit';

const limiterOptions: Partial<Options> = {
	windowMs: 150 * 60 * 1000, // change back to 15
	limit: 150,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
};

const limiter = rateLimit(limiterOptions);

export default limiter;