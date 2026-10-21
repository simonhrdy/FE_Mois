import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { type TableCellProps } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import type { Breakpoint, SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';

export interface TableColumn<T> {
  id: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: TableCellProps['align'];

  hideBelow?: Breakpoint;

  isRowHeader?: boolean;
}

interface AppTableProps<T> {
  caption: string;
  columns: readonly TableColumn<T>[];
  rows: readonly T[];
  getRowKey: (row: T) => string;
  footer?: ReactNode;
}

function visibilitySx(hideBelow?: Breakpoint): SxProps<Theme> | undefined {
  return hideBelow ? { display: { xs: 'none', [hideBelow]: 'table-cell' } } : undefined;
}

export function AppTable<T>({ caption, columns, rows, getRowKey, footer }: AppTableProps<T>) {
  return (
    <>
      <TableContainer>
        <Table aria-label={caption}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  scope="col"
                  sx={visibilitySx(column.hideBelow)}
                >
                  {column.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={getRowKey(row)} hover>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    component={column.isRowHeader ? 'th' : 'td'}
                    scope={column.isRowHeader ? 'row' : undefined}
                    sx={visibilitySx(column.hideBelow)}
                  >
                    {column.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {footer}
    </>
  );
}
