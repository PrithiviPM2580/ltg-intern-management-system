// ============================================
//  🔹 Compression Middleware
// ============================================
import zlib from "node:zlib";
import compression from "compression";
import type { Request, Response } from "express";

// ------------------------------------------------------
// 1️⃣ Compression Middleware
// ------------------------------------------------------
const shouldCompress = (req: Request, res: Response): boolean => {
	// Don't compress responses that are already encoded
	if (res.getHeader("Content-Encoding")) return false;

	// Don't compress if the request has 'x-no-compression' header
	if (req.headers["x-no-compression"]) return false;

	// Check the Content-Type header
	const reawContentType = res.getHeader("Content-Type");
	const contentType =
		typeof reawContentType === "string"
			? reawContentType.toLowerCase()
			: Array.isArray(reawContentType)
				? reawContentType.join(";").toLowerCase()
				: "";

	// Skip compression for certain content types
	if (contentType) {
		if (
			contentType.startsWith("image/") ||
			contentType.startsWith("video/") ||
			contentType.startsWith("audio/") ||
			contentType.startsWith("application/zip") ||
			contentType === "application/pdf"
		) {
			return false;
		}
	}

	// Use the default compression filter function
	return compression.filter(req, res);
};

// ------------------------------------------------------
// 2️⃣ Compression Middleware
// ------------------------------------------------------
const compressionMiddleware = compression({
	level: 6,
	threshold: 1024,
	filter: shouldCompress,
	brotli: { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 6 } },
});

export default compressionMiddleware;
