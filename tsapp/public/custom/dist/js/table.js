function updateWorkList() {
  let updateWorkListJSON = {};
  /*for(let eachItem of schemaList) {
    updateWorkListJSON[eachItem.toUpperCase()] = $("textarea[id^='insert-" + eachItem + "']").val();
  }*/
  //NEW ADDITIONS +
  for(let eachItem of schemaList) {
    eachItem = eachItem.toUpperCase();
    console.log(eachItem, globalConfigObject);
    //updateWorkListJSON[eachItem.toUpperCase()] = $("textarea[id^='insert-" + eachItem + "']").val();
    if(globalDateList.indexOf(eachItem) > -1) {
      let date = '';
      if($("input[id^='insert-" + eachItem + "']").val() != "") {
        try {
          //Guillermo Requirements +
          /*date = $("input[id^='insert-" + eachItem + "']").val().split("-");
          day = date[2];
          month = date[1];
          year = date[0];
          date = year + "-" + month + "-" + day + " 00:00:00";*/
          //Guillermo Requirements -
          //Guillermo Requirements New +          
          //It must have time also
          date = $("textarea[id^='insert-" + eachItem + "']").val().split(" ")[0];
          console.log(eachItem, date);
          time = $("textarea[id^='insert-" + eachItem + "']").val().split(" ")[1];
          if((date.length > 0) &&(time.length > 0)) {
            date = date.split("-");
            day = date[2];
            month = date[1];
            year = date[0];
            date = year + "-" + month + "-" + day + " " + time;          
          } else {
            date = "";
          }         
          //Guillermo Requirements New -          
        } catch(e) {
          $("#inserterror-" + eachItem).text();
          $("#inserterror-" + eachItem).text("Input value doesn't satisfy constraints, FORMAT 'yyyy-mm-dd hh-mm-ss'");
          $('#exampleModal').animate({ scrollTop: 0 }, 'slow');
          return;          
          //console.log(eachItem, date, time);          
        }
      } else 
        date = "";
      updateWorkListJSON[eachItem] = date.toString();
    } else if(globalTimeList.indexOf(eachItem) > -1) {
      //READ THE TIME VALUES FIRST AND THEN ASSIGN TO VARIABLES
      if(($('#time1-' + eachItem).val() == "") || ($('#time2-' + eachItem).val() == "") || ($('#time3-' + eachItem).val() == "")) {
        time = "";
      } else {
        let timeSlot1 = $('#time1-' + eachItem).val();
        if(timeSlot1.length == 1)
          timeSlot1 = "0" + timeSlot1;
        let timeSlot2 = $('#time2-' + eachItem).val();
        if(timeSlot2.length == 1)
          timeSlot2 = "0" + timeSlot2;            
        let timeSlot3 = $('#time3-' + eachItem).val();
        if(timeSlot3.length == 1)
          timeSlot3 = "0" + timeSlot3;      
        time = timeSlot1 + ":" + timeSlot2 + ":" + timeSlot3;    
      }
      updateWorkListJSON[eachItem] = time;
    } else {
      //USE THE configObjectData HERE
      if(globalConfigObject[eachItem] == "LISTMULTIPLE") {
        let listMultipleValues = $("[id^='insert-" + eachItem + "']").val();
        try {
          listMultipleValues = listMultipleValues.toString();
        } catch(e) {
          listMultipleValues = "";
        }
        updateWorkListJSON[eachItem] = listMultipleValues;
      } else if(globalConfigObject[eachItem] == "LIST") {     
        updateWorkListJSON[eachItem] = $('#insert-' + eachItem + ' :selected').val();       
      } else {
        let valueToInsert = $("textarea[id^='insert-" + eachItem + "']").val();
        if($("textarea[id^='insert-" + eachItem + "']").val() == undefined)
          valueToInsert = "";
        //Custom Handling +
        if(eachItem == "RNC") {
          if(valueToInsert.length == 10) {
            //Use to match string
            let createMatchString = valueToInsert.match(/[A-Z]+/g) + valueToInsert.match(/\d+/g);
            if(createMatchString != valueToInsert) {
              $("#inserterror-" + eachItem).text();
              $("#inserterror-" + eachItem).text("Input value doesn't satisfy constraints");
							$('#exampleModal').animate({ scrollTop: 0 }, 'slow');
              return;
            } else {
              $("#inserterror-" + eachItem).empty();
            }
          } else {
              $("#inserterror-" + eachItem).text();
              $("#inserterror-" + eachItem).text("Input value doesn't satisfy constraints. Should have 10 characters");
							$('#exampleModal').animate({ scrollTop: 0 }, 'slow');
              return;
          }
        } else if(eachItem == "DISC") {
          if(valueToInsert.length >= 3) {
            //Use to match string
            let createMatchString = valueToInsert.match(/\d+/g);
            if(createMatchString != valueToInsert) {
              $("#inserterror-" + eachItem).text();
              $("#inserterror-" + eachItem).text("Input value doesn't satisfy constraints");
							$('#exampleModal').animate({ scrollTop: 0 }, 'slow');
              return;
            } else {
              $("#inserterror-" + eachItem).empty();
            }
          } else {
              $("#inserterror-" + eachItem).text();
              $("#inserterror-" + eachItem).text("Input value doesn't satisfy constraints. Should have a value in 3 character format '001'");
							$('#exampleModal').animate({ scrollTop: 0 }, 'slow');
              return;
          }
        } else if(eachItem == "DISPO") {
          if(valueToInsert.length > 0) {
            if(valueToInsert.endsWith(".0")) {
              //as it just the representation and need handling
              //https://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0
              valueToInsert == "1.0";
            } else {
              let checkIfFloat = parseFloat(valueToInsert);
              if((Number(checkIfFloat) === checkIfFloat && checkIfFloat % 1 !== 0) == true) {
                let createMatchString = valueToInsert.match(/\d+/g).toString().replace(",",".");
                if(createMatchString != valueToInsert) {
                  $("#inserterror-" + eachItem).text();
                  $("#inserterror-" + eachItem).text("Input value doesn't satisfy constraints");
                  $('#exampleModal').animate({ scrollTop: 0 }, 'slow');
                  return;
                } else {
                  $("#inserterror-" + eachItem).empty();
                }
              }  else {
                $("#inserterror-" + eachItem).text();
                $("#inserterror-" + eachItem).text("Input value doesn't satisfy constraints");
                $('#exampleModal').animate({ scrollTop: 0 }, 'slow');
                return;
              }
            }
          } else {
              $("#inserterror-" + eachItem).text();
              $("#inserterror-" + eachItem).text("Input value doesn't satisfy constraints. Should have a value");
							$('#exampleModal').animate({ scrollTop: 0 }, 'slow');
              return;
          } 
          //Custom Handling -          
        }
        updateWorkListJSON[eachItem] = valueToInsert;
      }
    }        
  }
  //console.log(updateWorkListJSON);
  $.ajax({
    type: "GET",
    url: '/arena/home/formula/saved/' + dbname,
    success: function(savedFormula) {
      savedFormula = savedFormula[0];
      let updatedKeyList = Object.keys(updateWorkListJSON);
      for(let eachUpdatedWorkListItem of updatedKeyList) {
        try {
        if(savedFormula[eachUpdatedWorkListItem] != null) {
          //Found a Formula
          //console.log(eachUpdatedWorkListItem, savedFormula[eachUpdatedWorkListItem]);
          //Update the value
          let formulaName = savedFormula[eachUpdatedWorkListItem].split(",")[0];
          let selectedFormulaValues = savedFormula[eachUpdatedWorkListItem].split(",");
          selectedFormulaValues.shift();
          let argumentsList = [];
          switch(formulaName.replace(/ /g, "")) {
            case "ADD":
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateWorkListJSON[eachFormulaValue]);
              }
              argumentsList.splice(argumentsList.length-1, 1);//Remove the last special field index
              let updatedValueToInsertADD = ADD(argumentsList);
              updateWorkListJSON[eachUpdatedWorkListItem] = updatedValueToInsertADD;
              break;
            case "SUBTRACT":
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateWorkListJSON[eachFormulaValue]);
              }
              argumentsList.splice(argumentsList.length-1, 1);//Remove the last special field index
              let updatedValueToInsertSUBTRACT = SUBTRACT(argumentsList);
              updateWorkListJSON[eachUpdatedWorkListItem] = updatedValueToInsertSUBTRACT;
              break;
            case "MULTIPLY":
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateWorkListJSON[eachFormulaValue]);
              }
              argumentsList.splice(argumentsList.length-1, 1);//Remove the last special field index
              let updatedValueToInsertMULTIPLY = MULTIPLY(argumentsList);
              updateWorkListJSON[eachUpdatedWorkListItem] = updatedValueToInsertMULTIPLY;
              break;
            case "DIVIDE":
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateWorkListJSON[eachFormulaValue]);
              }
              argumentsList.splice(argumentsList.length-1, 1);//Remove the last special field index
              let updatedValueToInsertDIVIDE = DIVIDE(argumentsList);
              updateWorkListJSON[eachUpdatedWorkListItem] = updatedValueToInsertDIVIDE;
              break;
            case "CONCATENATE":
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateWorkListJSON[eachFormulaValue]);
              }
              argumentsList.splice(argumentsList.length-1, 1);//Remove the last special field index
              let updatedValueToInsertCONCATENATE = CONCATENATE(argumentsList);
              updateWorkListJSON[eachUpdatedWorkListItem] = updatedValueToInsertCONCATENATE;
              break;
            case "DATEDIFF":
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateWorkListJSON[eachFormulaValue]);
              }
              let updatedValueToInsertDATEDIFF = DATEDIFF(argumentsList);
              if(updatedValueToInsertDATEDIFF.includes("NaN") == false)
                updateWorkListJSON[eachUpdatedWorkListItem] = updatedValueToInsertDATEDIFF;
              updateWorkListJSON[eachUpdatedWorkListItem] = "00:00:00";
              break;
            case "CUMILATIVETIMEADD":
              //console.log(selectedFormulaValues);
              let selectedFormulaValuesLen = selectedFormulaValues.length;
              let unqiueCumilativeKey = selectedFormulaValues[selectedFormulaValuesLen-1];
              selectedFormulaValues.splice(selectedFormulaValuesLen-1, 1);
              //console.log(unqiueCumilativeKey);
              //console.log(selectedFormulaValues);
              let sendJSON = {};
              sendJSON["key"] = unqiueCumilativeKey;
              sendJSON["value"] = selectedFormulaValues;
              sendJSON["field"] = eachUpdatedWorkListItem;
              let uniqueItems = unqiueCumilativeKey.split("&");
              for(let eachUniqueItem of uniqueItems) {
                sendJSON[eachUniqueItem] = updateWorkListJSON[eachUniqueItem];
              }
              $.ajax({
                type: "POST",
                url: '/arena/home/formula/getcumilativecombo/' + dbname,
                data: sendJSON,
                success: function(savedFormula) {    
                  //console.log(savedFormula);
                  savedFormula = savedFormula[0];
                  let getOutput = '';
                  if((savedFormula[eachUpdatedWorkListItem] == "") || (savedFormula[eachUpdatedWorkListItem] == "00:00:00"))
                    getOutput = savedFormula[selectedFormulaValues]
                  else
                    getOutput = savedFormula[eachUpdatedWorkListItem]
                  //console.log(getOutput);
                  argumentsList = [];
                  argumentsList.push(getOutput);
                  argumentsList.push("00:00:00");//TIME IS HARDCODED AS IT A NEW WORK LIST ADDITION
                  let updatedValueToInsertCUMILATIVETIME = CUMILATIVETIMEADD(argumentsList);
                  //console.log(eachUpdatedWorkListItem, ":", updatedValueToInsertCUMILATIVETIME);
                  updateWorkListJSON[eachUpdatedWorkListItem] = updatedValueToInsertCUMILATIVETIME;
              }, async: false });
              break;
            case "FLOOR":
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateWorkListJSON[eachFormulaValue]);
              }
              argumentsList.splice(argumentsList.length-1, 1);//Remove the last special field index
              let updatedValueToInsertFLOOR = FLOOR(argumentsList);
              updateWorkListJSON[eachUpdatedWorkListItem] = updatedValueToInsertFLOOR;
              break;
            case "CEILING":
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateWorkListJSON[eachFormulaValue]);
              }
              argumentsList.splice(argumentsList.length-1, 1);//Remove the last special field index
              let updatedValueToInsertCEILING = CEILING(argumentsList);
              updateWorkListJSON[eachUpdatedWorkListItem] = updatedValueToInsertCEILING;
              break;
            case "ABS":
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateWorkListJSON[eachFormulaValue]);
              }
              argumentsList.splice(argumentsList.length-1, 1);//Remove the last special field index
              let updatedValueToInsertABS = ABS(argumentsList);
              updateWorkListJSON[eachUpdatedWorkListItem] = updatedValueToInsertABS;
              break;
            case "MAX":
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateWorkListJSON[eachFormulaValue]);
              }
              argumentsList.splice(argumentsList.length-1, 1);//Remove the last special field index
              let updatedValueToInsertMAX = MAX(argumentsList);
              updateWorkListJSON[eachUpdatedWorkListItem] = updatedValueToInsertMAX;
              break;
            case "MIN":
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateWorkListJSON[eachFormulaValue]);
              }
              argumentsList.splice(argumentsList.length-1, 1);//Remove the last special field index
              let updatedValueToInsertMIN = MIN(argumentsList);
              updateWorkListJSON[eachUpdatedWorkListItem] = updatedValueToInsertMIN;
              break;
          }
        }
        } catch(e) {
          console.log(e);
        }
      }
      //console.log(updateWorkListJSON);
      //NEW ADDITIONS -
      $.ajax({
        type: "POST",
        url: '/arena/home/newitem/' + dbname,
        data: updateWorkListJSON,
        success: function(data) {
          window.location.href="/arena/home/db/render/" + dbname + "/1";
        }, async: false });
  }, async: true });
}

