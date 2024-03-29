import { Fragment, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VerificationInput from 'react-verification-input';
import { ResultComponent } from '@components/index';
import { ROUTES_LINKS } from '@constants/index';
import { useAppDispatch, useAppSelector } from '@hooks/index';
import { setCode } from '@redux/index';
import { useConfirmEmailMutation } from '@services/index';
import { getClearLastRoutePath, TPreviousLocations } from '@utils/index';
import { Row } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import classNames from 'classnames';

import './auth.scss';

export const ConfirmEmailPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { email } = useAppSelector((state) => state.auth);
    const { previousLocations } = useAppSelector((state) => state.router);
    const [statusResult, setStatusResult] = useState<'info' | 'error'>('info');
    const [codeItem, setCodeItem] = useState<string>('');
    const [
        confirmEmail,
        { isLoading: isConfirmLoading, isError: isConfirmError, isSuccess: isConfirmSuccess },
    ] = useConfirmEmailMutation();

    useEffect(() => {
        if (!previousLocations || previousLocations.length === 0) {
            navigate(ROUTES_LINKS.auth);
        }

        const previousPath = getClearLastRoutePath(previousLocations as TPreviousLocations[]);

        if (!(previousPath === ROUTES_LINKS.auth || previousPath === ROUTES_LINKS.confirmEmail)) {
            navigate(ROUTES_LINKS.auth);
        }
    }, [navigate, previousLocations]);

    useEffect(() => {
        if (isConfirmError) {
            setStatusResult('error');
            setCodeItem('');
        }
    }, [isConfirmError]);

    useEffect(() => {
        if (isConfirmSuccess) {
            navigate(ROUTES_LINKS.changePassword);
        }
    }, [isConfirmSuccess, navigate]);

    const onCompleteInputVerification = useCallback(
        (code: string) => {
            confirmEmail({ email, code });
            dispatch(setCode(code));
        },
        [dispatch, confirmEmail, email],
    );
    const onChangeInputVerification = useCallback((code: string) => {
        setCodeItem(code);
    }, []);

    return (
        <ResultComponent
            showSpinner={isConfirmLoading}
            status={statusResult}
            title={
                statusResult === 'info' ? (
                    <Paragraph>
                        Введите код <br />
                        для восстановления аккаунта
                    </Paragraph>
                ) : (
                    <Paragraph>
                        Неверный код. Введите код <br />
                        для восстановления аккаунта
                    </Paragraph>
                )
            }
            subTitle={
                <Fragment>
                    Мы отправили вам на e-mail <span>{email}</span> <br />
                    шестизначный код. Введите его в поле ниже.
                </Fragment>
            }
            extra={
                <Fragment>
                    <Row
                        className={classNames('verification', {
                            error: statusResult === 'error',
                        })}
                    >
                        <VerificationInput
                            value={codeItem}
                            onChange={onChangeInputVerification}
                            onComplete={onCompleteInputVerification}
                            inputProps={{
                                'data-test-id': 'verification-input',
                            }}
                            placeholder=''
                            classNames={{
                                container: 'verification__input',
                                character: 'verification__item',
                                characterInactive: 'inactive',
                                characterSelected: 'selected',
                                characterFilled: 'filled',
                            }}
                        />
                    </Row>

                    <Paragraph>
                        Не пришло письмо? Проверьте <span className='br' />
                        папку Спам.
                    </Paragraph>
                </Fragment>
            }
        />
    );
};
