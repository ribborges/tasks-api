import { CookieOptions } from "express";

const cookieOpt: CookieOptions = {
    path: '/',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: "lax",
    secure: true,
    partitioned: true
}

const clearCookieOpt: CookieOptions = {
    path: '/',
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    partitioned: true
}

export { cookieOpt, clearCookieOpt };