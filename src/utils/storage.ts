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
