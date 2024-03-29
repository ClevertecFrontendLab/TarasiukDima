import { Link } from 'react-router-dom';
import { Result } from 'antd';
import { ROUTES_LINKS, STATUS_CODES } from '@constants/index';
import { PageContent, PageLayout } from '@components/index';
import { ResultStatusType } from 'antd/lib/result';

import './error-page.scss';

export const NotFoundPage = () => (
    <PageLayout className='error-page'>
        <PageContent className=''>
            <div className='error-page__content'>
                <Result
                    status={STATUS_CODES.notAuth as ResultStatusType}
                    title='Такой страницы нет'
                    subTitle='Извините, страница не найдена, возможно, она была удалена или перемещена.'
                    extra={
                        <Link
                            className='button-page error-page__content_button'
                            to={ROUTES_LINKS.home}
                        >
                            На главную
                        </Link>
                    }
                />
            </div>
        </PageContent>
    </PageLayout>
);
