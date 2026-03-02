/**
 * Hook genérico de validação de formulários
 * Suporta validação em tempo real (onChange) e ao sair do campo (onBlur)
 * @param {Object} initialValues - Valores iniciais dos campos
 * @param {Object} validationRules - Regras: { campo: [{ test: fn, message: string }] }
 * @returns {{ values, errors, touched, handleChange, handleBlur, isValid, reset }}
 */

import { useState, useCallback } from 'react';

export function useFormValidation(initialValues, validationRules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback(
    (fieldName, fieldValue) => {
      const rules = validationRules[fieldName];

      if (!rules) return '';

      for (const rule of rules) {
        if (!rule.test(fieldValue)) {
          return rule.message;
        }
      }

      return '';
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;

      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));

      // Validar em tempo real se o campo foi tocado
      if (touched[name]) {
        const error = validateField(name, newValue);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;

      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    },
    [validateField]
  );

  const isValid = useCallback(() => {
    const newErrors = {};

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validationRules, values, validateField]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    isValid,
    reset,
    setValues,
    setErrors,
  };
}
