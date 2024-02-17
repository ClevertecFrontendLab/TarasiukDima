import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { setCode } from '@redux/user-slice';
import { useConfirmEmailMutation } from '@services/userApi';
import { useAppDispatch, useAppSelector } from '@hooks/typed-react-redux-hooks';
import { IPreviousLocations, getClearLastRoutePath } from '@utils/index';
import { ResultComponent } from '@components/index';
import VerificationInput from 'react-verification-input';
import { Row } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import { ROUTES_LINKS } from '@constants/index';

import './auth.scss';

export const ConfirmEmailPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { email } = useAppSelector((state) => state.user);
    const { previousLocations } = useAppSelector((state) => state.router);
    const [statusResult, setStatusResult] = useState<'info' | 'error'>('info');
    const [codeItem, setCodeItem] = useState<string>('');
    const [
        confirmEmail,
        { isLoading: isConfirmLoading, isError: isConfirmError, isSuccess: isConfirmSuccess },
    ] = useConfirmEmailMutation();

    // check if previous is not auth page or current page
    useEffect(() => {
        if (!previousLocations || previousLocations.length === 0) {
            navigate(ROUTES_LINKS.auth);
        }

        const previousPath = getClearLastRoutePath(previousLocations as Array<IPreviousLocations>);

        if (!(previousPath === ROUTES_LINKS.auth || previousPath === ROUTES_LINKS.confirmEmail)) {
            navigate(ROUTES_LINKS.auth);
        }
    }, [navigate, previousLocations]);

    // is error confirm
    useEffect(() => {
        if (isConfirmError) {
            setStatusResult('error');
            setCodeItem('');
        }
    }, [isConfirmError]);

    // is success confirm
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
                <>
                    Мы отправили вам на e-mail <span>{email}</span> <br />
                    шестизначный код. Введите его в поле ниже.
                </>
            }
            extra={
                <>
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
                        Не пришло письмо? Проверьте <span className='br'></span>папку Спам.
                    </Paragraph>
                </>
            }
        />
    );
};
