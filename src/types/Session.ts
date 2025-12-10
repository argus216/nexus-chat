export type Session = {
    user: {
        _id: string;
        name: string;
        email: string;
        phone: string;
    };
    expires: number;
};
