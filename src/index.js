import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import { InputNumber, Select } from "antd";

import currencyList from "./currencyList.js";

const { Option } = Select;
const locale = window.navigator.language || "de-DE";

const currencyOptions = currencyList.data.map(c => ({
  label: c.CcyNm,
  value: `${c.CtryNm}::${c.Ccy}`
}));

const currencyFormatter = selectedCurrOpt => value => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: selectedCurrOpt.split("::")[1]
  }).format(value);
};

const currencyParser = val => {
  try {
    // for when the input gets clears
    if (typeof val === "string" && !val.length) {
      val = "0.0";
    }

    // detecting and parsing between comma and dot
    var group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, "");
    var decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, "");
    var reversedVal = val.replace(new RegExp("\\" + group, "g"), "");
    reversedVal = reversedVal.replace(new RegExp("\\" + decimal, "g"), ".");
    //  => 1232.21 €

    // removing everything except the digits and dot
    reversedVal = reversedVal.replace(/[^0-9.]/g, "");
    //  => 1232.21

    // appending digits properly
    const digitsAfterDecimalCount = (reversedVal.split(".")[1] || []).length;
    const needsDigitsAppended = digitsAfterDecimalCount > 2;

    if (needsDigitsAppended) {
      reversedVal = reversedVal * Math.pow(10, digitsAfterDecimalCount - 2);
    }

    return Number.isNaN(reversedVal) ? 0 : reversedVal;
  } catch (error) {
    console.error(error);
  }
};

const Form = () => {
  const [currency, setCurrency] = React.useState(currencyOptions[0].value);
  return (
    <div>
      <InputNumber
        defaultValue={10000000}
        style={{
          width: 400,
          marginRight: "1rem"
        }}
        formatter={currencyFormatter(currency)}
        parser={currencyParser}
      />

      <Select
        showSearch
        value={currency}
        style={{ width: 120, marginTop: "1rem" }}
        onChange={setCurrency}
      >
        {currencyOptions.map(opt => (
          <Option key={opt.value} value={opt.value}>
            {opt.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};

const App = () => {
  return (
    <div
      style={{
        fontFamily: "Fira Sans, sans serif"
      }}
    >
      <h3>
        Implemeting the <code>Intl.NumberFormat</code> on Input
      </h3>
      <Form />
      <h4 style={{ marginTop: "2rem" }}>References:</h4>
      <ul>
        <li>
          UI Framework <a href="https://www.ant.design">Ant Design</a>
        </li>
        <li>
          Browser API for formatting{" "}
          <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat">
            Intl.NumberFormat
          </a>
        </li>
        <li>
          The currency options from{" "}
          <a href="https://www.currency-iso.org/en/home/tables/table-a1.html">
            Current currency & funds code list
          </a>
        </li>
      </ul>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("container"));
