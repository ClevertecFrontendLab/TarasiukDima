import { TOKEN_AUTH_LOCALSTORAGE } from '@constants/index';

const regExpForEmail =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

export const validateEmail = (email: string) => {
    return Boolean(email.match(regExpForEmail));
};

export const validatePassword = (password: string) => {
    const clearPass = password.trim();

    if (clearPass.length < 8) {
        return false;
    }

    const existUpper = Boolean(clearPass.match(/[A-Z]/));
    // const existLower = Boolean(clearPass.match(/[a-z]/));
    const existNumber = Boolean(clearPass.match(/[0-9]/));

    if (!existUpper || !existNumber) {
        return false;
    }

    return !clearPass.match(/[^A-Za-z0-9]/);
};

export const setLocalStorageItem = (key: string, value: unknown) => {
    try {
        const valueToSave = JSON.stringify(value);
        localStorage.setItem(key, valueToSave);
    } catch (error) {
        console.log('Ошибка сохранения в localStorage.', error);
    }
};
export const getLocalStorageItem = (key: string) => {
    try {
        const result = localStorage.getItem(key);
        return result ? result : '';
    } catch (error) {
        return '';
    }
};
export const removeLocalStorageItem = (key: string) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.log('Ошибка удаления из localStorage.', error);
    }
};

export interface IPreviousLocations {
    location: { pathname: string };
}
export const getClearLastRoutePath = (previousLocations: Array<IPreviousLocations>) => {
    if (!previousLocations.length) return '';

    return previousLocations[previousLocations.length - 1].location?.pathname.split('/').join('/');
};

export const getCookie = (key: string) => {
    const nameCookie = key + '=';
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }

        if (c.indexOf(nameCookie) == 0) return c.substring(nameCookie.length, c.length);
    }

    return '';
};
