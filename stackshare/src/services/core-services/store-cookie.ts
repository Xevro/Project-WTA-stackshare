export class StoreCookie {

    setCookie = (name: string, value: string): void => {
        const date = new Date();
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
        document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
    };

    getCookie = (name: string): string => {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length == 2) {
            return parts.pop().split(";").shift();
        }
    };

    deleteCookie = (name: string): void => {
        const date = new Date();
        date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
        document.cookie = name + "=; expires=" + date.toUTCString() + "; path=/";
    };
}
