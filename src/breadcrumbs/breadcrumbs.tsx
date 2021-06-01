import * as React from "react";
import { Breadcrumb, IBreadcrumbItem } from "@fluentui/react/lib/Breadcrumb";
import { breadcrumbsStyles } from "./styles";
import { Shimmer } from "@fluentui/react";
import { commonStyles } from "../styles";

const items = (title: string[]) => {
  return title.map((item, index) => {
    return { text: item, key: item, isCurrentItem: index === title.length - 1 };
  }) as IBreadcrumbItem[];
};

export interface IBreadcrumbsProps {
  title: string[];
  count: string;
}

export const Breadcrumbs = ({ title, count }: IBreadcrumbsProps) => {
  return (
    <div style={commonStyles.alignCenter}>
      <Breadcrumb
        items={items(title)}
        ariaLabel="Breadcrumb with no maxDisplayedItems"
        overflowAriaLabel="More links"
        styles={breadcrumbsStyles}
      />
      {count === "null" ? (
        <Shimmer
          width="50px"
          style={commonStyles.alignSelfCenter}
          shimmerColors={{
            background: "white",
            shimmer: "#a3a2a0",
            shimmerWave: "white",
          }}
        />
      ) : (
        <div style={breadcrumbsStyles.count}>({count})</div>
      )}
    </div>
  );
};
