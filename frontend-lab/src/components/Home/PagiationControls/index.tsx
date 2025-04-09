// libraries
import type { Dispatch, FC, SetStateAction } from 'react';
import { Button, HTMLSelect } from '@blueprintjs/core';
// config
import { PAGE_SIZE_CONFIG } from 'components/Home/config';

interface PaginationControlsProps {
  length: number;
  pagination: {
    pageSize: number;
    page: number;
  };
  setPagination: Dispatch<SetStateAction<{ page: number; pageSize: number }>>;
}

export const PaginationControls: FC<PaginationControlsProps> = ({ length, pagination, setPagination }) => {
  const totalPages = Math.ceil(length / pagination.pageSize);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination({ page: 1, pageSize: newPageSize });
  };

  return (
    <div className="pagination-controls">
      <Button
        disabled={pagination.page === 1}
        onClick={() => handlePageChange(pagination.page - 1)}
        text="Предыдущая"
      />

      <span>
        {`Страница ${pagination.page} из ${totalPages}`}
      </span>

      <Button
        disabled={pagination.page === totalPages || totalPages === 0}
        onClick={() => handlePageChange(pagination.page + 1)}
        text="Следующая"
      />

      <label>
        {'Строк на странице: '}
        <HTMLSelect
          iconName="caret-down"
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          value={pagination.pageSize}
        >
          {
              PAGE_SIZE_CONFIG.map((item) => (
                <option key={item.size} value={item.size}>{item.size}</option>
              ))
          }
        </HTMLSelect>
      </label>
    </div>
  );
};
