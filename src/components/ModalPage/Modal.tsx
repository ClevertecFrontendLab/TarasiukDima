import { ReactNode } from 'react';
import { Modal, ModalProps } from 'antd';

import './modal.scss';

interface IModalPageProps extends ModalProps {
    variant?: 'info' | 'error' | 'content';
    children?: ReactNode;
    footer?: ReactNode;
    title?: ReactNode;
    closable?: boolean;
}

export const ModalPage: React.FC<IModalPageProps> = ({
    variant = 'info',
    children,
    footer = null,
    title = null,
    closable = false,
    ...lastProps
}) => {
    return (
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
    );
};
