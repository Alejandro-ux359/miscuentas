// src/_pwa-framework/genforms/types/controls/controls.types.ts
import {
  IChecks,
  ICommonProps,
  ICustomIcons,
  IInputProps,
  IOnChangeFunction,
  IOptionsProps,
  IRadios,
  ITimeControls,
  IconColor,
  IconNames,
} from "./common.types";
import {
  IDateValidation,
  IMultiSelectValidation,
  INumberValidation,
  IRadioValidations,
  IRatingValidations,
  ISelectValidation,
  ISliderValidations,
  ITextValidation,
} from "./validation.Types";

export type IGenericControls =
  | IScanner
  | ITextField
  | ISelect
  | IMultiSelect
  | INumberField
  | IAutocomplete
  | IDatePicker
  | ITimePicker
  | IRadio
  | ICheck
  | ISwitch
  | ISlider
  | IRating
  | ICustomComponent;

export type ITextField = {
  type: "text";
  pattern?: RegExp;
  validations?: ITextValidation;
  hidden?: any;
  multiline?: multiline;
} & IInputProps;

type multiline =
  | { minRows?: number; maxRows?: number }
  | boolean;

export type IScanner = {
  type: "scanner";
  parseFunction: (scannerResult: any) => Record<string, any>;
  closeOnScan: boolean;
} & ICommonProps;

export type IPhoneOrEmail = {
  type: "phoneOrEmail";
  validations?: IPhoneOrEmail;
} & IInputProps;

export type INumberField = {
  type: "number";
  format: "units" | "finance" | "other";
  mask?: string;
  decimalScale?: number;
  fixDecimalSeparator?: boolean;
  avoidSeparator?: boolean;
  prefix?: string;
  validations?: INumberValidation;
  negativeValues?: boolean;
} & IInputProps;

export type ISelect = {
  type: "select";
  validations?: ISelectValidation;
  checkValues?: any[];
  url?: string;
  useRef?: any;
  showDelete?: boolean;
} & IOptionsProps;

export type IMultiSelect = {
  type: "multiselect";
  validations?: IMultiSelectValidation;
  checkValues?: any[];
  url?: string;
  useRef?: any;
} & IOptionsProps;

export type IAutocomplete = {
  type: "autocomplete";
  validations?: ISelectValidation;
  loadingText?: string;
} & IOptionsProps;

export type IDatePicker = {
  type: "date";
  validations?: IDateValidation;
} & ITimeControls;

export type ITimePicker = {
  type: "time";
  validations?: IDateValidation;
  onChangeCallback?: IOnChangeFunction;
} & ITimeControls;

export type IRadio = {
  type: "radio";
  direction?: "row" | "col";
  labelPlacement?: "top" | "start" | "bottom" | "end";
  radios?: IRadios[];
  validations?: IRadioValidations;
  url?: string;
  defaultValue?: string;
  onChangeCallback?: IOnChangeFunction;
} & ICommonProps;

export type ICheck = {
  type: "check";
} & IChecks &
  ICustomIcons;

export type ISwitch = {
  type: "switch";
} & IChecks;

export type IRating = {
  type: "rating";
  precision?: boolean;
  max?: number;
  color?: IconColor;
  defaultValue?: number;
  validations?: IRatingValidations;
} & ICommonProps &
  ICustomIcons;

export type ISlider = {
  type: "slider";
  startIcon?: IconNames;
  endIcon?: IconNames;
  step?: number;
  mark?: boolean;
  min: number;
  defaultValue?: number;
  max: number;
  validations?: ISliderValidations;
  valueLabelDisplay?: "auto" | "on" | "off";
} & ICommonProps;

export type ICustomComponent = {
  type: "component";
  component: (props: {
    id?: any;
    initialValue?: any;
    gridValues?: any;
    name?: any;
    label?: any;
    disabled?: any;
    hidden?: any;
    sx?: any;
    component?: any;
    validations?: any;
    formValue?: any;
    error?: any;
    setFieldValue?: any;
    setFieldTouched?: any;
    values?: any;
  }) => any;
} & ICommonProps;




