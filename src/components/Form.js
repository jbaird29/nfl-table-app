import React, { useState } from "react";

function Form() {
    const [params, setParams] = useState({dimension: "player", filter: "pass"});

    function handleSelect(e) {
        const { name, value } = e.target;
        setParams(prevValue => {
            return { ...prevValue, [name]: value };
        });
    }

    function handleRunClick(e) {
        e.preventDefault();
        const { dimension, filter } = params
        // fetch(`/query?dimension=${dimension}&filter=${filter}`)
        // .then(response => response.json())
        // .then(data => document.querySelector('#data').innerText = JSON.stringify(data))
    }

    return (
    <div>
        <form>
            <button name="run-button" onClick={handleRunClick}>Run</button>
            <select name="dimension" onChange={handleSelect} value={params.dimension}>
                <option value="player">Player Name</option>
                <option value="team">Team Name</option>
            </select>
            <select name="filter" onChange={handleSelect} value={params.filter}>
                <option value="pass">Total Passing Yards</option>
                <option value="rush">Total Rushing Yards</option>
                <option value="receive">Total Receiving Yards</option>
            </select>
        </form>
    </div>
    );
  }
  
  export default Form;
  