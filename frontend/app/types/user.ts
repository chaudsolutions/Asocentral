export interface UserType {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
}
