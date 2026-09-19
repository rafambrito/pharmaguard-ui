<script setup lang="ts">
import { useRouter } from 'vue-router'
import { t } from '@/shared/config/messages'
import { NOTA_FISCAL_MEDICAMENTOS_MOCK, NOTA_FISCAL_UNIDADES_MEDIDA_MOCK } from '@/entities/nota-fiscal-entrada'
import { useNotaFiscalEntradaMock } from '@/features/nota-fiscal-entrada-mock'
import Button from '@/shared/ui/atoms/Button/Button.vue'
import Icon from '@/shared/ui/atoms/Icon/Icon.vue'
import Input from '@/shared/ui/atoms/Input/Input.vue'
import Label from '@/shared/ui/atoms/Label/Label.vue'
import Select from '@/shared/ui/atoms/Select/Select.vue'
import SectionPanel from '@/shared/ui/molecules/SectionPanel/SectionPanel.vue'
import DashboardHeader from '@/shared/ui/organisms/DashboardHeader/DashboardHeader.vue'

const router = useRouter()

const {
  cabecalho,
  itens,
  arquivoNome,
  isProcessing,
  isSaving,
  isBusy,
  feedback,
  valorTotalItens,
  simularLeituraCodigoBarras,
  importarArquivo,
  adicionarItem,
  removerItem,
  selecionarMedicamentoItem,
  novaNota,
  registrarEntrada,
} = useNotaFiscalEntradaMock()

const medicamentoOptions = NOTA_FISCAL_MEDICAMENTOS_MOCK.map((medicamento) => ({
  value: String(medicamento.id),
  label: medicamento.nome,
}))

function onFileChange(event: Event): void {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    void importarArquivo(file)
  }

  target.value = ''
}

function onMedicamentoChange(itemId: string, value: string): void {
  selecionarMedicamentoItem(itemId, value ? Number(value) : null)
}

function formatMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
</script>

