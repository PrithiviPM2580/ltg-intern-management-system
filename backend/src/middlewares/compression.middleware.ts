import zlib from "node:zlib";
import compression from "compression";
import type { Request, Response } from "express";

const shouldCompress = (req: Request, res: Response): boolean => {
	if (res.getHeader("Content-Encoding")) return false;

	if (req.headers["x-no-compression"]) return false;

	const reawContentType = res.getHeader("Content-Type");
	const contentType =
		typeof reawContentType === "string"
			? reawContentType.toLowerCase()
			: Array.isArray(reawContentType)
				? reawContentType.join(";").toLowerCase()
				: "";

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
	return compression.filter(req, res);
};

const compressionMiddleware = compression({
	level: 6,
	threshold: 1024,
	filter: shouldCompress,
	brotli: { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 6 } },
});

export default compressionMiddleware;
