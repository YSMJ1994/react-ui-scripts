import React, { useState, useEffect } from 'react';

export default function asyncComponent<PropsType extends {}>(targetFn: () => Promise<any>): React.FC<PropsType> {
    return function AsyncComp(props) {
        const [Target, setTarget]: [any, any] = useState(null);
        useEffect(() => {
            let isMounted = true;
            targetFn()
                .then(res => {
                    isMounted && setTarget(() => res.default);
                })
                .catch(() => {
                    isMounted && setTarget(null);
                });
            return () => {
                isMounted = false;
            };
        }, [targetFn]);
        return Target && <Target {...props} />;
    };
}
