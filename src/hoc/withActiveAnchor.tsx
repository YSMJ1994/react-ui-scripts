import React, { useEffect } from "react";

const WithActiveAnchor = <P extends {}>(Comp: RC<P>): RC<P> => {
  return function(props) {
    useEffect(() => {
      const hash = decodeURI(location.hash);
      if (hash) {
        const hashName = String(hash).replace(/^#/, "");
        const anchorDom = document.querySelector<HTMLElement>(
          `[id="${hashName}"]`
        );
        anchorDom && anchorDom.scrollIntoView();
      }
    }, []);
    return <Comp {...props} />;
  };
};

export default WithActiveAnchor;
