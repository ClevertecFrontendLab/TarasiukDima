import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { ConfigProvider } from 'antd';

import { store } from '@redux/configure-store';
import { MainPage } from './pages';

import 'antd/dist/antd.min.css';
import 'normalize.css';
import './index.scss';

ConfigProvider.config({
    theme: {
        primaryColor: '#262626',
        // colorSecondary: '#10239E',
        // colorLink: '#10239E',
    },
});

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ConfigProvider>
                <HashRouter>
                    <Routes>
                        <Route path='/' element={<MainPage />} />
                    </Routes>
                </HashRouter>
            </ConfigProvider>
        </Provider>
    </React.StrictMode>,
);
