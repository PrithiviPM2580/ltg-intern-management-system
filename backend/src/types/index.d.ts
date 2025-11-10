declare global {
  type ErrorDetail = {
    field?: string;
    message?: string;
  };

  type ErrorInfo = {
    type: string;
    details?: ErrorDetail[];
  };

  type APIErrorType = string | ErrorInfo;
}

export {};
