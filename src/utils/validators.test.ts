import { validateEmail, validatePassword } from './validators';

describe('validateEmail', () => {
    const email = '123@mail.com';

    test('get correct email', () => {
        expect(validateEmail(email)).toBeTruthy();
    });

    test('get incorrect email', () => {
        expect(validateEmail('123@123')).toBeFalsy();
    });

    test('get empty email', () => {
        expect(validateEmail('')).toBeFalsy();
    });
});

describe('validatePassword', () => {
    test('with correct password', () => {
        expect(validatePassword('123456As')).toBeTruthy();
    });

    test('with short password', () => {
        expect(validatePassword('123As')).toBeFalsy();
    });

    test('with not allowed symbols', () => {
        expect(validatePassword('123As456@')).toBeFalsy();
    });

    test('with empty password', () => {
        expect(validatePassword('')).toBeFalsy();
    });
});
