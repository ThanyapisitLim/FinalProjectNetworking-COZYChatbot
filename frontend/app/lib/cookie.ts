import Cookies from "js-cookie";

export function setCookie(token: string) {
    Cookies.set("token", token, { expires: 1 })
}

export function getCookie(name: string) {
    return Cookies.get(name)
}

export function deleteCookie(name: string) {
    Cookies.remove(name)
}