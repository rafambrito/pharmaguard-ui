<script setup lang="ts">
import { t } from '@/shared/config/messages'
import {
  USUARIO_STATUS,
  USUARIO_TIPOS,
  usuarioStatusLabel,
  usuarioStatusTone,
  usuarioTipoLabel,
} from '@/entities/usuario'
import { useUsuarioCrud } from '@/features/usuario-crud'
import Button from '@/shared/ui/atoms/Button/Button.vue'
import Input from '@/shared/ui/atoms/Input/Input.vue'
import Label from '@/shared/ui/atoms/Label/Label.vue'
import Select from '@/shared/ui/atoms/Select/Select.vue'
import StatusBadge from '@/shared/ui/atoms/StatusBadge/StatusBadge.vue'
import SectionPanel from '@/shared/ui/molecules/SectionPanel/SectionPanel.vue'
import DashboardHeader from '@/shared/ui/organisms/DashboardHeader/DashboardHeader.vue'

const {
  usuarios,
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
} = useUsuarioCrud()

const statusOptions = USUARIO_STATUS.map((status) => ({
  value: status,
  label: usuarioStatusLabel(status),
}))

const tipoOptions = USUARIO_TIPOS.map((tipo) => ({
  value: tipo,
  label: usuarioTipoLabel(tipo),
}))
</script>

<template>
  <main class="usuarios-page">
    <DashboardHeader :title="t('usuarios.header.title')" :subtitle="t('usuarios.header.subtitle')" />

    <p v-if="feedback" class="feedback" :class="`feedback--${feedback.tone}`" role="status">
      <span class="feedback__dot" aria-hidden="true" />
      {{ feedback.message }}
    </p>

    <SectionPanel :title="t('usuarios.form.title')" :description="t('usuarios.form.description')">
      <form class="form" @submit.prevent="salvar">
        <div class="form__grid">
          <div class="field">
            <Label for-id="usuario-nome">{{ t('usuarios.field.nome') }}</Label>
            <Input id="usuario-nome" v-model="form.nome" :disabled="isBusy" />
          </div>

          <div class="field">
            <Label for-id="usuario-email">{{ t('usuarios.field.email') }}</Label>
            <Input id="usuario-email" v-model="form.email" type="email" :disabled="isBusy" />
          </div>

          <div class="field">
            <Label for-id="usuario-login">{{ t('usuarios.field.login') }}</Label>
            <Input id="usuario-login" v-model="form.login" :disabled="isBusy" />
          </div>

          <div class="field">
            <Label for-id="usuario-tipo">{{ t('usuarios.field.tipo') }}</Label>
            <Select
              id="usuario-tipo"
              v-model="form.tipo"
              :options="tipoOptions"
              :placeholder="t('usuarios.option.any')"
              :disabled="isBusy || isEditing"
            />
          </div>

          <div class="field">
            <Label for-id="usuario-status">{{ t('usuarios.field.status') }}</Label>
            <Select
              id="usuario-status"
              v-model="form.status"
              :options="statusOptions"
              :placeholder="t('usuarios.option.any')"
              :disabled="isBusy"
            />
          </div>

          <div class="field">
            <Label for-id="usuario-senha">{{ t('usuarios.field.senha') }}</Label>
            <Input
              id="usuario-senha"
              v-model="form.senha"
              type="password"
              show-password-toggle
              autocomplete="new-password"
              :disabled="isBusy || isEditing"
            />
          </div>
        </div>

        <p v-if="isEditing" class="form__hint">{{ t('usuarios.hint.editLocked') }}</p>

        <div class="form__actions">
          <div class="form__actions-group">
            <Button type="submit" :disabled="isBusy" :loading="isSaving">
              {{ t('usuarios.action.save') }}
            </Button>
            <Button type="button" variant="secondary" :disabled="isBusy" @click="novo">
              {{ t('usuarios.action.new') }}
            </Button>
            <Button
              type="button"
              variant="secondary"
              :disabled="isBusy"
              :loading="isLoading"
              @click="pesquisar"
            >
              {{ t('usuarios.action.search') }}
            </Button>
          </div>

          <Button
            type="button"
            variant="danger"
            :disabled="isBusy || !isEditing"
            :loading="isDeleting"
            @click="remover"
          >
            {{ t('usuarios.action.delete') }}
          </Button>
        </div>
      </form>
    </SectionPanel>

    <SectionPanel
      :title="t('usuarios.results.title')"
      :description="t('usuarios.results.description')"
    >
      <p v-if="isLoading" class="state">{{ t('usuarios.state.loading') }}</p>
      <p v-else-if="!hasSearched" class="state">{{ t('usuarios.state.initial') }}</p>
      <p v-else-if="usuarios.length === 0" class="state">{{ t('usuarios.state.empty') }}</p>

      <div v-else class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">{{ t('usuarios.field.nome') }}</th>
              <th scope="col">{{ t('usuarios.field.email') }}</th>
              <th scope="col">{{ t('usuarios.field.login') }}</th>
              <th scope="col">{{ t('usuarios.field.tipo') }}</th>
              <th scope="col">{{ t('usuarios.field.perfis') }}</th>
              <th scope="col">{{ t('usuarios.field.status') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="usuario in usuarios"
              :key="usuario.id"
              class="table__row"
              :class="{ 'table__row--selected': usuario.id === selectedId }"
              :aria-selected="usuario.id === selectedId"
              tabindex="0"
              @click="selecionar(usuario)"
              @keydown.enter.prevent="selecionar(usuario)"
              @keydown.space.prevent="selecionar(usuario)"
            >
              <td :data-label="t('usuarios.field.nome')" class="table__cell--strong">
                {{ usuario.nome }}
              </td>
              <td :data-label="t('usuarios.field.email')">{{ usuario.email }}</td>
              <td :data-label="t('usuarios.field.login')">{{ usuario.login }}</td>
              <td :data-label="t('usuarios.field.tipo')">{{ usuarioTipoLabel(usuario.tipo) }}</td>
              <td :data-label="t('usuarios.field.perfis')">
                {{ usuario.perfis?.map((perfil) => perfil.nome).join(', ') || '-' }}
              </td>
              <td :data-label="t('usuarios.field.status')">
                <StatusBadge
                  :tone="usuarioStatusTone(usuario.status)"
                  :label="usuarioStatusLabel(usuario.status)"
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
.usuarios-page {
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

  .form__actions-group {
    flex: 1 1 100%;
  }
}

@media (max-width: 640px) {
  .form__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  /* no mobile a tabela vira lista de cartoes para evitar rolagem horizontal */
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
