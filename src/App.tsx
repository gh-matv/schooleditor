import React from 'react';
import './App.css';
import {calculate_vars, exercicedata_t, get_step_text, replace_text_with_vars} from "./core/exercice";

import math_lib from "./libraries/maths";

function App() {

  /*
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
  */

  const exampleData: exercicedata_t = {
    text: "<h1>Résoudre $A x + $B = 0</h1>",
    vars: {
      input: [
        {name: "A", gen: "Math.floor(Math.random() * 10 + 1)"},
        {name: "B", gen: "Math.floor(Math.random() * 10)"}
      ],
    },
    steps: [
      {
        // Si B != 0, on déplace B de l'autre coté de l'équation
        condition: "Number($B)!=0",
        explanation: "Comme b != 0, on passe b de l'autre coté, en inversant son signe<br />"
                    +" => $A x + $B = 0<br />"
                    +"=> $A x = -$B"
      },
      {
        action: "\"-$B / $A\"",
        store_to: "RST",
        explanation: "On passe le multiple de x de l'autre coté<br />"
                    +"=> x = -$B / $A",
      },
      {
        // Si le nombre est entier
        action: "Number(-$B)/Number($A)",
        store_to: "RST",
        explanation: "Comme le nombre est simplifiable, calculer son resultat<br />"
                    +"=> x = -$B / $A <br />"
                    +"=> x = $RST",
        condition: "(Number(-$B) % Number($A)) ==0"
      },
      {
        action: "Math.reducestr(-$B,$A)",
        store_to: "REDUCED"
      },
      {
        // Si la fraction est simplifiable
        condition: "($RST)!=($REDUCED)",
        action: "$REDUCED",
        store_to: "RST",
        explanation: "Comme la fraction est simplifiable, calculer son resultat<br />"
                    +"=> x = -$B / $A <br />"
                    +"=> x = $REDUCED",
        
      }
    ],
    result: "x = $RST"
  }

  function transform(data: exercicedata_t) {

    let text = data.text;
    let steps: string[] = [];

    // CALCULATE THE INPUTS
    let var_values = calculate_vars(data.vars?.input);
    console.log("VAR_VALUES", var_values);

    // CALCULATE THE STEPS
    data.steps?.forEach((e,i) => {

      console.log("STEP", i);
      

      // Calculate the step definition
      // This must be done BEFORE the result assignation !
      steps[i] = get_step_text(e, var_values);

      if(!e.action){ console.log("no action"); return; }
      if(!e.store_to){ console.log("no store_to"); return; }
      // eslint-disable-next-line no-eval

      if(!e.condition) {
        console.log("NO condition");
      }
      else
      {
        console.log("CONDITION", e.condition);
        console.log("CONDITION REPL", replace_text_with_vars(e.condition, var_values));
        console.log("CONDITION EVAL", eval(replace_text_with_vars(e.condition, var_values)));
        if(eval(replace_text_with_vars(e.condition, var_values))) {
          console.log("CONDITION OK");
        } else {
          console.log("CONDITION KO");
        }
      }

      if(!e.condition || eval(replace_text_with_vars(e.condition, var_values))) {
        const calc = eval(replace_text_with_vars(e.action, var_values));
        console.log("setting var", e.store_to, "to", calc);
        var_values.set(e.store_to, calc);
      }

      console.log("===========================");
    });

    // FINAL REPLACEMENT
    console.log("VAR_VALUES before replacing text ", var_values);
    text = replace_text_with_vars(text, var_values);
    console.log("text value", text);

    return {text, var_values, steps};
  }

  const [text, set_text] = React.useState(exampleData.text);

  React.useEffect(() => {
    math_lib();
    const {text, var_values, steps} = transform(exampleData); 
    set_text(text); 
    console.log("VAR_VALUES after replacing text ", var_values);
  });

  return (
      <div className="App-header">      
        <div className="Question" dangerouslySetInnerHTML={{__html:text}} />
        {/*<div dangerouslySetInnerHTML={{__html:steps.filter(e => e.trim() != "").map((e,i) => {
          return `<div><h3>Etape ${i+1} :</h3>${e}</div>`;
        }).join("")}} />
      <div>{replace_text_with_vars("$A $B $RES", var_values)}</div>
        <h3 className="Result" dangerouslySetInnerHTML={{__html:exampleData.result ? replace_text_with_vars(exampleData.result, var_values) : ""}} />
      */}</div>
      
  );
}

export default App;
