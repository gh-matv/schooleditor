import './App.css';

function ExerciceContent(props: {text: string, steps: string[], result: string}) {
  return (
    <div className="App">
      <header className="App-header">
        <h3 className={"Question"} dangerouslySetInnerHTML={{__html:props.text}} />
        
        {props.steps.filter(e => e.trim() !== "").map((e,i) => (
          <div key={i}>
            <h3>
              Etape {i} :
            </h3>
            <div dangerouslySetInnerHTML={{__html:e}} />
          </div>
        ))}

        <h3 className={"Result"}>{props.result}</h3>

      </header>
    </div>
  );
}

export default ExerciceContent;
