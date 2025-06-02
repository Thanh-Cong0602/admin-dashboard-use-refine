import CustomAvatar from "@/components/custom-avatar";
import { Text } from "@/components/text";
import { COMPANIES_LIST_QUERY } from "@/graphql/queries";
import { Company } from "@/graphql/schema.types";
import { currencyNumber } from "@/utilities";
import { SearchOutlined } from "@ant-design/icons";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  FilterDropdown,
  List,
  useTable,
} from "@refinedev/antd";
import { getDefaultFilter, HttpError, useGo } from "@refinedev/core";
import { Input, Space, Table } from "antd";

export const CompanyList = ({ children }: React.PropsWithChildren) => {
  const go = useGo();

  const { tableProps, filters } = useTable<Company, HttpError, Company>({
    resource: "companies",
    onSearch: (values) => {
      return [
        {
          field: "name",
          operator: "contains",
          value: values.name,
        },
      ];
    },
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "name",
          operator: "contains",
          value: undefined,
        },
      ],
    },
    pagination: {
      pageSize: 12,
    },
    meta: {
      gqlQuery: COMPANIES_LIST_QUERY,
    },
  });

  return (
    <>
      <List
        breadcrumb={false}
        headerButtons={() => (
          <CreateButton
            onClick={() => {
              go({
                to: {
                  resource: "companies",
                  action: "create",
                },
                options: {
                  keepQuery: true,
                },
                type: "replace",
              });
            }}
          />
        )}
      >
        <Table
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
          }}
          rowKey="id"
        >
          <Table.Column<Company>
            dataIndex="name"
            title="Company Title"
            defaultFilteredValue={getDefaultFilter("id", filters)}
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Company" />
              </FilterDropdown>
            )}
            render={(_, record) => {
              return (
                <Space>
                  <CustomAvatar
                    shape="square"
                    name={record.name}
                    src={record.avatarUrl}
                  />
                  <Text style={{ whiteSpace: "nowrap" }}>{record.name}</Text>
                </Space>
              );
            }}
          />

          <Table.Column<Company>
            dataIndex={"totalRevenue"}
            title="Open deals amount"
            render={(_, company) => {
              return (
                <Text>
                  {currencyNumber(company?.dealsAggregate?.[0].sum?.value || 0)}
                </Text>
              );
            }}
          />

          <Table.Column<Company>
            fixed="right"
            dataIndex="id"
            title="Actions"
            render={(value) => (
              <Space>
                <EditButton hideText size="small" recordItemId={value} />

                <DeleteButton hideText size="small" recordItemId={value} />
              </Space>
            )}
          />
        </Table>
      </List>
      {children}
    </>
  );
};
