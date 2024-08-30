import { Table } from "antd";

function TableAdmin(props) {
  const { renderTableHeader, columns, tableData, onChange, isLoading, current, pageSize, total } = props;
  return <>
    <div className='manage-page-admin__table'>
      <Table
        title={renderTableHeader}
        columns={columns}
        dataSource={tableData}
        onChange={onChange}
        loading={isLoading}
        showSorterTooltip={{ target: 'full-header' }}
        rowKey="_id"
        pagination={{
          showTotal: (total, range) => {
            return <><p className='subtitle2'>{`${range[0]} - ${range[1]} trên ${total} hàng`}</p></>
          },
          current: current,
          pageSize: pageSize,
          total: total,
          pageSizeOptions: [5, 10, 20, 50, 100],
          showSizeChanger: true,
        }}
      />
    </div>
  </>
}
export default TableAdmin;