// src/_pwa-framework/genforms/components/GenericForm.tsx
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import {
  IGenericControls,
  ITextField,
  INumberField,
  ISelect,
  IDatePicker,
} from "./controls.types";

type GenericFormProps = {
  title?: string;
  description?: string;
  controls: IGenericControls[];
  hideButtons?: boolean;
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  nextButton?: {
    text: string;
    action: (values: Record<string, any>) => void;
    submitOnAction?: boolean;
  };
  prevButton?: { text: string; action: (values: Record<string, any>) => void };
  values?: Record<string, any>;
  submitLabel?: string;
  onCancel?: () => void;
};

const GenericForm = (props: GenericFormProps) => {
  const {
    title,
    description,
    controls,
    hideButtons,
    onSubmit,
    nextButton,
    prevButton,
    values,
    submitLabel,
    onCancel,
  } = props;

  // Construimos valores iniciales
  const initialValues: Record<string, any> = controls.reduce((acc, control) => {
    acc[control.name] = values?.[control.name] ?? "";
    return acc;
  }, {} as Record<string, any>);

  // Validación mínima opcional: todos los campos string
  const validationSchema = Yup.object(
    controls.reduce((acc, control) => {
      acc[control.name] = Yup.string();
      return acc;
    }, {} as Record<string, any>)
  );

  return (
    <div style={{ padding: 16 }}>
      {title && <DialogTitle>{title}</DialogTitle>}
      {description && <DialogContentText>{description}</DialogContentText>}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {(formikProps: FormikProps<Record<string, any>>) => {
          const { values, handleChange, handleSubmit } = formikProps;

          return (
            <form onSubmit={handleSubmit}>
              <DialogContent>
                {controls.map((control) => {
                  switch (control.type) {
                    case "text":
                    case "number":
                    case "date":
                      return (
                        <div key={control.name} style={{ marginBottom: 12 }}>
                          <label>{control.label}</label>
                          <input
                            type={control.type}
                            name={control.name}
                            value={values[control.name]}
                            onChange={handleChange}
                          />
                        </div>
                      );

                    case "select":
                      const selectControl = control as ISelect;
                      return (
                        <div key={control.name} style={{ marginBottom: 12 }}>
                          <label>{control.label}</label>
                          <select
                            name={control.name}
                            value={values[control.name]}
                            onChange={handleChange}
                          >
                            {selectControl.checkValues?.map((opt: any) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      );

                    default:
                      return (
                        <div key={control.name} style={{ marginBottom: 12 }}>
                          <label>{control.label}</label>
                          <input
                            type="text"
                            name={control.name}
                            value={values[control.name]}
                            onChange={handleChange}
                          />
                        </div>
                      );
                  }
                })}
              </DialogContent>

              <Box sx={{ flexGrow: 1 }} />

              {!hideButtons && (
                <DialogActions>
                  {/* Botón Cancelar (izquierda) */}
                  {onCancel && (
                    <Button
                      type="button"
                      onClick={onCancel}
                      color="primary"
                      variant="contained"
                    >
                      Cancelar
                    </Button>
                  )}

                  {/* Botón Submit / Aceptar (derecha) */}
                  <Button type="submit" color="primary" variant="contained">
                    {submitLabel || "Aceptar"}
                  </Button>
                </DialogActions>
              )}
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default GenericForm;
