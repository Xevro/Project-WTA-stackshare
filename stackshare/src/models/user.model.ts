export interface User {
    created_at: string;
    email: string;
    name: string;
    uuid: string;
    username: string;
    password: string;
    passwordConfirm?: string;
}
