export const theme = {
    colors: {
        primary: '#ffff66',      // Obsolete yellow
        background: '#141414',   // Obsolete black
        text: '#ffffff',
        textMuted: '#a0a0a0',
        accent: '#00ff88',
        error: '#ff4444'
    },
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '2rem',
        xl: '4rem'
    },
    breakpoints: {
        mobile: '640px',
        tablet: '768px',
        desktop: '1024px'
    },
    typography: {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        h1: {
            fontSize: '2.5rem',
            fontWeight: '300',
            lineHeight: '1.2'
        },
        h2: {
            fontSize: '2rem',
            fontWeight: '300',
            lineHeight: '1.3'
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: '400',
            lineHeight: '1.4'
        },
        body: {
            fontSize: '1.125rem',
            lineHeight: '1.6'
        }
    }
};

export default theme;
