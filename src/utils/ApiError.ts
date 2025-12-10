export class ApiError extends Error {
    constructor(public message: string, public status: number) {
        super(message);
        this.name = "ApiError";
        this.message = message;
        this.status = status;
    }
}
