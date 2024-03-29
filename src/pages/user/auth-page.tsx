import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GooglePlusOutlined } from '@ant-design/icons';
import { Logo, UserLayout } from '@components/index';
import {
    ERROR_MESSAGES,
    ROUTES_LINKS,
    SERVICE_API_URL,
    STATUS_CODES,
    TOKEN_AUTH_LOCALSTORAGE,
    USER_IDS,
} from '@constants/index';
import { useAppDispatch, useAppSelector } from '@hooks/index';
import { setEmail, setToken } from '@redux/index';
import { useCheckEmailMutation, useLoginMutation } from '@services/index';
import {
    getClearLastRoutePath,
    setLocalStorageItem,
    TPreviousLocations,
    validateEmail,
    validatePassword,
    visiblePasswordRenderIcon,
} from '@utils/index';
import { Button, Checkbox, Form, Input, Row } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { TServerErrorResponse } from 'src/app-types/responses';

import { AuthNavButtons } from './auth-nav-buttons';

import './auth.scss';

type TFormFields = {
    email: string;
    password: string;
    remember: string;
};

export const AuthPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { previousLocations } = useAppSelector((state) => state.router);
    const { email } = useAppSelector((state) => state.auth);

    const [
        loginUser,
        {
            isLoading: isLoginLoading,
            isError: isLoginError,
            isSuccess: isLoginSuccess,
            error: logResponseErrorData,
            data: logResponseData,
        },
    ] = useLoginMutation();

    const [
        checkEmail,
        {
            isLoading: isCheckEmailLoading,
            isError: isErrorCheckEmail,
            isSuccess: isSuccessCheckEmail,
            error: emailErrorData,
        },
    ] = useCheckEmailMutation();

    const [curEmail, setCurEmail] = useState<string>('');
    const [isEmailError, setIsEmailError] = useState<boolean>(false);
    const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    useEffect(() => {
        if (isErrorCheckEmail && emailErrorData) {
            const { status, data } = emailErrorData as TServerErrorResponse;

            if (
                data &&
                data.message === 'Email не найден' &&
                status.toString() === STATUS_CODES.notAuth
            ) {
                navigate(ROUTES_LINKS.resultErrorNoUser, { state: { variantError: 'no-user' } });

                return;
            }

            navigate(ROUTES_LINKS.resultErrorEmail, {
                state: { variantError: 'server' },
            });
        }
    }, [isErrorCheckEmail, emailErrorData, navigate]);

    useEffect(() => {
        if (isSuccessCheckEmail) {
            navigate(ROUTES_LINKS.confirmEmail);
        }
    }, [isSuccessCheckEmail, navigate]);

    useEffect(() => {
        if (!previousLocations || previousLocations.length === 0) {
            return;
        }

        const previousPath = getClearLastRoutePath(previousLocations as TPreviousLocations[]);

        if (previousPath === ROUTES_LINKS.resultErrorEmail && email) {
            checkEmail({ email });
        }
    }, [email, previousLocations, checkEmail]);

    useEffect(() => {
        if (isLoginSuccess && logResponseData && 'accessToken' in logResponseData) {
            const token = logResponseData.accessToken || '';

            if (rememberMe) {
                setLocalStorageItem(TOKEN_AUTH_LOCALSTORAGE, token);
            }

            dispatch(setToken(token));
            navigate(ROUTES_LINKS.home);
        }
    }, [dispatch, rememberMe, isLoginSuccess, navigate, logResponseData]);

    useEffect(() => {
        if (isLoginError && logResponseErrorData) {
            navigate(ROUTES_LINKS.resultErrorLogin);
        }
    }, [isLoginError, navigate, logResponseErrorData]);

    const forgotPasswordHandler = useCallback(() => {
        if (!curEmail || isEmailError) {
            setIsEmailError(true);

            return;
        }

        dispatch(setEmail(curEmail));
        checkEmail({ email: curEmail });
    }, [dispatch, curEmail, checkEmail, isEmailError]);

    const emailChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
        const value = event?.target?.value || '';
        const isValidEmail = validateEmail(value);

        setCurEmail(value);
        setIsEmailError(!isValidEmail);
    }, []);

    const passwordChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            const value = event?.target?.value || '';
            const isValidPassword = validatePassword(value);

            setIsPasswordError(!isValidPassword);
        },
        [],
    );

    const rememberChangeHandler = useCallback((event: CheckboxChangeEvent) => {
        const value = event?.target.checked || false;

        setRememberMe(value);
    }, []);

    const onSubmit = useCallback(
        (values: TFormFields) => {
            let errorExist = false;

            const emailUser = values.email || '';

            if (!validateEmail(emailUser)) {
                setIsEmailError(true);
                errorExist = true;
            }

            const password = values.password || '';

            if (!validatePassword(password)) {
                setIsPasswordError(true);
                errorExist = true;
            }

            if (errorExist) {
                return;
            }

            dispatch(setEmail(emailUser));
            loginUser({ email: emailUser, password });
        },
        [dispatch, loginUser],
    );

    const googleLoginHandler = useCallback(async () => {
        window.location.href = `${SERVICE_API_URL}/auth/google`;
    }, []);

    return (
        <UserLayout className='form-content' showSpinner={isLoginLoading || isCheckEmailLoading}>
            <Logo className='content-block__logo' variantIcon='sized' />

            <AuthNavButtons active='auth' />

            <Form
                name='auth'
                initialValues={{ remember: rememberMe }}
                onFinish={onSubmit}
                autoComplete='on'
                size='large'
            >
                <Form.Item
                    validateStatus={isEmailError ? 'error' : 'success'}
                    className='form__email'
                    name='email'
                    data-test-id={USER_IDS.loginEmail}
                >
                    <Input addonBefore='e-mail:' type='email' onChange={emailChangeHandler} />
                </Form.Item>

                <Form.Item
                    validateStatus={isPasswordError ? 'error' : 'success'}
                    extra={ERROR_MESSAGES.password1Error}
                    name='password'
                >
                    <Input.Password
                        autoComplete=''
                        placeholder='Пароль'
                        onChange={passwordChangeHandler}
                        iconRender={visiblePasswordRenderIcon}
                        data-test-id={USER_IDS.loginPassword}
                    />
                </Form.Item>

                <Row justify='space-between' align='middle'>
                    <Form.Item name='remember' valuePropName='checked' className='remember-item'>
                        <Checkbox
                            onChange={rememberChangeHandler}
                            data-test-id={USER_IDS.loginRemember}
                        >
                            Запомнить меня
                        </Checkbox>
                    </Form.Item>

                    <Button
                        onClick={forgotPasswordHandler}
                        type='link'
                        color='primaryColor'
                        className='forgot-btn'
                        data-test-id={USER_IDS.loginForgot}
                    >
                        Забыли пароль?
                    </Button>
                </Row>

                <Button
                    htmlType='submit'
                    className='btn form__submit'
                    data-test-id={USER_IDS.loginSubmit}
                >
                    Войти
                </Button>
            </Form>

            <Button type='default' className='btn' onClick={googleLoginHandler}>
                <GooglePlusOutlined />
                Регистрация через Google
            </Button>
        </UserLayout>
    );
};
