import React, { useState, useEffect, FC, PropsWithChildren } from "react";
import Comps from "../../assets/components";

interface Group {
  name: string;
  components: Comp[];
}

interface CtxValue {
  groups: Group[];
  comps: Comp[];
}

const compsCtx = React.createContext<CtxValue>({ groups: [], comps: [] });

function groupComps(comps: Comp[]): Group[] {
  const groups: { [k: string]: Comp[] } = {};
  comps.forEach(comp => {
    const {
      config: { type }
    } = comp;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(comp);
  });
  // console.log('groups', groups)
  return Object.keys(groups)
    .sort((a, b) => (a > b ? -1 : 1))
    .map(key => ({
      name: key,
      components: groups[key]
    }));
}

export const Provider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [data, setData] = useState<CtxValue>({ groups: [], comps: [] });
  const P = compsCtx.Provider;
  useEffect(() => {
    setData({
      groups: groupComps(Comps),
      comps: Comps
    });
  }, [Comps]);
  return <P value={data}>{children}</P>;
};

export default compsCtx;
