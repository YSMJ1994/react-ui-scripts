import React, {
  useState,
  useEffect,
  useRef,
  CSSProperties,
  FC,
  PropsWithChildren
} from "react";
import cs from "classnames";
import "./style.scss";

interface CollapseListProps {
  show?: boolean;
  className?: string;
  style?: CSSProperties;
}

const CollapseList: FC<PropsWithChildren<CollapseListProps>> = ({
  className,
  style,
  children,
  show = false
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [fullHeight, setFullHeight] = useState<number | "auto">("auto");
  useEffect(() => {
    if (!listRef.current) {
      return;
    }
    const dom = listRef.current;
    setFullHeight(dom.scrollHeight || "auto");
  }, [children, listRef.current]);
  const calcStyle = {
    ...style,
    height: show ? fullHeight : 0,
    opacity: show ? 1 : 0
  };
  return (
    <div
      className={cs("collapse-list", className)}
      style={calcStyle}
      ref={listRef}
    >
      {children}
    </div>
  );
};

export default CollapseList;
