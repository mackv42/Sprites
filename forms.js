let editControlls = {
	"select": document.getElementById("select"),
	"add": document.getElementById("add"),
	"name": document.getElementById("name"),
	"x1": document.getElementById("x1"),
	"y1": document.getElementById("y1"),
	"x2": document.getElementById("x2"),
	"y2": document.getElementById("y2")
}

editControlls.name.onchange = changeName;
editControlls.x1.onchange = editorChange;
editControlls.x2.onchange = editorChange;
editControlls.y1.onchange = editorChange;
editControlls.y2.onchange = editorChange;


function updateForms(){
	let selectedFrame = getSelectedFrame();
	editControlls.name.value = selectedFrame.name;
	editControlls.x1.value = selectedFrame.point1.x;
	editControlls.y1.value = selectedFrame.point1.y;
	editControlls.x2.value = selectedFrame.point2.x;
	editControlls.y2.value = selectedFrame.point2.y;
}


editControlls.select.onchange = function(){
	if(this.checked){
		//select on canvas click
		editControlls.checked = false;
	} else{
		//do normal stuff
	}
}


canvas.onclick = function(event){
	let clickOffset = canvas.getBoundingClientRect();
    let x = event.clientX - clickOffset.left;
    let y = event.clientY - clickOffset.top;
    if(editControlls.add.checked){
	  	let selectedPoint = editorState.selectedPoint;
	    if(selectedPoint === undefined){
	    	editorState.selectedPoint = new Object({"x": Math.floor(x), "y": Math.floor(y)});
	    } else{
	    	
	    	let addedBox = {"point1": {"x": (selectedPoint.x < x)? selectedPoint.x:Math.floor(x), "y": (selectedPoint.y < y)?selectedPoint.y:Math.floor(y)}, 
	    					"point2": {"x": (selectedPoint.x < x)? Math.floor(x):selectedPoint.x, "y": (selectedPoint.y < y)?Math.floor(y):selectedPoint.y}};
	    	
	    	editorState.frames.push(addedBox);
	    	selectSingleFrame(addedBox);
	    	editorState.selectedPoint = undefined;
	    }
	} else if(editControlls.select.checked){
		let selectedFrame = {};
		for(let i=0; i<editorState.frames.length; i++){
			if(inBounds({x, y}, editorState.frames[i])){
				if(editorState.ctrl){
					editorState.frames[i].selected = true;
				} else{
					selectSingleFrame(editorState.frames[i]);
				}
			}
		}
	}

	clear();
	reloadImage();
	drawSelectBoxes();
}

document.onkeydown = function(evt){
	if(evt.ctrlKey){
		editorState.ctrl = true;
	}
}

document.onkeyup = function(evt){
	
	if(evt.keyCode == 46){
		for(let i=0; i<editorState.frames.length; i++){
			if(editorState.frames[i].selected){
				editorState.frames.splice(i, 1);
			}
		}
	}

	if(evt.keyCode == 17){
		editorState.ctrl = false;
	}

	clear();
	reloadImage();
	drawSelectBoxes();
}

function editorChange(){
	let updateBox = {}
	let loc = -1;
	for(let i=0; i<editorState.frames.length; i++){
		if(editorState.frames[i].selected){ loc = i; }
	}
	if(loc == -1){return;}

	editorState.frames[loc].point1.x = parseInt(editControlls.x1.value);
	editorState.frames[loc].point2.x = parseInt(editControlls.x2.value);
	editorState.frames[loc].point1.y = parseInt(editControlls.y1.value);
	editorState.frames[loc].point2.y = parseInt(editControlls.y2.value);
	clear();
	reloadImage();
	drawSelectBoxes();
}


let downloadBtn = document.getElementById('downloadJson');

function downloadData(evt){
  evt.preventDefault();
  let newJson = {"frames": []};
  for(let i=0; i<editorState.frames.length; i++){
  	//if it has data
  	if(Object.keys(editorState.frames[i].point1).length > 0){
  		//we download that
  		newJson.frames.push(new Object({"name": editorState.frames[i].name, 
  			"group": editorState.frames[i].group, 
  			"x": editorState.frames[i].point1.x,
  			"y": editorState.frames[i].point1.y,
  			"width": editorState.frames[i].point2.x - editorState.frames[i].point1.x,
  			"height": editorState.frames[i].point2.y - editorState.frames[i].point1.y }));
  	}
  }
  
  const json = JSON.stringify(newJson);
  const dataURL = `data:application/json,${json}`;

  const anchor = document.getElementById("downloadJson");
  anchor.setAttribute("download", "Your_data.json");
  anchor.setAttribute("href", dataURL);

  downloadBtn.removeEventListener("click", downloadData, false); 
  evt.currentTarget.click();
  downloadBtn.onclick = this;
}

let autoFrameBtn = document.getElementById("autoFrame");
let groupsDropdown = document.getElementById("groups");
let frameNumDropdown = document.getElementById("frameNum");
let addGroup = document.getElementById("addGroupName");
let addGroupBtn = document.getElementById("addGroup");
let addToGroupBtn = document.getElementById("addToGroup");

autoFrameBtn.onclick = function(){
	let selectedFrame = getSelectedFrame();
	addFramesInArea(selectedFrame.point1.x, selectedFrame.point1.y, selectedFrame.point2.x, selectedFrame.point2.y);
}

addToGroupBtn.onclick = function(){
	for(let i=0; i<editorState.frames.length; i++){
		if(editorState.frames[i].selected){
			addToGroup(editorState.frames[i], groupsDropdown.value);
		}
	}
}

addGroupBtn.onclick = function(){
	let groupName = addGroup.value;
	if(groupExists(groupName)){
		return;
	}
	createGroup(groupName);
	let option = document.createElement("option");
	option.value = groupName;
	option.innerHTML = groupName;
	groupsDropdown.appendChild(option);
}

document.getElementById("grid").onclick = function(){
	let selectedFrame= getSelectedFrame();
	let rows = document.getElementById("numRows").value;
	let columns = document.getElementById("numColumns").value;
	let frameGrid = [];
	
	frameGrid = grid(selectedFrame, rows, columns);
	for(let i=0; i<frameGrid.length; i++){
		editorState.frames.push(frameGrid[i]);
	}
	console.log(frameGrid);
	deleteSelectedFrame();

	clear();
	reloadImage();
	drawSelectBoxes();
}

editorState.onchange = function(){
	  const json = JSON.stringify(editorState);
  const dataURL = `data:application/json,${json}`;

  const anchor = document.getElementById("downloadJson");
  anchor.setAttribute("download", "Your_data.json");
  anchor.setAttribute("href", dataURL);
}


downloadBtn.onclick = downloadData;