import React, { useEffect, useState, useCallback, FC } from "react";
import ReactDom from "react-dom";
import cs from "classnames";
import "./style.scss";

export default function withToc<T>(Comp: FC<{ list: T[] }>) {
  return ({ list = [] }: { list: T[] | undefined }) => {
    const [fixed, setFixed] = useState(false);
    const listener = useCallback(
      e => {
        const scrollTop = e.target.scrollingElement.scrollTop;
        if (scrollTop > 50 && !fixed) {
          setFixed(true);
        }
        if (scrollTop <= 50 && fixed) {
          setFixed(false);
        }
      },
      [fixed]
    );
    useEffect(() => {
      if (window.scrollY > 50 && !fixed) {
        setFixed(true);
      }
      if (window.scrollY <= 50 && fixed) {
        setFixed(false);
      }
      window.addEventListener("scroll", listener);
      return () => window.removeEventListener("scroll", listener);
    }, [listener]);
    /*useEffect(() => {
      const hash = decodeURI(location.hash);
      const targetLink = document.querySelector(`a[href='${hash}']`);
      targetLink && targetLink.click();
    }, []);*/
    return ReactDom.createPortal(
      <div className={cs("toc-wrap", { "toc-wrap--fixed": fixed })}>
        <Comp list={list} />
      </div>,
      document.querySelector(".AppMain") || document.body
    );
  };
}
