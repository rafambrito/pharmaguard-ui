<script setup lang="ts">
import { onMounted } from 'vue'
import { t } from '@/shared/config/messages'
import {
  MEDICAMENTO_CRITICIDADES,
  MEDICAMENTO_STATUS,
  medicamentoCriticidadeLabel,
  medicamentoCriticidadeTone,
  medicamentoStatusLabel,
  medicamentoStatusTone,
} from '@/entities/medicamento'
import { useMedicamentoCrud } from '@/features/medicamento-crud'
import Button from '@/shared/ui/atoms/Button/Button.vue'
import Input from '@/shared/ui/atoms/Input/Input.vue'
import Label from '@/shared/ui/atoms/Label/Label.vue'
import Select from '@/shared/ui/atoms/Select/Select.vue'
import StatusBadge from '@/shared/ui/atoms/StatusBadge/StatusBadge.vue'
import SectionPanel from '@/shared/ui/molecules/SectionPanel/SectionPanel.vue'
import DashboardHeader from '@/shared/ui/organisms/DashboardHeader/DashboardHeader.vue'

const {
  medicamentos,
  categorias,
  unidadesMedida,
  form,
  selectedId,
  isEditing,
  hasSearched,
  isLoading,
  isLoadingSupport,
  isSaving,
  isDeleting,
  isBusy,
  feedback,
  carregarApoio,
  pesquisar,
  selecionar,
  salvar,
  remover,
  novo,
} = useMedicamentoCrud()

const criticidadeOptions = MEDICAMENTO_CRITICIDADES.map((criticidade) => ({
  value: criticidade,
  label: medicamentoCriticidadeLabel(criticidade),
}))

const statusOptions = MEDICAMENTO_STATUS.map((status) => ({
  value: status,
  label: medicamentoStatusLabel(status),
}))

onMounted(() => {
  void carregarApoio()
})
</script>

