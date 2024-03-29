import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

export const visiblePasswordRenderIcon = (visible: boolean) =>
    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />;