<template>
  <main class="nota-fiscal-page">
    <DashboardHeader :title="t('notaFiscalEntrada.header.title')" :subtitle="t('notaFiscalEntrada.header.subtitle')" />

    <p class="mock-banner">
      <Icon name="alert" :size="16" />
      {{ t('notaFiscalEntrada.mockBanner') }}
    </p>

    <p v-if="feedback" class="feedback" :class="`feedback--${feedback.tone}`" role="status">
      <span class="feedback__dot" aria-hidden="true" />
      {{ feedback.message }}
    </p>

    <SectionPanel
      :title="t('notaFiscalEntrada.capture.title')"
      :description="t('notaFiscalEntrada.capture.description')"
    >
      <div class="capture">
        <Button type="button" variant="secondary" :disabled="isBusy" :loading="isProcessing" @click="simularLeituraCodigoBarras">
          <Icon name="barcode" :size="16" />
          {{ t('notaFiscalEntrada.capture.scanAction') }}
        </Button>

        <label class="file-input" :class="{ 'file-input--disabled': isBusy }">
          <Icon name="upload" :size="16" />
          {{ t('notaFiscalEntrada.capture.importAction') }}
          <input type="file" accept=".xml,.pdf" :disabled="isBusy" @change="onFileChange" />
        </label>

        <span v-if="arquivoNome" class="file-name">
          {{ t('notaFiscalEntrada.capture.fileSelected') }} {{ arquivoNome }}
        </span>
        <span v-if="isProcessing" class="file-name">{{ t('notaFiscalEntrada.capture.processing') }}</span>
      </div>
    </SectionPanel>

    <SectionPanel
      :title="t('notaFiscalEntrada.header2.title')"
      :description="t('notaFiscalEntrada.header2.description')"
    >
      <form class="form" @submit.prevent="registrarEntrada">
        <div class="form__grid">
          <div class="field">
            <Label for-id="nf-chave">{{ t('notaFiscalEntrada.field.chaveAcesso') }}</Label>
            <Input id="nf-chave" v-model="cabecalho.chaveAcesso" :disabled="isBusy" />
          </div>

          <div class="field">
            <Label for-id="nf-numero">{{ t('notaFiscalEntrada.field.numero') }}</Label>
            <Input id="nf-numero" v-model="cabecalho.numero" :disabled="isBusy" />
          </div>

          <div class="field">
            <Label for-id="nf-serie">{{ t('notaFiscalEntrada.field.serie') }}</Label>
            <Input id="nf-serie" v-model="cabecalho.serie" :disabled="isBusy" />
          </div>

          <div class="field">
            <Label for-id="nf-cnpj">{{ t('notaFiscalEntrada.field.cnpjFornecedor') }}</Label>
            <Input id="nf-cnpj" v-model="cabecalho.cnpjFornecedor" :disabled="isBusy" />
          </div>

          <div class="field field--wide">
            <Label for-id="nf-razao">{{ t('notaFiscalEntrada.field.razaoSocialFornecedor') }}</Label>
            <Input id="nf-razao" v-model="cabecalho.razaoSocialFornecedor" :disabled="isBusy" />
          </div>

          <div class="field">
            <Label for-id="nf-data-emissao">{{ t('notaFiscalEntrada.field.dataEmissao') }}</Label>
            <Input id="nf-data-emissao" v-model="cabecalho.dataEmissao" type="date" :disabled="isBusy" />
          </div>

          <div class="field">
            <Label for-id="nf-valor-total">{{ t('notaFiscalEntrada.field.valorTotal') }}</Label>
            <Input id="nf-valor-total" v-model="cabecalho.valorTotal" type="number" :disabled="isBusy" />
          </div>
        </div>

        <SectionPanel
          :title="t('notaFiscalEntrada.items.title')"
          :description="t('notaFiscalEntrada.items.description')"
        >
          <p v-if="itens.length === 0" class="state">{{ t('notaFiscalEntrada.items.empty') }}</p>

          <div v-else class="table-scroll">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">{{ t('notaFiscalEntrada.items.field.medicamento') }}</th>
                  <th scope="col">{{ t('notaFiscalEntrada.items.field.ncm') }}</th>
                  <th scope="col">{{ t('notaFiscalEntrada.items.field.unidadeMedida') }}</th>
                  <th scope="col">{{ t('notaFiscalEntrada.items.field.quantidade') }}</th>
                  <th scope="col">{{ t('notaFiscalEntrada.items.field.valorUnitario') }}</th>
                  <th scope="col">{{ t('notaFiscalEntrada.items.field.lote') }}</th>
                  <th scope="col">{{ t('notaFiscalEntrada.items.field.dataValidade') }}</th>
                  <th scope="col" />
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in itens" :key="item.id">
                  <td :data-label="t('notaFiscalEntrada.items.field.medicamento')">
                    <Select
                      :model-value="item.medicamentoId ? String(item.medicamentoId) : ''"
                      :options="medicamentoOptions"
                      :placeholder="t('notaFiscalEntrada.option.select')"
                      size="sm"
                      :disabled="isBusy"
                      @update:model-value="(value) => onMedicamentoChange(item.id, value)"
                    />
                  </td>
                  <td :data-label="t('notaFiscalEntrada.items.field.ncm')">
                    <Input v-model="item.ncm" :disabled="isBusy" />
                  </td>
                  <td :data-label="t('notaFiscalEntrada.items.field.unidadeMedida')">
                    <Select
                      v-model="item.unidadeMedida"
                      :options="NOTA_FISCAL_UNIDADES_MEDIDA_MOCK"
                      :placeholder="t('notaFiscalEntrada.option.select')"
                      size="sm"
                      :disabled="isBusy"
                    />
                  </td>
                  <td :data-label="t('notaFiscalEntrada.items.field.quantidade')">
                    <Input v-model="item.quantidade" type="number" :disabled="isBusy" />
                  </td>
                  <td :data-label="t('notaFiscalEntrada.items.field.valorUnitario')">
                    <Input v-model="item.valorUnitario" type="number" :disabled="isBusy" />
                  </td>
                  <td :data-label="t('notaFiscalEntrada.items.field.lote')">
                    <Input v-model="item.lote" :disabled="isBusy" />
                  </td>
                  <td :data-label="t('notaFiscalEntrada.items.field.dataValidade')">
                    <Input v-model="item.dataValidade" type="date" :disabled="isBusy" />
                  </td>
                  <td>
                    <Button type="button" variant="danger" :disabled="isBusy" @click="removerItem(item.id)">
                      {{ t('notaFiscalEntrada.items.removeAction') }}
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="items__footer">
            <Button type="button" variant="secondary" :disabled="isBusy" @click="adicionarItem">
              {{ t('notaFiscalEntrada.items.addAction') }}
            </Button>
            <span class="items__total">
              {{ t('notaFiscalEntrada.items.summary.total') }}: {{ formatMoeda(valorTotalItens) }}
            </span>
          </div>
        </SectionPanel>

        <div class="form__actions">
          <div class="form__actions-group">
            <Button type="submit" :disabled="isBusy" :loading="isSaving">
              {{ t('notaFiscalEntrada.action.register') }}
            </Button>
            <Button type="button" variant="secondary" :disabled="isBusy" @click="novaNota">
              {{ t('notaFiscalEntrada.action.new') }}
            </Button>
            <Button type="button" variant="ghost" :disabled="isBusy" @click="router.push('/entradas')">
              {{ t('notaFiscalEntrada.backToEntradas') }}
            </Button>
          </div>
        </div>
      </form>
    </SectionPanel>
  </main>
</template>

<style scoped>
.nota-fiscal-page {
  display: grid;
  gap: var(--pg-gutter);
  align-content: start;
  width: 100%;
  min-width: 0;
  max-width: 1280px;
}

.mock-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 10px 14px;
  border: 1px solid var(--pg-color-border);
  border-radius: var(--pg-radius-sm);
  background: var(--pg-color-blue-50);
  color: var(--pg-color-text-secondary);
  font-size: 0.8rem;
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

.capture {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.file-input {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 9px 16px;
  border: 1px solid var(--pg-color-border);
  border-radius: var(--pg-radius-sm);
  background: var(--pg-color-surface);
  color: var(--pg-color-blue-700);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.file-input--disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.file-input input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
}

.file-name {
  color: var(--pg-color-text-muted);
  font-size: 0.8rem;
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
  padding: 8px 10px;
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
  padding: 8px 10px;
  border-bottom: 1px solid var(--pg-color-border);
  vertical-align: middle;
  min-width: 120px;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.items__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 12px;
}

.items__total {
  color: var(--pg-color-text-primary);
  font-size: 0.85rem;
  font-weight: 600;
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
}
</style>
