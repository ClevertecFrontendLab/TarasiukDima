import { ReactNode, memo } from 'react';
import { Modal, ModalProps } from 'antd';

import './modal.scss';

type TModalPageProps = ModalProps & {
    variant?: 'info' | 'error' | 'content';
    children?: ReactNode;
    footer?: ReactNode;
    title?: ReactNode;
    closable?: boolean;
};

export const ModalPage: React.FC<TModalPageProps> = memo(
    ({
        variant = 'info',
        children,
        footer = null,
        title = null,
        closable = false,
        ...lastProps
    }) => (
        <Modal
            className={`${variant}-modal`}
            closable={closable}
            footer={footer}
            title={title}
            centered
            {...lastProps}
        >
            {children}
        </Modal>
    ),
);
