<script setup lang="ts">
import { useRouter } from 'vue-router'
import { t } from '@/shared/config/messages'
import {
  FORNECEDOR_STATUS,
  fornecedorStatusLabel,
  fornecedorStatusTone,
  leadTimeStatusLabel,
  leadTimeStatusTone,
} from '@/entities/fornecedor'
import { useFornecedorCrud } from '@/features/fornecedor-crud'
import Button from '@/shared/ui/atoms/Button/Button.vue'
import Icon from '@/shared/ui/atoms/Icon/Icon.vue'
import Input from '@/shared/ui/atoms/Input/Input.vue'
import Label from '@/shared/ui/atoms/Label/Label.vue'
import Select from '@/shared/ui/atoms/Select/Select.vue'
import StatusBadge from '@/shared/ui/atoms/StatusBadge/StatusBadge.vue'
import SectionPanel from '@/shared/ui/molecules/SectionPanel/SectionPanel.vue'
import DashboardHeader from '@/shared/ui/organisms/DashboardHeader/DashboardHeader.vue'

const router = useRouter()

const {
  fornecedores,
  form,
  selectedId,
  isEditing,
  hasSearched,
  isLoading,
  isSaving,
  isDeleting,
  isBusy,
  feedback,
  pesquisar,
  selecionar,
  salvar,
  remover,
  novo,
} = useFornecedorCrud()

const statusOptions = FORNECEDOR_STATUS.map((status) => ({
  value: status,
  label: fornecedorStatusLabel(status),
}))
</script>

<template>
  <main class="fornecedores-page">
    <DashboardHeader
      :title="t('fornecedores.header.title')"
      :subtitle="t('fornecedores.header.subtitle')"
    />

    <div class="page-actions">
      <Button type="button" variant="secondary" @click="router.push('/pedidos-compra')">
        <Icon name="cart" :size="16" />
        {{ t('pedidoCompra.header.title') }}
      </Button>
    </div>

    <p v-if="feedback" class="feedback" :class="`feedback--${feedback.tone}`" role="status">
      <span class="feedback__dot" aria-hidden="true" />
      {{ feedback.message }}
    </p>

    <SectionPanel
      :title="t('fornecedores.form.title')"
      :description="t('fornecedores.form.description')"
    >
      <form class="form" @submit.prevent="salvar">
        <div class="form__grid">
          <div class="field">
            <Label for-id="fornecedor-nome">{{ t('fornecedores.field.nome') }}</Label>
            <Input id="fornecedor-nome" v-model="form.nome" :disabled="isBusy" />
          </div>

          <div class="field">
            <Label for-id="fornecedor-codigo">{{ t('fornecedores.field.codigo') }}</Label>
            <Input id="fornecedor-codigo" v-model="form.codigo" :disabled="isBusy" />
          </div>

          <div class="field">
            <Label for-id="fornecedor-documento">{{ t('fornecedores.field.documento') }}</Label>
            <Input id="fornecedor-documento" v-model="form.documento" :disabled="isBusy" />
          </div>

          <div class="field field--wide">
            <Label for-id="fornecedor-observacao">{{ t('fornecedores.field.observacao') }}</Label>
            <Input id="fornecedor-observacao" v-model="form.observacao" :disabled="isBusy" />
          </div>

          <div class="field">
            <Label for-id="fornecedor-lead-time">{{ t('fornecedores.field.leadTimeDias') }}</Label>
            <Input
              id="fornecedor-lead-time"
              v-model="form.leadTimeDias"
              type="number"
              :disabled="isBusy"
            />
          </div>

          <div class="field">
            <Label for-id="fornecedor-status">{{ t('fornecedores.field.status') }}</Label>
            <Select
              id="fornecedor-status"
              v-model="form.status"
              :options="statusOptions"
              :placeholder="t('fornecedores.option.any')"
              :disabled="isBusy"
            />
          </div>
        </div>

        <div class="form__actions">
          <div class="form__actions-group">
            <Button type="submit" :disabled="isBusy" :loading="isSaving">
              {{ t('fornecedores.action.save') }}
            </Button>
            <Button type="button" variant="secondary" :disabled="isBusy" @click="novo">
              {{ t('fornecedores.action.new') }}
            </Button>
            <Button
              type="button"
              variant="secondary"
              :disabled="isBusy"
              :loading="isLoading"
              @click="pesquisar"
            >
              {{ t('fornecedores.action.search') }}
            </Button>
          </div>

          <Button
            type="button"
            variant="danger"
            :disabled="isBusy || !isEditing"
            :loading="isDeleting"
            @click="remover"
          >
            {{ t('fornecedores.action.delete') }}
          </Button>
        </div>
      </form>
    </SectionPanel>

    <SectionPanel
      :title="t('fornecedores.results.title')"
      :description="t('fornecedores.results.description')"
    >
      <p v-if="isLoading" class="state">{{ t('fornecedores.state.loading') }}</p>
      <p v-else-if="!hasSearched" class="state">{{ t('fornecedores.state.initial') }}</p>
      <p v-else-if="fornecedores.length === 0" class="state">
        {{ t('fornecedores.state.empty') }}
      </p>

      <div v-else class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">{{ t('fornecedores.field.nome') }}</th>
              <th scope="col">{{ t('fornecedores.field.codigo') }}</th>
              <th scope="col">{{ t('fornecedores.field.documento') }}</th>
              <th scope="col">{{ t('fornecedores.field.leadTimeDias') }}</th>
              <th scope="col">{{ t('fornecedores.field.statusLeadTime') }}</th>
              <th scope="col">{{ t('fornecedores.field.status') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="fornecedor in fornecedores"
              :key="fornecedor.id"
              class="table__row"
              :class="{ 'table__row--selected': fornecedor.id === selectedId }"
              :aria-selected="fornecedor.id === selectedId"
              tabindex="0"
              @click="selecionar(fornecedor)"
              @keydown.enter.prevent="selecionar(fornecedor)"
              @keydown.space.prevent="selecionar(fornecedor)"
            >
              <td :data-label="t('fornecedores.field.nome')" class="table__cell--strong">
                {{ fornecedor.nome }}
              </td>
              <td :data-label="t('fornecedores.field.codigo')">{{ fornecedor.codigo }}</td>
              <td :data-label="t('fornecedores.field.documento')">
                {{ fornecedor.documento || '-' }}
              </td>
              <td :data-label="t('fornecedores.field.leadTimeDias')">
                {{ fornecedor.leadTimeDias ?? '-' }}
              </td>
              <td :data-label="t('fornecedores.field.statusLeadTime')">
                <StatusBadge
                  v-if="fornecedor.statusLeadTime"
                  :tone="leadTimeStatusTone(fornecedor.statusLeadTime)"
                  :label="leadTimeStatusLabel(fornecedor.statusLeadTime)"
                />
                <span v-else>-</span>
              </td>
              <td :data-label="t('fornecedores.field.status')">
                <StatusBadge
                  :tone="fornecedorStatusTone(fornecedor.ativo ? 'ATIVO' : 'INATIVO')"
                  :label="fornecedorStatusLabel(fornecedor.ativo ? 'ATIVO' : 'INATIVO')"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </SectionPanel>
  </main>
</template>

<style scoped>
.fornecedores-page {
  display: grid;
  gap: var(--pg-gutter);
  align-content: start;
  width: 100%;
  min-width: 0;
  max-width: 1280px;
}

.page-actions {
  display: flex;
  justify-content: flex-end;
}

.feedback {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  padding: 10px 14px;
  border: 1px solid var(--pg-color-border);
  border-radius: var(--pg-radius-sm);
  background: var(--pg-color-surface);
  box-shadow: var(--pg-shadow-sm);
  color: var(--pg-color-text-secondary);
  font-size: 0.82rem;
}

.feedback__dot {
  flex: 0 0 auto;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--pg-color-text-muted);
}

.feedback--success .feedback__dot {
  background: var(--pg-color-normal);
}

.feedback--error {
  color: var(--pg-color-critical);
}

.feedback--error .feedback__dot {
  background: var(--pg-color-critical);
}

.form {
  display: grid;
  gap: 14px;
}

.form__grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px 14px;
}

