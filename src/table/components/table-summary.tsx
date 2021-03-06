import React from "react";
import styles from "../table.module.scss";
import { Typography } from "@material-ui/core";

type Props = {
  data: Record<string, any>[];
};

export const TableSummary = (props: Props) => {
  const { data } = props;
  return (
    <Typography className={styles.tableSummary}>
      Showing {data.length} records
    </Typography>
  );
};
