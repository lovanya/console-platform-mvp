<script setup lang="ts">
import { useBillingStore } from '../stores/billing'

const store = useBillingStore()
</script>

<template>
  <div>
    <h2 style="margin: 0 0 16px 0;">订单列表</h2>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <thead>
        <tr style="background: #fafafa; border-bottom: 1px solid #f0f0f0;">
          <th style="padding: 12px 16px; text-align: left;">订单号</th>
          <th style="padding: 12px 16px; text-align: left;">月份</th>
          <th style="padding: 12px 16px; text-align: right;">金额</th>
          <th style="padding: 12px 16px; text-align: left;">状态</th>
          <th style="padding: 12px 16px; text-align: left;">创建时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in store.orders" :key="order.id" style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px 16px;">{{ order.id }}</td>
          <td style="padding: 12px 16px;">{{ order.month }}</td>
          <td style="padding: 12px 16px; text-align: right;">¥{{ order.amount.toFixed(2) }}</td>
          <td style="padding: 12px 16px;">
            <span :style="{ color: order.status === 'paid' ? '#52c41a' : '#faad14' }">
              {{ order.status === 'paid' ? '已支付' : '待支付' }}
            </span>
          </td>
          <td style="padding: 12px 16px;">{{ order.createdAt }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>