import React from 'react';

const IframeComponent = () => {
    return (
        <iframe
            src="/form.html"
            title="Form"
            width="100%"
            height="600px"
            style={{ border: 'none' }}
        ></iframe>
    );
};

export default IframeComponent;
