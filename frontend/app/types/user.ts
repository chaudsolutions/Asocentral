export interface UserType {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
}
