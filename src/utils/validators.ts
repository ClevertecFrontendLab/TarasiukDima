import { MIN_LENGTH_PASSWORD } from '@constants/index';

const regExpForEmail =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

export const validateEmail = (email: string) => regExpForEmail.test(email);

export const validatePassword = (password: string) => {
    const clearPass = password.trim();

    if (clearPass.length < MIN_LENGTH_PASSWORD) {
        return false;
    }

    const existUpper = /[A-Z]/.test(clearPass);
    const existLower = /[a-z]/.test(clearPass);
    const existNumber = /[0-9]/.test(clearPass);

    if (!existUpper || !existNumber || !existLower) {
        return false;
    }

    return !clearPass.match(/[^A-Za-z0-9]/);
};
