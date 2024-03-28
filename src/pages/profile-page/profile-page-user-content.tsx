import { FC, useCallback, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import locale from 'antd/es/locale/ru_RU';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generatePicker from 'antd/es/date-picker/generatePicker';
import { useGetCurrentDayInfo } from '@hooks/index';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Col, ConfigProvider, Form, Input, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import { ProfilePageUpload } from './profile-page-upload';
import { validateEmail, validatePassword } from '@utils/index';
import { DATE_FORMAT_TO_VIEW, PROFILE_IDS } from '@constants/index';
import DateIcon from '@public/img/dateIcon.svg?react';
import { TUserInfoUpdateBody } from '@app_types/index';

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

type TProfilePageUserContentProps = {
    firstName?: string;
    lastName?: string;
    birthday?: string;
    email?: string;
    imgSrc?: string;
    isUpdatingUserInfo?: boolean;
    updateUserInfoCb: (newData: TUserInfoUpdateBody) => void;
};
export const ProfilePageUserContent: FC<TProfilePageUserContentProps> = ({
    firstName = '',
    lastName = '',
    birthday = '',
    email = '',
    imgSrc = '',
    isUpdatingUserInfo = false,
    updateUserInfoCb,
}) => {
    const { getDateForSave } = useGetCurrentDayInfo();

    const [imageUrlForSave, setImageUrlForSave] = useState<string>('');
    const [imageForSaveChanged, setImageForSaveChanged] = useState<boolean>(false);

    const [nameUser, setNameUser] = useState<string>(firstName);
    const [nameUserChanged, setNameUserChanged] = useState<boolean>(false);

    const [lastNameUser, setLastNameUser] = useState<string>(lastName);
    const [lastNameUserChanged, setLastNameUserChanged] = useState<boolean>(false);

    const [birthdayUser, setBirthdayUser] = useState<Dayjs | null>(
        birthday ? dayjs(birthday) : null,
    );
    const [birthdayUserChanged, setBirthdayUserChanged] = useState<boolean>(false);

    const [emailUser, setEmailUser] = useState<string>(email);
    const [emailUserChanged, setEmailUserChanged] = useState<boolean>(false);
    const [isEmailError, setIsEmailError] = useState<boolean>(false);

    const [passwordUser, setPasswordUser] = useState<string>('');
    const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
    const [passwordsChanged, setPasswordsChanged] = useState<boolean>(false);

    const [password2User, setPassword2User] = useState<string>('');
    const [isPasswordRepeatError, setIsPasswordRepeatError] = useState<boolean>(false);

    const isChangedFields = useMemo(() => {
        return (
            nameUserChanged ||
            lastNameUserChanged ||
            birthdayUserChanged ||
            emailUserChanged ||
            imageForSaveChanged ||
            passwordsChanged
        );
    }, [
        nameUserChanged,
        lastNameUserChanged,
        birthdayUserChanged,
        emailUserChanged,
        imageForSaveChanged,
        passwordsChanged,
    ]);

    const disabledSend =
        isEmailError ||
        isPasswordError ||
        isPasswordRepeatError ||
        !isChangedFields ||
        isUpdatingUserInfo;

    const changeImageForSave = useCallback(
        (newSrc: string) => {
            setImageUrlForSave(newSrc);
            setImageForSaveChanged(newSrc !== imgSrc);
        },
        [imgSrc],
    );

    const nameChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            const value = event?.target?.value || '';
            setNameUser(value);
            setNameUserChanged(firstName !== value);
        },
        [firstName],
    );

    const lastNameChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            const value = event?.target?.value || '';
            setLastNameUser(value);
            setLastNameUserChanged(lastName !== value);
        },
        [lastName],
    );

    const birthdayChangeHandler = useCallback(
        (value: Dayjs | null) => {
            setBirthdayUser(value);
            setBirthdayUserChanged(
                dayjs(birthday).format(DATE_FORMAT_TO_VIEW) !== value?.format(DATE_FORMAT_TO_VIEW),
            );
        },
        [birthday],
    );

    const emailChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            const value = event?.target?.value || '';
            const isValidEmail = validateEmail(value);

            setIsEmailError(!isValidEmail);
            setEmailUser(value);
            setEmailUserChanged(email !== value);
        },
        [email],
    );

    const comparePasswords = useCallback((pass1: string, pass2: string) => {
        setIsPasswordRepeatError(pass1 !== pass2);
    }, []);

    const passwordChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            const value = event?.target?.value || '';
            const isValidPassword = validatePassword(value);

            setPasswordUser(value);
            comparePasswords(password2User, value);

            if (!value && !password2User) {
                setPasswordsChanged(false);
                setIsPasswordError(false);
                return;
            }

            setIsPasswordError(!isValidPassword);
            setPasswordsChanged(true);
        },
        [password2User, comparePasswords],
    );

    const passwordRepeatChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            const value = event?.target?.value || '';

            setPasswordsChanged(true);
            setPassword2User(value);
            comparePasswords(passwordUser, value);
        },
        [passwordUser, comparePasswords],
    );

    const sendUserNewData = useCallback(() => {
        const updatedData: TUserInfoUpdateBody = {
            email: emailUser,
        };

        if (imageForSaveChanged) {
            updatedData['imgSrc'] = imageUrlForSave;
        }

        if (nameUserChanged) {
            updatedData['firstName'] = nameUser;
        }

        if (lastNameUserChanged) {
            updatedData['lastName'] = lastNameUser;
        }

        if (birthdayUserChanged) {
            updatedData['birthday'] = getDateForSave(birthdayUser);
        }

        if (emailUserChanged && validateEmail(emailUser)) {
            updatedData['email'] = emailUser;
        }

        if (passwordsChanged && validatePassword(passwordUser)) {
            updatedData['password'] = passwordUser;
        }

        updateUserInfoCb(updatedData);
    }, [
        birthdayUser,
        birthdayUserChanged,
        emailUser,
        emailUserChanged,
        getDateForSave,
        imageForSaveChanged,
        imageUrlForSave,
        lastNameUser,
        lastNameUserChanged,
        nameUser,
        nameUserChanged,
        passwordUser,
        passwordsChanged,
        updateUserInfoCb,
    ]);

    const clearStateAfterSend = useCallback(() => {
        setImageForSaveChanged(false);
        setNameUserChanged(false);
        setLastNameUserChanged(false);
        setBirthdayUserChanged(false);
        setEmailUserChanged(false);
        setPasswordsChanged(false);

        setPasswordUser('');
        setPassword2User('');

        setIsEmailError(false);
        setIsPasswordError(false);
        setIsPasswordRepeatError(false);
    }, []);

    const isNotValidFormItems = useCallback(() => {
        let errorExist = false;

        if (!validateEmail(emailUser)) {
            setIsEmailError(true);
            errorExist = true;
        }

        if (passwordsChanged && !validatePassword(passwordUser)) {
            setIsPasswordError(true);
            errorExist = true;
        }

        return errorExist;
    }, [emailUser, passwordUser, passwordsChanged]);

    const onSubmitForm = useCallback(() => {
        if (isNotValidFormItems()) {
            return;
        }

        sendUserNewData();
        clearStateAfterSend();
    }, [isNotValidFormItems, sendUserNewData, clearStateAfterSend]);

    return (
        <Form
            className='profile-form'
            onFinish={onSubmitForm}
            initialValues={{ email: emailUser ?? '' }}
        >
            <Col className='profile-form__block'>
                <Title level={2} className='profile-form__block_title'>
                    Личная информация
                </Title>

                <Row align='top'>
                    <ProfilePageUpload preview={imgSrc} changeCb={changeImageForSave} />

                    <Col className='user-personal-info'>
                        <Form.Item name='name' className='profile-form_input'>
                            <Input
                                data-test-id={PROFILE_IDS.formFirstName}
                                type='text'
                                value={nameUser}
                                onChange={nameChangeHandler}
                                placeholder='Имя'
                            />
                        </Form.Item>

                        <Form.Item name='last_name' className='profile-form_input'>
                            <Input
                                data-test-id={PROFILE_IDS.formLastName}
                                type='text'
                                value={lastNameUser}
                                onChange={lastNameChangeHandler}
                                placeholder='Фамилия'
                            />
                        </Form.Item>

                        <ConfigProvider locale={locale}>
                            <DatePicker
                                data-test-id={PROFILE_IDS.formBirthday}
                                placeholder='Дата рождения'
                                value={birthdayUser}
                                onChange={birthdayChangeHandler}
                                format={DATE_FORMAT_TO_VIEW}
                                style={{ width: '100%', height: 40 }}
                                suffixIcon={<DateIcon />}
                            />
                        </ConfigProvider>
                    </Col>
                </Row>
            </Col>

            <Col className='profile-form__block'>
                <Title level={2} className='profile-form__block_title'>
                    Приватность и авторизация
                </Title>

                <Form.Item
                    name='email'
                    className='profile-form_email'
                    validateStatus={isEmailError ? 'error' : 'success'}
                >
                    <Input
                        data-test-id={PROFILE_IDS.formEmail}
                        addonBefore='e-mail:'
                        type='email'
                        value={emailUser}
                        onChange={emailChangeHandler}
                    />
                </Form.Item>

                <Form.Item
                    validateStatus={isPasswordError ? 'error' : 'success'}
                    extra='Пароль не менее 8 символов, с заглавной буквой и цифрой'
                    name='password'
                    className='profile-form_password'
                >
                    <Input.Password
                        data-test-id={PROFILE_IDS.formPassword}
                        placeholder='Пароль'
                        value={passwordUser}
                        onChange={passwordChangeHandler}
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                </Form.Item>

                <Form.Item
                    validateStatus={isPasswordRepeatError ? 'error' : 'success'}
                    extra={isPasswordRepeatError ? 'Пароли не совпадают' : ''}
                    name='password2'
                    className='profile-form_password'
                >
                    <Input.Password
                        data-test-id={PROFILE_IDS.formRepeatPassword}
                        value={password2User}
                        onChange={passwordRepeatChangeHandler}
                        placeholder='Повторите пароль'
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                </Form.Item>

                <Button
                    data-test-id={PROFILE_IDS.formSubmit}
                    type='primary'
                    className='button-page profile-form_submit'
                    htmlType='submit'
                    disabled={disabledSend}
                >
                    Сохранить изменения
                </Button>
            </Col>
        </Form>
    );
};
