// @flow
import React from "react";
import classNames from "classnames";
import styles from "./selection-grid.module.scss";
import { GridCell } from "./components/grid-cell";
import { GridHeader } from "./components/grid-header";
import { generateColHeaders, generateRowHeaders, validateGridData } from "./grid-utils";

type Props = {
  /** Data to be displayed in grid */
  gridData: Array<Array<any>>,

  /** Number of rows in the grid */
  numRows: number,

  /** Number of columns in the grid */
  numCols: number,

  /** A set of selected cell indices */
  selectedCoordinates: Array<GridCellCoordinate>,

  /** Custom cell rendering function */
  cellRenderer: GridCellInfo => Node,

  /** Onclick handler for selecting cell */
  onSelect: GridCellInfo => void,

  /** Dictates whether to show the row/column header */
  showHeader?: boolean,

  /**
   * Provides classNames to the grid and its sub-components. Options include:
   *
   *  - `root`
   *
   *  - `header` (applied to the row/column headers)
   *
   *  - `row` (applied to each row of the grid. Can take a function `(rowIndex: number) => classname: string` to help
   *    specify a className for any specific row)
   *
   *  - `cell` (applied to each cell. Can take a function `(gridCellInfo: GridCellInfo) => classname: string` to help
   *    specify a className for any specific cell)
   *
   *  - `cellContent` (applied to content div inside each cell)
   */
  classes?: SelectionGridClasses,

  /** Should return true if cell is selectable. By default, it'll check if the instance at the position is not null. */
  isCellSelectable?: GridCellInfo => boolean,

  /** Should return true if cell is empty. By default, it'll check if the instance at the position is null. */
  isCellEmpty?: GridCellInfo => boolean,
};

export const SelectionGrid = (props: Props) => {
  const {
    gridData,
    numCols,
    numRows,
    selectedCoordinates,
    classes = {},
    showHeader = true,
    onSelect,
    cellRenderer,
    isCellSelectable = ({ instance }) => instance != null,
    isCellEmpty = ({ instance }) => instance == null,
  } = props;

  try {
    validateGridData(numRows, numCols, gridData);
  } catch (error) {
    console.error(error.message);
    throw error;
  }

  const colHeaders = generateColHeaders(numCols);
  const rowHeaders = generateRowHeaders(numRows);
  const calculateCellIndex = ({ rowIndex, colIndex }: GridCellCoordinate) => {
    return rowIndex * numCols + colIndex;
  };

  const selectedIndices = new Set();
  selectedCoordinates.forEach(coordinate => {
    const { rowIndex, colIndex } = coordinate;
    if (rowIndex >= 0 && rowIndex < numRows && colIndex >= 0 && colIndex < numCols) {
      selectedIndices.add(calculateCellIndex(coordinate));
    }
  });

  return (
    <div className={classNames(styles.grid, classes.root)}>
      {showHeader && (
        <div className={classNames(styles.row, classes.row)}>
          <GridHeader classes={classes} />
          {colHeaders.map((header, index) => {
            return (
              <GridHeader
                key={index}
                classes={classes}
              >{header}
              </GridHeader>
            );
          })}
        </div>
      )}
      {gridData.map((row, rowIndex) => {
        let rowClass = classes.row;
        if (typeof classes.row === "function") {
          rowClass = classes.row(rowIndex);
        }
        return (
          <div
            className={classNames(styles.row, rowClass)}
            key={rowIndex}
          >
            {showHeader && (
              <GridHeader classes={classes}>{rowHeaders[rowIndex]}</GridHeader>
            )}
            {row.map((instance, colIndex) => {
              const cellIndex = rowIndex * numCols + colIndex;
              const gridCellInfo = {
                rowIndex,
                colIndex,
                cellIndex,
                instance,
              };
              return (
                <GridCell
                  key={cellIndex}
                  gridCellInfo={gridCellInfo}
                  classes={classes}
                  isSelectable={isCellSelectable(gridCellInfo)}
                  isSelected={selectedIndices.has(cellIndex)}
                  isEmpty={isCellEmpty(gridCellInfo)}
                  onSelect={onSelect}
                  cellRenderer={cellRenderer}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};