.field {
  display: grid;
  gap: 5px;
  align-content: start;
  grid-column: span 2;
  min-width: 0;
}

.field--wide {
  grid-column: span 4;
}

.form__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid var(--pg-color-border);
}

.form__actions-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.state {
  margin: 0;
  padding: 24px 8px;
  color: var(--pg-color-text-secondary);
  font-size: 0.82rem;
  text-align: center;
}

.table-scroll {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}

.table th {
  padding: 8px 12px;
  border-bottom: 1px solid var(--pg-color-border);
  color: var(--pg-color-text-muted);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
}

.table td {
  padding: 11px 12px;
  border-bottom: 1px solid var(--pg-color-border);
  color: var(--pg-color-text-secondary);
  vertical-align: middle;
}

.table__cell--strong {
  color: var(--pg-color-text-primary);
  font-weight: 600;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table__row {
  cursor: pointer;
  transition: background-color 140ms ease;
}

.table__row:hover td {
  background: var(--pg-color-blue-50);
}

.table__row--selected td {
  background: var(--pg-color-blue-100);
  color: var(--pg-color-text-primary);
}

.table__row--selected td:first-child {
  box-shadow: inset 3px 0 0 var(--pg-color-blue-700);
}

.table__row:focus-visible {
  outline: 2px solid var(--pg-color-blue-600);
  outline-offset: -2px;
}

@media (max-width: 1180px) {
  .form__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .form__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .field--wide {
    grid-column: span 2;
  }

  .form__actions-group {
    flex: 1 1 100%;
  }
}

@media (max-width: 640px) {
  .form__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .field--wide {
    grid-column: span 1;
  }

  .table thead {
    display: none;
  }

  .table,
  .table tbody,
  .table tr,
  .table td {
    display: block;
    width: 100%;
  }

  .table__row {
    margin-bottom: 10px;
    border: 1px solid var(--pg-color-border);
    border-radius: var(--pg-radius-sm);
    background: var(--pg-color-surface);
  }

  .table__row--selected {
    border-color: var(--pg-color-blue-600);
  }

  .table__row--selected td,
  .table__row:hover td {
    background: transparent;
  }

  .table__row--selected td:first-child {
    box-shadow: none;
  }

  .table td {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 12px;
    text-align: right;
  }

  .table td::before {
    content: attr(data-label);
    color: var(--pg-color-text-muted);
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .table tbody tr td:last-child {
    border-bottom: none;
  }
}
</style>