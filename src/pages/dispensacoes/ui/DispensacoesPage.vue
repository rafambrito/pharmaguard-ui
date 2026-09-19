<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { t } from '@/shared/config/messages'
import { formatDate } from '@/shared/utils'
import { useDispensacaoCrud } from '@/features/dispensacao-crud'
import Button from '@/shared/ui/atoms/Button/Button.vue'
import Input from '@/shared/ui/atoms/Input/Input.vue'
import Label from '@/shared/ui/atoms/Label/Label.vue'
import Select from '@/shared/ui/atoms/Select/Select.vue'
import SectionPanel from '@/shared/ui/molecules/SectionPanel/SectionPanel.vue'
import DashboardHeader from '@/shared/ui/organisms/DashboardHeader/DashboardHeader.vue'

const pacienteTermo = ref('')
const { dispensacoes, pacientes, medicamentos, unidadesSaude, form, selectedId, isViewing, hasSearched, isLoading, isLoadingSupport, isSearchingPatients, isSaving, isBusy, feedback, carregarApoio, buscarPacientes, pesquisar, selecionar, salvar, novo } = useDispensacaoCrud()

function medicamentoLabel(id: number): string { const medicamento = medicamentos.value.find((item) => item.id === id); return medicamento ? `${medicamento.nome} - ${medicamento.apresentacao}` : `#${id}` }
function unidadeLabel(id: number): string { return unidadesSaude.value.find((item) => item.id === id)?.nome ?? `#${id}` }
function pacienteLabel(id: number): string { return pacientes.value.find((item) => item.id === id)?.nome ?? `#${id}` }

onMounted(() => { void carregarApoio() })
</script>

<template>
  <main class="dispensacoes-page">
    <DashboardHeader :title="t('dispensacoes.header.title')" :subtitle="t('dispensacoes.header.subtitle')" />
    <p v-if="feedback" class="feedback" :class="`feedback--${feedback.tone}`" role="status"><span class="feedback__dot" aria-hidden="true" />{{ feedback.message }}</p>
    <SectionPanel :title="t('dispensacoes.form.title')" :description="t('dispensacoes.form.description')">
      <form class="form" @submit.prevent="salvar">
        <div class="patient-search"><div class="field"><Label for-id="dispensacao-paciente-busca">{{ t('dispensacoes.field.patientSearch') }}</Label><Input id="dispensacao-paciente-busca" v-model="pacienteTermo" :disabled="isBusy || isViewing" /></div><Button type="button" variant="secondary" :disabled="isBusy || isViewing || !pacienteTermo" :loading="isSearchingPatients" @click="buscarPacientes(pacienteTermo)"><span class="patient-search__action-label">{{ isSearchingPatients ? t('dispensacoes.action.searchingPatient') : t('dispensacoes.action.searchPatient') }}</span></Button></div>
        <div class="form__grid">
          <div class="field"><Label for-id="dispensacao-paciente">{{ t('dispensacoes.field.paciente') }}</Label><Select id="dispensacao-paciente" v-model="form.pacienteId" :options="pacientes.map((paciente) => ({ value: String(paciente.id), label: `${paciente.nome} - ${paciente.cpf}` }))" :placeholder="t('dispensacoes.option.select')" :disabled="isBusy || isViewing" /></div>
          <div class="field"><Label for-id="dispensacao-unidade">{{ t('dispensacoes.field.unidade') }}</Label><Select id="dispensacao-unidade" v-model="form.unidadeId" :options="unidadesSaude.map((unidade) => ({ value: String(unidade.id), label: unidade.nome }))" :placeholder="t('dispensacoes.option.select')" :disabled="isBusy || isViewing" /></div>
          <div class="field"><Label for-id="dispensacao-medicamento">{{ t('dispensacoes.field.medicamento') }}</Label><Select id="dispensacao-medicamento" v-model="form.medicamentoId" :options="medicamentos.map((medicamento) => ({ value: String(medicamento.id), label: `${medicamento.nome} - ${medicamento.apresentacao}` }))" :placeholder="t('dispensacoes.option.select')" :disabled="isBusy || isViewing" /></div>
          <div class="field"><Label for-id="dispensacao-quantidade">{{ t('dispensacoes.field.quantidade') }}</Label><Input id="dispensacao-quantidade" v-model="form.quantidade" type="number" :disabled="isBusy || isViewing" /></div>
          <div class="field"><Label for-id="dispensacao-receita">{{ t('dispensacoes.field.numeroReceita') }}</Label><Input id="dispensacao-receita" v-model="form.numeroReceita" :disabled="isBusy || isViewing" /></div>
          <div class="field"><Label for-id="dispensacao-crm">{{ t('dispensacoes.field.crm') }}</Label><Input id="dispensacao-crm" v-model="form.crmPrescritor" :disabled="isBusy || isViewing" /></div>
          <div class="field field--wide"><Label for-id="dispensacao-observacao">{{ t('dispensacoes.field.observacao') }}</Label><Input id="dispensacao-observacao" v-model="form.observacao" :disabled="isBusy || isViewing" /></div>
          <div class="field"><Label for-id="dispensacao-inicio">{{ t('dispensacoes.field.dataInicial') }}</Label><Input id="dispensacao-inicio" v-model="form.dataInicial" type="date" :disabled="isBusy || isViewing" /></div>
          <div class="field"><Label for-id="dispensacao-fim">{{ t('dispensacoes.field.dataFinal') }}</Label><Input id="dispensacao-fim" v-model="form.dataFinal" type="date" :disabled="isBusy || isViewing" /></div>
        </div>
        <p v-if="isLoadingSupport" class="form__hint">{{ t('dispensacoes.state.loadingSupport') }}</p><p v-else-if="isViewing" class="form__hint">{{ t('dispensacoes.hint.readOnly') }}</p>
        <div class="form__actions"><div class="form__actions-group"><Button type="submit" :disabled="isBusy || isViewing" :loading="isSaving">{{ t('dispensacoes.action.save') }}</Button><Button type="button" variant="secondary" :disabled="isBusy" @click="novo">{{ t('dispensacoes.action.new') }}</Button><Button type="button" variant="secondary" :disabled="isBusy" :loading="isLoading" @click="pesquisar">{{ t('dispensacoes.action.search') }}</Button></div></div>
      </form>
    </SectionPanel>
    <SectionPanel :title="t('dispensacoes.results.title')" :description="t('dispensacoes.results.description')"><p v-if="isLoading" class="state">{{ t('dispensacoes.state.loading') }}</p><p v-else-if="!hasSearched" class="state">{{ t('dispensacoes.state.initial') }}</p><p v-else-if="dispensacoes.length === 0" class="state">{{ t('dispensacoes.state.empty') }}</p><div v-else class="table-scroll"><table class="table"><thead><tr><th>{{ t('dispensacoes.field.paciente') }}</th><th>{{ t('dispensacoes.field.medicamento') }}</th><th>{{ t('dispensacoes.field.unidade') }}</th><th>{{ t('dispensacoes.field.quantidade') }}</th><th>{{ t('dispensacoes.field.lotes') }}</th><th>{{ t('dispensacoes.field.data') }}</th></tr></thead><tbody><tr v-for="dispensacao in dispensacoes" :key="dispensacao.id" class="table__row" :class="{ 'table__row--selected': dispensacao.id === selectedId }" tabindex="0" @click="selecionar(dispensacao)" @keydown.enter.prevent="selecionar(dispensacao)" @keydown.space.prevent="selecionar(dispensacao)"><td class="table__cell--strong">{{ pacienteLabel(dispensacao.pacienteId) }}</td><td>{{ medicamentoLabel(dispensacao.medicamentoId) }}</td><td>{{ unidadeLabel(dispensacao.unidadeId) }}</td><td>{{ dispensacao.quantidade }}</td><td>{{ dispensacao.lotes.map((lote) => `${lote.numeroLote} (${lote.quantidade})`).join(', ') }}</td><td>{{ formatDate(dispensacao.dataDispensacao) }}</td></tr></tbody></table></div></SectionPanel>
  </main>
