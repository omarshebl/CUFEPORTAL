export function setCookie(cookieName, cookieValue, expiryDays = 0) {
    const d = new Date();
    d.setTime(d.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
    const expires = "expires="+d.toUTCString();
    document.cookie = `${cookieName}=${cookieValue}; ${expiryDays===0?'':expires} path=/;`;
}

export function getCookie(cookieName) {
    let name = cookieName + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(cookieName.length, c.length);
        }
    }
    return false;
}

export function checkCookie(cookieName) {
    let user = getCookie(cookieName);
    if (user !== false) {
        return true;
    } 
    return false;
}