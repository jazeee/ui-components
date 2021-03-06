import React from "react";
import classNames from "classnames";
import styles from "./readonly-text-field.module.scss";
import { Icon } from "@material-ui/core";

type Props = {
  /** Id of the element. */
  id?: string;
  /** classname applied to the textfield */
  className?: string;
  /** When specified, displays the chosen material-ui icon as a Font Icon. */
  icon?: string;
  /** Displays the text as a disabled Material-UI TextField */
  isDisabled?: boolean;
  /** When `true`, displays the empty value as is. Otherwise displays "-" in place of the empty value. */
  showEmptyValue?: boolean;
};

/** Provides a styled component for displaying read-only input fields. */
export const ReadOnlyTextField: React.FC<Props> = (props) => {
  const {
    children,
    className = "",
    isDisabled,
    showEmptyValue,
    icon,
    ...other
  } = props;
  return (
    <span
      className={classNames(className, styles.readonlyTextField, {
        [styles.disabled]: isDisabled,
      })}
      data-testid="readonly-text-field"
      {...other}
    >
      {icon && (
        <Icon data-testid="icon" className={styles.icon}>
          {icon}
        </Icon>
      )}
      {showEmptyValue ||
      (children !== undefined && children !== null && children !== "")
        ? children
        : "-"}
    </span>
  );
};