function saveEditedWorkList() {
  let wasDateUpdated = 0;
  let currentCoreConfigObject = '';
  $.ajax({
    type: "GET",
    url: '/arena/home/db/coredbfieldsettings/' + dbname,
    success: function(configObject) {
    //console.log("^^^&&^^^", configObject);
    try {
      configObject = JSON.parse(configObject[0]["CONFIGOBJECT"]);
    } catch(e) {
      configObject = {};
    }
    currentCoreConfigObject = configObject;
  }, async: false });
  let changeLogList = [];
  let updateKVJson = {};
  for(let eachValue in updateKeyList) {
    if(globalDateList.indexOf(updateKeyList[eachValue]) > -1) {
      let date = '';
      if($('#values-' + updateKeyList[eachValue]).val() != "") {
        try {
          //Guillermo Requirements +
          //date = $('#values-' + updateKeyList[eachValue]).val().split("-");
          //day = date[2];
          //month = date[1];
          //year = date[0];
          //date = year + "-" + month + "-" + day + " 00:00:00";
          //Guillermo Requirements -          
          //It must have time also
          //Guillermo Requirements New +
          //console.log(updateKeyList[eachValue], $('#values-' + updateKeyList[eachValue]).val())
          date = $('#values-' + updateKeyList[eachValue]).val().split(" ")[0];
          time = $('#values-' + updateKeyList[eachValue]).val().split(" ")[1];
          if((date.length > 0) &&(time.length > 0)) {
            date = date.split("-");
            day = date[2];
            month = date[1];
            year = date[0];
            date = year + "-" + month + "-" + day + " " + time;          
          } else {
            date = "";
          }          
          //Guillermo Requirements New -          
        } catch(e) {
          $("#inserterror-" + updateKeyList[eachValue]).text();
          $("#inserterror-" + updateKeyList[eachValue]).text("Input value doesn't satisfy constraints, FORMAT 'yyyy-mm-dd hh-mm-ss'");
          $('#exampleModal1').animate({ scrollTop: 0 }, 'slow');
          return;             
          //console.log(eachItem, date, time);          
        }        
        //ORIGINALS +
        /*date = $('#values-' + updateKeyList[eachValue]).val().split("-");
        day = date[2];
        month = date[1];
        year = date[0];
        //date = year + "-" + month + "-" + day + " 00:00:00";
        date = year + "-" + month + "-" + day;*/
        //ORIGINALS -
      } else 
        date = "";
      //if(currentEdit[updateKeyList[eachValue]] != date) {
      //console.log("--", currentEdit[updateKeyList[eachValue]].split(" ")[1], date.split(" ")[1]);
      //Guillermo Requirements +
      /*$.ajax({
        type: "GET",
        url: '/arena/home/gettime',
        success: function(time) {
          //console.log("---", time, currentEdit[updateKeyList[eachValue]]);
          if((date != "") && (currentEdit[updateKeyList[eachValue]].length <= 0)) {
            date = date.split(" ")[0] + " " + time;
            wasDateUpdated = 1;
          }
          else if((date != "") && (currentEdit[updateKeyList[eachValue]].length > 0)) {
            date = currentEdit[updateKeyList[eachValue]];
          }
      }, async: false });*/
      //Guillermo Requirements -      
      if((currentEdit[updateKeyList[eachValue]].split(" ")[1] != date.split(" ")[1]) && (currentEdit[updateKeyList[eachValue]].split(" ")[1] == undefined)) {
        changeLogList.push(updateKeyList[eachValue]);
      }          
      updateKVJson[updateKeyList[eachValue]] = date.toString();
    } else if(globalTimeList.indexOf(updateKeyList[eachValue]) > -1) {
      //READ THE TIME VALUES FIRST AND THEN ASSIGN TO VARIABLES
      if(($('#time1-' + updateKeyList[eachValue]).val() == "") || ($('#time2-' + updateKeyList[eachValue]).val() == "") || ($('#time3-' + updateKeyList[eachValue]).val() == "")) {
        time = "";
      } else {
        let timeSlot1 = $('#time1-' + updateKeyList[eachValue]).val();
        if(timeSlot1.length == 1)
          timeSlot1 = "0" + timeSlot1;
        let timeSlot2 = $('#time2-' + updateKeyList[eachValue]).val();
        if(timeSlot2.length == 1)
          timeSlot2 = "0" + timeSlot2;            
        let timeSlot3 = $('#time3-' + updateKeyList[eachValue]).val();
        if(timeSlot3.length == 1)
          timeSlot3 = "0" + timeSlot3;      
        time = timeSlot1 + ":" + timeSlot2 + ":" + timeSlot3;
        if(currentEdit[updateKeyList[eachValue]] != time) {
          changeLogList.push(updateKeyList[eachValue]);
        }      
      }
      updateKVJson[updateKeyList[eachValue]] = time;
    } else {
      //HANDLING BEGINS +
      let coreObjectKeys = Object.keys(currentCoreConfigObject);
      //console.log("#######", coreObjectKeys);
      for(let eachCoreObject of coreObjectKeys) {
        //console.log("^^^", eachCoreObject);
        if((eachCoreObject == "PRIMARY_KEY") || (eachCoreObject == "FOREIGN_KEY"))
          continue;
        if(eachCoreObject == updateKeyList[eachValue]) {
          let type = currentCoreConfigObject[eachCoreObject];
          if(type == "NUMERIC_1") {
            //console.log("NUMERIC_1");
            if(currentEdit[updateKeyList[eachValue]] != $('#textarea-' + updateKeyList[eachValue]).val()) {
              changeLogList.push(updateKeyList[eachValue]);
            }        
            updateKVJson[updateKeyList[eachValue]] = $('#textarea-' + updateKeyList[eachValue]).val();
          } else if(type == "LIST") {
            //console.log("LIST");
            if(currentEdit[updateKeyList[eachValue]] != $('#values-' + updateKeyList[eachValue]).val()) {
              changeLogList.push(updateKeyList[eachValue]);
            }        
            updateKVJson[updateKeyList[eachValue]] = $('#values-' + updateKeyList[eachValue]).val();
          } else if(type == "LISTMULTIPLE") {
            //console.log("LISTMULTIPLE");
            if(currentEdit[updateKeyList[eachValue]] != $('#textarea-' + updateKeyList[eachValue]).val()) {
              changeLogList.push(updateKeyList[eachValue]);
            }        
            let value = $('#textarea-' + updateKeyList[eachValue]).val();
            try {
              value = value.toString();
            } catch(e) {
              value = "";
            }
            updateKVJson[updateKeyList[eachValue]] = value;
          } else {
            //console.log("NORMAL", $('textarea#values-' + updateKeyList[eachValue]).val());
            if(currentEdit[updateKeyList[eachValue]] != $('textarea#values-' + updateKeyList[eachValue]).val()) {
              changeLogList.push(updateKeyList[eachValue]);
            }
            try {
              updateKVJson[updateKeyList[eachValue]] = $('textarea#values-' + updateKeyList[eachValue]).val().replace(/['"]+/g, '\"');         
            } catch(e) {
              updateKVJson[updateKeyList[eachValue]] = $('textarea#values-' + updateKeyList[eachValue]).val();
            }
          }
        }
      }
      //console.log("&&&&&", schemaList);
      if(coreObjectKeys.length <= 0) {
        try {
          for(let eachItem of schemaList) {        
            eachItem = eachItem.toUpperCase();
            //console.log("^^^", schemaList);
            if((eachItem == "PRIMARY_KEY") || (eachItem == "FOREIGN_KEY"))
              continue;
            if(eachItem == updateKeyList[eachValue]) {
              let type = currentCoreConfigObject[eachItem];
              if(type == "NUMERIC_1") {
                //console.log("NUMERIC_1");
                if(currentEdit[updateKeyList[eachValue]] != $('#textarea-' + updateKeyList[eachValue]).val()) {
                  changeLogList.push(updateKeyList[eachValue]);
                }        
                updateKVJson[updateKeyList[eachValue]] = $('#textarea-' + updateKeyList[eachValue]).val();
              } else if(type == "LIST") {
                //console.log("LIST");
                if(currentEdit[updateKeyList[eachValue]] != $('#values-' + updateKeyList[eachValue]).val()) {
                  changeLogList.push(updateKeyList[eachValue]);
                }        
                updateKVJson[updateKeyList[eachValue]] = $('#values-' + updateKeyList[eachValue]).val();
              } else if(type == "LISTMULTIPLE") {
                //console.log("LISTMULTIPLE");
                if(currentEdit[updateKeyList[eachValue]] != $('#textarea-' + updateKeyList[eachValue]).val()) {
                  changeLogList.push(updateKeyList[eachValue]);
                }        
                let value = $('#textarea-' + updateKeyList[eachValue]).val();
                try {
                  value = value.toString();
                } catch(e) {
                  value = "";
                }
                updateKVJson[updateKeyList[eachValue]] = value;
              } else {
                //console.log("NORMAL", $('textarea#values-' + updateKeyList[eachValue]).val());
                if(currentEdit[updateKeyList[eachValue]] != $('textarea#values-' + updateKeyList[eachValue]).val()) {
                  changeLogList.push(updateKeyList[eachValue]);
                }
                try {
                  updateKVJson[updateKeyList[eachValue]] = $('textarea#values-' + updateKeyList[eachValue]).val().replace(/['"]+/g, '\"');         
                } catch(e) {
                  updateKVJson[updateKeyList[eachValue]] = $('textarea#values-' + updateKeyList[eachValue]).val();
                }
              }
            }          
          }
        } catch(e) {
          
        }
      }
      //HANDLIGN ENDS -
      /* ORIGINALS
      if(currentEdit[updateKeyList[eachValue]] != $('textarea#values-' + updateKeyList[eachValue]).val()) {
        changeLogList.push(updateKeyList[eachValue]);
      }
      try {
        updateKVJson[updateKeyList[eachValue]] = $('textarea#values-' + updateKeyList[eachValue]).val().replace(/['"]+/g, '\"');         
      } catch(e) {
        updateKVJson[updateKeyList[eachValue]] = $('textarea#values-' + updateKeyList[eachValue]).val();
      }*/
    }
    //updateKVJson[updateKeyList[eachValue]] = $('textarea#values-' + updateKeyList[eachValue]).val();
  }

  //console.log("********", updateKVJson);

  $.ajax({
    type: "GET",
    url: '/arena/home/formula/saved/' + dbname,
    success: function(savedFormula) {
      savedFormula = savedFormula[0];
      delete updateKVJson["ID"];//ID is not part of formula string here i am
      let updatedKeyList = Object.keys(updateKVJson);
      let dateTimeDiff = "";
      try {
      for(let eachUpdatedWorkListItem of updatedKeyList) {
        if(savedFormula[eachUpdatedWorkListItem] != null) {
          //Found a Formula
          //console.log(eachUpdatedWorkListItem, savedFormula[eachUpdatedWorkListItem]);
          //Update the value
          let formulaName = savedFormula[eachUpdatedWorkListItem].split(",")[0];
          let selectedFormulaValues = savedFormula[eachUpdatedWorkListItem].split(",");
          selectedFormulaValues.shift();
          let argumentsList = [];
          switch(formulaName.replace(/ /g, "")) {
            case "ADD":
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateKVJson[eachFormulaValue]);
              }
              argumentsList.splice(argumentsList.length-1, 1);//Remove the last special field index
              let updatedValueToInsertADD = ADD(argumentsList);
              updateKVJson[eachUpdatedWorkListItem] = updatedValueToInsertADD;
              changeLogList.push(eachUpdatedWorkListItem);
              break;
            case "SUBTRACT": 
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateKVJson[eachFormulaValue]);
              }
              argumentsList.splice(argumentsList.length-1, 1);//Remove the last special field index
              let updatedValueToInsertSUBTRACT = SUBTRACT(argumentsList);
              updateKVJson[eachUpdatedWorkListItem] = updatedValueToInsertSUBTRACT;
              changeLogList.push(eachUpdatedWorkListItem);
              break;
            case "MULTIPLY":
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateKVJson[eachFormulaValue]);
              }
              argumentsList.splice(argumentsList.length-1, 1);//Remove the last special field index
              let updatedValueToInsertMULTIPLY = MULTIPLY(argumentsList);
              updateKVJson[eachUpdatedWorkListItem] = updatedValueToInsertMULTIPLY;
              changeLogList.push(eachUpdatedWorkListItem);
              break;
            case "DIVIDE":
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateKVJson[eachFormulaValue]);
              }
              argumentsList.splice(argumentsList.length-1, 1);//Remove the last special field index
              let updatedValueToInsertDIVIDE = DIVIDE(argumentsList);
              updateKVJson[eachUpdatedWorkListItem] = updatedValueToInsertDIVIDE;
              changeLogList.push(eachUpdatedWorkListItem);
              break;
            case "CONCATENATE":
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateKVJson[eachFormulaValue]);
              }
              argumentsList.splice(argumentsList.length-1, 1);//Remove the last special field index
              let updatedValueToInsertCONCATENATE = CONCATENATE(argumentsList);
              updateKVJson[eachUpdatedWorkListItem] = updatedValueToInsertCONCATENATE;
              changeLogList.push(eachUpdatedWorkListItem);
              break;
            case "DATEDIFF":
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateKVJson[eachFormulaValue]);
              }
              argumentsList.splice(argumentsList.length-1, 1);//Remove the last special field index
              //console.log("DATE DIFF: " , argumentsList);
              let updatedValueToInsertDATEDIFF = DATEDIFF(argumentsList);
              //console.log("DATE DIFF: " , updatedValueToInsertDATEDIFF);
              if(updatedValueToInsertDATEDIFF.includes("NaN") == false) {
                updateKVJson[eachUpdatedWorkListItem] = updatedValueToInsertDATEDIFF;
                //console.log("^^^^^^###", updatedValueToInsertDATEDIFF);
                dateTimeDiff = updatedValueToInsertDATEDIFF;
                changeLogList.push(eachUpdatedWorkListItem);
              }
              break;
            case "CUMILATIVETIMEADD":
              //console.log(selectedFormulaValues);
              let selectedFormulaValuesLen = selectedFormulaValues.length;
              let unqiueCumilativeKey = selectedFormulaValues[selectedFormulaValuesLen-1];
              selectedFormulaValues.splice(selectedFormulaValuesLen-1, 1);
              //console.log(unqiueCumilativeKey);
              //console.log(selectedFormulaValues);
              let sendJSON = {};
              sendJSON["key"] = unqiueCumilativeKey;
              sendJSON["value"] = selectedFormulaValues;
              sendJSON["field"] = eachUpdatedWorkListItem;
              let uniqueItems = unqiueCumilativeKey.split("&");
              for(let eachUniqueItem of uniqueItems) {
                //console.log("***", eachUniqueItem, updateKVJson[eachUniqueItem], updateKVJson);
                sendJSON[eachUniqueItem] = updateKVJson[eachUniqueItem];
              }
              $.ajax({
                type: "POST",
                url: '/arena/home/formula/getcumilativecombo/' + dbname,
                data: sendJSON,
                success: function(savedFormula) {    
                  //console.log("******", savedFormula, sendJSON);
                  if(savedFormula.length > 0) {
                    savedFormula = savedFormula[0];
                    let getOutput = '';
                    if((savedFormula[eachUpdatedWorkListItem] == "") || (savedFormula[eachUpdatedWorkListItem] == "00:00:00"))
                      getOutput = savedFormula[selectedFormulaValues]
                    else
                      getOutput = savedFormula[eachUpdatedWorkListItem]
                    //console.log(getOutput);
                    argumentsList = [];
                    argumentsList.push(getOutput);
                    //console.log("^^^^^^", getOutput, dateTimeDiff);
                    //if((dateTimeDiff != "") && (wasDateUpdated == 1)) {//NO NEED FOR THIS
                    if(dateTimeDiff != "") {                      
                      argumentsList.push(dateTimeDiff);//THIS TIME GET THE ACTUAL TIME DIFF AND PRESENT DATA
                      dateTimeDiff = "";
                    }
                    else
                      argumentsList.push("00:00:00");//THIS TIME GET THE ACTUAL TIME DIFF AND PRESENT DATA
                    //console.log("^^^^^", argumentsList);
                    let updatedValueToInsertCUMILATIVETIME = CUMILATIVETIMEADD(argumentsList);
                    //console.log(eachUpdatedWorkListItem, ":", updatedValueToInsertCUMILATIVETIME);
                    updateKVJson[eachUpdatedWorkListItem] = updatedValueToInsertCUMILATIVETIME;
                    changeLogList.push(eachUpdatedWorkListItem);
                  }
              }, async: false });
              break;
            case "FLOOR":
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateKVJson[eachFormulaValue]);
              }
              argumentsList.splice(argumentsList.length-1, 1);//Remove the last special field index
              let updatedValueToInsertFLOOR = FLOOR(argumentsList);
              updateKVJson[eachUpdatedWorkListItem] = updatedValueToInsertFLOOR;
              changeLogList.push(eachUpdatedWorkListItem);
              break;
            case "CEILING":
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateKVJson[eachFormulaValue]);
              }
              argumentsList.splice(argumentsList.length-1, 1);//Remove the last special field index
              let updatedValueToInsertCEILING = CEILING(argumentsList);
              updateKVJson[eachUpdatedWorkListItem] = updatedValueToInsertCEILING;
              changeLogList.push(eachUpdatedWorkListItem);
              break;
            case "ABS":
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateKVJson[eachFormulaValue]);
              }
              argumentsList.splice(argumentsList.length-1, 1);//Remove the last special field index
              let updatedValueToInsertABS = ABS(argumentsList);
              updateKVJson[eachUpdatedWorkListItem] = updatedValueToInsertABS;
              changeLogList.push(eachUpdatedWorkListItem);
              break;
            case "MAX":
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateKVJson[eachFormulaValue]);
              }
              argumentsList.splice(argumentsList.length-1, 1);//Remove the last special field index
              let updatedValueToInsertMAX = MAX(argumentsList);
              updateKVJson[eachUpdatedWorkListItem] = updatedValueToInsertMAX;
              changeLogList.push(eachUpdatedWorkListItem);
              break;
            case "MIN":
              argumentsList = [];
              for(let eachFormulaValue of selectedFormulaValues) {
                argumentsList.push(updateKVJson[eachFormulaValue]);
              }
              argumentsList.splice(argumentsList.length-1, 1);//Remove the last special field index
              let updatedValueToInsertMIN = MIN(argumentsList);
              updateKVJson[eachUpdatedWorkListItem] = updatedValueToInsertMIN;
              changeLogList.push(eachUpdatedWorkListItem);
              break;
          }
        }
      }
      //console.log(updateKVJson);
      } catch(e) {
        console.log(e);
      }
    updateKVJson["ID"] = updateId;
    updateKVJson["CHANGELIST"] = changeLogList.toString();
    $.ajax({
      type: "POST",
      url: '/arena/home/db/update/existingitem/' + dbname,
      data: updateKVJson,
      success: function(data) {
        window.location.reload();
        //Do not redirect to another page
        //window.location.href="/arena/home/db/" + dbname;
      }, async: false });
  }, async: false });

}

