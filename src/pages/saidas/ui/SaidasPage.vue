<script setup lang="ts">
import { onMounted } from 'vue'
import { t } from '@/shared/config/messages'
import { SAIDA_ESTOQUE_MOTIVOS, saidaEstoqueMotivoLabel } from '@/entities/saida-estoque'
import { useSaidaEstoqueCrud } from '@/features/saida-estoque-crud'
import Button from '@/shared/ui/atoms/Button/Button.vue'
import Input from '@/shared/ui/atoms/Input/Input.vue'
import Label from '@/shared/ui/atoms/Label/Label.vue'
import Select from '@/shared/ui/atoms/Select/Select.vue'
import SectionPanel from '@/shared/ui/molecules/SectionPanel/SectionPanel.vue'
import DashboardHeader from '@/shared/ui/organisms/DashboardHeader/DashboardHeader.vue'

const {
  saidas,
  medicamentos,
  unidadesSaude,
  form,
  selectedId,
  isViewing,
  hasSearched,
  isLoading,
  isLoadingSupport,
  isSaving,
  isBusy,
  feedback,
  carregarApoio,
  pesquisar,
  selecionar,
  salvar,
  novo,
} = useSaidaEstoqueCrud()

const motivoOptions = SAIDA_ESTOQUE_MOTIVOS.filter((motivo) => motivo !== 'DISPENSACAO').map((motivo) => ({
  value: motivo,
  label: saidaEstoqueMotivoLabel(motivo),
}))

function medicamentoLabel(id: number): string {
  const medicamento = medicamentos.value.find((item) => item.id === id)
  return medicamento ? `${medicamento.nome} - ${medicamento.apresentacao}` : String(id)
}

function unidadeSaudeLabel(id: number): string {
  const unidade = unidadesSaude.value.find((item) => item.id === id)
  return unidade ? unidade.nome : String(id)
}

function lotesConsumidosLabel(lotes: { numeroLote: string; quantidadeConsumida: number }[]): string {
  return lotes.map((lote) => `${lote.numeroLote} (${lote.quantidadeConsumida})`).join(', ') || '-'
}

onMounted(() => {
  void carregarApoio()
})
</script>

