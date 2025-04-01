import { ref, type Ref } from 'vue'

type FormValues = Record<string, any>
type ValidationRule = {
  required?: boolean
  minLength?: number
  pattern?: RegExp
}

type ValidationRules = Record<string, ValidationRule>

type UseFormReturn = {
  form: Ref<FormValues>
  errors: Ref<Record<string, string>>
  validate: (rules: ValidationRules) => boolean
  resetForm: () => void
}

export function useForm(initialValues: FormValues): UseFormReturn {
  const form = ref<FormValues>({ ...initialValues })
  const errors = ref<Record<string, string>>({})

  const validate = (rules: ValidationRules): boolean => {
    errors.value = {}

    Object.keys(rules).forEach((field) => {
      const value = form.value[field]
      const rule = rules[field]

      if (!rule) return // Ensure rule exists before checking properties

      if (rule.required && !value) {
        errors.value[field] = `${field} is required`
      }
      if (rule.minLength !== undefined && value.length < rule.minLength) {
        errors.value[field] = `${field} must be at least ${rule.minLength} characters long`
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.value[field] = `Invalid ${field}`
      }
    })

    return Object.keys(errors.value).length === 0
  }

  const resetForm = (): void => {
    form.value = { ...initialValues }
    errors.value = {}
  }

  return { form, errors, validate, resetForm }
}