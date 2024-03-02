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
        return result ? JSON.parse(result) : '';
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

const getCookieValueIfCorrectKey = (key: string, cookieLine: string) => {
    const lineCookie = cookieLine.trim();

    if (lineCookie.indexOf(key) === 0) {
        return lineCookie.substring(key.length, lineCookie.length);
    }

    return '';
};

export const getCookie = (key: string) => {
    const nameCookie = key + '=';
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const valueCookie = getCookieValueIfCorrectKey(nameCookie, cookies[i]);

        if (valueCookie) {
            return valueCookie;
        }
    }

    return '';
};
