<script setup lang="ts">
import { t } from '@/shared/config/messages'
import { formatDate } from '@/shared/utils'
import { PACIENTE_STATUS, pacienteStatusLabel, pacienteStatusTone } from '@/entities/paciente'
import { usePacienteCrud } from '@/features/paciente-crud'
import Button from '@/shared/ui/atoms/Button/Button.vue'
import Input from '@/shared/ui/atoms/Input/Input.vue'
import Label from '@/shared/ui/atoms/Label/Label.vue'
import Select from '@/shared/ui/atoms/Select/Select.vue'
import StatusBadge from '@/shared/ui/atoms/StatusBadge/StatusBadge.vue'
import SectionPanel from '@/shared/ui/molecules/SectionPanel/SectionPanel.vue'
import DashboardHeader from '@/shared/ui/organisms/DashboardHeader/DashboardHeader.vue'

const {
  pacientes,
  historico,
  form,
  selectedId,
  isEditing,
  hasSearched,
  isLoading,
  isSaving,
  isDeleting,
  isLoadingHistory,
  isBusy,
  feedback,
  pesquisar,
  selecionar,
  salvar,
  inativar,
  novo,
} = usePacienteCrud()

const statusOptions = PACIENTE_STATUS.map((status) => ({ value: status, label: pacienteStatusLabel(status) }))
</script>

<template>
  <main class="pacientes-page">
    <DashboardHeader :title="t('pacientes.header.title')" :subtitle="t('pacientes.header.subtitle')" />

    <p v-if="feedback" class="feedback" :class="`feedback--${feedback.tone}`" role="status">
      <span class="feedback__dot" aria-hidden="true" />{{ feedback.message }}
    </p>

    <SectionPanel :title="t('pacientes.form.title')" :description="t('pacientes.form.description')">
      <form class="form" @submit.prevent="salvar">
        <div class="form__grid">
          <div class="field field--wide"><Label for-id="paciente-nome">{{ t('pacientes.field.nome') }}</Label><Input id="paciente-nome" v-model="form.nome" :disabled="isBusy" /></div>
          <div class="field"><Label for-id="paciente-cpf">{{ t('pacientes.field.cpf') }}</Label><Input id="paciente-cpf" v-model="form.cpf" inputmode="numeric" :disabled="isBusy" /></div>
          <div class="field"><Label for-id="paciente-nascimento">{{ t('pacientes.field.dataNascimento') }}</Label><Input id="paciente-nascimento" v-model="form.dataNascimento" type="date" :disabled="isBusy" /></div>
          <div class="field"><Label for-id="paciente-cns">{{ t('pacientes.field.cartaoSus') }}</Label><Input id="paciente-cns" v-model="form.cartaoSus" :disabled="isBusy" /></div>
          <div class="field"><Label for-id="paciente-telefone">{{ t('pacientes.field.telefone') }}</Label><Input id="paciente-telefone" v-model="form.telefone" type="tel" :disabled="isBusy" /></div>
          <div class="field"><Label for-id="paciente-email">{{ t('pacientes.field.email') }}</Label><Input id="paciente-email" v-model="form.email" type="email" :disabled="isBusy" /></div>
          <div class="field"><Label for-id="paciente-cidade">{{ t('pacientes.field.cidade') }}</Label><Input id="paciente-cidade" v-model="form.cidade" :disabled="isBusy" /></div>
          <div class="field"><Label for-id="paciente-uf">{{ t('pacientes.field.uf') }}</Label><Input id="paciente-uf" v-model="form.uf" maxlength="2" :disabled="isBusy" /></div>
          <div class="field"><Label for-id="paciente-status">{{ t('pacientes.field.status') }}</Label><Select id="paciente-status" v-model="form.status" :options="statusOptions" :placeholder="t('pacientes.option.any')" :disabled="isBusy" /></div>
        </div>
        <p v-if="isEditing" class="form__hint">{{ t('pacientes.hint.inactivation') }}</p>
        <div class="form__actions">
          <div class="form__actions-group">
            <Button type="submit" :disabled="isBusy" :loading="isSaving">{{ t('pacientes.action.save') }}</Button>
            <Button type="button" variant="secondary" :disabled="isBusy" @click="novo">{{ t('pacientes.action.new') }}</Button>
            <Button type="button" variant="secondary" :disabled="isBusy" :loading="isLoading" @click="pesquisar">{{ t('pacientes.action.search') }}</Button>
          </div>
          <Button type="button" variant="danger" :disabled="isBusy || !isEditing || form.status === 'INATIVO'" :loading="isDeleting" @click="inativar">{{ t('pacientes.action.inactivate') }}</Button>
        </div>
      </form>
    </SectionPanel>

    <SectionPanel :title="t('pacientes.results.title')" :description="t('pacientes.results.description')">
      <p v-if="isLoading" class="state">{{ t('pacientes.state.loading') }}</p>
      <p v-else-if="!hasSearched" class="state">{{ t('pacientes.state.initial') }}</p>
      <p v-else-if="pacientes.length === 0" class="state">{{ t('pacientes.state.empty') }}</p>
      <div v-else class="table-scroll"><table class="table"><thead><tr><th>{{ t('pacientes.field.nome') }}</th><th>{{ t('pacientes.field.cpf') }}</th><th>{{ t('pacientes.field.dataNascimento') }}</th><th>{{ t('pacientes.field.cidade') }}</th><th>{{ t('pacientes.field.status') }}</th></tr></thead><tbody><tr v-for="paciente in pacientes" :key="paciente.id" class="table__row" :class="{ 'table__row--selected': paciente.id === selectedId }" tabindex="0" @click="selecionar(paciente)" @keydown.enter.prevent="selecionar(paciente)" @keydown.space.prevent="selecionar(paciente)"><td class="table__cell--strong">{{ paciente.nome }}</td><td>{{ paciente.cpf }}</td><td>{{ formatDate(paciente.dataNascimento) }}</td><td>{{ paciente.cidade || '-' }}{{ paciente.uf ? `/${paciente.uf}` : '' }}</td><td><StatusBadge :tone="pacienteStatusTone(paciente.status)" :label="pacienteStatusLabel(paciente.status)" /></td></tr></tbody></table></div>
    </SectionPanel>

    <SectionPanel v-if="isEditing" :title="t('pacientes.history.title')" :description="t('pacientes.history.description')">
      <p v-if="isLoadingHistory" class="state">{{ t('pacientes.state.loadingHistory') }}</p>
      <p v-else-if="historico.length === 0" class="state">{{ t('pacientes.state.emptyHistory') }}</p>
      <div v-else class="table-scroll"><table class="table"><thead><tr><th>{{ t('pacientes.history.medicamento') }}</th><th>{{ t('pacientes.history.unidade') }}</th><th>{{ t('pacientes.history.quantidade') }}</th><th>{{ t('pacientes.history.lotes') }}</th><th>{{ t('pacientes.history.data') }}</th></tr></thead><tbody><tr v-for="dispensacao in historico" :key="dispensacao.id"><td class="table__cell--strong">#{{ dispensacao.medicamentoId }}</td><td>#{{ dispensacao.unidadeId }}</td><td>{{ dispensacao.quantidade }}</td><td>{{ dispensacao.lotes.map((lote) => `${lote.numeroLote} (${lote.quantidade})`).join(', ') }}</td><td>{{ formatDate(dispensacao.dataDispensacao) }}</td></tr></tbody></table></div>
    </SectionPanel>
  </main>
