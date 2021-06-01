import React, { useCallback, useEffect, useState } from "react";
import Breadcrumbs from "../breadcrumbs";
import Toolbar from "../toolbar";
import DataTable from "../datatable";
import axios from "axios";
import { useDebounce } from "use-debounce";
import { IColumn, Spinner } from "@fluentui/react";
import InfiniteScroll from "react-infinite-scroll-component";

export interface IOverviewProps {
  title: string[];
  dataSource: string;
  loadingText?: string;
  dataEndText?: string;
  defaultSortedField?: string;
  token: string;
  searchPlaceholder?: string;
  filterField: string;
  withFilter: boolean;
  columns: IColumn[];
}

export const Overview = ({
  title,
  dataSource,
  token,
  withFilter,
  columns,
  filterField,
  searchPlaceholder,
  defaultSortedField,
  loadingText,
  dataEndText,
}: IOverviewProps) => {
  const [searchText, setSearchText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [textToSearch] = useDebounce(searchText, 1000);
  const [orderBy, setOrderBy] = useState(defaultSortedField || "");
  const [page, setPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [itemsCount, setItemsCount] = useState("null");
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState<any[]>([]);
  const [dataColumns, setDataColumns] = useState(columns);
  const [loading, setLoading] = useState(false);
  const [fullDataCount, setFullDataCount] = useState(0);

  const getInitialData = () => {
    let endpoint = dataSource + "?page=" + 1;
    if (orderBy.length > 0) {
      endpoint = endpoint + "&&orderby=" + orderBy;
    }
    if (filters.length > 0) {
      let endpointFiltered = filters
        .map((item) => `&${item.field}=${item.value}`)
        .toString();
      endpointFiltered = endpointFiltered.replaceAll(",&", "&");
      endpoint = endpoint + endpointFiltered;
    }
    if (textToSearch) {
      endpoint = endpoint + `&${filterField}=` + textToSearch;
    }
    axios
      .get(endpoint, {
        headers: {
          Authorization: token,
        },
      })
      .then((res: any) => {
        setData(res.data._data);
        setTotalPageCount(res.data._meta.pageCount);
        setItemsCount(res.data._meta.totalCount);
        setFullDataCount(res.data._meta.totalCount);
        setPage(2);
        setLoading(false);
        if (searchText.length > 0 || filters.length > 0) {
          setItemsCount(`${res.data._meta.totalCount} of ${fullDataCount}`);
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const setColumns = useCallback(
    (e: any, { fieldName = "" }: IColumn) => {
      let updatedOrderBy = orderBy === fieldName ? `-${fieldName}` : fieldName;
      setOrderBy(updatedOrderBy);
      setPage(1);
    },
    [orderBy]
  );

  useEffect(() => {
    setLoading(true);
    getInitialData();
    let updatedColumns = [...dataColumns];
    updatedColumns = updatedColumns.map((item) => {
      let isSorted = Boolean(
        item.fieldName && orderBy.includes(item.fieldName)
      );
      let isSortedDescending = !(item.fieldName && orderBy.includes("-"));
      return {
        ...item,
        isSorted,
        isSortedDescending,
        onColumnClick: setColumns,
      };
    });
    setDataColumns(updatedColumns);
  }, []);

  useEffect(() => {
    if (orderBy) {
      fetchMore();
    }
  }, [orderBy]);

  useEffect(() => {
    if (filters.length > 0) {
      setLoading(true);
      setPage(1);
    } else if (filters.length === 0) {
      setPage(1);
      getInitialData();
    }
  }, [filters]);

  useEffect(() => {
    if (textToSearch.length > 0) {
      setLoading(true);
      setPage(1);
    } else if (textToSearch.length === 0) {
      setPage(1);
      getInitialData();
    }
  }, [textToSearch]);

  const fetchMore = () => {
    if (page === 1) {
      setLoading(true);
    }
    let endpoint = dataSource + "?page=" + page;
    if (orderBy) {
      endpoint = endpoint + "&&orderby=" + orderBy;
    }
    if (textToSearch) {
      endpoint = endpoint + `&${filterField}=` + textToSearch;
    }
    if (filters.length > 0) {
      let endpointFiltered = filters
        .map((item) => `&${item.field}=${item.value}`)
        .toString();
      endpointFiltered = endpointFiltered.replaceAll(",&", "&");
      endpoint = endpoint + endpointFiltered;
    }
    axios
      .get(endpoint, {
        headers: {
          Authorization: token,
        },
      })
      .then((res: any) => {
        setData(data.concat(res.data._data));
        if (searchText.length > 0 || filters.length > 0) {
          setItemsCount(`${res.data._meta.totalCount} of ${fullDataCount}`);
        }
        setPage(page + 1);
        if (page === 1) {
          setLoading(false);
          setData(res.data._data);
          let updatedColumns = [...dataColumns];
          updatedColumns = updatedColumns.map((item) => {
            let isSorted = Boolean(
              item.fieldName && orderBy.includes(item.fieldName)
            );
            let isSortedDescending = !(item.fieldName && orderBy.includes("-"));
            return {
              ...item,
              isSorted,
              isSortedDescending,
              onColumnClick: setColumns,
            };
          });
          setDataColumns(updatedColumns);
        }
        if (filters.length > 0) {
          setTotalPageCount(res.data._meta.pageCount);
        }
      });
  };

  useEffect(() => {
    if (loading && textToSearch.length > 0) {
      fetchMore();
    } else if (loading && filters.length > 0) {
      fetchMore();
    }
  }, [loading]);

  return error.length === 0 ? (
    <>
      <Breadcrumbs title={title} count={itemsCount} />
      <Toolbar
        setSearchText={setSearchText}
        withFilter={withFilter}
        disabled={loading}
        searchPlaceholder={searchPlaceholder}
        onFilter={(items) => setFilters(items)}
      />
      <InfiniteScroll
        dataLength={data.length}
        next={fetchMore}
        hasMore={page <= totalPageCount}
        loader={
          data.length < 24 && textToSearch.length > 0 ? (
            loading ? (
              <Spinner
                label={loadingText || "Loading search results..."}
                styles={{ root: { marginTop: 32 } }}
              />
            ) : (
              <p style={{ textAlign: "center" }}>
                <b>{"No more results found!"}</b>
              </p>
            )
          ) : (
            <Spinner
              label={loadingText || "Loading Data..."}
              styles={{ root: { marginTop: 32 } }}
            />
          )
        }
        endMessage={
          loading ? (
            <Spinner
              label={loadingText || "Loading Data..."}
              styles={{ root: { marginTop: 32 } }}
            />
          ) : (
            <p style={{ textAlign: "center" }}>
              <b>{dataEndText || "Yay! You have seen it all"}</b>
            </p>
          )
        }
      >
        <DataTable
          searchText={searchText}
          loading={loading}
          data={data}
          columns={dataColumns}
          filterField={filterField}
        />
      </InfiniteScroll>
    </>
  ) : (
    <b>{error}</b>
  );
};
