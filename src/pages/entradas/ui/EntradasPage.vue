<script setup lang="ts">
import { onMounted } from 'vue'
import { t } from '@/shared/config/messages'
import { ENTRADA_ESTOQUE_ORIGENS, entradaEstoqueOrigemLabel } from '@/entities/entrada-estoque'
import { useEntradaEstoqueCrud } from '@/features/entrada-estoque-crud'
import { formatDate } from '@/shared/utils'
import Button from '@/shared/ui/atoms/Button/Button.vue'
import Input from '@/shared/ui/atoms/Input/Input.vue'
import Label from '@/shared/ui/atoms/Label/Label.vue'
import Select from '@/shared/ui/atoms/Select/Select.vue'
import SectionPanel from '@/shared/ui/molecules/SectionPanel/SectionPanel.vue'
import DashboardHeader from '@/shared/ui/organisms/DashboardHeader/DashboardHeader.vue'

const {
  entradas,
  medicamentos,
  unidadesSaude,
  lotes,
  form,
  selectedId,
  isViewing,
  hasSearched,
  isLoading,
  isLoadingSupport,
  isLoadingLotes,
  isSaving,
  isBusy,
  feedback,
  carregarApoio,
  carregarLotesDoMedicamento,
  pesquisar,
  selecionar,
  salvar,
  novo,
} = useEntradaEstoqueCrud()

const origemOptions = ENTRADA_ESTOQUE_ORIGENS.map((origem) => ({
  value: origem,
  label: entradaEstoqueOrigemLabel(origem),
}))

function medicamentoLabel(id: number): string {
  const medicamento = medicamentos.value.find((item) => item.id === id)
  return medicamento ? `${medicamento.nome} - ${medicamento.apresentacao}` : String(id)
}

function unidadeSaudeLabel(id: number): string {
  const unidade = unidadesSaude.value.find((item) => item.id === id)
  return unidade ? unidade.nome : String(id)
}

function loteLabel(id: number): string {
  const lote = lotes.value.find((item) => item.id === id)
  return lote ? lote.numeroLote : String(id)
}

onMounted(() => {
  void carregarApoio()
})
</script>

