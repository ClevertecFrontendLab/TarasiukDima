import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '@services/index';
import { useAppDispatch } from '@hooks/index';
import { setToken } from '@redux/user-slice';
import { Button, Checkbox, Form, Input, Row } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { EyeInvisibleOutlined, EyeTwoTone, GooglePlusOutlined } from '@ant-design/icons';
import { UserLayout, Logo } from '@components/index';
import { AuthNavButtons } from './AuthNavButtons';
import { ROUTES_LINKS, TOKEN_AUTH_LOCALSTORAGE } from '@constants/index';
import { setLocalStorageItem, validateEmail, validatePassword } from '@utils/index';

import './auth.scss';

interface IFormFields {
    email: string;
    password: string;
    remember: string;
}

export const AuthPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();

    const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [isEmailError, setIsEmailError] = useState<boolean>(false);
    const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const forgotPasswordHandler = useCallback(() => {
        if (!email || isEmailError) {
            setIsEmailError(true);
            return;
        }

        navigate(ROUTES_LINKS.changePassword);
    }, [email, isEmailError, navigate]);

    const emailChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            const value = event?.target?.value || '';
            const isValidEmail = validateEmail(value);

            setEmail(value);
            setIsEmailError(!isValidEmail);
            setSubmitDisabled(!isValidEmail || isPasswordError);
        },
        [isPasswordError],
    );

    const passwordChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            const value = event?.target?.value || '';
            const isValidPassword = validatePassword(value);

            setIsPasswordError(!isValidPassword);
            setSubmitDisabled(isEmailError || !isValidPassword);
        },
        [isEmailError],
    );

    const rememberChangeHandler = useCallback((event: CheckboxChangeEvent) => {
        const value = !!event?.target?.value || false;
        setRememberMe(value);
    }, []);

    const saveLoginUserData = useCallback(
        (token: string) => {
            dispatch(setToken(token));

            if (rememberMe) {
                setLocalStorageItem(TOKEN_AUTH_LOCALSTORAGE, token);
            }

            navigate(ROUTES_LINKS.home);
        },
        [dispatch, rememberMe, navigate],
    );

    const loginUser = useCallback(
        async (email: string, password: string, remember: boolean) => {
            const loginResult = await login({ email, password });

            console.log('loginResult', loginResult);

            if ('error' in loginResult) {
                navigate(ROUTES_LINKS.resultErrorLogin, {
                    state: {
                        from: 'auth',
                    },
                });

                return;
            }

            const token = loginResult.data?.accessToken || '';

            saveLoginUserData(token);
        },
        [login, navigate, saveLoginUserData],
    );

    const onSubmit = useCallback(
        async (values: IFormFields) => {
            let errorExist = false;

            const email = values.email || '';
            if (!validateEmail(email)) {
                setIsEmailError(true);
                setSubmitDisabled(true);
                errorExist = true;
            }

            const password = values.password || '';
            if (!validatePassword(password)) {
                setIsPasswordError(true);
                setSubmitDisabled(true);
                errorExist = true;
            }

            if (errorExist) {
                return;
            }

            const remember = !!values.remember || false;

            await loginUser(email, password, remember);
        },
        [loginUser],
    );

    const googleLoginHandler = useCallback(async () => {
        console.log('googleLoginHandler');
    }, []);

    return (
        <UserLayout className='form-content' showSpinner={isLoginLoading}>
            <Logo className='content-block__logo' variantIcon='sized' />

            <AuthNavButtons active='auth' />

            <Form
                name='auth'
                initialValues={{ remember: rememberMe }}
                onFinish={onSubmit}
                autoComplete='on'
                size='large'
                // noValidate
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
                >
                    <Input.Password
                        placeholder='Пароль'
                        onChange={passwordChangeHandler}
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                </Form.Item>

                <Row justify='space-between' align='middle'>
                    <Form.Item name='remember' valuePropName='checked' className='remember-item'>
                        <Checkbox onChange={rememberChangeHandler}>Запомнить меня</Checkbox>
                    </Form.Item>

                    <Button
                        onClick={forgotPasswordHandler}
                        type='link'
                        color='primaryColor'
                        className='forgot-btn'
                    >
                        Забыли пароль?
                    </Button>
                </Row>

                <Button htmlType='submit' className='btn form__submit' disabled={submitDisabled}>
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
