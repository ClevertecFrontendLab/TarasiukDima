import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row } from 'antd';
import { ROUTES_LINKS } from '@constants/index';

export const SettingsPageReviews = memo(() => {
    // const {
    //     data: tariffsListInfo = [],
    //     isError: isErrorGetTariffsList,
    //     isLoading: isLoadingGetTariffsList,
    //     isSuccess: isSuccessGetTariffsList,
    // } = useGetTariffsListQuery(null);

    // useEffect(() => {
    //     if (isErrorUpdateUserInfo) {
    //         setIsShowErrorSaveNewInfo(true);
    //     }
    // }, [isErrorUpdateUserInfo]);

    const addReviewBtnCb = useCallback(() => {
        console.log('addReviewBtnCb');
    }, []);

    return (
        <Row className='settings-page__review-buttons' justify='start' align='stretch'>
            <Button type='primary' className='page-button' onClick={addReviewBtnCb}>
                Написать отзыв
            </Button>

            <Link to={ROUTES_LINKS.feedbacks} className='page-button all-button'>
                Смотреть все отзывы
            </Link>
        </Row>
    );
});
