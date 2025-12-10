export type APISuccess<T = any> = {
    success: true;
    data: T;
    message: string;
};

export type APIError = {
    success: false;
    error: string;
    status?: number;
};

export type APIResponse<T = any> = APISuccess<T> | APIError;
