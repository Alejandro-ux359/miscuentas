// src/_pwa-framework/genforms/components/GenericForm.tsx
import React, { memo } from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  TextFieldProps,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { IGenericControls, ISelect } from "./controls.types";
import {
  LocalizationProvider,
  DatePicker,
  MobileTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

// Componente CampoItem memoizado
export const CampoItem: React.FC<{
  campo: { id?: string; label: string; name: string; type?: string };
  valor: any;
  onChange: (v: any) => void;
  onDelete?: () => void;
  editable?: boolean;
  sx?: object;
  maxDate?: Dayjs;
}> = memo(({ campo, valor, onChange, onDelete, editable = true, maxDate }) => {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}
    >
      {campo.type === "date" ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={campo.label}
            value={valor ? dayjs(valor) : null}
            onChange={(newValue) =>
              onChange(newValue ? newValue.format("YYYY-MM-DD") : "")
            }
            maxDate={maxDate} // ✅ aquí se aplica
            slotProps={{
              textField: {
                fullWidth: true,
                size: "small",
                margin: "dense",
              } as TextFieldProps,
            }}
          />
        </LocalizationProvider>
      ) : campo.type === "time" ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileTimePicker
            ampm={false}
            label={campo.label}
            value={valor ? dayjs(valor, "HH:mm") : null}
            onChange={(newValue) =>
              onChange(newValue ? newValue.format("HH:mm") : "")
            }
            slotProps={{
              textField: {
                fullWidth: true,
                size: "small",
                margin: "dense",
              } as TextFieldProps,
            }}
          />
        </LocalizationProvider>
      ) : (
        <TextField
          label={campo.label}
          type={campo.type || "text"}
          value={valor || ""}
          onChange={(e) => onChange(e.target.value)}
          fullWidth
          size="small"
          margin="dense"
          disabled={!editable}
        />
      )}

      {editable && onDelete && (
        <Button onClick={onDelete} color="error">
          <DeleteIcon />
        </Button>
      )}
    </div>
  );
});

type GenericFormProps = {
  title?: string;
  description?: string;
  controls: IGenericControls[];
  hideButtons?: boolean;
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  values?: Record<string, any>;
  submitLabel?: string;
  onCancel?: () => void;
  onChange?: (values: Record<string, any>) => void;
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
  onChange,
}) => {
  const initialValues: Record<string, any> = controls.reduce((acc, control) => {
    if (control.type === "check" || control.type === "switch") {
      acc[control.name] = values?.[control.name] ?? false;
    } else if (control.type === "select") {
      acc[control.name] = values?.[control.name] ?? "";
    } else {
      acc[control.name] = values?.[control.name] ?? "";
    }
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

          React.useEffect(() => {
            if (onChange) onChange(values);
          }, [values, onChange]);

          return (
            <form onSubmit={handleSubmit}>
              <DialogContent>
                {controls.map((control) => {
                  switch (control.type) {
                    case "text":
                      return (
                        <div key={control.name} style={{ marginBottom: 12 }}>
                          <TextField
                            label={control.label}
                            type="text"
                            name={control.name}
                            value={values[control.name]}
                            onChange={handleChange}
                            fullWidth
                          />
                        </div>
                      );

                    case "number":
                      return (
                        <div key={control.name} style={{ marginBottom: 12 }}>
                          <TextField
                            label={control.label}
                            type="number"
                            name={control.name}
                            value={values[control.name]}
                            onChange={(e) => {
                              // Guardamos solo el número limpio
                              const rawValue = e.target.value.replace(
                                /[^0-9.]/g,
                                ""
                              );
                              setFieldValue(control.name, rawValue);
                            }}
                            fullWidth
                            InputProps={{
                              startAdornment: control.finanza
                                ? "$ "
                                : undefined,
                            }}
                          />
                        </div>
                      );

                    case "date":
                      return (
                        <div key={control.name} style={{ marginBottom: 12 }}>
                          <CampoItem
                            campo={control}
                            valor={values[control.name]}
                            onChange={(v) => setFieldValue(control.name, v)}
                            maxDate={dayjs()}
                          />
                        </div>
                      );

                    case "time":
                      return (
                        <div key={control.name} style={{ marginBottom: 12 }}>
                          <CampoItem
                            campo={control}
                            valor={values[control.name]}
                            onChange={(v) => setFieldValue(control.name, v)}
                          />
                        </div>
                      );

                    case "select":
                      const selectControl = control as ISelect;
                      const [options, setOptions] = React.useState<any[]>(
                        selectControl.checkValues || []
                      );

                      React.useEffect(() => {
                        if (selectControl.url) {
                          axios.get(selectControl.url).then((res) => {
                            const mapped = res.data.map((item: any) => ({
                              value: item.id_concepto,
                              label: item.denominacion,
                            }));
                            setOptions(mapped); // Array válido para checkValues
                          });
                        } else if (selectControl.checkValues) {
                          setOptions(selectControl.checkValues);
                        }
                      }, [selectControl.url, selectControl.checkValues]);

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
                            <option value="" disabled>
                              Selecciona...
                            </option>
                            {options.map((opt) => (
                              <option key={opt.value} value={opt.label}>
                                {opt.label}
                              </option>
                            ))}
                          </TextField>
                        </div>
                      );

                    case "check":
                      return (
                        <div key={control.name} style={{ marginBottom: 12 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!!values[control.name]}
                                onChange={(e) =>
                                  setFieldValue(control.name, e.target.checked)
                                }
                              />
                            }
                            label={control.label}
                          />
                        </div>
                      );

                    case "switch":
                      return (
                        <div key={control.name} style={{ marginBottom: 12 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!!values[control.name]}
                                onChange={(e) =>
                                  setFieldValue(control.name, e.target.checked)
                                }
                              />
                            }
                            label={control.label}
                          />
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
              </DialogContent>

              <Box sx={{ flexGrow: 1 }} />

              {/* {!hideButtons && (
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
              )} */}
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default GenericForm;
