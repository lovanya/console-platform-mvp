import type { CSSProperties, ReactNode } from 'react'

export interface TableColumn<T = Record<string, unknown>> {
  key: string
  title: ReactNode
  align?: 'left' | 'right' | 'center'
  width?: number | string
  render?: (value: T[keyof T], row: T) => ReactNode
}

interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[]
  data: T[]
  rowKey?: keyof T | string
}

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 14,
}

const theadRowStyle: CSSProperties = {
  background: '#fafafa',
  borderBottom: '1px solid #f0f0f0',
}

const thBase: CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontWeight: 600,
  fontSize: 13,
  color: '#333',
}

const tdBase: CSSProperties = {
  padding: '12px 16px',
}

export default function Table<T = Record<string, unknown>>({
  columns,
  data,
  rowKey = 'id' as keyof T,
}: TableProps<T>) {
  return (
    <table style={tableStyle}>
      <thead>
        <tr style={theadRowStyle}>
          {columns.map((col) => (
            <th
              key={col.key}
              style={{
                ...thBase,
                textAlign: col.align ?? 'left',
                width: col.width,
              }}
            >
              {col.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              style={{
                ...tdBase,
                textAlign: 'center',
                color: '#999',
                padding: 32,
              }}
            >
              暂无数据
            </td>
          </tr>
        ) : (
          data.map((row, i) => (
            <tr
              key={String(row[rowKey as keyof T] ?? i)}
              style={{ borderBottom: '1px solid #f0f0f0' }}
            >
              {columns.map((col) => {
                const raw = row[col.key as keyof T]
                return (
                  <td
                    key={col.key}
                    style={{
                      ...tdBase,
                      textAlign: col.align ?? 'left',
                    }}
                  >
                    {col.render ? col.render(raw, row) : (raw as ReactNode)}
                  </td>
                )
              })}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
