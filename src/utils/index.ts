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
    const existNumber = Boolean(clearPass.match(/[0-9]/));

    if (!existUpper || !existNumber) {
        return false;
    }

    return !clearPass.match(/[^A-Za-z0-9]/);
};
