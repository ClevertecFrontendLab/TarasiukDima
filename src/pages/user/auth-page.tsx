import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@hooks/index';
import { setEmail, setToken } from '@redux/user-slice';
import { IServerErrorResponse, useCheckEmailMutation, useLoginMutation } from '@services/index';
import {
    IPreviousLocations,
    getClearLastRoutePath,
    setLocalStorageItem,
    validateEmail,
    validatePassword,
} from '@utils/index';
import { Button, Checkbox, Form, Input, Row } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { EyeInvisibleOutlined, EyeTwoTone, GooglePlusOutlined } from '@ant-design/icons';
import { UserLayout, Logo } from '@components/index';
import { AuthNavButtons } from './AuthNavButtons';
import { ROUTES_LINKS, SERVICE_API_URL, TOKEN_AUTH_LOCALSTORAGE } from '@constants/index';

import './auth.scss';

interface IFormFields {
    email: string;
    password: string;
    remember: string;
}

export const AuthPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { previousLocations } = useAppSelector((state) => state.router);
    const { email } = useAppSelector((state) => state.user);

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

    // got email check error
    useEffect(() => {
        if (isErrorCheckEmail && emailErrorData) {
            const { status, data } = emailErrorData as IServerErrorResponse;

            if (data && data.message === 'Email не найден' && status.toString() === '404') {
                navigate(ROUTES_LINKS.resultErrorNoUser, { state: { variantError: 'no-user' } });
                return;
            }

            navigate(ROUTES_LINKS.resultErrorEmail, {
                state: { variantError: 'server' },
            });
        }
    }, [isErrorCheckEmail, emailErrorData, navigate]);

    // got email check success
    useEffect(() => {
        if (isSuccessCheckEmail) {
            navigate(ROUTES_LINKS.confirmEmail);
            return;
        }
    }, [isSuccessCheckEmail, navigate]);

    // got repeat check email
    useEffect(() => {
        if (!previousLocations || previousLocations.length === 0) {
            return;
        }

        const previousPath = getClearLastRoutePath(previousLocations as Array<IPreviousLocations>);

        if (previousPath === ROUTES_LINKS.resultErrorEmail && email) {
            checkEmail({ email });
        }
    }, [email, previousLocations, checkEmail]);

    // got success Login
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

    // get error Login
    useEffect(() => {
        if (isLoginError && logResponseErrorData) {
            navigate(ROUTES_LINKS.resultErrorLogin);
            return;
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
        (values: IFormFields) => {
            let errorExist = false;

            const email = values.email || '';
            if (!validateEmail(email)) {
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

            dispatch(setEmail(email));
            loginUser({ email, password });
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
                    data-test-id='login-email'
                >
                    <Input addonBefore='e-mail:' type='email' onChange={emailChangeHandler} />
                </Form.Item>

                <Form.Item
                    validateStatus={isPasswordError ? 'error' : 'success'}
                    extra='Пароль не менее 8 символов, с заглавной буквой и цифрой'
                    name='password'
                >
                    <Input.Password
                        placeholder='Пароль'
                        onChange={passwordChangeHandler}
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                        data-test-id='login-password'
                    />
                </Form.Item>

                <Row justify='space-between' align='middle'>
                    <Form.Item name='remember' valuePropName='checked' className='remember-item'>
                        <Checkbox onChange={rememberChangeHandler} data-test-id='login-remember'>
                            Запомнить меня
                        </Checkbox>
                    </Form.Item>

                    <Button
                        onClick={forgotPasswordHandler}
                        type='link'
                        color='primaryColor'
                        className='forgot-btn'
                        data-test-id='login-forgot-button'
                    >
                        Забыли пароль?
                    </Button>
                </Row>

                <Button
                    htmlType='submit'
                    className='btn form__submit'
                    data-test-id='login-submit-button'
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
