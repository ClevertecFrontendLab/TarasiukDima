/* eslint-disable import/no-extraneous-dependencies */
import { FC, useCallback, useEffect, useState } from 'react';
import { AppDatePicker } from '@components/app-day-picker';
import { DATE_FORMAT_TO_VIEW, ERROR_MESSAGES, PROFILE_IDS } from '@constants/index';
import { useAppSelector, useDayInfo } from '@hooks/index';
import { validateEmail, validatePassword, visiblePasswordRenderIcon } from '@utils/index';
import { Button, Col, Form, Input, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import { Dayjs } from 'dayjs';
import { TUserInfo, TUserInfoUpdateBody } from 'src/app-types/index';

import { ProfilePageUpload } from './profile-page-upload';

interface FieldData {
    name: string[];
    value?: unknown;
    touched?: boolean;
    validating?: boolean;
    errors?: string[];
}

type TProfileFormSate = {
    firstName: string;
    lastName: string;
    email: string;
    password1: string;
    password2: string;
};

type TProfilePageUserContentProps = {
    isUpdatingUserInfo?: boolean;
    updateUserInfoCb: (newData: TUserInfoUpdateBody) => void;
};
export const ProfilePageUserContent: FC<TProfilePageUserContentProps> = ({
    isUpdatingUserInfo = false,
    updateUserInfoCb,
}) => {
    const { userData } = useAppSelector((state) => state.user);
    const { getDateForSave, getDayJsItem } = useDayInfo();

    const [form] = Form.useForm<TProfileFormSate>();

    const [disabledSave, setDisabledSave] = useState<boolean>(true);
    const [imageUrlForSave, setImageUrlForSave] = useState<string>('');
    const [imageUrlForSaveChanged, setImageUrlForSaveChanged] = useState<boolean>(false);
    const [birthdayUser, setBirthdayUser] = useState<Dayjs | null>(
        userData?.birthday ? getDayJsItem(userData.birthday) : null,
    );
    const [birthdayUserChanged, setBirthdayUserChanged] = useState<boolean>(false);

    useEffect(() => {
        if (userData) {
            form.setFieldValue('firstName', userData?.firstName ?? '');
            form.setFieldValue('lastName', userData?.lastName ?? '');
            form.setFieldValue(
                'birthday',
                userData?.birthday ? getDayJsItem(userData.birthday) : null,
            );
            form.setFieldValue('email', userData?.email ?? '');
            form.validateFields(['email']);
        }
    }, [userData, getDayJsItem, form]);

    const isFormErrorsExist = useCallback(() => {
        const formErrors = form.getFieldsError(['email', 'password1', 'password2']);

        return formErrors.filter((item) => item.errors.length).length > 0;
    }, [form]);

    const changeImageForSave = useCallback(
        (newSrc: string) => {
            setImageUrlForSave(newSrc);
            setImageUrlForSaveChanged(newSrc !== userData?.imgSrc);
            if (!isFormErrorsExist()) {
                setDisabledSave(false);
            }
        },
        [userData, isFormErrorsExist],
    );

    const currentBirthDay = userData?.birthday
        ? getDayJsItem(userData.birthday).format(DATE_FORMAT_TO_VIEW)
        : null;
    const birthdayChangeHandler = useCallback(
        (value: Dayjs | null) => {
            setBirthdayUser(value);
            setBirthdayUserChanged(currentBirthDay !== value?.format(DATE_FORMAT_TO_VIEW));

            if (!isFormErrorsExist()) {
                setDisabledSave(false);
            }
        },
        [currentBirthDay, isFormErrorsExist],
    );

    const checkIsNeedAddFormField = useCallback(
        (val: string, formKey: keyof TUserInfo) => {
            const currentUserFieldInfo = userData ? userData[formKey] ?? '' : '';

            return val !== currentUserFieldInfo;
        },
        [userData],
    );

    const onFinish = useCallback(
        ({ email, firstName, lastName, password1 }: TProfileFormSate) => {
            const updatedData: TUserInfoUpdateBody = {
                email,
            };

            if (imageUrlForSaveChanged && checkIsNeedAddFormField(imageUrlForSave, 'imgSrc')) {
                updatedData.imgSrc = imageUrlForSave;
            }
            if (checkIsNeedAddFormField(firstName, 'firstName')) {
                updatedData.firstName = firstName;
            }

            if (checkIsNeedAddFormField(lastName, 'lastName')) {
                updatedData.firstName = lastName;
            }

            if (birthdayUserChanged) {
                updatedData.birthday = getDateForSave(birthdayUser);
            }

            if (password1 && validatePassword(password1)) {
                updatedData.password = password1;
            }

            setDisabledSave(true);
            updateUserInfoCb(updatedData);
            setImageUrlForSave('');
            setBirthdayUserChanged(false);
            setImageUrlForSaveChanged(false);
        },
        [
            checkIsNeedAddFormField,
            birthdayUser,
            birthdayUserChanged,
            getDateForSave,
            imageUrlForSave,
            imageUrlForSaveChanged,
            updateUserInfoCb,
        ],
    );

    const onFieldsChange = useCallback(
        (_: FieldData[], allFields: FieldData[]) => {
            if (isFormErrorsExist()) {
                setDisabledSave(true);

                return false;
            }

            if (imageUrlForSaveChanged || birthdayUserChanged) {
                setDisabledSave(false);

                return false;
            }

            let dataChanged = false;

            allFields.forEach((item) => {
                const nameField = item.name[0] ?? '';
                const curValue = item.value ?? '';
                const curUserValue = userData ? userData[nameField as keyof TUserInfo] ?? '' : '';

                if (curValue !== curUserValue) {
                    dataChanged = true;
                }
            });

            setDisabledSave(!dataChanged);

            return true;
        },
        [userData, birthdayUserChanged, imageUrlForSaveChanged, isFormErrorsExist],
    );

    return (
        <Form
            form={form}
            name='profile-form'
            className='profile-form'
            onFieldsChange={onFieldsChange}
            onFinish={onFinish}
            initialValues={{
                firstName: userData?.firstName ?? '',
                lastName: userData?.lastName ?? '',
                email: userData?.email ?? '',
            }}
        >
            <Col className='profile-form__block'>
                <Title level={2} className='profile-form__block_title'>
                    Личная информация
                </Title>

                <Row align='top'>
                    <ProfilePageUpload changeCb={changeImageForSave} />

                    <Col className='user-personal-info'>
                        <Form.Item name='firstName' className='profile-form_input'>
                            <Input
                                type='text'
                                placeholder='Имя'
                                data-test-id={PROFILE_IDS.formFirstName}
                            />
                        </Form.Item>

                        <Form.Item name='lastName' className='profile-form_input'>
                            <Input
                                type='text'
                                placeholder='Фамилия'
                                data-test-id={PROFILE_IDS.formLastName}
                            />
                        </Form.Item>

                        <AppDatePicker
                            name='birthday'
                            placeholder='Дата рождения'
                            value={birthdayUser}
                            onChange={birthdayChangeHandler}
                            style={{ width: '100%', height: 40 }}
                            data-test-id={PROFILE_IDS.formBirthday}
                        />
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
                    required={true}
                    rules={[
                        {
                            validator: (_, value) =>
                                value && validateEmail(value)
                                    ? Promise.resolve()
                                    : Promise.reject(new Error(ERROR_MESSAGES.emailError)),
                        },
                    ]}
                >
                    <Input
                        type='email'
                        addonBefore='e-mail:'
                        data-test-id={PROFILE_IDS.formEmail}
                    />
                </Form.Item>

                <Form.Item
                    name='password1'
                    initialValue=''
                    className='profile-form_password first-password'
                    help={ERROR_MESSAGES.password1Error}
                    required={false}
                    rules={[
                        {
                            validator: (_, value) => {
                                if (!value) return Promise.resolve();

                                const isValidPassword = validatePassword(value);

                                return isValidPassword ? Promise.resolve() : Promise.reject();
                            },
                        },
                    ]}
                >
                    <Input.Password
                        autoComplete=''
                        placeholder='Пароль'
                        iconRender={visiblePasswordRenderIcon}
                        data-test-id={PROFILE_IDS.formPassword}
                    />
                </Form.Item>

                <Form.Item
                    name='password2'
                    initialValue=''
                    className='profile-form_password'
                    required={false}
                    dependencies={['password1']}
                    rules={[
                        ({ getFieldValue }) => ({
                            validator: (_, value) => {
                                const password1 = getFieldValue('password1');

                                return (!password1 && !value) || password1 === value
                                    ? Promise.resolve()
                                    : Promise.reject(new Error(ERROR_MESSAGES.password2Error));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        autoComplete=''
                        placeholder='Повторите пароль'
                        iconRender={visiblePasswordRenderIcon}
                        data-test-id={PROFILE_IDS.formRepeatPassword}
                    />
                </Form.Item>

                <Button
                    data-test-id={PROFILE_IDS.formSubmit}
                    type='primary'
                    className='button-page profile-form_submit'
                    htmlType='submit'
                    disabled={isUpdatingUserInfo || disabledSave}
                >
                    Сохранить изменения
                </Button>
            </Col>
        </Form>
    );
};
