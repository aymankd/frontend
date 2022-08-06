export type httpResponse<T> = {
  data: T;
  message: string;
  statusCode: number;
};

export type paginationResponse<T> = {
  data: T;
  pagination: {
    total: number;
    page: number;
    limit: number;
    next: number;
    prev: number;
  };
};

export type paginationQuery = {
  page: number;
  limit: number;
};