function showInfo(rowInfo, dbName) {
  //Access Settings +
  if(modifyItemEnabled == 1) {
    $("#editWorkListBody").empty();    
    $("#editWorkListBody").append("<div class='alert alert-danger'><b>Access Denied</b>. Admin has restricted, <b>'" + currentUser + "'</b> access to this page.</div>");
    return;
  }
  //Access Settings -  
  $.ajax({
    type: "GET",
    url: '/arena/home/db/coredbfieldsettings/' + dbname,
    success: function(configObjectData) {
      try {
        configObjectData = JSON.parse(configObjectData[0]["CONFIGOBJECT"]);
      } catch(e) {
        configObjectData = {};
      }
      $.ajax({
        type: "GET",
        url: '/arena/home/db/listsettings/' + dbname,
        success: function(settingsData) {
          settingsData = settingsData[0];
          $.ajax({
            type: "GET",
            url: '/arena/home/info/' + dbName + '/' + rowInfo,
            success: function(data) {
             let specialfields = data.specialfields;
             let dateList = specialfields[0]["DATELIST"];
             let timeList = specialfields[0]["TIMELIST"];
             dateList = dateList.split(",");
             dateList = dateList.map(x => x.trim());
             timeList = timeList.split(",");
             timeList = timeList.map(y => y.trim());         
             //Update GLOBAL DATE LIST
             globalDateList = dateList;
             //Update GLOBAL TIME LIST
             globalTimeList = timeList;
             data = data.data[0];
             let getKeys = Object.keys(data);
             updateKeyList = getKeys;
             $("#viewChangeLog").empty();
             $("#editWorkListBody").empty();
             let tableString = '';
             tableString += "<table class='table table-stripped table-borderless table-hover table-sm' style='width:100%'>";
             for(let eachObject in getKeys) {
                if(getKeys[eachObject] == "ID") {
                  updateId = data[getKeys[eachObject]];
                  continue;
                }
                else if(data[getKeys[eachObject]] != null) {
                  if(dateList.indexOf(getKeys[eachObject]) > -1) {
                    //Handle Color Darkening +
                    tableString += "<tr><td id='key-" + getKeys[eachObject] + "'>";
                    if(data[getKeys[eachObject]].length > 0)
                      tableString += "<b class='text-muted'>" + getKeys[eachObject] + "</b>";
                    else
                      tableString += "<b>" + getKeys[eachObject] + "</b>";
                    //Handle Color Darkening -
                    //Guillermo Requirements +
                    //tableString += "</td></td><tr><td><input type='date' id='values-" + getKeys[eachObject] + "' class='form-control' style='width:100%' value=" + data[getKeys[eachObject]].split(" ")[0] +  " /></td></tr>"; 
                    //Guillermo Requirements -   
                    //Guillermo Requirements New +                    
                    tableString += "</td></td><tr><td><textarea id='values-" + getKeys[eachObject] + "' class='form-control' style='width:100%'>" + data[getKeys[eachObject]] +  "</textarea><small class='text-muted form-text' id='infotext-" + getKeys[eachObject] + "'>This Field has a predefined format. (FORMAT. <b>yyyy-mm-dd hh-mm-ss</b>, Eg. 2019-09-12 20:11:00)</small><span class='badge badge-warning' id='inserterror-" + getKeys[eachObject] + "'></span></td></tr>";                     
                    //Guillermo Requirements New -
                    currentEdit[getKeys[eachObject]] = data[getKeys[eachObject]];
                  } else if(timeList.indexOf(getKeys[eachObject]) > -1) {
                    //Handle Color Darkening +
                    tableString += "<tr><td id='key-" + getKeys[eachObject] + "'>";
                    if(data[getKeys[eachObject]].length > 0)
                      tableString += "<b class='text-muted'>" + getKeys[eachObject] + "</b>";
                    else
                      tableString += "<b>" + getKeys[eachObject] + "</b>";
                    //Handle Color Darkening -
                    tableString += "</td></td><tr><td><div class='form-row'><div class='col'><input id='time1-" + getKeys[eachObject]  + "' type='number' min='00' max='23' placeholder='00' class='form-control' value=" + data[getKeys[eachObject]].split(":")[0] + "></div><div class='col'><input id='time2-" + getKeys[eachObject]  + "' type='number' min='00' max='23' placeholder='00' class='form-control' value=" + data[getKeys[eachObject]].split(":")[1] + "></div><div class='col'><input id='time3-" + getKeys[eachObject]  + "' type='number' min='00' max='23' placeholder='00' class='form-control' value=" + data[getKeys[eachObject]].split(":")[2] + "></div></div>";
                    currentEdit[getKeys[eachObject]] = data[getKeys[eachObject]].split(":")[0] + ":" + data[getKeys[eachObject]].split(":")[1] + ":" + data[getKeys[eachObject]].split(":")[2];
                  } else {
                    //CHECK IN CONFIG OBJECT
                    if(configObjectData[getKeys[eachObject]] == "NUMERIC_1") {
                    //Handle Color Darkening +
                    tableString += "<tr><td id='key-" + getKeys[eachObject] + "'>";
                    if(data[getKeys[eachObject]].length > 0)
                      tableString += "<b class='text-muted'>" + getKeys[eachObject] + "</b>";
                    else
                      tableString += "<b>" + getKeys[eachObject] + "</b>";
                    //Handle Color Darkening -
                      tableString += "</td></td><tr><td><input type='number' id='values-" + getKeys[eachObject] + "' class='form-control' style='width:100%' value='" + data[getKeys[eachObject]] + "'></td></tr>";
                    } else if(configObjectData[getKeys[eachObject]] == "LIST") {
                      //Handle Color Darkening +
                      tableString += "<tr><td id='key-" + getKeys[eachObject] + "'>";
                      if(data[getKeys[eachObject]].length > 0)
                        tableString += "<b class='text-muted'>" + getKeys[eachObject] + "</b>";
                      else
                        tableString += "<b>" + getKeys[eachObject] + "</b>";
                      //Handle Color Darkening -
                      tableString += "</td></td><tr><td><select id='values-" + getKeys[eachObject] + "' class='form-control' style='width:100%'>";
                      try {
                        let currentSettingsData = settingsData[getKeys[eachObject]];
                        currentSettingsData = currentSettingsData.split(",");
                        for(let eachObjectOfSettingsData of currentSettingsData) {
                          if(eachObjectOfSettingsData.trim() == data[getKeys[eachObject]].trim()) {
                            tableString += "<option selected>" + eachObjectOfSettingsData + "</option>";
                          } else {
                            tableString += "<option>" + eachObjectOfSettingsData + "</option>";
                          }
                        }
                        tableString += "</select></td></tr>";
                      } catch(e) {
                        tableString += "</select></td></tr>";
                      }
                    } else if(configObjectData[getKeys[eachObject]] == "LISTMULTIPLE") {
                      //Handle Color Darkening +
                      tableString += "<tr><td id='key-" + getKeys[eachObject] + "'>";
                      if(data[getKeys[eachObject]].length > 0)
                        tableString += "<b class='text-muted'>" + getKeys[eachObject] + "</b>";
                      else
                        tableString += "<b>" + getKeys[eachObject] + "</b>";
                      //Handle Color Darkening -
                      tableString += "</td></td><tr><td><select multiple id='values-" + getKeys[eachObject] + "' class='form-control' style='width:100%'>";
                      try {
                        let currentSettingsData = settingsData[getKeys[eachObject]];
                        currentSettingsData = currentSettingsData.split(",");
                        //SPLIT THE DATA
                        let currentData = data[getKeys[eachObject]].split(",");
                        //for(let eachCurrentData of currentData) {
                          for(let eachObjectOfSettingsData of currentSettingsData) {
                            eachObjectOfSettingsData = eachObjectOfSettingsData.trim();
                            //if(eachObjectOfSettingsData == eachCurrentData.trim()) {
                            if(currentData.indexOf(eachObjectOfSettingsData) > -1) {                              
                              tableString += "<option selected>" + eachObjectOfSettingsData + "</option>";
                            } else {
                              tableString += "<option>" + eachObjectOfSettingsData + "</option>";
                            }
                          }
                        //}
                        tableString += "</select></td></tr>";
                      } catch(e) {
                        tableString += "</select></td></tr>";
                      }
                    } else {
                      //Handle Color Darkening +
                      tableString += "<tr><td id='key-" + getKeys[eachObject] + "'>";
                      if(data[getKeys[eachObject]].length > 0)
                        tableString += "<b class='text-muted'>" + getKeys[eachObject] + "</b>";
                      else
                        tableString += "<b>" + getKeys[eachObject] + "</b>";
                      //Handle Color Darkening -
                      tableString += "</td></td><tr><td><textarea id='values-" + getKeys[eachObject] + "' class='form-control' style='width:100%' placeholder='Type in " + getKeys[eachObject] + " data...'>" + data[getKeys[eachObject]] +  "</textarea></td></tr>";
                    }
                    currentEdit[getKeys[eachObject]] = data[getKeys[eachObject]];
                  }
                } else {
                  tableString += "<tr><td id='key-" + getKeys[eachObject] + "'><b>" + getKeys[eachObject] + "</b></td></td><tr><td><textarea id='values-" + getKeys[eachObject] + "' style='width:100%' class='form-control' placeholder='Type in " + getKeys[eachObject] + " data...'></textarea></td></tr>";
                  currentEdit[getKeys[eachObject]] = data[getKeys[eachObject]];
                }
             }
             tableString += "</tbody></table>";
             $("#editWorkListBody").append(tableString);
            //Set to Current Date Only +
            //Guillermo Requirements +
            /*for(let eachDateList of dateList) {
              var today = new Date().toISOString().split('T')[0];
              console.log("----", today, "values-" + eachDateList);
              $("#values-" + eachDateList).attr("min", today);
            }*/
            //Guillermo Requirements -            
            //Set to Current Date Only -                                 
             //$("#viewChangeLog").append("<div class='row'><div class='col-lg-6'><a class='btn btn-xl btn-outline-info' style='width:100%' href='/arena/home/db/changelog/"+ dbname + "/" + updateId + "'><i class='fa fa-book'></i> View Changelog</a></div><div class='col-lg-6'><a class='btn btn-xl btn-info' style='width:100%' href='/arena/home/db/fullscreenmode/"+ dbname + "/" + updateId + "'><i class='fa fa-external-link'></i> View in Detail</a></div></div>");
             //$("#viewChangeLog").append("<div class='row'><div class='col-lg-4'><a class='btn btn-xl btn-outline-info' style='width:100%' href='/arena/home/db/changelog/"+ dbname + "/" + updateId + "'><i class='fa fa-book'></i> View Changelog</a></div><div class='col-lg-4'><a class='btn btn-xl btn-outline-info' style='width:100%' href='/arena/home/db/additionalfolders/"+ dbname + "/" + updateId + "'><i class='fa fa-folder-o'></i> Additional Files</a></div><div class='col-lg-4'><a class='btn btn-xl btn-info' style='width:100%' href='/arena/home/db/fullscreenmode/"+ dbname + "/" + updateId + "'><i class='fa fa-external-link'></i> View in Detail</a></div></div>");
              //Access Settings +
              if(removeItemEnabled == 1) {
                $("#viewChangeLog").append("<div class='row'><div class='col-lg-3'><a class='btn btn-sm btn-outline-info' style='width:100%' href='/arena/home/db/changelog/"+ dbname + "/" + updateId + "'><i class='fa fa-book'></i> View Changelog</a></div><div class='col-lg-3'><a class='btn btn-sm btn-outline-info' style='width:100%' href='/arena/home/db/additionalfolders/"+ dbname + "/" + updateId + "'><i class='fa fa-folder-o'></i> View Additional Files</a></div><div class='col-lg-3'><a class='btn btn-sm btn-info' style='width:100%' href='/arena/home/db/fullscreenmode/"+ dbname + "/" + updateId + "'><i class='fa fa-external-link'></i> View in Detail</a></div><div class='col-lg-3'><a id='removeBtn' class='btn btn-sm btn-secondary' style='width:100%' href='#' data-dimiss='modal'><i class='fa fa-trash'></i> Remove this Item</a><font class='badge badge-danger'>Access Denied</font></div></div>");             
              }
              //Access Settings -  
              else {
                $("#viewChangeLog").append("<div class='row'><div class='col-lg-3'><a class='btn btn-sm btn-outline-info' style='width:100%' href='/arena/home/db/changelog/"+ dbname + "/" + updateId + "'><i class='fa fa-book'></i> View Changelog</a></div><div class='col-lg-3'><a class='btn btn-sm btn-outline-info' style='width:100%' href='/arena/home/db/additionalfolders/"+ dbname + "/" + updateId + "'><i class='fa fa-folder-o'></i> View Additional Files</a></div><div class='col-lg-3'><a class='btn btn-sm btn-info' style='width:100%' href='/arena/home/db/fullscreenmode/"+ dbname + "/" + updateId + "'><i class='fa fa-external-link'></i> View in Detail</a></div><div class='col-lg-3'><a id='removeBtn' class='btn btn-sm btn-outline-danger' style='width:100%' href='#' data-dimiss='modal'><i class='fa fa-trash'></i> Remove this Item</a><font class='text-muted'><input type='checkbox' class='form-control-input text-muted' onChange='enableDisableRemoveItemButton()' /> Check to Confirm Remove</font></div></div>");             
              }
             
             getUpdateSettingsList(1);
             getUpdateEnableDisableList();
            }, async: true });
      }, async: true });
    }, async: true });
}

