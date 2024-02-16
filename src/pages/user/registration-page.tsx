import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistrationMutation, IRequestAnswer } from '@services/index';
import { Button, Form, Input } from 'antd';
import { validateEmail, validatePassword } from '@utils/index';
import { EyeInvisibleOutlined, EyeTwoTone, GooglePlusOutlined } from '@ant-design/icons';
import { UserLayout, Logo } from '@components/index';
import { AuthNavButtons } from './AuthNavButtons';
import { ROUTES_LINKS } from '@constants/index';

import './auth.scss';

interface IFormFields {
    email: string;
    password: string;
    password2: string;
}

export const RegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
    const [isEmailError, setIsEmailError] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
    const [isPasswordRepeatError, setIsPasswordRepeatError] = useState<boolean>(false);

    const [
        registrationUser,
        {
            isLoading: isRegistrationLoading,
            isError: isRegistrationError,
            isSuccess: isRegistrationSuccess,
            data: regResponseData,
            error: regResponseErrorData,
        },
    ] = useRegistrationMutation();

    useEffect(() => {
        if (isRegistrationSuccess) {
            navigate(ROUTES_LINKS.resultSuccess, {
                state: regResponseData,
            });
        }
    }, [isRegistrationSuccess, navigate, regResponseData]);

    useEffect(() => {
        if (isRegistrationError) {
            let linkToRedirect = ROUTES_LINKS.resultError;

            if ((regResponseErrorData as IRequestAnswer)?.data?.statusCode === 409) {
                linkToRedirect = ROUTES_LINKS.resultErrorUserExist;
            }

            navigate(linkToRedirect, {
                state: regResponseErrorData,
            });
        }
    }, [isRegistrationError, navigate, regResponseErrorData]);

    const emailChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            const value = event?.target?.value || '';
            const isValidEmail = validateEmail(value);

            setIsEmailError(!isValidEmail);
            setSubmitDisabled(!isValidEmail || isPasswordError || isPasswordRepeatError);
        },
        [isPasswordError, isPasswordRepeatError],
    );

    const passwordChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            const value = event?.target?.value || '';
            const isValidPassword = validatePassword(value);

            setPassword(value);
            setIsPasswordError(!isValidPassword);
            setSubmitDisabled(isEmailError || !isValidPassword || isPasswordRepeatError);
        },
        [isEmailError, isPasswordRepeatError],
    );

    const passwordRepeatChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            const value = event?.target?.value || '';
            setIsPasswordRepeatError(password !== value);
            setSubmitDisabled(isEmailError || isPasswordError || password !== value);
        },
        [password, isEmailError, isPasswordError],
    );

    const onSubmit = async (values: IFormFields) => {
        let errorExist = false;
        const email = values.email || '';
        if (!validateEmail(email)) {
            errorExist = true;
            setIsEmailError(true);
            setSubmitDisabled(true);
        }

        const password = values.password || '';
        if (!validatePassword(password)) {
            errorExist = true;
            setIsPasswordError(true);
            setSubmitDisabled(true);
        }

        const password2 = values.password2 || '';
        if (!password2 || password !== password2) {
            errorExist = true;
            setIsPasswordRepeatError(true);
            setSubmitDisabled(true);
        }

        if (errorExist) {
            return;
        }

        registrationUser({
            email,
            password,
        });
    };

    return (
        <UserLayout className='form-content' showSpinner={isRegistrationLoading}>
            <Logo className='content-block__logo' variantIcon='sized' />

            <AuthNavButtons active='register' />

            <Form
                name='register'
                initialValues={{ remember: true }}
                onFinish={onSubmit}
                autoComplete='on'
                size='large'
                noValidate
            >
                <Form.Item
                    validateStatus={isEmailError ? 'error' : 'success'}
                    className='form__email'
                    name='email'
                >
                    <Input addonBefore='e-mail:' type='email' onChange={emailChangeHandler} />
                </Form.Item>

                <Form.Item
                    validateStatus={isPasswordError ? 'error' : 'success'}
                    extra='Пароль не менее 8 символов, с заглавной буквой и цифрой'
                    name='password'
                    className='password-item'
                >
                    <Input.Password
                        placeholder='Пароль'
                        onChange={passwordChangeHandler}
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                </Form.Item>

                <Form.Item
                    validateStatus={isPasswordRepeatError ? 'error' : 'success'}
                    extra='Пароли не совпадают'
                    name='password2'
                >
                    <Input.Password
                        onChange={passwordRepeatChangeHandler}
                        placeholder='Повторите пароль'
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                </Form.Item>

                <Button htmlType='submit' className='btn form__submit' disabled={submitDisabled}>
                    Войти
                </Button>
            </Form>

            <Button type='default' className='btn'>
                <GooglePlusOutlined />
                Регистрация через Google
            </Button>
        </UserLayout>
    );
};
