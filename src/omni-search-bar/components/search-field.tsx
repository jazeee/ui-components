import Grid from "@material-ui/core/Grid";
import React from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import keycode from "keycode";
import styles from "../omni.module.scss";
import {
  DATE_SEARCH_TYPES,
  SearchFieldProps,
  buildDateRangeString,
  extractDateRange,
  formatDate,
  parseDate,
} from "@grailbio/lib";
import { DateInput } from "../../date/date-input";

type Props = {
  placeholder: string;
  onSearch: () => any;
  searchType: symbol;
} & SearchFieldProps;

export const SearchField: React.FC<Props> = props => {
  const {
    searchKey,
    searchType,
    searchValue,
    onChange,
    onSearch = () => {},
    // Unused props
    searchDefs: __searchDefs,
    searchValues: __searchValues,
    ...otherProps
  } = props;
  const onChangeComponent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { id, value: text },
    } = event;
    onChange(id, text);
  };
  const onEnter = event => {
    if (event.keyCode === keycode("Enter")) {
      event.preventDefault();
      onSearch();
    }
  };
  if (!DATE_SEARCH_TYPES.includes(searchType)) {
    return (
      <TextField
        id={searchKey}
        inputProps={{
          "data-testid": searchKey,
        }}
        className={styles.textField}
        value={searchValue ? String(searchValue) : ""}
        onChange={onChangeComponent}
        onKeyDown={onEnter}
        fullWidth
        {...otherProps}
      />
    );
  }

  const { startDate, endDate } = extractDateRange(searchValue);
  const onDateSearch = (
    id: string,
    startDate?: string | null,
    endDate?: string | null,
  ) => {
    onChange(id, buildDateRangeString({ startDate, endDate }));
  };
  const onChangeStartDate = (id, date) => {
    const validDate = formatDate(date);
    if (validDate) {
      onDateSearch(id, validDate, endDate);
    }
  };
  const onChangeEndDate = (id, date) => {
    const validDate = formatDate(date);
    if (validDate) {
      onDateSearch(id, startDate, validDate);
    }
  };

  return (
    <Grid className={styles.dateGrid}>
      <DateInput
        id={`${searchKey}-from`}
        className={styles.input}
        value={parseDate(startDate)}
        onChange={onChangeStartDate.bind(this, searchKey)}
        onKeyDown={onEnter}
        InputProps={{ placeholder: "From date" }}
        {...otherProps}
      />
      <Typography className={styles.typography}>to</Typography>
      <DateInput
        id={`${searchKey}-to`}
        className={styles.input}
        value={parseDate(endDate)}
        onChange={onChangeEndDate.bind(this, searchKey)}
        onKeyDown={onEnter}
        InputProps={{ placeholder: "To date" }}
        {...otherProps}
      />
    </Grid>
  );
};