var removeItem = 1;
function enableDisableRemoveItemButton() {
  if(removeItem == 0) {
    $("#removeBtn").removeAttr('href');
    $("#removeBtn").attr('href', '#');
    removeItem = 1;
  } else if(removeItem == 1) {
    $("#removeBtn").removeAttr('href');
    $("#removeBtn").attr('href', "/arena/home/remove/"+ dbname + "/" + updateId);
    removeItem = 0;    
  }
}

function setSearchParam() {
  searchIndex = $("#searchselection :selected").val();
}

function showNextSet(dbName) {
  event.preventDefault(); 
  $("#paginate").empty();
  let nextPaginateCounter = paginateCounter + 4;
  let paginateString = '';
  paginateString += '<li class="page-item"> <a class="page-link" href="#" tabindex="-1", onclick="showPreviousSet(\'' + dbName  + '\')"><i class="fa fa-angle-double-left"></i></a> </li>';
  for(let eachPaginate=paginateCounter; eachPaginate<=nextPaginateCounter; eachPaginate++) {
    paginateString += '</li><li class="page-item"><a class="page-link" href="#", id="pagination-' + eachPaginate + '", onclick="next(\'' + eachPaginate + '\', \'' + dbName  + '\')">' + eachPaginate + '</a></li>'; 
  }
  paginateString += '<li class="page-item"> <a class="page-link" href="#", onclick="showNextSet(\'' + dbName  + '\')"><i class="fa fa-angle-double-right"></i></a> </li>';
  $("#paginate").append(paginateString);
  paginateCounter = paginateCounter + 5;
  //$('#chooseDisplayOptionPerList').prop('selectedIndex',0);//SELECT LIST  The game beings
}

