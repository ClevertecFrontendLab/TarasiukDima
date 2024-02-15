import { useCallback, useState } from 'react';
import { useAppSelector } from '@hooks/index';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input, Row } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, GooglePlusOutlined } from '@ant-design/icons';
import { UserLayout, Logo } from '@components/index';
import { AuthNavButtons } from './AuthNavButtons';
import { ROUTES_LINKS } from '@constants/index';
import { validateEmail, validatePassword } from '@utils/index';

import './auth.scss';

interface IFormFields {
    email: string;
    password: string;
    remember: string;
}

export const AuthPage: React.FC = () => {
    const navigate = useNavigate();
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [isEmailError, setIsEmailError] = useState<boolean>(false);

    const [isPasswordError, setIsPasswordError] = useState<boolean>(false);

    const { isAuth } = useAppSelector((state) => state.user);

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

    if (isAuth) {
        return <Navigate to={ROUTES_LINKS.home} replace={true} />;
    }

    const onSubmit = (values: IFormFields) => {
        const email = values.email || '';
        if (!validateEmail(email)) {
            setIsEmailError(true);
            setSubmitDisabled(true);
            return;
        }

        const password = values.password || '';
        if (!validatePassword(password)) {
            setIsPasswordError(true);
            setSubmitDisabled(true);
            return;
        }
        const remember = values.remember || false;

        console.log('Success:', values);
    };

    return (
        <UserLayout className='form-content'>
            <Logo className='content-block__logo' variantIcon='sized' />

            <AuthNavButtons active='auth' />

            <Form
                name='auth'
                initialValues={{ remember: true }}
                onFinish={onSubmit}
                autoComplete='off'
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

                <Row justify='space-between' align='middle'>
                    <Form.Item name='remember' valuePropName='checked' className='remember-item'>
                        <Checkbox>Запомнить меня</Checkbox>
                    </Form.Item>

                    <Button onClick={forgotPasswordHandler} type='link' color='primaryColor'>
                        Забыли пароль?
                    </Button>
                </Row>

                <Button htmlType='submit' className='btn form__submit' disabled={submitDisabled}>
                    Войти
                </Button>
            </Form>

            <Button type='default' className='btn'>
                <GooglePlusOutlined />
                Регистрация через Google
            </Button>

            {/* <Spin size="large" /> */}
        </UserLayout>
    );
};
