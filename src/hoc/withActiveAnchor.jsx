import React, { useEffect, useRef } from "react";

const WithActiveAnchor = Comp => {
  return function(props) {
    useEffect(() => {
      const hash = decodeURI(location.hash);
      // console.log('hash', hash)
      if (hash) {
        const hashName = String(hash).replace(/^#/, "");
        // console.log('hashName', hashName)
        const anchorDom = document.querySelector(`[id="${hashName}"]`);
        // console.log("anfff", anchorDom);
        if (anchorDom) {
          anchorDom.scrollIntoView({ behavior: "instant" });
        }
      }
    }, []);
    return <Comp {...props} />;
  };
};

export default WithActiveAnchor;
