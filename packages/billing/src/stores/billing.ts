import { defineStore } from 'pinia'

interface BillItem {
  id: string
  type: string
  spec: string
  quantity: number
  unitPrice: number
}

interface Bill {
  month: string
  amount: number
  paid: boolean
  instances: number
  items: BillItem[]
}

interface Order {
  id: string
  month: string
  amount: number
  status: 'paid' | 'unpaid'
  createdAt: string
}

export const useBillingStore = defineStore('billing', {
  state: () => ({
    bills: [
      {
        month: '2025-07',
        amount: 1248.5,
        paid: false,
        instances: 8,
        items: [
          { id: 'b1', type: 'ECS', spec: 'ecs.g7.xlarge', quantity: 4, unitPrice: 280 },
          { id: 'b2', type: 'RDS', spec: 'rds.mysql.x8', quantity: 2, unitPrice: 180 },
          { id: 'b3', type: 'OSS', spec: '标准存储', quantity: 100, unitPrice: 0.13 },
          { id: 'b4', type: 'SLB', spec: 'slb.s2.small', quantity: 2, unitPrice: 24.25 },
        ],
      },
      {
        month: '2025-06',
        amount: 1086.0,
        paid: true,
        instances: 7,
        items: [
          { id: 'b5', type: 'ECS', spec: 'ecs.g7.xlarge', quantity: 3, unitPrice: 280 },
          { id: 'b6', type: 'RDS', spec: 'rds.mysql.x8', quantity: 2, unitPrice: 180 },
          { id: 'b7', type: 'OSS', spec: '标准存储', quantity: 80, unitPrice: 0.13 },
        ],
      },
      {
        month: '2025-05',
        amount: 956.4,
        paid: true,
        instances: 6,
        items: [
          { id: 'b8', type: 'ECS', spec: 'ecs.g6.large', quantity: 3, unitPrice: 240 },
          { id: 'b9', type: 'RDS', spec: 'rds.postgres.x4', quantity: 1, unitPrice: 100 },
        ],
      },
    ] as Bill[],
    orders: [
      {
        id: 'ORD-202507-001',
        month: '2025-07',
        amount: 1248.5,
        status: 'unpaid',
        createdAt: '2025-07-01 00:00:00',
      },
      {
        id: 'ORD-202506-001',
        month: '2025-06',
        amount: 1086.0,
        status: 'paid',
        createdAt: '2025-06-01 00:00:00',
      },
      {
        id: 'ORD-202505-001',
        month: '2025-05',
        amount: 956.4,
        status: 'paid',
        createdAt: '2025-05-01 00:00:00',
      },
    ] as Order[],
  }),

  getters: {
    availableMonths: (state) => state.bills.map((b) => b.month),
    getBillByMonth: (state) => (month: string) => state.bills.find((b) => b.month === month),
  },

  actions: {
    markPaid(month: string) {
      const bill = this.bills.find((b) => b.month === month)
      if (bill) {
        bill.paid = true
        const order = this.orders.find((o) => o.month === month)
        if (order) order.status = 'paid'
      }
    },
  },
})
