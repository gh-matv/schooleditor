import React from 'react';
import './App.css';
import {calculate_vars, exercicedata_t, get_step_text, replace_text_with_vars} from "./core/exercice";

import math_lib from "./libraries/maths";

function ExerciceContent(props: {text: string, steps: string[], result: string}) {
  return (
    <div className="App">
      <header className="App-header">
        <h1>{props.text}</h1>
        <h2>{props.result}</h2>
        <h2>{props.steps.join("<br />")}</h2>
      </header>
    </div>
  );
}

export default ExerciceContent;
