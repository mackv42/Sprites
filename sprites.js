
let spriteData = {
	"src": "",
	"image": {}
}

let editorState = {
	"frames": [{"point1": {}, "point2": {}, "selected": false}],
	"orignalImage": {},
	"groups": [],
	"selectedPoint": undefined
}


function getSelectedFrame(){
	let loc = -1;
	for(let i=0; i<editorState.frames.length; i++){
		if(editorState.frames[i].selected){ loc = i; }

	}

	if(loc == -1) return undefined;

	return editorState.frames[loc];
}

function deleteSelectedFrame(){
	for(let i=0; i<editorState.frames.length; i++){
		if(editorState.frames[i].selected){
			editorState.frames.splice(i, 1);
		}
	}
}

function selectFrame(frame){
	frame.selected = true;
}

function selectSingleFrame(frame){

	for(let i=0; i<editorState.frames.length; i++){
		if(editorState.frames[i].selected){
			editorState.frames[i].selected = false;
		}
	}

	selectFrame(frame);
	updateForms();
}

function changeName(){
	let loc = -1;
	for(let i=0; i<editorState.frames.length; i++){
		if(editorState.frames[i].selected){ loc = i; }
	}

	if(loc == -1) return;

	editorState.frames[loc]["name"] = editControlls.name.value;
}

function imageIsLoaded() { 
  var img1 = new Image();
  img1.src = this.src;
  spriteData.src = this.src;

  img1.onload = function(){
  	spriteData.image = img1;
	var clickOffset = canvas.getBoundingClientRect();

  	canvas.width = this.width;
	canvas.height = this.height;
	context.drawImage(img1, 0, 0);
	editorState.originalImage = context.getImageData(0, 0, canvas.width, canvas.height);
  }
}

function drawSelectBoxes(){
	let boxes = editorState.frames;

	boxes.map(box => drawBox(box));
}

window.addEventListener('load', function() {
  document.querySelector('input[type="file"]').addEventListener('change', function() {
      if (this.files && this.files[0]) {
          var img = document.querySelector('img');  // $('img')[0]
          img.src = URL.createObjectURL(this.files[0]); // set src to blob url
          img.onload = imageIsLoaded;
          console.log(img.src);
      }
  });
});



function emptyObject(obj){
	if(Object.keys(obj).length === 0 && obj.constructor === Object){
		return true;
	}

	return false;
}

function selectBox(box){
	box.selected = true;
	editControlls.x1.value = box.point1.x;
	editControlls.x2.value = box.point2.x;
	editControlls.y1.value = box.point1.y;
	editControlls.y2.value = box.point2.y;
}

function createGroup( name ){
	editorState.groups.push(name);
}

function getGroupNames(){
	return editorState.groups;
}

function getGroup( name ){
	return editorState.frames.filter(x => x.group == name);
}

function groupExists(name){
	let groups = getGroupNames();
	for(let i=0; i<groups.length; i++){
		if(groups[i] == name){
			return true;
		}
	}

	return false;
}

function addToGroup(frame, name){
	if(groupExists(name)){
		frame.group = name;
	}
}

function grid(frame, row, col){
	let frames = [];
	let width = (frame.point2.x - frame.point1.x)/col;
	let height = (frame.point2.y - frame.point1.y)/row;
	for(let i=0; i<row; i++){
		for(let j=0; j<col; j++){
			let tmp = {};
			tmp.x = frame.point1.x+width*j;
			tmp.y = frame.point1.y+height*i;
			frames.push(new Object({
				"point1": {"x": Math.floor(tmp.x), "y": Math.floor(tmp.y)},
				"point2": {"x": Math.floor(tmp.x+width), "y": Math.floor(tmp.y+height)}
			}));
		}
	}

	return frames;
}

function bounds(point, list){
	let ret = [];
	ret = list.filter(x => inBounds(point, x));

	return ret;
}


function getSurroundings(img, point){
	let data = img.data;
	return[
		(250 <img.data[point - img.width*4+3]),
		(250 < img.data[point -4+3]) ,
		(250 < img.data[point + 4+3]),
		 (250 < img.data[point + img.width*4+3]),
		(250 < img.data[point - img.width*4 - 4+3]),
		(250 < img.data[point - img.width*4 +4+3]), 
		(250 < img.data[point + img.width*4 -4+3]),
		(250 < img.data[point + img.width*4 + 4+3])
	];
}

