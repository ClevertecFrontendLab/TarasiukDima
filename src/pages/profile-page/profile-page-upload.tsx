import { FC, useCallback, useEffect, useState } from 'react';
import { useAppSelector, useIsMobile } from '@hooks/index';
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Modal, Row, Upload, UploadFile } from 'antd';
import { checkIsLessFileSize } from '@utils/index';
import {
    MAX_SIZE_PHOTO_USER_MB,
    MAX_WIDTH_FOR_MOBILE_PX,
    MEDIA_LOADING_STATUS,
    MEDIA_SERVER_URL,
    MODALS_STYLE,
    PROFILE_IDS,
    SERVICE_API_URL,
    STATUS_CODES,
} from '@constants/index';
import { filesQueryEndpoints } from '@services/index';
import { TUserPhotoResponse } from '@app_types/index';
import { RcFile } from 'antd/es/upload/interface';
import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

type TProfileUploadProps = {
    changeCb: (newSrc: string) => void;
};

export const ProfilePageUpload: FC<TProfileUploadProps> = ({ changeCb }) => {
    const { userData } = useAppSelector((state) => state.user);
    const { token } = useAppSelector((state) => state.auth);
    const isMobile = useIsMobile(MAX_WIDTH_FOR_MOBILE_PX);

    const [fileList, setFileList] = useState<UploadFile[]>(
        userData?.imgSrc
            ? [
                  {
                      name: 'avatar',
                      uid: 'avatar',
                      status: MEDIA_LOADING_STATUS.done,
                      url: MEDIA_SERVER_URL + userData.imgSrc,
                  },
              ]
            : [],
    );
    const [loadingPercent, setLoadingPercent] = useState<number>(0);
    const [isFileSizeError, setIsFileSizeError] = useState<boolean>(false);
    const [savingPhotoData, setSavingPhotoData] = useState<TUserPhotoResponse | null>(null);
    const [isErrorSavePhoto, setIsErrorSavePhoto] = useState<boolean>(false);
    const [isLoadingSavePhoto, setIsLoadingSavePhoto] = useState<boolean>(false);

    useEffect(() => {
        setFileList(
            userData?.imgSrc
                ? [
                      {
                          name: 'avatar',
                          uid: 'avatar',
                          status: MEDIA_LOADING_STATUS.done,
                          url: MEDIA_SERVER_URL + userData.imgSrc,
                      },
                  ]
                : [],
        );
    }, [userData]);

    useEffect(() => {
        if (isErrorSavePhoto) {
            setFileList([{ uid: 'error', name: 'image.png', status: MEDIA_LOADING_STATUS.error }]);
        }
    }, [isErrorSavePhoto]);

    useEffect(() => {
        if (isLoadingSavePhoto) {
            setFileList([
                {
                    uid: 'loading',
                    name: 'image.png',
                    percent: loadingPercent,
                    status: MEDIA_LOADING_STATUS.loading,
                },
            ]);
        }
    }, [isLoadingSavePhoto, loadingPercent]);

    useEffect(() => {
        if (savingPhotoData) {
            setFileList([
                {
                    name: savingPhotoData.name,
                    uid: savingPhotoData.name,
                    status: MEDIA_LOADING_STATUS.done,
                    url: MEDIA_SERVER_URL + savingPhotoData.url,
                },
            ]);
            changeCb(savingPhotoData.url);
        }
    }, [savingPhotoData, changeCb]);

    useEffect(() => {
        if (isFileSizeError) {
            const closeErrorModal = () => {
                setIsFileSizeError(false);
            };

            Modal.error({
                centered: true,
                closable: false,
                okText: <span data-test-id={PROFILE_IDS.formErrorClose}>Закрыть</span>,
                className: 'modal-page',
                maskStyle: MODALS_STYLE.maskStyleSmall,
                okButtonProps: {
                    className: 'right-btn',
                },

                open: isFileSizeError,
                title: <span>Файл слишком большой</span>,
                content: <span>Выберите файл размером {MAX_SIZE_PHOTO_USER_MB} МБ.</span>,
                onCancel: closeErrorModal,
                onOk: closeErrorModal,
            });
        }
    }, [isFileSizeError]);

    const handleRemoveCb = useCallback(() => {
        setFileList([]);
        changeCb('');
    }, [changeCb]);

    const savePhoto = useCallback(
        async (formData: FormData) => {
            setIsLoadingSavePhoto(true);

            const configRequest: AxiosRequestConfig<FormData> = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: token ? `Bearer ${token}` : '',
                },
                onUploadProgress(progressEvent: AxiosProgressEvent) {
                    const currentPercent =
                        (progressEvent.loaded / (progressEvent.total as number)) * 100;

                    setLoadingPercent(currentPercent);
                },
            };

            axios
                .post(`${SERVICE_API_URL}/${filesQueryEndpoints.upload}`, formData, configRequest)
                .then((response) => {
                    setSavingPhotoData(response.data);
                    setIsErrorSavePhoto(false);
                })
                .catch((error) => {
                    setIsErrorSavePhoto(true);
                    if (error.response.status.toString() === STATUS_CODES.badRequest) {
                        setIsFileSizeError(true);
                    }
                })
                .finally(() => {
                    setIsLoadingSavePhoto(false);
                });
        },
        [token],
    );

    const customRequestHandlerCb = useCallback(
        (options: RcCustomRequestOptions) => {
            const fileForLoad = options.file as RcFile;

            const isFileLessNeedSize = checkIsLessFileSize(
                fileForLoad.size,
                MAX_SIZE_PHOTO_USER_MB,
            );

            if (!isFileLessNeedSize) {
                setIsFileSizeError(true);
                return;
            }

            const formData = new FormData();
            formData.append('file', fileForLoad);

            savePhoto(formData);
            setIsFileSizeError(false);
        },
        [savePhoto],
    );

    // eslint-disable-next-line no-extra-boolean-cast
    const isNotEmptyFileList = !Boolean(fileList.length);

    return (
        <div className='upload-img' data-test-id={PROFILE_IDS.formAvatar}>
            <Upload
                name='avatar'
                customRequest={customRequestHandlerCb}
                listType={isMobile ? 'picture' : 'picture-card'}
                fileList={fileList}
                onRemove={handleRemoveCb}
                accept='image/*'
                multiple={false}
            >
                {isMobile
                    ? isNotEmptyFileList && (
                          <Row
                              className='upload-img__content-mobile'
                              justify='space-between'
                              align='middle'
                          >
                              <span className='upload-text'>Загрузить фото профиля:</span>
                              <Button icon={<UploadOutlined />} className='upload-button'>
                                  Загрузить
                              </Button>
                          </Row>
                      )
                    : isNotEmptyFileList && (
                          <span className='upload-img__content'>
                              <PlusOutlined />
                              <span className='text'>
                                  Загрузить фото <br />
                                  профиля
                              </span>
                          </span>
                      )}
            </Upload>
        </div>
    );
};