</template>

<style scoped>
.pacientes-page { display: grid; gap: var(--pg-gutter); align-content: start; width: 100%; min-width: 0; max-width: 1280px; }
.feedback { display: flex; align-items: center; gap: 10px; margin: 0; padding: 10px 14px; border: 1px solid var(--pg-color-border); border-radius: var(--pg-radius-sm); background: var(--pg-color-surface); box-shadow: var(--pg-shadow-sm); color: var(--pg-color-text-secondary); font-size: .82rem; }.feedback__dot { width: 8px; height: 8px; border-radius: 50%; background: var(--pg-color-text-muted); }.feedback--success .feedback__dot { background: var(--pg-color-normal); }.feedback--error { color: var(--pg-color-critical); }.feedback--error .feedback__dot { background: var(--pg-color-critical); }
.form { display: grid; gap: 14px; }.form__grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 12px 14px; }.field { display: grid; gap: 5px; grid-column: span 2; min-width: 0; }.field--wide { grid-column: span 4; }.form__hint { margin: 0; color: var(--pg-color-text-muted); font-size: .75rem; }.form__actions, .form__actions-group { display: flex; flex-wrap: wrap; gap: 8px; }.form__actions { align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--pg-color-border); }.state { margin: 0; padding: 24px 8px; color: var(--pg-color-text-secondary); font-size: .82rem; text-align: center; }.table-scroll { overflow-x: auto; }.table { width: 100%; border-collapse: collapse; font-size: .82rem; }.table th { padding: 8px 12px; border-bottom: 1px solid var(--pg-color-border); color: var(--pg-color-text-muted); font-size: .7rem; text-align: left; text-transform: uppercase; white-space: nowrap; }.table td { padding: 11px 12px; border-bottom: 1px solid var(--pg-color-border); color: var(--pg-color-text-secondary); }.table__cell--strong { color: var(--pg-color-text-primary); font-weight: 600; }.table__row { cursor: pointer; }.table__row:hover td { background: var(--pg-color-blue-50); }.table__row--selected td { background: var(--pg-color-blue-100); }.table__row:focus-visible { outline: 2px solid var(--pg-color-blue-600); outline-offset: -2px; }
@media (max-width: 760px) { .form__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }.field--wide { grid-column: span 2; } } @media (max-width: 640px) { .form__grid { grid-template-columns: 1fr; }.field, .field--wide { grid-column: span 1; }.table thead { display: none; } }
</style>