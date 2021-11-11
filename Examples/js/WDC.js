var myConnector = tableau.makeConnector(),

  inputURL = document.querySelector('.js-url'),
  maxRows = 100,
  rowNames,
  arr = [];

// var rowNames = arr[0].slice(0, maxRows);
// var rowNames = ["Date", "Time", "Time Zone", "Job ID", "Job Guid", "Job Name", "Job Template Number", "Template ID", "Template Version", "Template Name", "Step ID", "Job Step ID", "Template Step Number", "Step Name", "Field ID", "Field Name", "Field Type", "Field Value", "Is Na", "Executor ID", "Units", "Executor Name", "Location", "Job Business Unit", "Job Location"];
//, "Location", "Department", "Workflow Category", "Template Business Unit", "Template Location"];


myConnector.getSchema = function (schemaCallback) {
  var cols = [];

  loadJSON(localStorage.getItem('url'), function (resp) {
    if (resp !== '') arr = CSVToArray(resp);
    rowNames = arr[0].slice(0, maxRows);
    console.log(arr);

    for (var i = 0; i < rowNames.length; i++) {
      rowNames[i] = rowNames[i].split(' ')
        .join('_');
    }

    for (var i = 0; i < rowNames.length; i++) {
      cols.push({
        id: rowNames[i],
        alias: rowNames[i],
        dataType: tableau.dataTypeEnum.string,
      });
    }
    console.log('getsh');

    var tableSchema = {
      id: 'our_data',
      alias: '',
      columns: cols,
    };
    schemaCallback([tableSchema]);
  });
};


myConnector.getData = function (table, doneCallback) {
  let tableData = [],
    i,
    len = arr.length,
    max = 10000;
  let lenInner = rowNames.length,
    j,
    tmpRowObj;

  i = 1; // number row of data names
  while (i < len - 1 && max-- > 0) {
    j = 0;
    tmpRowObj = {};
    while (j < lenInner) {
      tmpRowObj[rowNames[j]] = arr[i][j];
      j++;
    }
    tableData.push(tmpRowObj);
    i++;
  }
  table.appendRows(tableData);
  doneCallback();
};
tableau.registerConnector(myConnector);

console.log('hey3');

document.querySelector('.js-getData').onclick = function () {
  localStorage.setItem('url', inputURL.value);
  tableau.connectionName = 'server';
  tableau.submit();
  //setTimeout(function(){tableau.submit()}, 3000);
};


function loadJSON(url, f) {
  console.log(url);
  var obj = new XMLHttpRequest();
  obj.open('GET', url);
  obj.onreadystatechange = function () {
    if (obj.readyState == 4 && obj.status == '200') {
      f(obj.responseText);
    }
  };
  obj.send(null);
  console.log('hey333');
}

function CSVToArray(strData) {
  var allRows = strData.split('\n');
  var res = [],
    i = -1;
  for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
    res[++i] = [];
    var rowCells = allRows[singleRow].split(',');
    for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
      res[i].push(rowCells[rowCell]);
    }
  }
  return res;
}