<template>
  <main class="entradas-page">
    <DashboardHeader
      :title="t('entradasEstoque.header.title')"
      :subtitle="t('entradasEstoque.header.subtitle')"
    />

    <p v-if="feedback" class="feedback" :class="`feedback--${feedback.tone}`" role="status">
      <span class="feedback__dot" aria-hidden="true" />
      {{ feedback.message }}
    </p>

    <SectionPanel
      :title="t('entradasEstoque.form.title')"
      :description="t('entradasEstoque.form.description')"
    >
      <form class="form" @submit.prevent="salvar">
        <div class="form__grid">
          <div class="field">
            <Label for-id="entrada-unidade">{{ t('entradasEstoque.field.unidade') }}</Label>
            <Select
              id="entrada-unidade"
              v-model="form.unidadeId"
              :options="unidadesSaude.map((unidade) => ({ value: String(unidade.id), label: unidade.nome }))"
              :placeholder="t('entradasEstoque.option.select')"
              :disabled="isBusy || isViewing"
            />
          </div>

          <div class="field">
            <Label for-id="entrada-medicamento">{{ t('entradasEstoque.field.medicamento') }}</Label>
            <Select
              id="entrada-medicamento"
              v-model="form.medicamentoId"
              :options="medicamentos.map((medicamento) => ({ value: String(medicamento.id), label: `${medicamento.nome} - ${medicamento.apresentacao}` }))"
              :placeholder="t('entradasEstoque.option.select')"
              :disabled="isBusy || isViewing"
              @change="carregarLotesDoMedicamento()"
            />
          </div>

          <div class="field">
            <Label for-id="entrada-lote">{{ t('entradasEstoque.field.lote') }}</Label>
            <Select
              id="entrada-lote"
              v-model="form.loteId"
              :options="lotes.map((lote) => ({ value: String(lote.id), label: `${lote.numeroLote} - ${formatDate(lote.dataValidade)}` }))"
              :placeholder="isLoadingLotes ? t('entradasEstoque.state.loadingLotes') : t('entradasEstoque.option.select')"
              :disabled="isBusy || isViewing || !form.medicamentoId"
            />
          </div>

          <div class="field">
            <Label for-id="entrada-quantidade">{{ t('entradasEstoque.field.quantidade') }}</Label>
            <Input
              id="entrada-quantidade"
              v-model="form.quantidade"
              type="number"
              :disabled="isBusy || isViewing"
            />
          </div>

          <div class="field">
            <Label for-id="entrada-origem">{{ t('entradasEstoque.field.origem') }}</Label>
            <Select
              id="entrada-origem"
              v-model="form.origem"
              :options="origemOptions"
              :placeholder="t('entradasEstoque.option.select')"
              :disabled="isBusy || isViewing"
            />
          </div>

          <div class="field">
            <Label for-id="entrada-documento">{{ t('entradasEstoque.field.documento') }}</Label>
            <Input id="entrada-documento" v-model="form.documento" :disabled="isBusy || isViewing" />
          </div>

          <div class="field field--wide">
            <Label for-id="entrada-observacao">{{ t('entradasEstoque.field.observacao') }}</Label>
            <Input id="entrada-observacao" v-model="form.observacao" :disabled="isBusy || isViewing" />
          </div>
        </div>

        <p v-if="isLoadingSupport" class="form__hint">{{ t('entradasEstoque.state.loadingSupport') }}</p>
        <p v-else-if="isViewing" class="form__hint">{{ t('entradasEstoque.hint.readOnly') }}</p>

        <div class="form__actions">
          <div class="form__actions-group">
            <Button type="submit" :disabled="isBusy || isViewing" :loading="isSaving">
              {{ t('entradasEstoque.action.save') }}
            </Button>
            <Button type="button" variant="secondary" :disabled="isBusy" @click="novo">
              {{ t('entradasEstoque.action.new') }}
            </Button>
            <Button
              type="button"
              variant="secondary"
              :disabled="isBusy"
              :loading="isLoading"
              @click="pesquisar"
            >
              {{ t('entradasEstoque.action.search') }}
            </Button>
          </div>
        </div>
      </form>
    </SectionPanel>

    <SectionPanel
      :title="t('entradasEstoque.results.title')"
      :description="t('entradasEstoque.results.description')"
    >
      <p v-if="isLoading" class="state">{{ t('entradasEstoque.state.loading') }}</p>
      <p v-else-if="!hasSearched" class="state">{{ t('entradasEstoque.state.initial') }}</p>
      <p v-else-if="entradas.length === 0" class="state">{{ t('entradasEstoque.state.empty') }}</p>

      <div v-else class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">{{ t('entradasEstoque.field.unidade') }}</th>
              <th scope="col">{{ t('entradasEstoque.field.medicamento') }}</th>
              <th scope="col">{{ t('entradasEstoque.field.lote') }}</th>
              <th scope="col">{{ t('entradasEstoque.field.quantidade') }}</th>
              <th scope="col">{{ t('entradasEstoque.field.origem') }}</th>
              <th scope="col">{{ t('entradasEstoque.field.documento') }}</th>
              <th scope="col">{{ t('entradasEstoque.field.dataEntrada') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="entrada in entradas"
              :key="entrada.id"
              class="table__row"
              :class="{ 'table__row--selected': entrada.id === selectedId }"
              :aria-selected="entrada.id === selectedId"
              tabindex="0"
              @click="selecionar(entrada)"
              @keydown.enter.prevent="selecionar(entrada)"
              @keydown.space.prevent="selecionar(entrada)"
            >
              <td :data-label="t('entradasEstoque.field.unidade')" class="table__cell--strong">
                {{ unidadeSaudeLabel(entrada.unidadeId) }}
              </td>
              <td :data-label="t('entradasEstoque.field.medicamento')">
                {{ medicamentoLabel(entrada.medicamentoId) }}
              </td>
              <td :data-label="t('entradasEstoque.field.lote')">{{ loteLabel(entrada.loteId) }}</td>
              <td :data-label="t('entradasEstoque.field.quantidade')">{{ entrada.quantidade }}</td>
              <td :data-label="t('entradasEstoque.field.origem')">
                {{ entradaEstoqueOrigemLabel(entrada.origem) }}
              </td>
              <td :data-label="t('entradasEstoque.field.documento')">
                {{ entrada.documento || '-' }}
              </td>
              <td :data-label="t('entradasEstoque.field.dataEntrada')">
                {{ entrada.dataEntrada || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </SectionPanel>
  </main>
</template>

<style scoped>
.entradas-page {
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