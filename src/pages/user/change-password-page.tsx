import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Checkbox, Form, Input, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import { EyeInvisibleOutlined, EyeTwoTone, GooglePlusOutlined } from '@ant-design/icons';
import { UserLayout } from '@components/index';
import { ROUTES_LINKS } from '@constants/index';

import './auth.scss';

export const ChangePasswordPage: React.FC = () => {
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);

    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <UserLayout className='form-content'>
            <Title className='form-content__title' level={3}>
                Восстановление аккауанта
            </Title>

            <Form
                name='auth'
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete='off'
                size='large'
            >
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
                    rules={[
                        {
                            required: true,
                            message: 'Пароли не совпадают',
                        },
                    ]}
                >
                    <Input.Password
                        placeholder='Повторите пароль'
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                </Form.Item>

                <Button htmlType='submit' className='btn form__submit' disabled={submitDisabled}>
                    Сохранить
                </Button>
            </Form>
        </UserLayout>
    );
};
