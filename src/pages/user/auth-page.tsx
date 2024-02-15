import { Button, Checkbox, Col, Form, Input, Row } from 'antd';

import { Logo } from '@components/index';
import { UserContentBlock } from './UserContentBlock';
import { AuthNavButtons } from './AuthNavButtons';

import './auth.scss';
import { EyeInvisibleOutlined, EyeTwoTone, GooglePlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ROUTES_LINKS } from '@constants/index';

export const AuthPage: React.FC = () => {
    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <UserContentBlock>
            <Logo className='content-block__logo' variantIcon='sized' />

            <AuthNavButtons active='auth' />

            <Form
                name='auth'
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete='off'
            >
                <Form.Item
                    name='email'
                    rules={[{ required: true, message: 'Почта невалидная!' }]}
                >
                    <Input addonBefore='e-mail:' defaultValue='' />
                </Form.Item>

                <Form.Item
                    name='password'
                    rules={[{ required: true, message: 'Пароль не менее 8 символов, с заглавной буквой и цифрой!' }]}
                >
                    <Input.Password
                        placeholder='Пароль'
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                </Form.Item>

                <Row justify='space-between' align='middle'>
                    <Form.Item name='remember' valuePropName='checked' className='remember-item'>
                        <Checkbox>Запомнить меня</Checkbox>
                    </Form.Item>

                    <Link to={ROUTES_LINKS.changePassword}>Забыли пароль?</Link>
                </Row>

                <Button htmlType='submit' className='btn form__submit'>
                    Войти
                </Button>
            </Form>

            <Button type='default' className='btn'>
                <GooglePlusOutlined />
                Войти через Google
            </Button>
        </UserContentBlock>
    );
};
