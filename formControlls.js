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
	  	let lastBox = editorState.frames[editorState.frames.length -1];
	    if(emptyObject(lastBox.point1)){
	    	lastBox.point1 = {"x": Math.floor(x), "y": Math.floor(y)};
	    } else{
	    	lastBox.point2 = {"x": Math.floor(x), "y": Math.floor(y)};
	    	selectSingleFrame(lastBox);

	    	editorState.frames.push({"point1": {}, "point2": {}, "selected": false});
	    }
	}

	if(editControlls.select.checked){
		let selectedFrame = {};
		for(let i=0; i<editorState.frames.length; i++){
			if(inBounds({x, y}, editorState.frames[i])){
				selectSingleFrame(editorState.frames[i]);
			}
		}
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

	console.log("update");
	editorState.frames[loc].point1.x = editControlls.x1.value;
	editorState.frames[loc].point2.x = editControlls.x2.value;
	editorState.frames[loc].point1.y = editControlls.y1.value;
	editorState.frames[loc].point2.y = editControlls.y2.value;
	clear();
	reloadImage();
	drawSelectBoxes();
}


let downloadBtn = document.getElementById('downloadJson');

function downloadData(evt){
  evt.preventDefault();
  const json = JSON.stringify(editorState);
  const dataURL = `data:application/json,${json}`;

  const anchor = document.getElementById("downloadJson");
  anchor.setAttribute("download", "Your_data.json");
  anchor.setAttribute("href", dataURL);

  downloadBtn.removeEventListener("click", downloadData, false); 
  evt.currentTarget.click();
  downloadBtn.onclick = this;
}


let groupsDropdown = document.getElementById("groups");
let frameNumDropdown = document.getElementById("frameNum");
let addGroup = document.getElementById("addGroupName");
let addGroupBtn = document.getElementById("addGroup");
let addToGroupBtn = document.getElementById("addToGroup");

addToGroupBtn.onclick = function(){
	let selectedFrame = getSelectedFrame();
	addToGroup(selectedFrame, groupsDropdown.value);
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
editorState.onchange = function(){
	  const json = JSON.stringify(editorState);
  const dataURL = `data:application/json,${json}`;

  const anchor = document.getElementById("downloadJson");
  anchor.setAttribute("download", "Your_data.json");
  anchor.setAttribute("href", dataURL);
}


downloadBtn.onclick = downloadData;