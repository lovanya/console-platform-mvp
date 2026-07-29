<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBillingStore } from '../stores/billing'
import { eventBus } from '@console/shared'

const store = useBillingStore()
const selectedMonth = ref('2025-07')

const currentBill = computed(() => store.getBillByMonth(selectedMonth.value))

function onMonthChange(month: string) {
  selectedMonth.value = month
}

function onPay() {
  store.markPaid(selectedMonth.value)
  // biome-ignore lint/suspicious/noExplicitAny: extending shared EventBus events
  eventBus.emit('billing:refresh' as any, {} as any)
}
</script>

<template>
  <div>
    <h2 style="margin: 0 0 16px 0;">账单总览</h2>

    <div style="display: flex; gap: 8px; margin-bottom: 24px;">
      <button
        v-for="month in store.availableMonths"
        :key="month"
        type="button"
        :style="{
          padding: '6px 12px',
          border: '1px solid',
          borderColor: month === selectedMonth ? '#1677ff' : '#d9d9d9',
          borderRadius: 4,
          background: month === selectedMonth ? '#e6f4ff' : '#fff',
          color: month === selectedMonth ? '#1677ff' : '#333',
          cursor: 'pointer',
        }"
        @click="onMonthChange(month)"
      >
        {{ month }}
      </button>
    </div>

    <div v-if="currentBill" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
      <div style="padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px; background: #fff;">
        <div style="font-size: 13px; color: #999;">本月账单</div>
        <div style="font-size: 28px; font-weight: 700; color: #1677ff; margin-top: 8px;">
          ¥{{ currentBill.amount.toFixed(2) }}
        </div>
      </div>
      <div style="padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px; background: #fff;">
        <div style="font-size: 13px; color: #999;">状态</div>
        <div style="font-size: 22px; font-weight: 600; margin-top: 8px; color: currentBill.paid ? '#52c41a' : '#faad14';">
          {{ currentBill.paid ? '已支付' : '待支付' }}
        </div>
      </div>
      <div style="padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px; background: #fff;">
        <div style="font-size: 13px; color: #999;">实例数</div>
        <div style="font-size: 28px; font-weight: 700; color: #333; margin-top: 8px;">
          {{ currentBill.instances }}
        </div>
      </div>
    </div>

    <div v-if="currentBill && !currentBill.paid" style="margin-bottom: 16px;">
      <button
        type="button"
        @click="onPay"
        style="padding: 10px 24px; background: #52c41a; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;"
      >
        立即支付
      </button>
    </div>

    <div v-if="currentBill">
      <h3>资源消耗明细</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr style="background: #fafafa; border-bottom: 1px solid #f0f0f0;">
            <th style="padding: 12px 16px; text-align: left;">资源类型</th>
            <th style="padding: 12px 16px; text-align: left;">规格</th>
            <th style="padding: 12px 16px; text-align: right;">数量</th>
            <th style="padding: 12px 16px; text-align: right;">单价(元)</th>
            <th style="padding: 12px 16px; text-align: right;">小计(元)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in currentBill.items" :key="item.id" style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 12px 16px;">{{ item.type }}</td>
            <td style="padding: 12px 16px;">{{ item.spec }}</td>
            <td style="padding: 12px 16px; text-align: right;">{{ item.quantity }}</td>
            <td style="padding: 12px 16px; text-align: right;">{{ item.unitPrice.toFixed(2) }}</td>
            <td style="padding: 12px 16px; text-align: right; font-weight: 600;">{{ (item.quantity * item.unitPrice).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>