</template>

<style scoped>
.dispensacoes-page { display: grid; gap: var(--pg-gutter); align-content: start; width: 100%; min-width: 0; max-width: 1280px; }.feedback { display: flex; align-items: center; gap: 10px; margin: 0; padding: 10px 14px; border: 1px solid var(--pg-color-border); border-radius: var(--pg-radius-sm); background: var(--pg-color-surface); box-shadow: var(--pg-shadow-sm); color: var(--pg-color-text-secondary); font-size: .82rem; }.feedback__dot { width: 8px; height: 8px; border-radius: 50%; background: var(--pg-color-text-muted); }.feedback--success .feedback__dot { background: var(--pg-color-normal); }.feedback--error { color: var(--pg-color-critical); }.feedback--error .feedback__dot { background: var(--pg-color-critical); }.form { display: grid; gap: 14px; }.patient-search { display: flex; align-items: end; gap: 8px; padding-bottom: 14px; border-bottom: 1px solid var(--pg-color-border); }.patient-search .field { flex: 1; }.patient-search__action-label { display: inline-block; min-width: 106px; transition: opacity 160ms ease; }.form__grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 12px 14px; }.field { display: grid; gap: 5px; grid-column: span 2; min-width: 0; }.field--wide { grid-column: span 4; }.form__hint { margin: 0; color: var(--pg-color-text-muted); font-size: .75rem; }.form__actions, .form__actions-group { display: flex; flex-wrap: wrap; gap: 8px; }.form__actions { padding-top: 12px; border-top: 1px solid var(--pg-color-border); }.state { margin: 0; padding: 24px 8px; color: var(--pg-color-text-secondary); font-size: .82rem; text-align: center; }.table-scroll { overflow-x: auto; }.table { width: 100%; border-collapse: collapse; font-size: .82rem; }.table th { padding: 8px 12px; border-bottom: 1px solid var(--pg-color-border); color: var(--pg-color-text-muted); font-size: .7rem; text-align: left; text-transform: uppercase; white-space: nowrap; }.table td { padding: 11px 12px; border-bottom: 1px solid var(--pg-color-border); color: var(--pg-color-text-secondary); }.table__cell--strong { color: var(--pg-color-text-primary); font-weight: 600; }.table__row { cursor: pointer; }.table__row:hover td { background: var(--pg-color-blue-50); }.table__row--selected td { background: var(--pg-color-blue-100); }.table__row:focus-visible { outline: 2px solid var(--pg-color-blue-600); outline-offset: -2px; }
@media (max-width: 760px) { .form__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }.field--wide { grid-column: span 2; } } @media (max-width: 640px) { .patient-search { align-items: stretch; flex-direction: column; }.form__grid { grid-template-columns: 1fr; }.field, .field--wide { grid-column: span 1; }.table thead { display: none; } }
</style>