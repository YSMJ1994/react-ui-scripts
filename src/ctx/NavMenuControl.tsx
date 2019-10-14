import React, {
  FC,
  PropsWithChildren,
  SetStateAction,
  useState
} from "react";

const navMenuControl = React.createContext<
  [string, React.Dispatch<SetStateAction<string>>]
>(["", s => s]);

export const Provider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [activeId, setActiveId] = useState<string>("");
  const P = navMenuControl.Provider;
  return <P value={[activeId, setActiveId]}>{children}</P>;
};

export default navMenuControl;
