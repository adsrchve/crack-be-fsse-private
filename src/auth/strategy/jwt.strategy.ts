import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Role } from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";

export interface JwtPayload {
    id: string;
    email: string;
    role: Role;
    name: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    return req?.cookies?.accessToken;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'secret',
        });
    }

    async validate(payload: JwtPayload) {
        return {
            userId: payload.id,
            email: payload.email,
            role: payload.role,
            name: payload.name,
        };
    }
}