function showPreviousSet(dbName) {
  event.preventDefault(); 
  //$("#paginate").empty();//Empty After Checking Condition
  if(paginateCounter != 0) {
    paginateCounter = paginateCounter - 5;
    let nextPaginateCounter = paginateCounter - 5;
    let reversePaginateCounter = nextPaginateCounter;
    nextPaginateCounter = nextPaginateCounter + 4;
    let paginateString = '';
    //Do not go in negative
    if(nextPaginateCounter <= 0) {
      next('0', dbName);
      return;  
    }
    $("#paginate").empty();//As in here
    paginateString += '<li class="page-item"> <a class="page-link" href="#" tabindex="-1", onclick="showPreviousSet(\'' + dbName  + '\')"><i class="fa fa-angle-double-left"></i></a> </li>';
    for(let eachPaginate=reversePaginateCounter; eachPaginate<=nextPaginateCounter; eachPaginate++) {
      paginateString += '</li><li class="page-item"><a class="page-link" href="#", id="pagination-' + eachPaginate + '", onclick="next(\'' + eachPaginate + '\', \'' + dbName  + '\')">' + eachPaginate + '</a></li>'; 
    }
    paginateString += '<li class="page-item"> <a class="page-link" href="#", onclick="showNextSet(\'' + dbName  + '\')"><i class="fa fa-angle-double-right"></i></a> </li>';
    $("#paginate").append(paginateString);
    //$('#chooseDisplayOptionPerList').prop('selectedIndex',0);//SELECT LIST  The game beings
  } 
}

