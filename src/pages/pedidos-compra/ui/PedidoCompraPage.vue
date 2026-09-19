<script setup lang="ts">
import { useRouter } from 'vue-router'
import { t } from '@/shared/config/messages'
import { NOTA_FISCAL_MEDICAMENTOS_MOCK, NOTA_FISCAL_UNIDADES_MEDIDA_MOCK } from '@/entities/nota-fiscal-entrada'
import {
  PEDIDO_COMPRA_CONDICOES_PAGAMENTO_MOCK,
  PEDIDO_COMPRA_FORNECEDORES_MOCK,
  PEDIDO_COMPRA_PRIORIDADES,
} from '@/entities/pedido-compra'
import { usePedidoCompraMock } from '@/features/pedido-compra-mock'
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
  isSaving,
  feedback,
  valorTotalEstimado,
  selecionarFornecedor,
  adicionarItem,
  removerItem,
  selecionarMedicamentoItem,
  novoPedido,
  registrarPedido,
} = usePedidoCompraMock()

const fornecedorOptions = PEDIDO_COMPRA_FORNECEDORES_MOCK.map((fornecedor) => ({
  value: String(fornecedor.id),
  label: fornecedor.nome,
}))

const medicamentoOptions = NOTA_FISCAL_MEDICAMENTOS_MOCK.map((medicamento) => ({
  value: String(medicamento.id),
  label: medicamento.nome,
}))

const prioridadeOptions = PEDIDO_COMPRA_PRIORIDADES.map((prioridade) => ({
  value: prioridade,
  label: prioridade.charAt(0) + prioridade.slice(1).toLowerCase(),
}))

function onFornecedorChange(value: string): void {
  selecionarFornecedor(value ? Number(value) : null)
}

function onMedicamentoChange(itemId: string, value: string): void {
  selecionarMedicamentoItem(itemId, value ? Number(value) : null)
}

function formatMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
</script>

