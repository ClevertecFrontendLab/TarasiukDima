import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GooglePlusOutlined } from '@ant-design/icons';
import { Logo, UserLayout } from '@components/index';
import { ERROR_MESSAGES, ROUTES_LINKS, USER_IDS } from '@constants/index';
import { useAppDispatch, useAppSelector } from '@hooks/index';
import { setEmail, setPassword } from '@redux/index';
import { useRegistrationMutation } from '@services/index';
import { validateEmail, validatePassword, visiblePasswordRenderIcon } from '@utils/index';
import { Button, Form, Input } from 'antd';
import { TServerErrorResponse } from 'src/app-types/responses';

import { AuthNavButtons } from './auth-nav-buttons';

import './auth.scss';

type TFormFields = {
    email: string;
    password: string;
    password2: string;
};

export const RegistrationPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { email, password } = useAppSelector((state) => state.auth);
    const { previousLocations } = useAppSelector((state) => state.router);

    const [curPassword, setCurPassword] = useState<string>('');
    const [isEmailError, setIsEmailError] = useState<boolean>(false);
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
        if (isRegistrationSuccess && regResponseData) {
            navigate(ROUTES_LINKS.resultSuccess, {
                state: regResponseData,
            });
        }
    }, [isRegistrationSuccess, navigate, regResponseData]);

    useEffect(() => {
        if (isRegistrationError && regResponseErrorData) {
            let linkToRedirect = ROUTES_LINKS.resultError;

            if ((regResponseErrorData as TServerErrorResponse).status.toString() === '409') {
                linkToRedirect = ROUTES_LINKS.resultErrorUserExist;
            }

            navigate(linkToRedirect, {
                state: {
                    ...(regResponseErrorData as TServerErrorResponse),
                },
            });
        }
    }, [isRegistrationError, navigate, regResponseErrorData]);

    useEffect(() => {
        if (!previousLocations || previousLocations.length === 0) {
            return;
        }

        const previousPath = previousLocations[previousLocations.length - 1].location?.pathname;

        if (previousPath === ROUTES_LINKS.resultError && email && password) {
            registrationUser({
                email,
                password,
            });
        }
    }, [registrationUser, email, password, previousLocations]);

    const emailChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
        const value = event?.target?.value || '';
        const isValidEmail = validateEmail(value);

        setIsEmailError(!isValidEmail);
    }, []);

    const passwordChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            const value = event?.target?.value || '';
            const isValidPassword = validatePassword(value);

            setCurPassword(value);
            setIsPasswordError(!isValidPassword);
        },
        [setCurPassword],
    );

    const passwordRepeatChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            const value = event?.target?.value || '';

            setIsPasswordRepeatError(curPassword !== value);
        },
        [curPassword],
    );

    const onSubmit = (values: TFormFields) => {
        let errorExist = false;
        const emailUser = values.email || '';

        if (!validateEmail(emailUser)) {
            errorExist = true;
            setIsEmailError(true);
        }

        const password1 = values.password || '';

        if (!validatePassword(password1)) {
            errorExist = true;
            setIsPasswordError(true);
        }

        const password2 = values.password2 || '';

        if (!password2 || password1 !== password2) {
            errorExist = true;
            setIsPasswordRepeatError(true);
        }

        if (errorExist) {
            return;
        }

        dispatch(setEmail(emailUser));
        dispatch(setPassword(password1));

        registrationUser({
            email: emailUser,
            password: password1,
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
                noValidate={true}
            >
                <Form.Item
                    validateStatus={isEmailError ? 'error' : 'success'}
                    className='form__email'
                    name='email'
                >
                    <Input
                        addonBefore='e-mail:'
                        type='email'
                        onChange={emailChangeHandler}
                        data-test-id={USER_IDS.registrationEmail}
                    />
                </Form.Item>

                <Form.Item
                    validateStatus={isPasswordError ? 'error' : 'success'}
                    extra={ERROR_MESSAGES.password1Error}
                    name='password'
                    className='password-item'
                >
                    <Input.Password
                        autoComplete=''
                        placeholder='Пароль'
                        onChange={passwordChangeHandler}
                        iconRender={visiblePasswordRenderIcon}
                        data-test-id={USER_IDS.registrationPassword}
                    />
                </Form.Item>

                <Form.Item
                    validateStatus={isPasswordRepeatError ? 'error' : 'success'}
                    extra={ERROR_MESSAGES.password2Error}
                    name='password2'
                >
                    <Input.Password
                        autoComplete=''
                        onChange={passwordRepeatChangeHandler}
                        placeholder='Повторите пароль'
                        iconRender={visiblePasswordRenderIcon}
                        data-test-id={USER_IDS.registrationPassword2}
                    />
                </Form.Item>

                <Button
                    htmlType='submit'
                    className='btn form__submit'
                    data-test-id={USER_IDS.registrationSubmitBtn}
                >
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
