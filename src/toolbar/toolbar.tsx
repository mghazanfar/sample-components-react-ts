import * as React from "react";
import {
  Stack,
  IStackTokens,
  PrimaryButton,
  CommandBarButton,
  IIconProps,
  IContextualMenuProps,
} from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { Search } from "../search/search";
import FilterPanel from "../filterPanel";
import FilterChip from "../filterChip";
import { toolbarStyles } from "./styles";

const itemStyles: React.CSSProperties = {
  alignItems: "center",
  display: "flex",
};
const importIcon: IIconProps = { iconName: "Download" };

// Tokens definition
const stackTokens: IStackTokens = { childrenGap: 5 };
const menuProps: IContextualMenuProps = {
  items: [
    {
      key: "emailMessage",
      text: "Email message",
      iconProps: { iconName: "Mail" },
    },
    {
      key: "calendarEvent",
      text: "Calendar event",
      iconProps: { iconName: "Calendar" },
    },
  ],
};

export interface IToolbarProps {
  setSearchText: (value: string) => void;
  onFilter: (items: { placeholder: string; value: string }[]) => void;
  withFilter: boolean;
  disabled: boolean;
  searchPlaceholder?: string;
}

export const Toolbar = ({
  setSearchText,
  withFilter,
  disabled,
  searchPlaceholder,
  onFilter,
}: IToolbarProps) => {
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);
  const [filtersDetails, setFiltersDetails] = React.useState<any[]>([]);
  const [filterToRemove, setFilterToRemove] = React.useState<any[]>([]);
  const filterIcon: IIconProps = { iconName: "Filter" };

  React.useEffect(() => {
    onFilter(filtersDetails);
  }, [filtersDetails]);

  return (
    <>
      {withFilter && (
        <FilterPanel
          open={isOpen}
          dismissPanel={dismissPanel}
          filterToRemove={filterToRemove}
          getFiltersDetails={(filters) => {
            setFiltersDetails(filters);
            onFilter && onFilter(filters);
          }}
        />
      )}
      <Stack tokens={stackTokens}>
        <Stack horizontal horizontalAlign="space-between">
          <div style={itemStyles}>
            <PrimaryButton
              text="Create new"
              style={toolbarStyles.search}
              onClick={(e) => alert("I'll be used to create a new project!")}
            />
            <Search
              setSearchText={setSearchText}
              underline={filtersDetails.length === 0}
              disabled={disabled}
              searchPlaceholder={searchPlaceholder}
            />
            {filtersDetails.length > 0 && (
              <div style={{ ...toolbarStyles.chipContainer, flexWrap: "wrap" }}>
                {filtersDetails.map((item: any, index: number) => (
                  <FilterChip
                    id={item.value}
                    onClose={(id) => {
                      setFiltersDetails([
                        ...filtersDetails.filter((item) => item.value !== id),
                      ]);
                      setFilterToRemove(
                        filtersDetails.filter((item) => item.value === id)
                      );
                    }}
                  >
                    {item.value}
                  </FilterChip>
                ))}
                <div
                  onClick={() => setFiltersDetails([])}
                  style={toolbarStyles.removeFilters}
                >
                  Remove filters
                </div>
              </div>
            )}
          </div>
          <div style={itemStyles}>
            {withFilter && filtersDetails.length > 0 ? (
              <PrimaryButton
                text="Filter"
                style={toolbarStyles.filterButton}
                iconProps={filterIcon}
                onClick={openPanel}
              />
            ) : (
              withFilter && (
                <CommandBarButton
                  disabled={disabled}
                  onClick={openPanel}
                  style={toolbarStyles.filterButtonLight}
                  iconProps={filterIcon}
                  text="Filter"
                />
              )
            )}
            <CommandBarButton
              iconProps={importIcon}
              text="Exporteer"
              style={toolbarStyles.importButton}
              menuProps={menuProps}
            />
          </div>
        </Stack>
      </Stack>
    </>
  );
};
