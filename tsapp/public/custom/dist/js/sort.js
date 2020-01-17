function sort_by_key(array, key)
{
 return array.sort(function(a, b)
 {
  var x = a[key]; var y = b[key];
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
 });
}

function sortByKey(arr, key) {
  try { arr = JSON.parse(arr); } catch(e) {}
  arr = sort_by_key(arr, key);
  return arr;
}

function sanitize(val) {
  $("#data").empty();
  let tableString = '';
  for(let eachData in val) {
    if(val[eachData]["STATUS_1"] == "UNASSIGNED") {
      tableString += "<tr onclick='showInfo(\"" + val[eachData]["ID"] +"\", \"" + dbname +"\")', data-toggle='modal' data-target='#exampleModal1' data-keyboard='false' data-backdrop='static', style='background-color: #FFA07A;'>";
    }
    else if((val[eachData]["STATUS_1"] == "IN WORK – WP") || (val[eachData]["STATUS_1"] == "WAITING APPROVAL") || (val[eachData]["STATUS_1"] == "PENDING")) {
      tableString += "<tr onclick='showInfo(\"" + val[eachData]["ID"] +"\", \"" + dbname +"\")', data-toggle='modal' data-target='#exampleModal1' data-keyboard='false' data-backdrop='static', style='background-color: #FFFFCC;'>";
    }
    else if(val[eachData]["STATUS_1"] == "IN WORK – STRESS") {
      tableString += "<tr onclick='showInfo(\"" + val[eachData]["ID"] +"\", \"" + dbname +"\")', data-toggle='modal' data-target='#exampleModal1' data-keyboard='false' data-backdrop='static', style='background-color: #90EE90;'>";
    } else {
      tableString += "<tr onclick='showInfo(\"" + val[eachData]["ID"] +"\", \"" + dbname +"\")', data-toggle='modal' data-target='#exampleModal1' data-keyboard='false' data-backdrop='static'>";
    }
    //tableString += "<tr onclick=\"showInfo(\'" + val[eachData]["ID"]  + "', \'" + dbname  + "')\" data-toggle=\"modal\" data-target=\"#exampleModal1\">";
    let counter = 0;
    let getKeys = Object.keys(val[eachData]);
    for(let eachSet in getKeys) {
      let eachValue = getKeys[eachSet];
      tableString += "<td id='valueby-" + eachData + "-" + counter + "' ><div id='row' style='height:20px;  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px;'><span title='" + val[eachData][eachValue] + "'>" + val[eachData][eachValue] + "</span></div></td>";
      counter++;
    }
    tableString += "</tr>";
  }
  $("#data").append(tableString);
  getUpdateSettingsList(0);
}
var isSorted = 0;

function sort(id) {
 /*try { val = val.replace(/&quot;/g, '"'); } catch(e) {}
 val = sortByKey(val, id.toUpperCase());
 sanitize(val);*/
 if(isSorted == 0) {
  sortTable($('#myTable'),'asc');
  isSorted = 1;
 }
 else {
  sortTable($('#myTable'),'desc');     
  isSorted = 0;
 }
}


function sortTable(table, order) {
    var asc   = order === 'asc',
        tbody = table.find('tbody');

    tbody.find('tr').sort(function(a, b) {
        if (asc) {
            return $('td:first', a).text().localeCompare($('td:first', b).text());
        } else {
            return $('td:first', b).text().localeCompare($('td:first', a).text());
        }
    }).appendTo(tbody);
}
