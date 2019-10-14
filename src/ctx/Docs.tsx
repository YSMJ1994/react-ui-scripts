import React, { useState, useEffect, FC, PropsWithChildren } from "react";
import docs from "../../assets/docs";

const docsCtx = React.createContext<Doc[]>([]);

export const Provider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [data, setData] = useState<Doc[]>([]);
  const P = docsCtx.Provider;
  useEffect(() => {
    setData(docs);
  }, [docs]);
  return <P value={data}>{children}</P>;
};

export default docsCtx;
