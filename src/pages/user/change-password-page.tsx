import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserLayout } from '@components/index';
import { ERROR_MESSAGES, ROUTES_LINKS, USER_IDS } from '@constants/index';
import { useAppDispatch, useAppSelector } from '@hooks/index';
import { setPassword } from '@redux/index';
import { useChangePasswordMutation } from '@services/index';
import {
    getClearLastRoutePath,
    TPreviousLocations,
    validatePassword,
    visiblePasswordRenderIcon,
} from '@utils/index';
import { Button, Form, Input } from 'antd';
import Title from 'antd/lib/typography/Title';

import './auth.scss';

type TFormFields = {
    password: string;
    password2: string;
};

export const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { password } = useAppSelector((state) => state.auth);
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

    useEffect(() => {
        if (!previousLocations || previousLocations.length === 0) {
            navigate(ROUTES_LINKS.auth);

            return;
        }

        const previousPath = getClearLastRoutePath(previousLocations as TPreviousLocations[]);

        if (
            !(
                previousPath === ROUTES_LINKS.resultErrorChangePassword ||
                previousPath === ROUTES_LINKS.confirmEmail ||
                previousPath === ROUTES_LINKS.changePassword
            )
        ) {
            navigate(ROUTES_LINKS.auth);
        }
    }, [previousLocations, navigate]);

    useEffect(() => {
        if (isChangePasswordSuccess) {
            navigate(ROUTES_LINKS.resultSuccessChangePassword);
        }
    }, [isChangePasswordSuccess, navigate]);

    useEffect(() => {
        if (isChangePasswordError && changePasswordErrorData) {
            navigate(ROUTES_LINKS.resultErrorChangePassword, {
                state: {
                    variant: 'error',
                },
            });
        }
    }, [isChangePasswordError, navigate, changePasswordErrorData]);

    useEffect(() => {
        const previousPath = getClearLastRoutePath(previousLocations as TPreviousLocations[]);

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

    const onSubmit = (values: TFormFields) => {
        let errorExist = false;

        const password1 = values.password || '';

        if (!validatePassword(password1)) {
            setIsPasswordError(true);
            errorExist = true;
        }

        const password2 = values.password2 || '';

        if (!password2 || password1 !== password2) {
            setIsPasswordRepeatError(true);
            errorExist = true;
        }

        if (errorExist) {
            return;
        }

        changePasswordUser({ password: password1 });
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
                noValidate={true}
            >
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
                        data-test-id={USER_IDS.changePassword}
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
                        data-test-id={USER_IDS.changePassword2}
                    />
                </Form.Item>

                <Button
                    htmlType='submit'
                    className='btn form__submit'
                    data-test-id={USER_IDS.changeSubmitBtn}
                >
                    Сохранить
                </Button>
            </Form>
        </UserLayout>
    );
};