<template>
  <main class="pedido-compra-page">
    <DashboardHeader :title="t('pedidoCompra.header.title')" :subtitle="t('pedidoCompra.header.subtitle')" />

    <p class="mock-banner">
      <Icon name="alert" :size="16" />
      {{ t('pedidoCompra.mockBanner') }}
    </p>

    <p v-if="feedback" class="feedback" :class="`feedback--${feedback.tone}`" role="status">
      <span class="feedback__dot" aria-hidden="true" />
      {{ feedback.message }}
    </p>

    <SectionPanel :title="t('pedidoCompra.form.title')" :description="t('pedidoCompra.form.description')">
      <form class="form" @submit.prevent="registrarPedido">
        <div class="form__grid">
          <div class="field">
            <Label for-id="pedido-fornecedor">{{ t('pedidoCompra.field.fornecedor') }}</Label>
            <Select
              id="pedido-fornecedor"
              :model-value="cabecalho.fornecedorId ? String(cabecalho.fornecedorId) : ''"
              :options="fornecedorOptions"
              :placeholder="t('pedidoCompra.option.select')"
              :disabled="isSaving"
              @update:model-value="onFornecedorChange"
            />
          </div>

          <div class="field">
            <Label for-id="pedido-cnpj">{{ t('pedidoCompra.field.cnpjFornecedor') }}</Label>
            <Input id="pedido-cnpj" :model-value="cabecalho.cnpjFornecedor" disabled />
          </div>

          <div class="field">
            <Label for-id="pedido-data">{{ t('pedidoCompra.field.dataPedido') }}</Label>
            <Input id="pedido-data" v-model="cabecalho.dataPedido" type="date" :disabled="isSaving" />
          </div>

          <div class="field">
            <Label for-id="pedido-previsao">{{ t('pedidoCompra.field.dataPrevistaEntrega') }}</Label>
            <Input id="pedido-previsao" v-model="cabecalho.dataPrevistaEntrega" type="date" :disabled="isSaving" />
          </div>

          <div class="field">
            <Label for-id="pedido-condicao">{{ t('pedidoCompra.field.condicaoPagamento') }}</Label>
            <Select
              id="pedido-condicao"
              v-model="cabecalho.condicaoPagamento"
              :options="PEDIDO_COMPRA_CONDICOES_PAGAMENTO_MOCK"
              :placeholder="t('pedidoCompra.option.select')"
              :disabled="isSaving"
            />
          </div>

          <div class="field">
            <Label for-id="pedido-prioridade">{{ t('pedidoCompra.field.prioridade') }}</Label>
            <Select
              id="pedido-prioridade"
              v-model="cabecalho.prioridade"
              :options="prioridadeOptions"
              :placeholder="t('pedidoCompra.option.select')"
              :disabled="isSaving"
            />
          </div>

          <div class="field field--wide">
            <Label for-id="pedido-observacao">{{ t('pedidoCompra.field.observacao') }}</Label>
            <Input id="pedido-observacao" v-model="cabecalho.observacao" :disabled="isSaving" />
          </div>
        </div>

        <SectionPanel :title="t('pedidoCompra.items.title')" :description="t('pedidoCompra.items.description')">
          <p v-if="itens.length === 0" class="state">{{ t('pedidoCompra.items.empty') }}</p>

          <div v-else class="table-scroll">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">{{ t('pedidoCompra.items.field.medicamento') }}</th>
                  <th scope="col">{{ t('pedidoCompra.items.field.unidadeMedida') }}</th>
                  <th scope="col">{{ t('pedidoCompra.items.field.quantidade') }}</th>
                  <th scope="col">{{ t('pedidoCompra.items.field.valorUnitarioEstimado') }}</th>
                  <th scope="col">{{ t('pedidoCompra.items.field.observacao') }}</th>
                  <th scope="col" />
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in itens" :key="item.id">
                  <td :data-label="t('pedidoCompra.items.field.medicamento')">
                    <Select
                      :model-value="item.medicamentoId ? String(item.medicamentoId) : ''"
                      :options="medicamentoOptions"
                      :placeholder="t('pedidoCompra.option.select')"
                      size="sm"
                      :disabled="isSaving"
                      @update:model-value="(value) => onMedicamentoChange(item.id, value)"
                    />
                  </td>
                  <td :data-label="t('pedidoCompra.items.field.unidadeMedida')">
                    <Select
                      v-model="item.unidadeMedida"
                      :options="NOTA_FISCAL_UNIDADES_MEDIDA_MOCK"
                      :placeholder="t('pedidoCompra.option.select')"
                      size="sm"
                      :disabled="isSaving"
                    />
                  </td>
                  <td :data-label="t('pedidoCompra.items.field.quantidade')">
                    <Input v-model="item.quantidade" type="number" :disabled="isSaving" />
                  </td>
                  <td :data-label="t('pedidoCompra.items.field.valorUnitarioEstimado')">
                    <Input v-model="item.valorUnitarioEstimado" type="number" :disabled="isSaving" />
                  </td>
                  <td :data-label="t('pedidoCompra.items.field.observacao')">
                    <Input v-model="item.observacao" :disabled="isSaving" />
                  </td>
                  <td>
                    <Button type="button" variant="danger" :disabled="isSaving" @click="removerItem(item.id)">
                      {{ t('pedidoCompra.items.removeAction') }}
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="items__footer">
            <Button type="button" variant="secondary" :disabled="isSaving" @click="adicionarItem">
              {{ t('pedidoCompra.items.addAction') }}
            </Button>
            <span class="items__total">
              {{ t('pedidoCompra.items.summary.total') }}: {{ formatMoeda(valorTotalEstimado) }}
            </span>
          </div>
        </SectionPanel>

        <div class="form__actions">
          <div class="form__actions-group">
            <Button type="submit" :disabled="isSaving" :loading="isSaving">
              {{ t('pedidoCompra.action.register') }}
            </Button>
            <Button type="button" variant="secondary" :disabled="isSaving" @click="novoPedido">
              {{ t('pedidoCompra.action.new') }}
            </Button>
            <Button type="button" variant="ghost" :disabled="isSaving" @click="router.push('/fornecedores')">
              {{ t('fornecedores.header.title') }}
            </Button>
          </div>
        </div>
      </form>
    </SectionPanel>
  </main>
</template>

<style scoped>
.pedido-compra-page {
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
