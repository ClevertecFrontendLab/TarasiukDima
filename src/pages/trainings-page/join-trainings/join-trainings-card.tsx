import { FC, Fragment, memo } from 'react';
import { TSimpleFn } from '@app-types/index';
import { Button, Card } from 'antd';

export const JoinTrainingsCard: FC<{
    randomTrainingSearchCb: TSimpleFn;
    favoriteTrainingSearchCb: TSimpleFn;
}> = memo(({ randomTrainingSearchCb, favoriteTrainingSearchCb }) => (
    <Card
        className='join-training__card'
        actions={[
            <Button type='default' className='page-button' onClick={randomTrainingSearchCb}>
                Случайный выбор
            </Button>,

            <Button type='default' className='page-button' onClick={favoriteTrainingSearchCb}>
                Выбор друга по моим видам тренировок
            </Button>,
        ]}
    >
        <Card.Meta
            title={
                <Fragment>
                    <span>Хочешь тренироваться с тем, кто разделяет твои цели и темп?</span>

                    <span>
                        Можешь найти друга для совместных тренировок среди других пользователей.
                    </span>
                </Fragment>
            }
            description='Можешь воспользоваться случайным выбором или выбрать друга с похожим на твой уровень и вид тренировки, и мы найдем тебе идеального спортивного друга.'
        />
    </Card>
));
