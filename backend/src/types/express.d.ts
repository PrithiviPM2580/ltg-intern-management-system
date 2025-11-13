// ============================================
//  🔹 Express Typescript
// ============================================

declare global {
	namespace Express {
		interface Request {
			intern?: TokenPayload;
		}
	}
}

export {};
