(function () {
		var myConnector = tableau.makeConnector();
		var rowNames = ["Date", "Time", "Time Zone", "Job ID", "Job Guid", "Job Name", "Job Template Number", "Template ID", "Template Version", "Template Name", "Step ID", "Job Step ID", "Template Step Number", "Step Name", "Field ID", "Field Name", "Field Type", "Field Value", "Is Na", "Executor ID", "Units", "Executor Name", "Location", "Job Business Unit", "Job Location"];
		//, "Location", "Department", "Workflow Category", "Template Business Unit", "Template Location"];
		for (var i = 0; i < rowNames.length; i++) {
			rowNames[i] = rowNames[i].split(' ').join('_');
		}

		myConnector.getSchema = function (schemaCallback) {
			var cols = [];
			for (var i = 0; i < rowNames.length; i++) {
				cols.push({
					id: rowNames[i],
					alias: rowNames[i],
					dataType: tableau.dataTypeEnum.string
				});
			}
	
			var tableSchema = {
					id: "our_data",
					alias: "",
					columns: cols
			};
	
			schemaCallback([tableSchema]);
		};
		myConnector.getData = function(table, doneCallback) {
			const url = "https://api.us-west-2.parsable.net/api/analytics/extract/7e9d99db-7b69-4284-8345-da9e33c678eb.csv?start=1580598000&end=1580684399&type=inputs&tz=Europe%2FBerlin&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODMyNjI3MzAsImlhdCI6MTU4MDY3MDczMCwiaXNzIjoiYXV0aDpwcm9kdWN0aW9uIiwic2VyYTpzaWQiOiJiMzgyNTI2Zi0xOWRiLTQyNmQtYjczMi0zMzdjOTgzYzVjYjgiLCJzZXJhOnRlYW1JZCI6IjdlOWQ5OWRiLTdiNjktNDI4NC04MzQ1LWRhOWUzM2M2NzhlYiIsInNlcmE6dHlwIjoiYXV0aCIsInN1YiI6IjdiODk2ZmFjLWZmMGMtNDRhMS1iMDUzLTAxNzhiZThkYzMwYSJ9.UBt7AW8X-36SG0Az8dCfq9abBX40xzu1-7vwu79AQEs";

			loadJSON(url, function(resp) {
			// console.log('to server');
				let arr = [];
				if(resp !== '') arr = CSVToArray(resp);
				console.log(arr);

				let tableData = [], i, len = arr.length, max = 10000;
				let lenInner = rowNames.length,
						j, tmpRowObj;

			// console.log('to shema');
				// Iterate over the JSON object Ввести потрібні назви для даних
				i = 1; // number row of data names
				while(i < len - 1 && max-- > 0) {
					j = 0;
					tmpRowObj = {};
					while(j < lenInner) {
						tmpRowObj[ rowNames[j] ] = arr[i][j];
						j++;
					}
					tableData.push(tmpRowObj);
					i++;
				}
				table.appendRows(tableData);
				doneCallback();
			});
		};

		tableau.registerConnector(myConnector);
})();

$(document).ready(function() {
    $("#submitButton").click(function() {
        tableau.connectionName = "USGS Earthquake Feed"; // This will be the data source name in Tableau
        tableau.submit(); // This sends the connector object to Tableau
    });
});

function loadJSON(url, f) {
	var obj = new XMLHttpRequest();
	// obj.overrideMimeType("application/json");
		obj.open("GET", url);
		obj.onreadystatechange = function() {
			if (obj.readyState == 4 && obj.status == "200"){
				f(obj.responseText);
			}
		}
	obj.send(null);
}

function CSVToArray(strData) {
  var allRows = strData.split('\n');
  var res = [], i = -1;
  for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
		res[++i] = [];
		var rowCells = allRows[singleRow].split(',');
		for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
			res[i].push(rowCells[rowCell]);
		}
  } 
  return res;
}