import React, { useContext } from "react";
import cs from "classnames";
import DocsCtx from "../../ctx/Docs";
import NavMenuControl from "../../ctx/NavMenuControl";
import styles from "./style.module.scss";

const NavMenu = () => {
  const docs = useContext(DocsCtx);
  const [activeId] = useContext(NavMenuControl);
  return (
    <ul className={styles.navMenu}>
      {docs.map(doc => {
        const {
          config: { id, name, filename }
        } = doc;
        return (
          <li
            className={cs(styles.navMenuItem, {
              [styles.active]: id === activeId
            })}
            key={id}
          >
            <a href={`/docs/${filename}`}>{name}</a>
          </li>
        );
      })}
    </ul>
  );
};

export default NavMenu;
