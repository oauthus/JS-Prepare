export class Form {
    constructor(form, controls) {
        this.form = form
        this.controls = controls
    }

    value() {
        const value = {}

        Object.keys(this.controls).forEach(control => {
            value[control] = this.form[control].value
        })
        return value
    }

    clear() {
        Object.keys(this.controls).forEach(control => {
            this.form[control].value = ''
        })
    }

    isValid() {
        let isFormValid = true
        Object.keys(this.controls).forEach(control => {
            const validators = this.controls[control]
            let isValid = true
            validators.forEach(validator => {
                isValid = validator(this.form[control].value) && isValid
            })

            isValid ? clearError(this.form[control]) : setError(this.form[control])

            isFormValid = isFormValid && isValid
        })

        return isFormValid
    }
}

function setError($control) {
    $control.classList.add('invalid')
    const error = '<p class="validation-error">¬ведите корректное значение</p>'
    $control.insertAdjacentHTML('afterend', error)
}

function clearError($control) {
    $control.classList.remove('invalid')
    if ($control.nextSibling) {
        $control.closest('.form-control').removeChild($control.nextSibling)
    }
}

