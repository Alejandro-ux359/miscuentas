// src/_pwa-framework/genforms/types/validation.types.ts
import { EControlsForValidate } from "./common.types";
import { Schema } from "yup";

/**
 * Función de prueba para validar un campo.
 */
export interface ITestFunction {
  (values?: any): boolean | void;
}

/**
 * Definición de prueba para un campo de validación.
 */
export type ITest = {
  /** Mensaje de error */
  message: string;
  /** Función que valida el campo */
  test: ITestFunction;
};

/** Validaciones personalizadas */
export type ICustomValidation = {
  tests?: ITest[];
};

/** Validaciones para un campo de texto */
export type ITextValidation = {
  required?: IRequiredValidation;
  regex?: IRegexValidation;
  email?: IEmailValidation;
  url?: IUrlValidation;
  lowercase?: ILowerCaseValidation;
  uppercase?: IUppercaseValidation;
  trim?: ITrimValidation;
  length?: ILimitsProps;
} & ILimitsValidation &
  ICustomValidation;

/** Validación para campos tipo phone o email */
export type IPhoneOrEmailValidation = {
  required?: IRequiredValidation;
  regex?: IRegexValidation;
  email?: IEmailValidation;
} & ILimitsValidation;

/** Validaciones condicionales */
export type IWhenValidation = {
  when?: { name: string; expression: (value: any) => boolean };
};

/** Validaciones para números */
export type INumberValidation = {
  required?: IRequiredValidation;
  length?: ILimitsProps;
  positive?: IPositiveValidation;
  negative?: INegativeValidation;
  integer?: IIntegerValidation;
} & IComparativeValidations &
  ILimitsValidation &
  ICustomValidation;

/** Validaciones para fechas */
export type IDateValidation = {
  required?: IRequiredValidation;
} & ILimitsValidation &
  ICustomValidation;

/** Validaciones para campos de hora */
export type ITimeValidation = {
  required?: IRequiredValidation;
  minTime?: {
    value: string;
    message: string;
  };
  maxTime?: {
    value: string;
    message: string;
  };
} & ICustomValidation;

/** Validaciones para radios */
export type IRadioValidations = {
  required?: IRequiredValidation;
} & ICustomValidation;

/** Validaciones para selects */
export type ISelectValidation = {
  required?: IRequiredValidation;
} & ILimitsValidation &
  ICustomValidation;

/** Validaciones para multiselect */
export type IMultiSelectValidation = {
  length?: IArrayLengthValidation;
  required?: IRequiredValidation;
} & ILimitsValidation &
  ICustomValidation;

/** Validaciones para rating y slider */
export type IRatingValidations = ILimitsValidation &
  IComparativeValidations &
  ICustomValidation;
export type ISliderValidations = IRatingValidations & ICustomValidation;

/** Tipos internos de validación */
type IRequiredValidation = ICommonValidationsProps;
type IEmailValidation = ICommonValidationsProps;
type IUrlValidation = ICommonValidationsProps;
type ILowerCaseValidation = ICommonValidationsProps;
type IUppercaseValidation = ICommonValidationsProps;
type ITrimValidation = ICommonValidationsProps;
type INegativeValidation = ICommonValidationsProps;
type IPositiveValidation = ICommonValidationsProps;
type IIntegerValidation = ICommonValidationsProps;

type IRegexValidation = {
  reference?: string;
  value: RegExp;
} & ICommonValidationsProps;

type IArrayLengthValidation = {
  reference?: string;
  value: number;
} & ICommonValidationsProps;

type ICommonValidationsProps = {
  message: string;
} & IWhenValidation;

type ILimitsProps = {
  reference?: string;
  value: number;
} & ICommonValidationsProps;

type ILessThanValidations = {
  reference?: string;
  value: number;
} & ICommonValidationsProps;

type IMoreThanValidations = {
  reference?: string;
  value: number;
} & ICommonValidationsProps;

type ILimitsValidation = {
  min?: ILimitsProps;
  max?: ILimitsProps;
};

type IComparativeValidations = {
  lessThan?: ILessThanValidations;
  moreThan?: IMoreThanValidations;
};

/** Mapeos de Yup */
export type IValidationMap = Record<EControlsForValidate, Schema>;
export type IValidationSchemaMap = {
  required: IRequiredSchema;
  length: ILengthSchema;
  min: IMinSchema;
  max: IMaxSchema;
  moreThan: IMoreThanSchema;
  lessThan: ILessThanSchema;
  integer: IIntegerSchema;
  positive: IPositiveSchema;
  negative: INegativeSchema;
  regular_expression: IRegExpSchema;
  email: IEmailSchema;
  url: IUrlSchema;
  oneOf: IOneOfSchema;
  tests: ITestsSchema;
};

export type EValidations =
  | "required"
  | "length"
  | "email"
  | "url"
  | "regular_expression"
  | "min"
  | "max"
  | "integer"
  | "moreThan"
  | "lessThan"
  | "positive"
  | "negative"
  | "tests"
  | "oneOf";

export type IValidationFunctions = Record<
  string,
  (schema: any, params: any) => any
>;

/** Yup schema mappings */
export type IRequiredSchema = {
  required: (schema: any, { message }: any) => any;
};
export type ILengthSchema = {
  length: (schema: any, { message, value, ref }: any) => any;
};
export type IMinSchema = {
  min: (schema: any, { message, value, ref }: any) => any;
};
export type IMaxSchema = {
  max: (schema: any, { message, value, ref }: any) => any;
};
export type IMoreThanSchema = {
  moreThan: (schema: any, { message, value, ref }: any) => any;
};
export type ILessThanSchema = {
  lessThan: (schema: any, { message, value, ref }: any) => any;
};
export type IIntegerSchema = {
  integer: (schema: any, { message }: any) => any;
};
export type IPositiveSchema = {
  positive: (schema: any, { message }: any) => any;
};
export type INegativeSchema = {
  negative: (schema: any, { message }: any) => any;
};
export type IRegExpSchema = {
  regular_expression: (schema: any, { message, value, ref }: any) => any;
};
export type IEmailSchema = { email: (schema: any, { message }: any) => any };
export type IUrlSchema = { url: (schema: any, { message }: any) => any };
export type IOneOfSchema = {
  oneOf: (schema: any, { message, value, ref }: any) => any;
};
export type ITestsSchema = { tests: (schema: any, tests: ITest[]) => any };