function findRecentQueries() {
 $("#savedQueries").empty();
 $.ajax({
    type: "GET",
    url: '/arena/home/db/fetch/' + dbname,
    data: { },
    success: function(data) {
      if(data.length <= 0) {
        $("#savedQueries").append('<li class="nav-item"><a class="nav-link active"><small class="text-muted"><i class="fa fa-bookmark-o text-muted"></i> No Saved Queries Found</small></a></li>');            
      } else {
        for(let eachData in data) {
          $("#savedQueries").append('<li class="nav-item"><a class="nav-link" href="/arena/home/db/view/' + dbname + '/' + data[eachData]["ID"] + '"><i class="fa fa-bookmark-o text-muted"></i> ' + data[eachData]["SAVEDATE"].split(" ")[0] + '@' + data[eachData]["SAVEDATE"].split(" ")[1] + '<br />&emsp;' + data[eachData]["USERID"].split("@")[0] + '</a></li>'); 
        }
      }      
    }, async: true });
}

function showResultsCount(pageSize) {
  $("#showingResult").empty();
  if(checkType == "1") {
    //$("#showingResult").append("Showing <b>(" + (totalCount - ((pageSize * 15))) + "-" + (totalCount - ((pageSize * 15)+14)) + ")</b> rows of <b>" + totalCount + "</b> rows.");
    $("#showingResult").append("Showing <b>(" + (totalCount - ((pageSize * parseInt($("#chooseDisplayOptionPerList :selected").val())))) + "-" + (totalCount - ((pageSize * parseInt($("#chooseDisplayOptionPerList :selected").val()))+(parseInt($("#chooseDisplayOptionPerList :selected").val())-1))) + ")</b> rows of <b>" + totalCount + "</b> rows.");
    }
  else {
    //$("#showingResult").append("Showing <b>(" + ((pageSize * 15)+1) + "-" + ((pageSize * 15) + 15) + ")</b> rows of <b>" + totalCount + "</b> rows.");     
    $("#showingResult").append("Showing <b>(" + ((pageSize * parseInt($("#chooseDisplayOptionPerList :selected").val()))+1) + "-" + ((pageSize * parseInt($("#chooseDisplayOptionPerList :selected").val())) + parseInt($("#chooseDisplayOptionPerList :selected").val())) + ")</b> rows of <b>" + totalCount + "</b> rows.");     }
}

