import React, {useContext, useState, useRef, useEffect, PropsWithChildren, FC, EventHandler, MouseEvent} from "react";
import { Link } from "react-router-dom";
import cs from "classnames";
import DocsCtx from "../../ctx/Docs";
import CompsCtx from "../../ctx/Comps";
import NavMenuControl from "../../ctx/NavMenuControl";
import "./style.scss";
import CollapseList from "../CollapseList";
import Icon from "../Icon";
interface NavMenuItemProps {
    name: string
    href?: string | undefined
    onClick?: EventHandler<MouseEvent<HTMLLIElement | HTMLDivElement>>
    isMenuHead?: boolean
    isComp?: boolean
    active?: boolean
    open?: boolean
    isShow?: boolean
}
const NavMenuItem: FC<PropsWithChildren<NavMenuItemProps>> = ({
  children,
  active = false,
  name,
  href,
  open = false,
  onClick,
  isMenuHead = false,
  isComp = false,
  isShow = open
}) => {
  const [show, setShow] = useState(isShow);
  if (!children) {
    const Tag = isMenuHead ? "div" : "li";
    return (
      <Tag
        onClick={(e: MouseEvent<HTMLLIElement | HTMLDivElement>) => onClick && onClick(e)}
        className={cs("nav-menu-item", {
          "nav-menu-item--active": active,
          "menu-head": isMenuHead,
          "comp-menu": isComp
        })}
      >
        {href ? (
          <Link to={href}>{name}</Link>
        ) : (
          <a href="javascript:">{name}</a>
        )}
        {isMenuHead && (
          <Icon
            className={cs("nav-menu-item-icon", {
              "nav-menu-item-icon-show": isShow
            })}
            size={12}
            name="arrow-down-line"
          />
        )}
      </Tag>
    );
  } else {
    return (
      <li>
        <NavMenuItem
          active={active}
          name={name}
          href={href}
          onClick={() => setShow(!show)}
          isMenuHead
          isShow={show}
        />
        <CollapseList className="nav-menu-item-children" show={show}>
          {children}
        </CollapseList>
      </li>
    );
  }
};

interface NavGroupItemProps {
    name: string
    components: Comp[]
    activeId: string
}

const NavGroupItem: FC<NavGroupItemProps> = ({ name, components, activeId }) => {
  return (
    <div className="nav-group-item">
      <div className="nav-group-item-name">{name}</div>
      <ul className="nav-group-item-list">
        {components.map(comp => {
          const {
            config: { id, name, sub }
          } = comp;
          return (
            <NavMenuItem
              key={id}
              name={`${name} ${sub}`}
              href={`/components/${name}`}
              active={id === activeId}
              isComp
            />
          );
        })}
      </ul>
    </div>
  );
};

const NavMenu = () => {
  const docs = useContext(DocsCtx);
  const { groups } = useContext(CompsCtx);
  const [activeId] = useContext(NavMenuControl);
  return (
    <ul className="nav-menu">
      {docs.map(doc => {
        const {
          config: { id, name, filename }
        } = doc;
        return (
          <NavMenuItem
            key={id}
            active={id === activeId}
            href={`/docs/${filename}`}
            name={name}
          />
        );
      })}
      <NavMenuItem name="组件" open>
        {groups.map(group => {
          const { name, components } = group;
          return (
            <NavGroupItem
              key={name}
              name={name}
              components={components}
              activeId={activeId}
            />
          );
        })}
      </NavMenuItem>
    </ul>
  );
};

export default NavMenu;
