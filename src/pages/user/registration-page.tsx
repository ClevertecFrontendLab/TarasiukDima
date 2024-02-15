import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, GooglePlusOutlined } from '@ant-design/icons';
import Logo from '@components/Logo';
import { AuthNavButtons } from './AuthNavButtons';
import { UserContentBlock } from './UserContentBlock';

import './auth.scss';

export const RegistrationPage: React.FC = () => {
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);

    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <UserContentBlock>
            <Logo className='content-block__logo' variantIcon='sized' />

            <AuthNavButtons active='register' />

            <Form
                name='auth'
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete='off'
                size='large'
            >
                <Form.Item name='email' rules={[{ required: true, message: 'Почта невалидная!' }]}>
                    <Input addonBefore='e-mail:' defaultValue='' />
                </Form.Item>

                <Form.Item
                    extra='Пароль не менее 8 символов, с заглавной буквой и цифрой'
                    name='password'
                    rules={[
                        {
                            required: true,
                            message: 'Пароль не менее 8 символов, с заглавной буквой и цифрой!',
                        },
                    ]}
                >
                    <Input.Password
                        placeholder='Пароль'
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                </Form.Item>

                <Form.Item
                    name='password-confirm'
                    tooltip='Пароль не менее 8 символов, с заглавной буквой и цифрой!'
                    rules={[
                        {
                            required: true,
                            message: 'Пароль не менее 8 символов, с заглавной буквой и цифрой!',
                        },
                    ]}
                >
                    <Input.Password
                        placeholder='Пароль'
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                </Form.Item>

                <Button htmlType='submit' className='btn form__submit'>
                    Войти
                </Button>
            </Form>

            <Button type='default' className='btn' disabled={submitDisabled}>
                <GooglePlusOutlined />
                Регистрация через Google
            </Button>
        </UserContentBlock>
    );
};
