let canvas = document.getElementById("editor");
let context = canvas.getContext("2d");


let spriteData = {
	"src": "",
	"image": {}
}

let editorState = {
	"setBox": [{"point1": {}, "point2": {}}],
	"editBox": {},
	"selector": false
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

  console.log(this);
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
			console.log("drawingBox");
		let width = (box.point1.x < box.point2.x) ? box.point2.x - box.point1.x : box.point1.x - box.point2.x;
		let height = (box.point1.y < box.point2.y) ? box.point2.y - box.point1.y : box.point1.y - box.point2.y;
		context.fillRect(box.point1.x, box.point1.y, width, height);
	//context.globalAlpha = 1;
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
    	lastBox.point2 = {"x": x, "y": y};
    	//selectSection(lastBox)
    	clear();
    	reloadImage();
    	drawSelectBoxes();
    	editorState.setBox.push({"point1": {}, "point2": {}});
    }
    console.log(x + " " + y);
}

function downloadData(){
  const obj = {"whatsup": "fucker", "array": ["this", "works", "like", "it", "should"]};
  const json = JSON.stringify(obj);
  const dataURL = `data:application/json,${json}`;

  const anchor = document.getElementById("downloadJson");
  anchor.setAttribute("download", "Your_data.json");
  anchor.setAttribute("href", dataURL);
}

downloadData();


function selectSection(box){
	//Ui for adding data
}

function updateSection(box){

}

function editSection(){

}

function loadSection(){

}