import { FC, memo, useCallback, useMemo, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { TTrainingInviteItem } from '@app-types/index';
import { COUNT_INVITES_TO_SHOW_DEFAULT } from '@constants/index';
import { useUpdateInviteMutation } from '@services/index';
import { Button, Col } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import classNames from 'classnames';

import { JoinTrainingsInvitesItem } from './join-trainings-invites-item';

import './join-trainings-invites.scss';

export const JoinTrainingsInvites: FC<{ invites: TTrainingInviteItem[] }> = memo(({ invites }) => {
    const [isShowAllInvites, setIsShowAllInvites] = useState(false);

    const [
        updateInvite,
        {
            isLoading: isLoadingUpdateInvite,
            // isError: isErrorUpdateInvite,
            // isSuccess: isSuccessUpdateInvite,
        },
    ] = useUpdateInviteMutation();

    const confirmInvite = useCallback(
        (id: string) => {
            updateInvite({
                id,
                status: 'accepted',
            });
        },
        [updateInvite],
    );

    const rejectInvite = useCallback(
        (id: string) => {
            updateInvite({
                id,
                status: 'rejected',
            });
        },
        [updateInvite],
    );

    const changeShowCountItems = useCallback(() => {
        setIsShowAllInvites((prev) => !prev);
    }, []);

    const cardsToShow = useMemo(() => {
        if (isShowAllInvites) {
            return invites;
        }

        return invites.slice(0, COUNT_INVITES_TO_SHOW_DEFAULT);
    }, [isShowAllInvites, invites]);

    if (!invites.length) return null;

    return (
        <Col className='invites-list'>
            <Paragraph className='invites-list__title'>
                Новое сообщение ({invites.length})
            </Paragraph>
            {cardsToShow.map((item) => (
                <JoinTrainingsInvitesItem
                    data={item}
                    key={item._id}
                    agreeCb={confirmInvite}
                    rejectCb={rejectInvite}
                    disabled={isLoadingUpdateInvite}
                />
            ))}
            <Button
                onClick={changeShowCountItems}
                className={classNames('invites-list__show-more', {
                    active: isShowAllInvites,
                })}
                type='text'
            >
                <DownOutlined />
                {isShowAllInvites ? 'Скрыть' : 'Показать'} все сообщения
            </Button>
        </Col>
    );
});
