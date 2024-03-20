import { ReactNode, memo } from 'react';
import { Modal, ModalProps } from 'antd';

import './modal.scss';
import classNames from 'classnames';

type TModalPageProps = ModalProps & {
    variant?: 'info' | 'error' | 'content';
    blur?: 'light' | 'dark';
    children?: ReactNode;
    footer?: ReactNode;
    title?: ReactNode;
    closable?: boolean;
    dataTestId?: string;
};

export const ModalPage: React.FC<TModalPageProps> = memo(
    ({
        variant = 'info',
        blur = 'dark',
        className='',
        children,
        footer = null,
        title = null,
        closable = false,
        dataTestId = '',
        ...lastProps
    }) => (
        <Modal
            className={classNames(`${variant}-modal`, {
                [className]: className
            }, [blur])}
            closable={closable}
            footer={footer}
            title={title}
            centered
            data-test-id={dataTestId}
            {...lastProps}
        >
            {children}
        </Modal>
    ),
);
