import React, { useEffect } from 'react';

const HelloWorld = () => {
    useEffect(() => {
        console.log('HelloWorld component rendered');
    }, []);

    return (
        <div>
            <h1>Hello, World!</h1>
            <p>This is a test React component.</p>
        </div>
    );
};

export default HelloWorld;