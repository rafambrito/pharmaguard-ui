<script setup lang="ts">
interface Column {
  key: string
  label: string
}

type CellValue = string | number | null
type RowData = Record<string, CellValue>

interface Props {
  columns: Column[]
  rows: RowData[]
}

defineProps<Props>()
</script>

<template>
  <div class="pg-table-wrapper">
    <table class="pg-table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
          <td v-for="column in columns" :key="column.key">{{ row[column.key] ?? '-' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.pg-table-wrapper {
  overflow-x: auto;
}

.pg-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  border: 1px solid #dbe6f2;
  padding: 10px;
  text-align: left;
}

th {
  background: #f4f8fd;
}
</style>
