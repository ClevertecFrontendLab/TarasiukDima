import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { SiteRouter } from '@components/index';
import { store } from '@redux/index';
import { ConfigProvider } from 'antd';

import 'antd/dist/antd.min.css';
import 'normalize.css';
import './index.scss';

ConfigProvider.config({
    theme: {
        primaryColor: '#262626',
    },
});

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ConfigProvider>
                <SiteRouter />
            </ConfigProvider>
        </Provider>
    </React.StrictMode>,
);
