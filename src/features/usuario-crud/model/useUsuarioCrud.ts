import { computed, reactive, ref } from 'vue'
import {
  filtrarUsuarios,
  type AtualizacaoUsuario,
  type NovoUsuario,
  type Usuario,
  type UsuarioFiltro,
  type UsuarioStatus,
} from '@/entities/usuario'
import {
  createUsuario,
  deleteUsuario,
  getUsuario,
  listUsuarios,
  updateUsuario,
} from '@/shared/api/userApi'
import { extractHttpErrorMessage } from '@/shared/api/http/httpError'
import { t } from '@/shared/config/messages'

interface UsuarioForm {
  nome: string
  email: string
  login: string
  tipo: string
  senha: string
  status: UsuarioStatus | ''
}

type FeedbackTone = 'success' | 'error'

interface Feedback {
  tone: FeedbackTone
  message: string
}

function emptyForm(): UsuarioForm {
  return { nome: '', email: '', login: '', tipo: '', senha: '', status: '' }
}

function emptyFiltro(): UsuarioFiltro {
  return { nome: '', email: '', login: '', tipo: '', status: '' }
}

export function useUsuarioCrud() {
  const usuarios = ref<Usuario[]>([])
  const form = reactive<UsuarioForm>(emptyForm())
  const criterios = ref<UsuarioFiltro>(emptyFiltro())
  const selectedId = ref<number | null>(null)
  const hasSearched = ref(false)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const isDeleting = ref(false)
  const feedback = ref<Feedback | null>(null)

  const isEditing = computed(() => selectedId.value !== null)
  const usuariosFiltrados = computed(() => filtrarUsuarios(usuarios.value, criterios.value))
  const isBusy = computed(() => isLoading.value || isSaving.value || isDeleting.value)

  function applyForm(source: UsuarioForm): void {
    Object.assign(form, source)
  }

  function fail(error: unknown, fallbackKey: Parameters<typeof t>[0]): void {
    feedback.value = { tone: 'error', message: extractHttpErrorMessage(error, t(fallbackKey)) }
  }

  // os proprios campos do cadastro sao usados como criterios de consulta (a senha nao filtra)
  async function pesquisar(): Promise<void> {
    criterios.value = {
      nome: form.nome,
      email: form.email,
      login: form.login,
      tipo: form.tipo,
      status: form.status,
    }

    isLoading.value = true
    feedback.value = null

    try {
      usuarios.value = await listUsuarios()
      hasSearched.value = true
    } catch (error) {
      usuarios.value = []
      fail(error, 'usuarios.feedback.loadError')
    } finally {
      isLoading.value = false
    }
  }

  function novo(): void {
    selectedId.value = null
    applyForm(emptyForm())
    criterios.value = emptyFiltro()
    usuarios.value = []
    hasSearched.value = false
    feedback.value = null
  }

  async function selecionar(usuario: Usuario): Promise<void> {
    feedback.value = null

    try {
      const detalhe = await getUsuario(usuario.id)
      selectedId.value = detalhe.id
      applyForm({
        nome: detalhe.nome,
        email: detalhe.email,
        login: detalhe.login,
        tipo: detalhe.tipo,
        senha: '',
        status: detalhe.status,
      })
    } catch (error) {
      fail(error, 'usuarios.feedback.loadOneError')
    }
  }

  async function salvar(): Promise<void> {
    isSaving.value = true
    feedback.value = null

    try {
      let salvo: Usuario

      if (selectedId.value === null) {
        const payload: NovoUsuario = {
          nome: form.nome,
          email: form.email,
          login: form.login,
          tipo: form.tipo,
          senha: form.senha,
          status: form.status || undefined,
        }
        salvo = await createUsuario(payload)
        feedback.value = { tone: 'success', message: t('usuarios.feedback.created') }
      } else {
        const payload: AtualizacaoUsuario = {
          nome: form.nome,
          email: form.email,
          login: form.login,
          status: form.status || undefined,
        }
        salvo = await updateUsuario(selectedId.value, payload)
        feedback.value = { tone: 'success', message: t('usuarios.feedback.updated') }
      }

      // apos salvar a listagem exibe apenas o registro afetado
      selectedId.value = salvo.id
      criterios.value = emptyFiltro()
      usuarios.value = [salvo]
      hasSearched.value = true
    } catch (error) {
      fail(error, 'usuarios.feedback.saveError')
    } finally {
      isSaving.value = false
    }
  }

  async function remover(): Promise<void> {
    if (selectedId.value === null) {
      return
    }

    isDeleting.value = true
    feedback.value = null

    try {
      const removidoId = selectedId.value
      await deleteUsuario(removidoId)
      selectedId.value = null
      applyForm(emptyForm())
      usuarios.value = usuarios.value.filter((usuario) => usuario.id !== removidoId)
      feedback.value = { tone: 'success', message: t('usuarios.feedback.deleted') }
    } catch (error) {
      fail(error, 'usuarios.feedback.deleteError')
    } finally {
      isDeleting.value = false
    }
  }

  return {
    usuarios: usuariosFiltrados,
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
  }
}