function next(pageSize, dbName) {
  //The game begins
  //alert($("#chooseDisplayOptionPerList :selected").val());
  //offset = offset + 15;
  offset = offset + parseInt($("#chooseDisplayOptionPerList :selected").val());
  //CHANGED THE URL BELOW
  let checkType = 0;
  if($('#inlineRadio2').is(':checked') == true) {
    checkType = 1;
  }
  showResultsCount(pageSize);
  $.ajax({
    type: "GET",
    url: '/arena/home/paginate/' + dbName  + '/' + offset + '/' + checkType + '/' + pageSize + '/' + parseInt($("#chooseDisplayOptionPerList :selected").val()),
    data: { },
    success: function(data) {
      //Change the Color of the TAB
      $('[id^="pagination-"]').css({"background-color": 	"#FFFFFF"});
      $('[id^="pagination-"]').css({"color": 	"#4169E1"});
      $("#pagination-" + pageSize).css({"background-color": 	"#00BFFF"});
      $("#pagination-" + pageSize).css({"color": 	"#FFFFFF"});
      val = data;
      $("#data").empty();
      let tableString = "";
      for(let eachData in data) {
        if(data[eachData]["STATUS_1"] == "UNASSIGNED") {
          tableString += "<tr onclick='showInfo(\"" + JSON.stringify(data[eachData]["ID"]) +"\", \"" + dbname +"\")', data-toggle='modal' data-target='#exampleModal1' data-keyboard='false' data-backdrop='static', style='background-color: #FFA07A;'>";
        }
        else if((data[eachData]["STATUS_1"] == "IN WORK - WP") || (data[eachData]["STATUS_1"] == "WAITING APPROVAL") || (data[eachData]["STATUS_1"] == "PENDING")) {
          tableString += "<tr onclick='showInfo(\"" + JSON.stringify(data[eachData]["ID"]) +"\", \"" + dbname +"\")', data-toggle='modal' data-target='#exampleModal1' data-keyboard='false' data-backdrop='static', style='background-color: #FFFFCC;'>";
        }
        else if(data[eachData]["STATUS_1"] == "IN WORK - STRESS") {
          tableString += "<tr onclick='showInfo(\"" + JSON.stringify(data[eachData]["ID"]) +"\", \"" + dbname +"\")', data-toggle='modal' data-target='#exampleModal1' data-keyboard='false' data-backdrop='static', style='background-color: #90EE90;'>";
        } else {
          tableString += "<tr onclick='showInfo(\"" + JSON.stringify(data[eachData]["ID"]) +"\", \"" + dbname +"\")', data-toggle='modal' data-target='#exampleModal1' data-keyboard='false' data-backdrop='static'>";
        }
        //tableString += '<tr>';
        let counter = 0;
        for(let eachSet in data[eachData]) {
          tableString += "<td id='valueby-" + eachData + "-" + counter + "' onclick=\"showInfo(\'" + data[eachData]["ID"]  + "', \'" + dbName  + "')\" data-toggle=\"modal\" data-target=\"#exampleModal1\"><div id='row' style='height:20px;  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px;'><span title='" + data[eachData][eachSet] + "'>" + data[eachData][eachSet] + "</span></div></td>";
          counter++;
        }
        tableString += "</tr>";
      }
      $("#data").append(tableString);
      getUpdateSettingsList(0);
      //convertData();
    }, async: false });      
    //$('#chooseDisplayOptionPerList').prop('selectedIndex',0);//SELECT LIST The game beings
}

function previous() {      
  if(offset > 0) {
    //offset = offset - 15;
    offset = offset - parseInt($("#chooseDisplayOptionPerList :selected").val());
  }
  let checkType = 0;
  if($('#inlineRadio2').is(':checked') == true) {
    checkType = 1;
  }
  showResultsCount(pageSize); 
  $.ajax({
    type: "GET",
    url: '/arena/home/paginate/' + offset + '/' + checkType,
    data: { },
    success: function(data) {
      val = data;
      $("#data").empty();
      let tableString = "";
      for(let eachData in data) {
        if(data[eachData]["STATUS_1"] == "UNASSIGNED") {
          tableString += "<tr onclick='showInfo(\"" + JSON.stringify(data[eachData]["ID"]) +"\", \"" + dbname +"\")', data-toggle='modal' data-target='#exampleModal1' data-keyboard='false' data-backdrop='static', style='background-color: #FFA07A;'>";
        }
        else if((data[eachData]["STATUS_1"] == "IN WORK – WP") || (data[eachData]["STATUS_1"] == "WAITING APPROVAL") || (data[eachData]["STATUS_1"] == "PENDING")) {
          tableString += "<tr onclick='showInfo(\"" + JSON.stringify(data[eachData]["ID"]) +"\", \"" + dbname +"\")', data-toggle='modal' data-target='#exampleModal1' data-keyboard='false' data-backdrop='static', style='background-color: #FFFFCC;'>";
        }
        else if(data[eachData]["STATUS_1"] == "IN WORK – STRESS") {
          tableString += "<tr onclick='showInfo(\"" + JSON.stringify(data[eachData]["ID"]) +"\", \"" + dbname +"\")', data-toggle='modal' data-target='#exampleModal1' data-keyboard='false' data-backdrop='static', style='background-color: #90EE90;'>";
        } else {
          tableString += "<tr onclick='showInfo(\"" + JSON.stringify(data[eachData]["ID"]) +"\", \"" + dbname +"\")', data-toggle='modal' data-target='#exampleModal1' data-keyboard='false' data-backdrop='static'>";
        }
        //tableString += "<tr>";
        let counter = 0;
        for(let eachSet in data[eachData]) {
          tableString += "<td id='valueby-" + eachData + "-" + counter + "' onclick=\"showInfo(\'" + data[eachData]["ID"]  + "')\" data-toggle=\"modal\" data-target=\"#exampleModal1\"><div id='row' style='height:20px;  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px;'><span title='" + data[eachData][eachSet] + "'>" + data[eachData][eachSet] + "</span></div></td>";
          counter++;
        }
        tableString += "</tr>";
      }
      $("#data").append(tableString);
      getUpdateSettingsList(0);
      //convertData();
    }, async: false });      
    //$('#chooseDisplayOptionPerList').prop('selectedIndex',0);//SELECT LIST The game beings
}

