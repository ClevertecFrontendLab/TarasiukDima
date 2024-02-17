import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@hooks/typed-react-redux-hooks';
import { IPreviousLocations, getClearLastRoutePath, validatePassword } from '@utils/index';
import { Button, Form, Input } from 'antd';
import Title from 'antd/lib/typography/Title';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { UserLayout } from '@components/index';
import { ROUTES_LINKS } from '@constants/index';

import './auth.scss';
import { useChangePasswordMutation } from '@services/userApi';
import { setPassword } from '@redux/user-slice';

interface IFormFields {
    password: string;
    password2: string;
}

export const ChangePasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { password } = useAppSelector((state) => state.user);
    const { previousLocations } = useAppSelector((state) => state.router);

    const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
    const [isPasswordRepeatError, setIsPasswordRepeatError] = useState<boolean>(false);

    const [
        changePasswordUser,
        {
            isLoading: isChangePasswordLoading,
            isSuccess: isChangePasswordSuccess,
            isError: isChangePasswordError,
            error: changePasswordErrorData,
        },
    ] = useChangePasswordMutation();

    // check if previous is not confirm, current or error pages
    useEffect(() => {
        if (!previousLocations || previousLocations.length === 0) {
            navigate(ROUTES_LINKS.auth);
            return;
        }

        const previousPath = getClearLastRoutePath(previousLocations as Array<IPreviousLocations>);

        if (
            !(
                previousPath === ROUTES_LINKS.resultErrorChangePassword ||
                previousPath === ROUTES_LINKS.confirmEmail ||
                previousPath === ROUTES_LINKS.changePassword
            )
        ) {
            navigate(ROUTES_LINKS.auth);
            return;
        }
    }, [previousLocations, navigate]);

    // got success change password
    useEffect(() => {
        if (isChangePasswordSuccess) {
            navigate(ROUTES_LINKS.resultSuccessChangePassword);
        }
    }, [isChangePasswordSuccess, navigate]);

    // get error change password
    useEffect(() => {
        if (isChangePasswordError && changePasswordErrorData) {
            navigate(ROUTES_LINKS.resultErrorChangePassword, {
                state: {
                    variant: 'error',
                },
            });
        }
    }, [isChangePasswordError, navigate, changePasswordErrorData]);

    // got repeat change password
    useEffect(() => {
        const previousPath = getClearLastRoutePath(previousLocations as Array<IPreviousLocations>);

        if (previousPath === ROUTES_LINKS.resultErrorChangePassword && password) {
            changePasswordUser({
                password,
            });
        }
    }, [password, changePasswordUser, previousLocations]);

    const passwordChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            const value = event?.target?.value || '';
            const isValidPassword = validatePassword(value);

            dispatch(setPassword(value));
            setIsPasswordError(!isValidPassword);
        },
        [dispatch],
    );

    const passwordRepeatChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            const value = event?.target?.value || '';

            setIsPasswordRepeatError(password !== value);
        },
        [password],
    );

    const onSubmit = (values: IFormFields) => {
        let errorExist = false;

        const password = values.password || '';
        if (!validatePassword(password)) {
            setIsPasswordError(true);
            errorExist = true;
        }

        const password2 = values.password2 || '';
        if (!password2 || password !== password2) {
            setIsPasswordRepeatError(true);
            errorExist = true;
        }

        if (errorExist) {
            return;
        }

        changePasswordUser({ password });
    };

    return (
        <UserLayout className='form-content' showSpinner={isChangePasswordLoading}>
            <Title className='form-content__title' level={3}>
                Восстановление аккауанта
            </Title>

            <Form
                name='change-password'
                onFinish={onSubmit}
                autoComplete='on'
                size='large'
                noValidate
            >
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
                        data-test-id='change-password'
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
                        data-test-id='change-confirm-password'
                    />
                </Form.Item>

                <Button
                    htmlType='submit'
                    className='btn form__submit'
                    data-test-id='change-submit-button'
                >
                    Сохранить
                </Button>
            </Form>
        </UserLayout>
    );
};
