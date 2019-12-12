import "./common-select.scss";
import FilledInput from "@material-ui/core/FilledInput";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input, { InputProps } from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LinearProgress from "@material-ui/core/LinearProgress";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import React, { ComponentType, ReactNode, useState } from "react";
import classNames from "classnames";
import isEmpty from "lodash/isEmpty";
import {
  ClearIndicator,
  CommonSelectContainer,
  DropdownIndicator,
  MultiValueContainer,
  MultiValueRemove,
  NoOptionsMessage,
  Option,
} from "./components";
import { CommonSelectClasses, CommonSelectOption } from "../types/select";

type Props = {
  value?: CommonSelectOption | CommonSelectOption[] | null;
  classes?: CommonSelectClasses;
  isFullWidth?: boolean;
  helperText?: string;
  id?: string;
  "data-testid"?: string;
  initialMessage?: string;
  isClearable?: boolean;
  isDisabled?: boolean;
  menuIsOpen?: boolean;
  onChange: Function;
  label?: string;
  variant?: "standard" | "filled" | "outlined";
  margin?: "none" | "dense" | "normal";
  placeholder?: string;
  selectType?: "simple" | "async" | "creatable";
  showError?: boolean;
  isLoading?: boolean;
  formatOption?: (x0: CommonSelectOption) => ReactNode;
  isMulti?: boolean;
  defaultOptions?: CommonSelectOption[];
  options?: CommonSelectOption[];
} & Partial<React.ComponentProps<typeof CommonSelectContainer>>;

const variants = {
  STANDARD: "standard",
  OUTLINED: "outlined",
  FILLED: "filled",
};

const margins = {
  NONE: "none",
  DENSE: "dense",
  NORMAL: "normal",
};

const getInputBaseComponent = (variant: string): ComponentType<InputProps> => {
  if (variant === variants.FILLED) {
    return FilledInput;
  }
  if (variant === variants.OUTLINED) {
    return OutlinedInput;
  }
  return Input;
};

export const CommonSelectComponent: React.FC<Props> = props => {
  const {
    onChange,
    formatOption,
    menuIsOpen,
    classes = {},
    isFullWidth = false,
    helperText = "",
    id = "",
    "data-testid": dataTestId,
    initialMessage = "",
    isClearable = true,
    isDisabled = false,
    label = "",
    placeholder = "",
    showError = false,
    variant = variants.STANDARD,
    margin = margins.NONE,
    isLoading = false,
    ...otherProps
  } = props;
  const { value } = otherProps;
  const [isInputFocused, setIsInputFocused] = useState(false);

  const InputBaseComponent = getInputBaseComponent(variant);

  const ariaAttributes = isLoading
    ? {
        "aria-describedby": `${id}-linear-progress`,
        "aria-busy": true,
      }
    : {};

  return (
    <div
      data-testid="common-select"
      className={classNames("common-select__root", classes.root)}
    >
      <FormControl
        fullWidth={isFullWidth}
        // @ts-ignore string is not assignable.
        margin={margin}
      >
        {label && (
          <InputLabel
            data-testid="common-select-input-label"
            classes={{
              formControl: classNames(
                "common-select__input-label",
                classes.label,
              ),
            }}
            htmlFor={id}
            shrink={isInputFocused || !isEmpty(value) || !isEmpty(placeholder)}
            // @ts-ignore no overload matches to this call.
            variant={variant}
          >
            {label}
          </InputLabel>
        )}
        <InputBaseComponent
          inputComponent={CommonSelectContainer}
          disabled={isDisabled}
          error={!isDisabled && showError}
          data-testid={dataTestId}
          inputProps={{
            ...otherProps,
            id,
            inputId: `${id && `${id}-`}select-input${
              isDisabled ? "-disabled" : ""
            }`,
            initialMessage,
            isDisabled,
            placeholder,
            menuIsOpen: isDisabled ? false : menuIsOpen,
            classNamePrefix: "common-select",
            isClearable,
            onChange: value => onChange(value),
            components: {
              Option: selectProps => (
                <Option
                  {...selectProps}
                  classes={classes}
                  formatOption={formatOption}
                />
              ),
              DropdownIndicator,
              IndicatorSeparator: null,
              ClearIndicator,
              NoOptionsMessage,
              MultiValueContainer,
              MultiValueRemove,
            },
          }}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          classes={{
            root: classNames(
              "common-select__input-root",
              classes.input,
              `common-select__input-${variant}`,
            ),
          }}
          {...ariaAttributes}
        />
        {isLoading && <LinearProgress id={`${id}-linear-progress`} />}
        {helperText && (
          <FormHelperText
            // @ts-ignore: no overload matches to this call.
            variant={variant}
            error={showError}
            data-testid={`${id ? `${id}-` : ""}select-helper-text`}
            classes={{
              root: classNames(
                { [`${id}-helpertext`]: id },
                "common-select__helpertext",
              ),
            }}
          >
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    </div>
  );
};