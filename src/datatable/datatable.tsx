import * as React from "react";
import {
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { ShimmeredDetailsList } from "@fluentui/react";
import { dataTableStyles } from "./styles";

export interface IDataTableState {
  columns: IColumn[];
  items: IDocument[];
}

export interface IDocument {
  key: string;
  name: string;
  value: string;
  iconName: string;
  fileType: string;
  modifiedBy: string;
  dateModified: string;
  dateModifiedValue: number;
  fileSize: string;
  fileSizeRaw: number;
}

export interface IDataTableProps {
  searchText: string;
  loading: boolean;
  data: any[];
  columns: IColumn[];
  filterField: string;
}

export class DataTable extends React.Component<
  IDataTableProps,
  IDataTableState
> {
  private _allItems: IDocument[];

  constructor(props: IDataTableProps) {
    super(props);
    this._allItems = _generateDocuments(props.data);

    this.state = {
      items: this._allItems,
      columns: props.columns,
    };
  }

  public render() {
    const { columns, items } = this.state;

    return (
      <div style={dataTableStyles.root}>
        <ShimmeredDetailsList
          items={items || []}
          columns={columns}
          selectionMode={SelectionMode.none}
          getKey={this._getKey}
          setKey="none"
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible={true}
          onItemInvoked={this._onItemInvoked}
          enableShimmer={this.props.loading}
        />
      </div>
    );
  }

  public componentDidUpdate(
    previousProps: any,
    previousState: IDataTableState
  ) {
    // if (previousProps.searchText !== this.props.searchText) {
    //   this._onChangeText(this.props.searchText);
    // }
    if (previousProps.columns !== this.props.columns) {
      this.setState({ columns: this.props.columns });
    }
    if (previousProps.data !== this.props.data) {
      this.setState({ items: this.props.data });
      this._allItems = _generateDocuments(this.props.data);
    }
  }

  private _getKey(item?: any, index?: number): string {
    return item && item.key;
  }

  // public _onChangeText = (text: string) => {
  //   let dataToFilter = [...this._allItems];
  //   let items = text
  //     ? dataToFilter.filter(
  //         (i: any) => i[this.props.filterField].toLowerCase().indexOf(text) > -1
  //       )
  //     : dataToFilter;
  //   this.setState({
  //     items,
  //   });
  // };

  private _onItemInvoked(item: any): void {
    alert(`Item invoked: ${item.name}`);
  }
}

// function _copyAndSort<T>(
//   items: T[],
//   columnKey: string,
//   isSortedDescending?: boolean
// ): T[] {
//   const key = columnKey as keyof T;
//   return items
//     .slice(0)
//     .sort((a: T, b: T) =>
//       (isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1
//     );
// }

function _generateDocuments(data: any[]) {
  const items: IDocument[] = data;
  return items;
}
