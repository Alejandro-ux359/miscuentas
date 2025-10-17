// src/_pwa-framework/genforms/components/GenericForm.tsx
import React from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { IGenericControls, ISelect } from "./controls.types";
import {
  LocalizationProvider,
  DesktopTimePicker,
  DatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import TimePicker from "react-time-picker"; // 🔹 NO usar TimePicker de MUI
import "react-time-picker/dist/TimePicker.css"; // estilos del reloj
import "react-clock/dist/Clock.css"; // estilos del reloj
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";


type GenericFormProps = {
  title?: string;
  description?: string;
  controls: IGenericControls[];
  hideButtons?: boolean;
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  values?: Record<string, any>;
  submitLabel?: string;
  onCancel?: () => void;
};

const GenericForm: React.FC<GenericFormProps> = ({
  title,
  description,
  controls,
  hideButtons,
  onSubmit,
  values,
  submitLabel,
  onCancel,
}) => {
  const initialValues: Record<string, any> = controls.reduce((acc, control) => {
    acc[control.name] = values?.[control.name] ?? "";
    return acc;
  }, {} as Record<string, any>);

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
          const { values, handleChange, handleSubmit, setFieldValue } =
            formikProps;

          return (
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  {controls.map((control) => {
                    switch (control.type) {
                      case "text":
                      case "number":
                        return (
                          <div key={control.name} style={{ marginBottom: 12 }}>
                            <TextField
                              label={control.label}
                              type={control.type}
                              name={control.name}
                              value={values[control.name]}
                              onChange={handleChange}
                              fullWidth
                            />
                          </div>
                        );

                      case "date":
                        return (
                          <div key={control.name} style={{ marginBottom: 12 }}>
                            <DatePicker
                              label={control.label}
                              value={
                                values[control.name]
                                  ? dayjs(values[control.name])
                                  : null
                              }
                              onChange={(newValue: Dayjs | null) =>
                                setFieldValue(
                                  control.name,
                                  newValue ? newValue.format("YYYY-MM-DD") : ""
                                )
                              }
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                } as TextFieldProps,
                              }}
                            />
                          </div>
                        );
case "time":
  return (
    <div key={control.name} style={{ marginBottom: 12 }}>
      <label>{control.label}</label>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileTimePicker
          ampm={false} // formato 24h
          value={
            values[control.name]
              ? dayjs(values[control.name], "HH:mm")
              : null
          }
          onChange={(newValue) => {
            const formatted = newValue ? newValue.format("HH:mm") : "";
            setFieldValue(control.name, formatted);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              size: "small",
              error:
                !!(
                  formikProps.touched[control.name] &&
                  formikProps.errors[control.name]
                ),
              helperText:
                formikProps.touched[control.name] &&
                formikProps.errors[control.name]
                  ? String(formikProps.errors[control.name])
                  : "",
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );

                      case "select":
                        const selectControl = control as ISelect;
                        return (
                          <div key={control.name} style={{ marginBottom: 12 }}>
                            <TextField
                              select
                              label={control.label}
                              name={control.name}
                              value={values[control.name]}
                              onChange={handleChange}
                              fullWidth
                              SelectProps={{ native: true }}
                            >
                              {selectControl.checkValues?.map((opt: any) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </TextField>
                          </div>
                        );

                      default:
                        return (
                          <div key={control.name} style={{ marginBottom: 12 }}>
                            <TextField
                              label={control.label}
                              name={control.name}
                              value={values[control.name]}
                              onChange={handleChange}
                              fullWidth
                            />
                          </div>
                        );
                    }
                  })}
                </LocalizationProvider>
              </DialogContent>

              <Box sx={{ flexGrow: 1 }} />

              {!hideButtons && (
                <DialogActions>
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
