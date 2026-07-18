export interface LoginResponse {
    username: string;
    roles: string[];
    access_token: string;
    expires_in: number;
    token_type: string;
}