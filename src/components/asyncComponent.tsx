import React, { useState, useEffect } from "react";

export default function asyncComponent<P extends {}>(
  targetFn: () => Promise<{ default: RC<P> }>,
  HighComponent?: (Comp: RC<P>) => RC<P>
): RC<P> {
  return function AsyncComp(props) {
    const [Target, setTarget] = useState<RC<P> | null>(null);
    useEffect(() => {
      let isMounted = true;
      targetFn()
        .then(res => {
          isMounted &&
            setTarget(() =>
              HighComponent ? HighComponent(res.default) : res.default
            );
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
