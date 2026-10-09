'use client';

import { GripVertical } from 'lucide-react';
import { TrashDuo, EditDuo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { DeleteConfirmPopover } from '@/components/ui/delete-confirm-popover';
import { Reorder } from 'motion/react';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => string;
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  onReorder?: (newData: T[]) => void;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  onReorder,
}: DataTableProps<T>) {
  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-background border-b">
          <tr>
            {onReorder && <th className="w-8 px-2 py-2"></th>}
            {columns.map((col) => (
              <th key={col.key} className="text-left px-3 py-2.5 text-xs font-medium ">
                {col.label}
              </th>
            ))}
            <th className="w-20 px-3 py-2"></th>
          </tr>
        </thead>
        <Reorder.Group as="tbody" axis="y" values={data} onReorder={onReorder || (() => {})}>
          {data.map((item, idx) => (
            <Reorder.Item
              key={item.id}
              value={item}
              as="tr"
              className={`border-b transition-colors ${
                idx === data.length - 1 ? 'border-b-0' : ''
              }`}
            >
              {onReorder && (
                <td className="px-2 py-1.5">
                  <div className="cursor-grab active:cursor-grabbing text-primary/90">
                    <GripVertical className="w-4 h-4" />
                  </div>
                </td>
              )}
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-1.5 bg-background">
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </td>
              ))}
              <td className="px-3 py-1.5 bg-background">
                <div className="flex items-center gap-1">
                  <Button
                    onClick={() => onEdit(item)}
                    variant="ghost"
                    size="icon-sm"
                    className="h-7 w-7 p-0 hover:bg-cherry/20 hover:text-cherry"
                  >
                    <EditDuo className="w-3.5 h-3.5" />
                  </Button>
                  <DeleteConfirmPopover
                    title="Delete this entry?"
                    description="Are you sure you want to delete this entry?"
                    confirmText="Delete"
                    onConfirm={() => onDelete(item.id)}
                    side="top"
                    align="end"
                    compact
                  >
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive data-[state=open]:bg-destructive/10 data-[state=open]:text-destructive cursor-pointer"
                    >
                      <TrashDuo className="w-3.5 h-3.5" />
                    </Button>
                  </DeleteConfirmPopover>
                </div>
              </td>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </table>
    </div>
  );
}
