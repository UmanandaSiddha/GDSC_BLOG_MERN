import { rateLimit, Options } from 'express-rate-limit';

const limiterOptions: Partial<Options> = {
	windowMs: 15 * 60 * 1000, // change back to 15
	limit: 1500,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
};

const limiter = rateLimit(limiterOptions);

export default limiter;