import React from 'react';
import './App.css';
import {calculate_vars, exercicedata_t, replace_text_with_vars} from "./core/exercice";

function App() {

  const exampleData: exercicedata_t = {
    text: "<h1>Yo ! $A + $B = $O</h1>",
    vars: {
      input: [
          {name: "A", type: "int", gen_method: "Math.floor(Math.random() * 10)"},
          {name: "B", type: "int", gen_method: "$A+1"}
      ],
      output: [ {name: "O", type: "int", gen_method: "none"}]
    },
    steps: [
      { action: "Number($A)+Number($B)", store_to: "O" }
    ],
  };

  function transform(data: exercicedata_t) {

    let text = data.text;

    // CALCULATE THE INPUTS
    let var_values = calculate_vars(data.vars?.input);

    // CALCULATE THE STEPS
    data.steps?.forEach(e => {
      // eslint-disable-next-line no-eval
      const calc = eval(replace_text_with_vars(e.action, var_values));
      var_values.set(e.store_to, calc);
    });

    // FINAL REPLACEMENT
    text = replace_text_with_vars(text, var_values);
    return text;
  }

  return (
      <>
        <div dangerouslySetInnerHTML={{__html:transform(exampleData)}} />
      </>)
}

export default App;
