/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
// 4200123489000800
const errorMessages = {
  login: {
    valueMissing: 'Вам требуется назвать себя',
  },
  email: {
    valueMissing: 'Предоставьте ящик для спама',
    typeMismatch: 'Это не очень похоже на электропочту',
  },
  password: {
    valueMissing: 'Пустой пароль - плохой пароль',
  },
  'credit-card': {
    valueMissing: 'Нам нужна ваша кредитка, одежда и мотоцикл',
    patternMismatch: 'Не удалось списать бабло с вашей карты, проверьте номер карты',
  },
};

export default class RegisterForm {
  constructor(element, tooltipGenerator) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }

    this.element = element;
    this.tooltips = {};
    this.dirtyFields = {};

    this.onSubmit = this.onSubmit.bind(this);
    this.onFieldInput = this.onFieldInput.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onWindowClose = this.onWindowClose.bind(this);

    this.element.addEventListener('submit', this.onSubmit);
    this.element.addEventListener('input', this.onFieldInput);
    this.element.addEventListener('change', this.onFieldChange);

    window.addEventListener('beforeunload', this.onWindowClose);
    this.tooltipGenerator = tooltipGenerator;

    this.init();
  }

  init() {
    const json = localStorage.getItem('formData');

    let formData;

    try {
      formData = JSON.parse(json);
    } catch (error) {
      console.log(error);

      return;
    }

    Object.keys(formData).forEach((key) => {
      this.element.querySelector(`[name="${key}"]`).value = formData[key];
    });
  }

  onSubmit(e) {
    if (this.element.checkValidity()) {
      return;
    }

    this.clearErrors();

    [...this.element.elements].some((elem) => {
      if (!this.tooltipGenerator) {
        elem.setCustomValidity('');
      }
      if (elem.validity.valid) return false;

      console.log(elem);

      const error = this.getErrorInField(elem);

      if (!error) {
        this.hideError(elem);

        return false;
      }

      this.showError(error, elem);

      return true;
    });

    if (!this.tooltipGenerator) {
      this.element.reportValidity();
    }

    e.preventDefault();

    console.log(e);
  }

  onFieldChange(event) {
    const field = event.target;

    const wasDirty = this.dirtyFields[field.name];

    this.dirtyFields[field.name] = true;

    if (!wasDirty) {
      this.onFieldInput(event);
    }
  }

  onFieldInput(event) {
    console.log('onFieldInput');
    const field = event.target;

    if (!this.dirtyFields[field.name]) return;

    const error = this.getErrorInField(field);

    if (!error) {
      this.hideError(field);

      return;
    }

    this.showError(error, field);
  }

  onWindowClose() {
    const formData = {};

    this.element.elements.forEach((elem) => {
      if (!elem.name) return;

      formData[elem.name] = elem.value;
    });

    const json = JSON.stringify(formData);

    localStorage.setItem('formData', json);
  }

  getErrorInField(element) {
    return Object.keys(ValidityState.prototype).find((key) => {
      if (key === 'valid') return false;
      if (element.validity[key]) {
        return true;
      }

      return false;
    });
  }

  showError(error, element) {
    if (!this.tooltipGenerator) {
      element.setCustomValidity(errorMessages[element.name][error]);
    } else {
      if (this.tooltips[element.name]) {
        this.tooltipGenerator.removeTooltip(this.tooltips[element.name].id);
      }

      const tooltipId = this.tooltipGenerator.addTooltip(errorMessages[element.name][error], element);

      this.tooltips[element.name] = { id: tooltipId };
    }
  }

  hideError(element) {
    if (!this.tooltipGenerator) {
      element.setCustomValidity('');

      this.element.reportValidity();

      return;
    }

    if (this.tooltips[element.name]) {
      this.tooltipGenerator.removeTooltip(this.tooltips[element.name].id);
    }
  }

  clearErrors() {
    Object.keys(this.tooltips).forEach((key) => {
      this.tooltipGenerator.removeTooltip(this.tooltips[key].id);
    });
  }
}
