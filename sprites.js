let canvas = document.getElementById("editor");
let context = canvas.getContext("2d");


let spriteData = {
	"src": "",
	"image": {}
}

let editorState = {
	"setBox": [{"point1": {}, "point2": {}, "selected": false}],
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
  }
}

function clear(){
	context.fillStyle = "white";
	context.fillRect(0, 0, canvas.width, canvas.height);
}

function reloadImage(){
	context.drawImage(spriteData.image, 0, 0);
}

function drawBox(box){
	context.fillStyle = "rgba(189, 195, 199, 150)";
	context.globalAlpha = 0.5;
		let width = (box.point1.x < box.point2.x) ? box.point2.x - box.point1.x : box.point1.x - box.point2.x;
		let height = (box.point1.y < box.point2.y) ? box.point2.y - box.point1.y : box.point1.y - box.point2.y;
		context.fillRect(box.point1.x, box.point1.y, width, height);

		if(box.selected){
			context.beginPath();
			context.lineWidth = "3";
			context.strokeStyle = "green";
			context.rect(box.point1.x, box.point1.y, width, height);
			context.stroke();
		} else{
			context.beginPath();
			context.lineWidth = "1";
			context.strokeStyle = "red";
			context.rect(box.point1.x, box.point1.y, width, height);
			context.stroke();
		}
	context.globalAlpha = 1;
}


function drawSelectBoxes(){
	let boxes = editorState.setBox;

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

canvas.onclick = function(event){
	let clickOffset = canvas.getBoundingClientRect();
    let x = event.clientX - clickOffset.left;
    let y = event.clientY - clickOffset.top;
  	console.log(editorState);
  	let lastBox = editorState.setBox[editorState.setBox.length -1];
  	console.log(lastBox.point1);
    if(emptyObject(lastBox.point1)){
    	lastBox.point1 = {"x": x, "y": y};
    } else{
    	if(editorState.setBox.length > 1){editorState.setBox[editorState.setBox.length - 2].selected = false; };
    	lastBox.point2 = {"x": x, "y": y};
    	lastBox.selected = true;
    	//selectSection(lastBox)
    	//editorState.selectedBox = lastBox;
    	clear();
    	reloadImage();
    	drawSelectBoxes();
    	editorState.setBox.push({"point1": {}, "point2": {}, "selected": false});
    }
    console.log(x + " " + y);
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

editorState.onchange = function(){
	console.log("hello");
	  const json = JSON.stringify(editorState);
  const dataURL = `data:application/json,${json}`;

  const anchor = document.getElementById("downloadJson");
  anchor.setAttribute("download", "Your_data.json");
  anchor.setAttribute("href", dataURL);
}


downloadBtn.onclick = downloadData;
//downloadData();


function selectSection(box){
	//Ui for adding data
}

function updateSection(box){

}

function editSection(){

}

function loadSection(){

}