
import React from 'react';

export const Layout = ({ children }) => {
    return (
        <div className="app-layout">
            <div className="container">
                {children}
            </div>
        </div>
    );
};

export default Layout;