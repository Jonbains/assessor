
import React from 'react';
import styles from '../styles/components.module.css';

export const Layout = ({ children }) => {
    return (
        <div className={styles.layout}>
            <div className={styles.container}>
                <div className={styles.contentWrapper}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;