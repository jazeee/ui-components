import React, { ReactNode, useState } from "react";
import classNames from "classnames";
import styles from "./common-page.module.scss";
import { Button, Card, CardHeader } from "@material-ui/core";
import { CommonPageClasses, HeaderAction, MenuItem } from "../../types/card";
import { LinkButton } from "../../link";
import { SideMenu } from "./components/side-menu";
import { SideMenuButton } from "./components/side-menu-button";
import { SpinnerOverlay } from "../../spinner-overlay";

type Props = {
  /** Provides the page's Title */
  title?: ReactNode;
  /** Provides for action components to be rendered in the top right corner */
  headerActions?: HeaderAction[];
  /** Provides a subtitle under the `title` */
  subtitle?: ReactNode;
  /**
   * Provides classNames to the page and its sub-components. Options include:
   *
   *  - `root`
   *
   *  - `header` (applied to entire header container which contains headerActions, title, subtitle, and side menu
   *     button)
   *
   *  - `headerActions` (applied to headerActions container)
   *
   *  - `title`
   *
   *  - `subtitle`
   *
   *  - `contentAndMenu` - container around content and side menu.
   *
   *  - `content` - a container inside of contentAndMenu but still around content. This exists to stop the content
   *     from being considered part of a flexbox with the side menu.
   *
   *  - `sideMenu`
   */
  classes?: CommonPageClasses;
  /** Takes a `node` that goes beneath the header. For example, page tabs. */
  subheader?: ReactNode;
  /** Displays a spinner when `isLoading` is true */
  isLoading?: boolean;
  /** Defines the list of items in the menu. The menu is hidden by default but can be revealed by clicking a hamburger
   *  button to the left of the page. Clicking on each item will scroll to the element with an id matching the key.
   *  If empty, no hamburger icon will appear. */
  menuContents?: MenuItem[];
};

/**
 * `CommonPage` provides a component for a page with a flush card header and an
 * optional side menu. Note: if you are using this component
 * in a new environment, we recommend building a new child component for your
 * environment; take a look at the `LimsPage` component as an example.
 */
export const CommonPage: React.FC<Props> = (props) => {
  const [sideMenuIsExpanded, setSideMenuIsExpanded] = useState(false);

  const toggleSideMenu = (): void => {
    setSideMenuIsExpanded((sideMenuIsExpanded) => !sideMenuIsExpanded);
  };

  const {
    classes = {},
    headerActions = [],
    subtitle = "",
    title = "",
    subheader,
    children,
    menuContents = [],
    isLoading,
    ...cardProps
  } = props;
  const mappedHeaderActions = headerActions.map((action, index) => {
    const {
      Component,
      content = "",
      id,
      color = "primary",
      componentProps = {},
      disabled,
      ...otherProps
    } = action;
    const ComponentToUse =
      Component ||
      (componentProps.href != null || otherProps.href != null
        ? LinkButton
        : Button);
    return (
      <ComponentToUse
        key={`header-action-${index}`}
        id={id}
        data-testid={id}
        color={color}
        disabled={disabled || isLoading}
        {...componentProps}
        {...otherProps}
      >
        {content}
      </ComponentToUse>
    );
  });

  const cardheader = (
    // @ts-ignore: no overload matches this call.
    <CardHeader
      title={title}
      titleTypographyProps={{
        variant: "h5",
        "data-testid": "common-page-title",
      }}
      classes={{
        root: styles.cardHeader,
        action: classNames(styles.headerActions, classes.headerActions),
        title: classNames("header-title", classes.title),
        subheader: classes.subtitle,
      }}
      action={mappedHeaderActions}
      subheader={subtitle}
      subheaderTypographyProps={{
        variant: "body2",
        "data-testid": "common-page-subtitle",
      }}
      avatar={
        menuContents.length > 0 && (
          <SideMenuButton
            isExpanded={sideMenuIsExpanded}
            toggleMenu={toggleSideMenu}
          />
        )
      }
    />
  );

  return (
    <div
      className={classNames(classes.root, styles.pageContainer)}
      data-testid="common-page"
    >
      <Card
        data-testid="common-page-header"
        classes={{
          root: classNames(
            classes.header,
            styles.stickyHeader,
            styles.pageHeader,
          ),
        }}
        {...cardProps}
      >
        {cardheader}
        {subheader}
      </Card>
      <div
        data-testid="common-page-content-and-menu"
        className={classNames(styles.contentAndMenu, classes.contentAndMenu)}
      >
        {menuContents.length > 0 && (
          <SideMenu
            data-testid="common-page-side-menu"
            isExpanded={sideMenuIsExpanded}
            menuContents={menuContents}
            className={classes.sideMenu}
          />
        )}
        <div
          data-testid="common-page-content"
          className={classNames(styles.content, classes.content)}
        >
          {children}
        </div>
      </div>
      {isLoading && <SpinnerOverlay className={styles.spinnerOverlay} />}
    </div>
  );
};
