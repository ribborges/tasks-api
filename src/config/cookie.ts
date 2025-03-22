import { CookieOptions } from "express";

const cookieOpt: CookieOptions = {
    path: '/',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: "none",
    secure: true
}

const clearCookieOpt: CookieOptions = {
    path: '/',
    httpOnly: true,
    sameSite: "none",
    secure: true
}

export { cookieOpt, clearCookieOpt };