function myFunction() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.trim();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[searchIndex];
    if (td) {
      txtValue = td.textContent || td.innerText;
      txtValue = txtValue.toUpperCase();
      filter = filter.toUpperCase();
       //if (txtValue.toUpperCase().indexOf(filter) > -1) {
       if (txtValue.indexOf(filter) > -1) {
        tr[i].style.display = "";
       } else {
         tr[i].style.display = "none";
       }
     }
   }
 }

function convertExcelDataToNodeDate(excelTimestamp) {
    if(excelTimestamp == "")
      return "";
    let secondsInDay = 24 * 60 * 60;
    let excelEpoch = new Date(1899, 11, 31);
    let excelEpochAsUnixTimestamp = excelEpoch.getTime();
    let missingLeapYearDay = secondsInDay * 1000;
    let delta = excelEpochAsUnixTimestamp - missingLeapYearDay;
    let excelTimestampAsUnixTimestamp = excelTimestamp * secondsInDay * 1000;
    let parsed = excelTimestampAsUnixTimestamp + delta;
    parsed = (parsed - 8 * 60 * 1000) - (1000 * 50);
    let dateTimeString = moment(parseInt(parsed)).format("YYYY-MM-DD HH:mm:ss");
    if(dateTimeString == "" || dateTimeString == "Invalid date" || dateTimeString.length <= 0) {
      return "";
    }
    else {
      return dateTimeString;
    }
  }

function convertData() {
 let searchIndexList = [];
 for(let eachValue in schemaList) {
   searchIndexList.push(schemaList[eachValue].toUpperCase());
 }
 $.ajax({
  type: "GET",
  url: '/arena/home/fields/' + dbname,
  success: function(data) {
    let dateList = data[0]["DATELIST"];
    let timeList = data[0]["TIMELIST"];
    dateList = dateList.split(",");
    dateList = dateList.map(x => x.trim());
    timeList = timeList.split(",");
    timeList = timeList.map(y => y.trim());
    let createDateIndexList = [];
    let createTimeIndexList = [];
    for(let eachDateItem in dateList) {
      if(searchIndexList.indexOf(dateList[eachDateItem]) > -1) {
        let index = searchIndexList.indexOf(dateList[eachDateItem]);
        createDateIndexList.push(index);
      } else if(searchIndexList.indexOf(dateList[eachDateItem] + "_1") > -1) {
        let index = searchIndexList.indexOf(dateList[eachDateItem]);
        createDateIndexList.push(index);
      }
    }
    for(let eachTimeItem in timeList) {
      if(searchIndexList.indexOf(timeList[eachTimeItem]) > -1) {
        let index = searchIndexList.indexOf(timeList[eachTimeItem]);
        createTimeIndexList.push(index);
      } else if(searchIndexList.indexOf(timeList[eachTimeItem] + "_1") > -1) {
        let index = searchIndexList.indexOf(timeList[eachTimeItem] + "_1");
        createTimeIndexList.push(index);
      }
    }
    createDateIndexList = createDateIndexList.map(function(val){return ++val;});
    createTimeIndexList = createTimeIndexList.map(function(val){return ++val;});
    for(let eachDateItem in createDateIndexList) {
      $('#myTable tbody tr td:nth-child(' + createDateIndexList[eachDateItem]  + ')').each( function(){
        let currentDateTime = $(this).text();
        if($(this).text() != "") {
          $(this).empty();
          $(this).append(convertExcelDataToNodeDate(parseInt(currentDateTime)));
        }               
      });
    }
  }, async: false });
}

function processSettingsList(data, settingvalue) {
try {
  let getKeys = Object.keys(data);
  //This shows/hides the drop down menu values
  for(let eachColumn in getKeys) {
    if(getKeys[eachColumn] != "ID") {
      if(data[getKeys[eachColumn]] == "false") {
        $("#dropdownkey-" + getKeys[eachColumn]).remove();
      }
    }
  }
  if(settingvalue == 0) {
    //for(let parentIndex=0; parentIndex<15; parentIndex++) {
    for(let parentIndex=0; parentIndex<parseInt($("#chooseDisplayOptionPerList :selected").val()); parentIndex++) {
      for(let eachColumn in getKeys) {
        if(getKeys[eachColumn] != "ID") {
          if(data[getKeys[eachColumn]] == "true") {
            $("#sortby-" + getKeys[eachColumn].toLowerCase()).css({"visibility": "visible"});
          }
          else if(data[getKeys[eachColumn]] == "false") {
            $("#sortby-" + getKeys[eachColumn].toLowerCase()).remove();
            $("#valueby-" + parentIndex + "-" + eachColumn).css({"display": "none"});
          }
        }
      }
    }    
  } else {
    //for(let parentIndex=0; parentIndex<15; parentIndex++) {
    for(let parentIndex=0; parentIndex<parseInt($("#chooseDisplayOptionPerList :selected").val()); parentIndex++) {
      for(let eachColumn in getKeys) {
        if(getKeys[eachColumn] != "ID") {
          if(data[getKeys[eachColumn]] == "true") {
            $("#key-" + getKeys[eachColumn]).css({"visibility": "visible"});
          }
          else if(data[getKeys[eachColumn]] == "false") {
            if(globalDateList.indexOf(getKeys[eachColumn]) > -1) {
              $("#key-" + getKeys[eachColumn]).remove();
              $("#values-" + getKeys[eachColumn]).css({"display": "none"});
              $("#infotext-" + getKeys[eachColumn]).css({"display": "none"});              
            } else if(globalTimeList.indexOf(getKeys[eachColumn]) > -1) {
              $("#key-" + getKeys[eachColumn]).remove();
              $("#time1-" + getKeys[eachColumn]).css({"display": "none"});
              $("#time2-" + getKeys[eachColumn]).css({"display": "none"});
              $("#time3-" + getKeys[eachColumn]).css({"display": "none"});
              $("#infotext-" + getKeys[eachColumn]).css({"display": "none"});
            } else {
              $("#key-" + getKeys[eachColumn]).remove();
              $("#values-" + getKeys[eachColumn]).css({"display": "none"});
            }
          }
        }
      }
    }        
  }
} catch(e) {
  //DO NOTHING
}
}

function getUpdateSettingsList(settingvalue) {
 let settingsDBName = dbname;
 settingsDBName = settingsDBName.replace("stressdb", "settingsdb");
 $.ajax({
  type: "GET",
  url: '/arena/home/db/getsettings/' + settingsDBName,
  success: function(data) {
    data = data[0];
    data["ID_STRESS"] = "false";//Hardcoded
    processSettingsList(data, settingvalue);
  }, async: false });
}   

function getUpdateEnableDisableList() {
 let enableDisableDBName = dbname;
 enableDisableDBName = enableDisableDBName.replace("stressdb", "enabledisabledb");     
 $.ajax({
  type: "GET",
  url: '/arena/home/db/getenablediable/' + enableDisableDBName,
  success: function(data) {
    data = data[0];
    data["ID_STRESS"] = "false";//Hardcoded
    if(data) {
      for(let eachColumn in data) {
        if(data[eachColumn] == "true") {
          $("#values-" + eachColumn).attr("disabled", false);
        } else if(data[eachColumn] == "false") {
          $("#values-" + eachColumn).attr("disabled", true);
        }
      }
    }
  }, async: false });
} 

$(document).ready(function() {
 findRecentQueries();
 //convertData();
});
