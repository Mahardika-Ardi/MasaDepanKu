const CODE_TO_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  CONNECTION_TIMEOUT: 503,
  INTERNAL_SERVER_ERROR: 500,
};

function isZodError(error) {
  return error?.name === "ZodError" || Array.isArray(error?.issues);
}

export function normalizeError(
  error,
  fallbackMessage = "Internal Server Error",
) {
  if (isZodError(error)) {
    return {
      status: 400,
      code: "BAD_REQUEST",
      message: "Validation failed",
      details: error.issues,
    };
  }

  const code = error?.code || "INTERNAL_SERVER_ERROR";
  const status = error?.status || CODE_TO_STATUS[code] || 500;

  return {
    status,
    code,
    message: error?.message || fallbackMessage,
    details: error?.details || null,
  };
}

export function sendError(res, error, fallbackMessage) {
  const normalized = normalizeError(error, fallbackMessage);

  return res.status(normalized.status).json({
    Success: false,
    Message: normalized.message,
    Information: normalized.details,
    Error: normalized.code,
  });
}

export function createError(message, code = "BAD_REQUEST", details = null) {
  const status = CODE_TO_STATUS[code] || 500;
  return { message, code, status, details };
}
