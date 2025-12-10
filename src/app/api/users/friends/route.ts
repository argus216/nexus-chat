import { apiHandler } from "@/utils/apiHandler";

export const GET = apiHandler(async () => {
    return {
        success: true,
        data: [
            {
                _id: "1",
                name: "John Doe",
                email: "john.doe@example.com",
                phone: "1234567890",
            },
            {
                _id: "2",
                name: "Jane Doe",
                email: "jane.doe@example.com",
                phone: "0987654321",
            },
            {
                _id: "3",
                name: "Lucke Joe Man Doe",
                email: "john.doe@example.com",
                phone: "1234567890",
            },
            {
                _id: "4",
                name: "Jane Pheonuix Alpha",
                email: "jane.doe@example.com",
                phone: "0987654321",
            },
            {
                _id: "5",
                name: "Lucke",
                email: "john.doe@example.com",
                phone: "1234567890",
            },
            {
                _id: "6",
                name: "Jane Doe",
                email: "jane.doe@example.com",
                phone: "0987654321",
            },
            {
                _id: "7",
                name: "John Fixit",
                email: "john.doe@example.com",
                phone: "1234567890",
            },
            {
                _id: "8",
                name: "Jane Doe",
                email: "jane.doe@example.com",
                phone: "0987654321",
            },
        ],
        message: "",
    };
});
