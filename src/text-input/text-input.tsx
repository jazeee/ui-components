import React, { ElementType, useState } from "react";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import styles from "./text-input.module.scss";

const isEmptyValue = (value): boolean => value == null || value === "";

const getDisplayValue = (
  value,
  readOnly: boolean,
  hasReadOnlyDefaultValue: boolean,
  readOnlyDefaultValue?: any,
): string => {
  const defaultValue = hasReadOnlyDefaultValue ? readOnlyDefaultValue : "-";
  return isEmptyValue(value) && readOnly ? defaultValue : value;
};

type Props = {
  /** If true, displays the field as read-only (with label and helper text). */
  readOnly?: boolean;
  /** Custom readOnly default value. Default to "-". It could be set explicitly to empty value, e.g. "". */
  readOnlyDefaultValue?: any;
  /** If readOnly is true, display this component rather than the default Material-UI TextField. */
  ReadOnlyComponent?: ElementType;
  /** props passed in to the ReadOnlyComponent */
  readOnlyComponentProps?: Record<string, any>;
  /** ID of the element. */
  id?: string;
  /** Classes to pass to the element. */
  className?: string;
  /** Data test id */
  "data-testid"?: string;
  /** The displayed style of the TextInput component. Defaults to "filled" */
  variant?: "filled" | "standard" | "outlined";
} & TextFieldProps;

/** TextInput is a wrapper around Material UI's TextField component. */
export const TextInput = (props: Props) => {
  const {
    id,
    className,
    value,
    readOnly,
    readOnlyDefaultValue,
    disabled,
    placeholder,
    "data-testid": dataTestId,
    onFocus,
    onBlur,
    variant,
    ReadOnlyComponent,
    readOnlyComponentProps = {},
    ...otherProps
  } = props;
  const [isInputFocused, setIsInputFocused] = useState(false);
  // We check if readOnlyDefaultValue is explicitly set.
  const hasReadOnlyDefaultValue = readOnlyDefaultValue != null;
  const displayValue = getDisplayValue(
    value,
    readOnly,
    hasReadOnlyDefaultValue,
    readOnlyDefaultValue,
  );
  if (readOnly && ReadOnlyComponent) {
    return (
      <ReadOnlyComponent
        id={id}
        className={className}
        {...readOnlyComponentProps}
      >
        {props.value}
      </ReadOnlyComponent>
    );
  }

  return (
    // @ts-ignore: disableUnderline not found on type
    <TextField
      data-testid={dataTestId || `${readOnly ? "readonly-" : ""}text-input`}
      id={id}
      className={className}
      margin="normal"
      variant={variant}
      value={displayValue}
      disabled={readOnly || disabled}
      placeholder={
        readOnly && hasReadOnlyDefaultValue ? undefined : placeholder
      }
      InputProps={{
        classes: {
          root: styles.root,
          disabled: styles.disabled,
        },
        disableUnderline: readOnly,
        readOnly,
        onFocus: (event) => {
          onFocus && onFocus(event);
          setIsInputFocused(true);
        },
        onBlur: (event) => {
          onBlur && onBlur(event);
          setIsInputFocused(false);
        },
      }}
      InputLabelProps={{
        shrink: readOnly || !isEmptyValue(value) || isInputFocused,
      }}
      {...otherProps}
    />
  );
};
