import { FC, Fragment, memo } from 'react';
import { TTrainingPalItem } from '@app-types/index';
import { Button, Card } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';

export const JoinTrainingsPartners: FC<{
    partners: TTrainingPalItem[];
}> = memo(({ partners }) => (
    <Fragment>
        <Paragraph>Мои партнёры по тренировкам</Paragraph>
        {!partners.length ? 'У вас пока нет партнёров для совместных тренировок' : null}
    </Fragment>
));
