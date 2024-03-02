import {
    getCookie,
    getLocalStorageItem,
    removeLocalStorageItem,
    setLocalStorageItem,
} from './storage';

type TStore = {
    [key: string]: string;
};

type TLocalStorage = {
    store: TStore;
};

class LocalStorageMock implements TLocalStorage {
    store: TStore = {};

    constructor() {
        this.store = {};
    }

    clear = jest.fn(() => {
        for (const key in this.store) {
            delete this.store[key];
        }
    });

    getItem = jest.fn((key: string) => {
        return this.store[key];
    });

    setItem = jest.fn((key: string, value: string) => {
        this.store[key] = value;
    });

    removeItem = jest.fn((key: string) => {
        delete this.store[key];
    });
}

describe('Localstorage', () => {
    const localStorageKey = 'test_key';
    const value = 'test_value';
    const saveValue = JSON.stringify(value);
    const mockLocalStorage = new LocalStorageMock();

    beforeAll(() => {
        Object.defineProperty(global, 'localStorage', {
            value: mockLocalStorage,
            writable: false,
        });
    });

    beforeEach(() => {
        localStorage.clear();
    });

    test('test set item', () => {
        expect(mockLocalStorage.store[localStorageKey]).toBeUndefined();

        setLocalStorageItem(localStorageKey, value);

        expect(mockLocalStorage.store[localStorageKey]).toBe(saveValue);
        expect(mockLocalStorage.setItem).toHaveBeenCalled();
        expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(1);
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(localStorageKey, saveValue);
    });

    test('test get not exist key', () => {
        expect(mockLocalStorage.store[localStorageKey]).toBeUndefined();

        const getValue = getLocalStorageItem(localStorageKey);

        expect(getValue).toBe('');
        expect(mockLocalStorage.getItem).toHaveBeenCalled();
        expect(mockLocalStorage.getItem).toHaveBeenCalledTimes(1);
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith(localStorageKey);
    });

    test('test get empty string for wrong value in localstorage', () => {
        mockLocalStorage.store[localStorageKey] = '{]';

        const getValue = getLocalStorageItem(localStorageKey);

        expect(getValue).toBe('');
        expect(mockLocalStorage.getItem).toHaveBeenCalled();
        expect(mockLocalStorage.getItem).toHaveBeenCalledTimes(1);
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith(localStorageKey);
    });

    test('test get key from storage', () => {
        let getValue = getLocalStorageItem(localStorageKey);
        expect(getValue).toBe('');

        setLocalStorageItem(localStorageKey, value);

        expect(mockLocalStorage.store[localStorageKey]).toBe(saveValue);

        getValue = getLocalStorageItem(localStorageKey);
        expect(getValue).toBe(value);

        expect(mockLocalStorage.getItem).toHaveBeenCalled();
        expect(mockLocalStorage.getItem).toHaveBeenCalledTimes(2);
    });

    test('test remove item', () => {
        const key2 = 'test_key_2';

        expect(Object.keys(mockLocalStorage.store).length).toBe(0);

        setLocalStorageItem(localStorageKey, value);
        setLocalStorageItem(key2, value);

        expect(Object.keys(mockLocalStorage.store).length).toBe(2);

        removeLocalStorageItem(localStorageKey);

        expect(mockLocalStorage.removeItem).toHaveBeenCalled();
        expect(Object.keys(mockLocalStorage.store).length).toBe(1);

        removeLocalStorageItem(key2);

        expect(Object.keys(mockLocalStorage.store).length).toBe(0);
        expect(mockLocalStorage.removeItem).toHaveBeenCalledTimes(2);
    });
});

describe('Cookie', () => {
    const key1 = 'test_cookie_1';
    const key2 = 'test_cookie_2';
    const value1 = 'test_value_1';
    const value2 = 'test_value_2';
    const cookie = `${key1}=${value1}; path=/; expires=Tue, 19 Jan 2038 03:14:07 GMT; ${key2}=${value2}; path=/; expires=Tue, 19 Jan 2038 03:14:07 GMT`;

    beforeAll(() => {
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: cookie,
        });
    });

    beforeEach(() => {
        localStorage.clear();
    });

    test('test get exist cookie key', () => {
        const cookie1 = getCookie(key1);
        expect(cookie1).toBe(value1);

        const cookie2 = getCookie(key2);
        expect(cookie2).toBe(value2);
    });

    test('test get not exist cookie key', () => {
        const cookie = getCookie('');
        expect(cookie).toBe('');
    });
});
