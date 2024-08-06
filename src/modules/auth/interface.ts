import { Token } from "./entity/token.entity";

export interface Tokens {
    accessToken: string,
    refreshToken: Token
}