<template>
  <main class="saidas-page">
    <DashboardHeader
      :title="t('saidasEstoque.header.title')"
      :subtitle="t('saidasEstoque.header.subtitle')"
    />

    <p v-if="feedback" class="feedback" :class="`feedback--${feedback.tone}`" role="status">
      <span class="feedback__dot" aria-hidden="true" />
      {{ feedback.message }}
    </p>

    <SectionPanel
      :title="t('saidasEstoque.form.title')"
      :description="t('saidasEstoque.form.description')"
    >
      <form class="form" @submit.prevent="salvar">
        <div class="form__grid">
          <div class="field">
            <Label for-id="saida-unidade">{{ t('saidasEstoque.field.unidade') }}</Label>
            <Select
              id="saida-unidade"
              v-model="form.unidadeId"
              :options="unidadesSaude.map((unidade) => ({ value: String(unidade.id), label: unidade.nome }))"
              :placeholder="t('saidasEstoque.option.select')"
              :disabled="isBusy || isViewing"
            />
          </div>

          <div class="field">
            <Label for-id="saida-medicamento">{{ t('saidasEstoque.field.medicamento') }}</Label>
            <Select
              id="saida-medicamento"
              v-model="form.medicamentoId"
              :options="medicamentos.map((medicamento) => ({ value: String(medicamento.id), label: `${medicamento.nome} - ${medicamento.apresentacao}` }))"
              :placeholder="t('saidasEstoque.option.select')"
              :disabled="isBusy || isViewing"
            />
          </div>

          <div class="field">
            <Label for-id="saida-quantidade">{{ t('saidasEstoque.field.quantidade') }}</Label>
            <Input
              id="saida-quantidade"
              v-model="form.quantidade"
              type="number"
              :disabled="isBusy || isViewing"
            />
          </div>

          <div class="field">
            <Label for-id="saida-motivo">{{ t('saidasEstoque.field.motivo') }}</Label>
            <Select
              id="saida-motivo"
              v-model="form.motivo"
              :options="motivoOptions"
              :placeholder="t('saidasEstoque.option.select')"
              :disabled="isBusy || isViewing"
            />
          </div>

          <div class="field field--wide">
            <Label for-id="saida-observacao">{{ t('saidasEstoque.field.observacao') }}</Label>
            <Input id="saida-observacao" v-model="form.observacao" :disabled="isBusy || isViewing" />
          </div>
        </div>

        <p v-if="isLoadingSupport" class="form__hint">{{ t('saidasEstoque.state.loadingSupport') }}</p>
        <p v-else-if="isViewing" class="form__hint">{{ t('saidasEstoque.hint.readOnly') }}</p>

        <div class="form__actions">
          <div class="form__actions-group">
            <Button type="submit" :disabled="isBusy || isViewing" :loading="isSaving">
              {{ t('saidasEstoque.action.save') }}
            </Button>
            <Button type="button" variant="secondary" :disabled="isBusy" @click="novo">
              {{ t('saidasEstoque.action.new') }}
            </Button>
            <Button
              type="button"
              variant="secondary"
              :disabled="isBusy"
              :loading="isLoading"
              @click="pesquisar"
            >
              {{ t('saidasEstoque.action.search') }}
            </Button>
          </div>
        </div>
      </form>
    </SectionPanel>

    <SectionPanel
      :title="t('saidasEstoque.results.title')"
      :description="t('saidasEstoque.results.description')"
    >
      <p v-if="isLoading" class="state">{{ t('saidasEstoque.state.loading') }}</p>
      <p v-else-if="!hasSearched" class="state">{{ t('saidasEstoque.state.initial') }}</p>
      <p v-else-if="saidas.length === 0" class="state">{{ t('saidasEstoque.state.empty') }}</p>

      <div v-else class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">{{ t('saidasEstoque.field.unidade') }}</th>
              <th scope="col">{{ t('saidasEstoque.field.medicamento') }}</th>
              <th scope="col">{{ t('saidasEstoque.field.quantidade') }}</th>
              <th scope="col">{{ t('saidasEstoque.field.motivo') }}</th>
              <th scope="col">{{ t('saidasEstoque.field.lotesConsumidos') }}</th>
              <th scope="col">{{ t('saidasEstoque.field.dataSaida') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="saida in saidas"
              :key="saida.id"
              class="table__row"
              :class="{ 'table__row--selected': saida.id === selectedId }"
              :aria-selected="saida.id === selectedId"
              tabindex="0"
              @click="selecionar(saida)"
              @keydown.enter.prevent="selecionar(saida)"
              @keydown.space.prevent="selecionar(saida)"
            >
              <td :data-label="t('saidasEstoque.field.unidade')" class="table__cell--strong">
                {{ unidadeSaudeLabel(saida.unidadeId) }}
              </td>
              <td :data-label="t('saidasEstoque.field.medicamento')">
                {{ medicamentoLabel(saida.medicamentoId) }}
              </td>
              <td :data-label="t('saidasEstoque.field.quantidade')">
                {{ saida.quantidadeTotal }}
              </td>
              <td :data-label="t('saidasEstoque.field.motivo')">
                {{ saidaEstoqueMotivoLabel(saida.motivo) }}
              </td>
              <td :data-label="t('saidasEstoque.field.lotesConsumidos')">
                {{ lotesConsumidosLabel(saida.lotesConsumidos) }}
              </td>
              <td :data-label="t('saidasEstoque.field.dataSaida')">
                {{ saida.dataSaida || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </SectionPanel>
  </main>
</template>

<style scoped>
.saidas-page {
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