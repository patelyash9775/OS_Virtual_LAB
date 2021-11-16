let add_button = document.querySelector(
    ".container>div:last-child>.add-process>.add"
  );
  let table = document.querySelector(".table>table");
  let play_button = document.querySelector(
    ".container>div:first-child>.buttons>.play"
  );
  let reset_button = document.querySelector(
    ".container>div:first-child>.buttons>.reset"
  );
  
  add_button.addEventListener("click", add_process);
  table.addEventListener("click", delete_process);
  play_button.addEventListener("click", run_algorithm);
  reset_button.addEventListener("click", reset_table);
  
  function add_process(e) {
    let arrivalTime = parseInt(document.getElementById("arrival-time").value, 10);
    let burstTime = parseInt(document.getElementById("brust-time").value, 10);
    let tableBody = document.querySelector(".table>table>tbody");
  
    if (
      Number.isInteger(arrivalTime) &&
      Number.isInteger(burstTime) &&
      burstTime > 0 &&
      arrivalTime >= 0
    ) {
      document.querySelector(".error").style.display = "none";
      tableBody.innerHTML += `<tr>
          <td></td>
          <td>${arrivalTime}</td>
          <td>${burstTime}</td>
          <td class="del">DEL</td>
        </tr>`;
  
      document.getElementById("arrival-time").value = "";
      document.getElementById("brust-time").value = "";
  
      for (let i = 0; i < table.rows.length; i++) {
        document.querySelector(
          `.table>table>tbody>tr:nth-child(${i + 1})>td:nth-child(1)`
        ).innerHTML = "P" + (i + 1);
      }
    } else {
      document.querySelector(".error").style.display = "block";
    }
  }
  
  function delete_process(e) {
    if (!e.target.classList.contains("del")) {
      return;
    }
    let deleteButton = e.target;
    deleteButton.closest("tr").remove();
  
    for (let i = 0; i < table.rows.length; i++) {
      document.querySelector(
        `.table>table>tbody>tr:nth-child(${i + 1})>td:nth-child(1)`
      ).innerHTML = "P" + (i + 1);
    }
  }
  
  function reset_table(e) {
    location.reload();
  }
  
  var processArr = [];
  var processArrSJF = [];
  var processArrLJF = [];
  var rowLength;
  var pid;
  var data = {
    header: ["Algorithm", "Turn Around Time"],
    rows: [],
  };
  
  
  function run_algorithm(e) {
    //processArr = [];
    let times = ["st", "ct", "rt", "wt", "tat"];
    rowLength = table.rows.length;
  
    for (let i = 1; i < rowLength; i++) {
      processArr.push({
        at: parseInt(table.rows.item(i).cells.item(1).innerHTML, 10),
        bt: parseInt(table.rows.item(i).cells.item(2).innerHTML, 10),
        pid: "P" + i,
      });
      processArrSJF.push({
        at: parseInt(table.rows.item(i).cells.item(1).innerHTML, 10),
        bt: parseInt(table.rows.item(i).cells.item(2).innerHTML, 10),
        pid: "P" + i,
      });
      processArrLJF.push({
        at: parseInt(table.rows.item(i).cells.item(1).innerHTML, 10),
        bt: parseInt(table.rows.item(i).cells.item(2).innerHTML, 10),
        pid: "P" + i,
      });
    }
  
    processArr = calculateAllTimes(processArr);
    processArrSJF = calculateAllTimesSJF(processArrSJF);
    processArrLJF = calculateAllTimesLJF(processArrLJF);

    let avgTAT = 0,
      avgWT = 0,
      avgRT = 0,
      avgTAT1 = 0,
      avgWT1 = 0,
      avgRT1 = 0,
      avgTAT2 = 0,
      avgWT2 = 0,
      avgRT2 = 0;
    
    for (let i = 0; i < processArrLJF.length; i++) {
        avgTAT2 += processArrLJF[i].tat;
        avgWT2 += processArrLJF[i].wt;
        
      }
  
    for (let i = 0; i < processArrSJF.length; i++) {
      avgTAT1 += processArrSJF[i].tat;
      avgWT1 += processArrSJF[i].wt;
      
    }
  
    for (let i = 0; i < processArr.length; i++) {
      avgTAT += processArr[i].tat;
      avgWT += processArr[i].wt;
      
    }
  
    document.querySelector(".container>div:first-child>.avg-tat>span").innerHTML =
      (avgTAT / processArr.length).toFixed(2) == "NaN"
        ? 0
        : (avgTAT / processArr.length).toFixed(2);
    document.querySelector(".container>div:first-child>.avg-wt>span").innerHTML =
      (avgWT / processArr.length).toFixed(2) == "NaN"
        ? 0
        : (avgWT / processArr.length).toFixed(2);
    

    document.querySelector(".container>div:first-child>.avg-tat-sjf>span").innerHTML =
        (avgTAT1 / processArrSJF.length).toFixed(2) == "NaN"
          ? 0
          : (avgTAT1 / processArrSJF.length).toFixed(2);
    document.querySelector(".container>div:first-child>.avg-wt-sjf>span").innerHTML =
        (avgWT1 / processArrSJF.length).toFixed(2) == "NaN"
          ? 0
          : (avgWT1 / processArrSJF.length).toFixed(2);
    
    document.querySelector(".container>div:first-child>.avg-tat-ljf>span").innerHTML =
        (avgTAT2 / processArrLJF.length).toFixed(2) == "NaN"
        ? 0
        : (avgTAT2 / processArrLJF.length).toFixed(2);
    document.querySelector(".container>div:first-child>.avg-wt-ljf>span").innerHTML =
        (avgWT2 / processArrLJF.length).toFixed(2) == "NaN"
        ? 0
        : (avgWT2 / processArrLJF.length).toFixed(2);

    processArr.sort(function (a, b) {
      var keyA = a.ct,
        keyB = b.ct;
      // Compare the 2 dates
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
        });
    
    console.log(processArr);
    let aTAT = avgTAT/processArr.length;
    let aTAT1 = avgTAT1/processArr.length;
    let aTAT2 = avgTAT2/processArr.length;

    data.rows[0]=["FCFS",aTAT];
    data.rows[1]= ["SJF",aTAT1];
    data.rows[2] = ["LJF",aTAT2];

    anychart.onDocumentReady(function () {
    
      anychart.theme(anychart.themes.lightEarth);
  
     
      // set a data from process array for tat chart
  
      console.log(data);
      // create the chart
      var chart = anychart.bar();
  
      // add data
      chart.data(data);
  
      chart.background().stroke({
        keys: [".1 red", ".5 yellow", ".9 blue"],
        angle: 45,
        thickness: 5
      });
  
      // set the chart title
      chart.title("TAT comparison For Different Algo");
  
      // draw
      chart.container("container");
      chart.draw();
    });
    
  

  }
  
  
  function calculateAllTimes(arr) {
    let time = 0;
    while (arr.find((el) => el.finish == undefined)) {
      let minAT = Infinity;
      let process = {};
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].at < minAT && arr[i].finish != true) {
          minAT = arr[i].at;
          process = arr[i];
        }
      }
      if (time == 0 || time < minAT) {
        time = minAT;
      }
      process.st = time;
      process.finish = true;
      time += process.bt;
      process.ct = time;
      process.rt = process.st - process.at;
      process.tat = process.ct - process.at;
      process.wt = process.tat - process.bt;
    }
    return arr;
  }
  
 
  
  function calculateAllTimesSJF(arr) {
    let time = Infinity;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].at < time) {
        time = arr[i].at;
      }
    }
  
    while (arr.find((el) => el.finish == undefined)) {
      let minBT = Infinity;
      let process = {};
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].at <= time && arr[i].finish != true && arr[i].bt < minBT) {
          minBT = arr[i].bt;
          process = arr[i];
        }
      }
  
      if (minBT === Infinity) {
        time++;
        continue;
      }
  
      process.st = time;
      process.finish = true;
      time += process.bt;
      process.ct = time;
      process.rt = process.st - process.at;
      process.tat = process.ct - process.at;
      process.wt = process.tat - process.bt;
    }
    return arr;
  }

  function calculateAllTimesLJF(arr) {
    let time = Infinity;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].at < time) {
        time = arr[i].at;
      }
    }
  
    while (arr.find((el) => el.finish == undefined)) {
      let maxBT = 0;
      let process = {};
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].at <= time && arr[i].finish != true && arr[i].bt > maxBT) {
          maxBT = arr[i].bt;
          process = arr[i];
        }
      }
  
      if (maxBT === 0) {
        time++;
        continue;
      }
  
      process.st = time;
      process.finish = true;
      time += process.bt;
      process.ct = time;
      process.rt = process.st - process.at;
      process.tat = process.ct - process.at;
      process.wt = process.tat - process.bt;
    }
    return arr;
  }