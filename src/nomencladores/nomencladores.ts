export const nomencladoresMock = {
  "1000": [
    {
      idconcepto: 1001,
      denominacion: "Efectivo",
      ticoncepto: 1,
      codigo: null,
      childrens: true,
    },
    {
      idconcepto: 1100,
      denominacion: "Tarjetas de crédito/débito",
      ticoncepto: 1,
      codigo: null,
      childrens: true,
    },
    {
      idconcepto: 1200,
      denominacion: "Transferencias bancarias",
      ticoncepto: 1,
      codigo: null,
      childrens: true,
    },
    {
      idconcepto: 1300,
      denominacion: "Billeteras digitales / e-wallets",
      ticoncepto: 1,
      codigo: null,
      childrens: true,
    },
    {
      idconcepto: 1400,
      denominacion: "Criptomonedas",
      ticoncepto: 1,
      codigo: null,
      childrens: true,
    }
  ],

  //#region efectivo
  "1001": [
    {
      idconcepto: 1002,
      denominacion: "Moneda local",
      ticoncepto: 2,
      codigo: null,
      childrens: false,
    },
    {
      idconcepto: 1003,
      denominacion: "Moneda extranjera",
      ticoncepto: 2,
      codigo: null,
      childrens: false,
    }
  ],

  //#region tarjetas
  "1100": [
    {
      idconcepto: 1101,
      denominacion: "Visa",
      ticoncepto: 2,
      codigo: "VISA",
      childrens: false,
    },
    {
      idconcepto: 1102,
      denominacion: "MasterCard",
      ticoncepto: 2,
      codigo: "MC",
      childrens: false,
    },
    {
      idconcepto: 1103,
      denominacion: "American Express",
      ticoncepto: 2,
      codigo: "AMEX",
      childrens: false,
    },
    {
      idconcepto: 1104,
      denominacion: "Maestro / Debit",
      ticoncepto: 2,
      codigo: "MAESTRO",
      childrens: false,
    }
  ],

  //#region transferencias
  "1200": [
    {
      idconcepto: 1201,
      denominacion: "SWIFT / Internacional",
      ticoncepto: 2,
      codigo: "SWIFT",
      childrens: false,
    },
    {
      idconcepto: 1202,
      denominacion: "ACH / Nacional",
      ticoncepto: 2,
      codigo: "ACH",
      childrens: false,
    },
    {
      idconcepto: 1203,
      denominacion: "Transferencia SEPA (Europa)",
      ticoncepto: 2,
      codigo: "SEPA",
      childrens: false,
    }
  ],

  //#region billeteras digitales
  "1300": [
    {
      idconcepto: 1301,
      denominacion: "PayPal",
      ticoncepto: 2,
      codigo: "PAYPAL",
      childrens: false,
    },
    {
      idconcepto: 1302,
      denominacion: "Skrill",
      ticoncepto: 2,
      codigo: "SKRILL",
      childrens: false,
    },
    {
      idconcepto: 1303,
      denominacion: "Apple Pay",
      ticoncepto: 2,
      codigo: "APPLEPAY",
      childrens: false,
    },
    {
      idconcepto: 1304,
      denominacion: "Google Pay",
      ticoncepto: 2,
      codigo: "GOOGLEPAY",
      childrens: false,
    },
    {
      idconcepto: 1305,
      denominacion: "MercadoPago",
      ticoncepto: 2,
      codigo: "MP",
      childrens: false,
    }
  ],

  //#region criptomonedas
  "1400": [
    {
      idconcepto: 1401,
      denominacion: "Bitcoin",
      ticoncepto: 2,
      codigo: "BTC",
      childrens: false,
    },
    {
      idconcepto: 1402,
      denominacion: "Ethereum",
      ticoncepto: 2,
      codigo: "ETH",
      childrens: false,
    },
    {
      idconcepto: 1403,
      denominacion: "USDT / Tether",
      ticoncepto: 2,
      codigo: "USDT",
      childrens: false,
    }
  ],

    //#region Metodos Cubano
  "1500": [
    {
      idconcepto: 1401,
      denominacion: "Transfermovil",
      ticoncepto: 2,
      codigo: "BTC",
      childrens: false,
    },
    {
      idconcepto: 1402,
      denominacion: "Enzona",
      ticoncepto: 2,
      codigo: "ETH",
      childrens: false,
    },
  ]
};