<template>
  <main class="medicamentos-page">
    <DashboardHeader
      :title="t('medicamentos.header.title')"
      :subtitle="t('medicamentos.header.subtitle')"
    />

    <p v-if="feedback" class="feedback" :class="`feedback--${feedback.tone}`" role="status">
      <span class="feedback__dot" aria-hidden="true" />
      {{ feedback.message }}
    </p>

    <SectionPanel
      :title="t('medicamentos.form.title')"
      :description="t('medicamentos.form.description')"
    >
      <form class="form" @submit.prevent="salvar">
        <div class="form__grid">
          <div class="field">
            <Label for-id="medicamento-nome">{{ t('medicamentos.field.nome') }}</Label>
            <Input id="medicamento-nome" v-model="form.nome" :disabled="isBusy" />
          </div>

          <div class="field">
            <Label for-id="medicamento-apresentacao">
              {{ t('medicamentos.field.apresentacao') }}
            </Label>
            <Input id="medicamento-apresentacao" v-model="form.apresentacao" :disabled="isBusy" />
          </div>

          <div class="field field--wide">
            <Label for-id="medicamento-descricao">{{ t('medicamentos.field.descricao') }}</Label>
            <Input id="medicamento-descricao" v-model="form.descricao" :disabled="isBusy" />
          </div>

          <div class="field">
            <Label for-id="medicamento-categoria">{{ t('medicamentos.field.categoria') }}</Label>
            <Select
              id="medicamento-categoria"
              v-model="form.categoria"
              :options="categorias.map((categoria) => ({ value: categoria.codigo, label: categoria.nome }))"
              :placeholder="t('medicamentos.option.any')"
              :disabled="isBusy"
            />
          </div>

          <div class="field">
            <Label for-id="medicamento-unidade-medida">
              {{ t('medicamentos.field.unidadeMedida') }}
            </Label>
            <Select
              id="medicamento-unidade-medida"
              v-model="form.unidadeMedidaId"
              :options="unidadesMedida.map((unidade) => ({ value: String(unidade.id), label: `${unidade.nome} (${unidade.sigla})` }))"
              :placeholder="t('medicamentos.option.any')"
              :disabled="isBusy"
            />
          </div>

          <div class="field">
            <Label for-id="medicamento-criticidade">
              {{ t('medicamentos.field.criticidade') }}
            </Label>
            <Select
              id="medicamento-criticidade"
              v-model="form.criticidade"
              :options="criticidadeOptions"
              :placeholder="t('medicamentos.option.any')"
              :disabled="isBusy"
            />
          </div>

          <div class="field">
            <Label for-id="medicamento-status">{{ t('medicamentos.field.status') }}</Label>
            <Select
              id="medicamento-status"
              v-model="form.status"
              :options="statusOptions"
              :placeholder="t('medicamentos.option.any')"
              :disabled="isBusy"
            />
          </div>
        </div>

        <p v-if="isLoadingSupport" class="form__hint">{{ t('medicamentos.state.loadingSupport') }}</p>

        <div class="form__actions">
          <div class="form__actions-group">
            <Button type="submit" :disabled="isBusy" :loading="isSaving">
              {{ t('medicamentos.action.save') }}
            </Button>
            <Button type="button" variant="secondary" :disabled="isBusy" @click="novo">
              {{ t('medicamentos.action.new') }}
            </Button>
            <Button
              type="button"
              variant="secondary"
              :disabled="isBusy"
              :loading="isLoading"
              @click="pesquisar"
            >
              {{ t('medicamentos.action.search') }}
            </Button>
          </div>

          <Button
            type="button"
            variant="danger"
            :disabled="isBusy || !isEditing"
            :loading="isDeleting"
            @click="remover"
          >
            {{ t('medicamentos.action.delete') }}
          </Button>
        </div>
      </form>
    </SectionPanel>

    <SectionPanel
      :title="t('medicamentos.results.title')"
      :description="t('medicamentos.results.description')"
    >
      <p v-if="isLoading" class="state">{{ t('medicamentos.state.loading') }}</p>
      <p v-else-if="!hasSearched" class="state">{{ t('medicamentos.state.initial') }}</p>
      <p v-else-if="medicamentos.length === 0" class="state">{{ t('medicamentos.state.empty') }}</p>

      <div v-else class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">{{ t('medicamentos.field.nome') }}</th>
              <th scope="col">{{ t('medicamentos.field.apresentacao') }}</th>
              <th scope="col">{{ t('medicamentos.field.categoria') }}</th>
              <th scope="col">{{ t('medicamentos.field.unidadeMedida') }}</th>
              <th scope="col">{{ t('medicamentos.field.criticidade') }}</th>
              <th scope="col">{{ t('medicamentos.field.status') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="medicamento in medicamentos"
              :key="medicamento.id"
              class="table__row"
              :class="{ 'table__row--selected': medicamento.id === selectedId }"
              :aria-selected="medicamento.id === selectedId"
              tabindex="0"
              @click="selecionar(medicamento)"
              @keydown.enter.prevent="selecionar(medicamento)"
              @keydown.space.prevent="selecionar(medicamento)"
            >
              <td :data-label="t('medicamentos.field.nome')" class="table__cell--strong">
                {{ medicamento.nome }}
              </td>
              <td :data-label="t('medicamentos.field.apresentacao')">
                {{ medicamento.apresentacao }}
              </td>
              <td :data-label="t('medicamentos.field.categoria')">
                {{ medicamento.categoria.nome }}
              </td>
              <td :data-label="t('medicamentos.field.unidadeMedida')">
                {{ medicamento.unidadeMedida.sigla }}
              </td>
              <td :data-label="t('medicamentos.field.criticidade')">
                <StatusBadge
                  :tone="medicamentoCriticidadeTone(medicamento.criticidade)"
                  :label="medicamentoCriticidadeLabel(medicamento.criticidade)"
                />
              </td>
              <td :data-label="t('medicamentos.field.status')">
                <StatusBadge
                  :tone="medicamentoStatusTone(medicamento.ativo ? 'ATIVO' : 'INATIVO')"
                  :label="medicamentoStatusLabel(medicamento.ativo ? 'ATIVO' : 'INATIVO')"
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
.medicamentos-page {
  display: grid;
  gap: var(--pg-gutter);
  align-content: start;
  width: 100%;
  min-width: 0;
  max-width: 1280px;
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

.form__hint {
  margin: 0;
  color: var(--pg-color-text-muted);
  font-size: 0.75rem;
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