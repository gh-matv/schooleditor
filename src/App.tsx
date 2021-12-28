import React from 'react';
import './App.css';
import {calculate_vars, exercicedata_t, get_step_text, replace_text_with_vars} from "./core/exercice";
import ExerciceContent from './ExerciceContent';

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

  /*
  const exampleData: exercicedata_t = {
    text: "Résoudre $A x + $B = 0",
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
  */

  const exampleData: exercicedata_t = {
    text: "Donne une écriture décimale qui correspond à<br />$EQX",
    vars: {
      input: [
        {name: "EQA", gen: "Math.floor(Math.random() * 8 + 1)"},
        {name: "EQB", gen: "Math.floor(Math.random() * 8 + 1)"},
        {name: "EQC", gen: "Math.floor(Math.random() * 8 + 1)"},
        {name: "EQD", gen: "Math.floor(Math.random() * 8 + 1)"},
        {name: "EQX", gen: "'($EQA x 10) + ($EQB x 1) + ($EQC x 0.1) + ($EQD x 0.01)'"},
      ],
    },
    steps: [
      {
        action: "$EQA*10",
        store_to: "EQSA",
      },
      {
        action: "$EQB*1",
        store_to: "EQSB",
      },
      {
        action: "$EQC*0.1",
        store_to: "EQSC",
      },
      {
        action: "$EQD*0.01",
        store_to: "EQSD",
      },
      {
        explanation: "On multiplie $EQA par 10<br />"
                    +"=> $EQA * 10 = $EQSA<br />"
                    +"=> ($EQSA) + ($EQB * 1) + ($EQC * 0.1) + ($EQD * 0.01)",
      },
      {
        explanation: "On multiplie $EQB par 1<br />"
                    +"=> $EQB * 1 = $EQSB<br />"
                    +"=> ($EQSA) + ($EQSB) + ($EQC * 0.1) + ($EQD * 0.01)",
      },
      {
        explanation: "On multiplie $EQC par 0.1<br />"
                    +"=> $EQC * 0.1 = $EQSC<br />"
                    +"=> ($EQSA) + ($EQSB) + ($EQSC) + ($EQD * 0.01)",
      },
      {
        explanation: "On multiplie $EQD par 0.01<br />"
                    +"=> $EQD * 0.01 = $EQSD<br />"
                    +"=> ($EQSA) + ($EQSB) + ($EQSC) + ($EQSD)",
      },
      {
        action: "$EQSA + $EQSB + $EQSC + $EQSD",
        store_to: "EQR",
      },
      {
        explanation: "On ajoute les résultats de toutes les multiplications<br />"
                    +"=> $EQSA + $EQSB + $EQSC + $EQSD = $EQR<br />",
      },
    ],
    result: "x = $EQR"
  };

  function transform(data: exercicedata_t) {

    let text = data.text;
    let steps: string[] = [];

    // CALCULATE THE INPUTS
    let var_values = calculate_vars(data.vars?.input);
    console.log("VAR_VALUES", var_values);

    // CALCULATE THE STEPS
    data.steps?.forEach((e,i) => {

      //console.log("STEP", i);
      

      // Calculate the step definition
      // This must be done BEFORE the result assignation !
      steps[i] = get_step_text(e, var_values);

      if(!e.action){ console.log("no action"); return; }
      if(!e.store_to){ console.log("no store_to"); return; }
      // eslint-disable-next-line no-eval

      //if(!e.condition) {
      //  console.log("NO condition");
      //}
      //else
      //{
        //console.log("CONDITION", e.condition);
        //console.log("CONDITION REPL", replace_text_with_vars(e.condition, var_values));
        //console.log("CONDITION EVAL", eval(replace_text_with_vars(e.condition, var_values)));
        //if(eval(replace_text_with_vars(e.condition, var_values))) {
          //console.log("CONDITION OK");
        //} else {
          //console.log("CONDITION KO");
        //}
      //}

      if(!e.condition || eval(replace_text_with_vars(e.condition, var_values))) {
        const calc = eval(replace_text_with_vars(e.action, var_values));
        //console.log("setting var", e.store_to, "to", calc);
        var_values.set(e.store_to, calc);
      }

      //console.log("===========================");
    });

    // FINAL REPLACEMENT
    //console.log("VAR_VALUES before replacing text ", var_values);
    text = replace_text_with_vars(text, var_values);
    //console.log("text value", text);

    return {text, var_values, steps};
  }


  const [text, setText] = React.useState(exampleData.text);
  const [var_values, setVarValues] = React.useState(new Map());
  const [steps, setSteps] = React.useState([] as string[]);
  const [result, setResult] = React.useState("");

    React.useEffect(() => {
      math_lib();
      const {text, var_values, steps} = transform(exampleData);  
      setText(text);
      setVarValues(var_values);
      setSteps(steps);
      exampleData.result && setResult(replace_text_with_vars(exampleData.result, var_values));
    }, []);


  return (
    <ExerciceContent text={text} steps={steps} result={result} />    
  );
}

export default App;