function noSurroundings(img, point){
	let surroundings= getSurroundings(img, point);
	for(let i=0; i<surroundings.length; i++){
		if(surroundings[i]){
			return false;
		}
	}

	return true;
}

function findNext(img, point, width){
	if(point > img.length){
		return undefined;
	}
	for(let i=0; i<width; i++){
		if(img[point+(i*4)+3] > 250){
			return point+(i*4);
		}
	}

	return undefined;
}

function autoFrame2(img, point){
	let checker = false;
	let data = img.data;
	let startingPoint = getPoint(point/4, img.width);
	let dead = false;
	let currentPoint = point;
	let minX = startingPoint.x;
	let minY = startingPoint.y;
	let maxX = startingPoint.x;
	let maxY = startingPoint.y;
	let direction = false;

	while(!dead){
		if(noSurroundings(img, currentPoint)){
			if(!direction){
				startingPoint.x = minX;
				startingPoint.y += 1;

				currentPoint = (startingPoint.x)*4 + (startingPoint.y*img.width)*4;
					currentPoint = findNext(data, currentPoint, maxX-minX);
					if(currentPoint == undefined){
						break;
					}
				direction = true;
			} else{
				direction = false;
			}
		}

		let tmpPoint = getPoint(currentPoint/4, img.width);
		if(tmpPoint.x > maxX){
			maxX = tmpPoint.x;
		}
		if(tmpPoint.y > maxY){
			maxY = tmpPoint.y;
		}
		if(tmpPoint.y < minY){
			minY = tmpPoint.y;
		}
		if(tmpPoint.x < minX){
			minX = tmpPoint.x;
		}
		if(direction){
			currentPoint -= 4;
		} else{
			currentPoint+=4;
		}

	}

	return {"point1": {"x": minX, "y": minY-1}, "point2": {"x": maxX+1, "y": maxY+1}}
}

function autoFrame(img){
	let pixels = img.data;
	let frameList = [];
	for(let i=0; i<pixels.length; i+=4){
		let inFrame = bounds(getPoint(i/4, img.width), frameList);
		if(inFrame[1] != undefined){
			i += inFrame[1].point2.x*4-inFrame[1].point1.x*4;

			continue;
		}

		if(pixels[i+3] > 250){
			if(i>pixels.length){
				break;
			}
			frameList.push(autoFrame2(img, i));

		}
	}

	for(let i=0; i<frameList.length-1; i++){
		for(let j=0; j<frameList.length-1; j++){
			if(j == i) continue;
			if(frameList[j].point1){
				if(interSect(frameList[i], frameList[j])){
					
					frameList.splice(i, 1, new Object({
						"point1": {
							"x": min(frameList[i].point1.x, frameList[j].point1.x),
							"y": min(frameList[i].point1.y, frameList[j].point1.y) },
						"point2": {
							"x": max(frameList[i].point2.x, frameList[j].point2.x),
							"y": max(frameList[i].point2.y, frameList[j].point2.y)
						}
					}));
				}
			}	 else{break;}
			
			}
	}

	for(let i=0; i<frameList.length-1; i++){
		for(let j=0; j<frameList.length-1; j++){
			if(j == i){ continue; }
			if(frameList[i].point1.x == frameList[j].point1.x && frameList[i].point1.y == frameList[j].point1.y){
				frameList.splice(j, 1);
				if(i > 0) i--;
			}
		}
	}
	


	return frameList;
}

function addFrames(){
	let frames = autoFrame(editorState.originalImage);
	for(let i=0; i<frames.length; i++){
		editorState.frames.push(frames[i]);
	}
		clear();
	reloadImage();
	drawSelectBoxes();
}

function addFramesInArea(x1, y1, x2, y2){
	//refresh context so we only have the original image
	clear();
	reloadImage();

	//get data from just this section
	let data = context.getImageData(x1, y1, x2-x1, y2-y1);
	console.log(data);
	let frames = autoFrame(data);
	console.log(frames);
	for(let i=0; i<frames.length; i++){
		editorState.frames.push({"point1": {"x": frames[i].point1.x+x1, "y": frames[i].point1.y+y1}, 
								 "point2": {"x": frames[i].point2.x+x1, "y": frames[i].point2.y+y1}});

	}

	for(let i=0; i<editorState.frames.length; i++){
		if(editorState.frames[i].selected == true){
			editorState.frames.splice(i, 1);
		}
	}

	clear();
	reloadImage();
	drawSelectBoxes();
}