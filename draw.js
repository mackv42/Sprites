let canvas = document.getElementById("editor");
let context = canvas.getContext("2d");

function clear(){
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function reloadImage(){
	context.drawImage(spriteData.image, 0, 0);
}

function drawBox(box){
	context.fillStyle = "rgba(189, 195, 199, 150)";
	context.globalAlpha = 0.5;
		let width = box.point2.x - box.point1.x;
		let height = box.point2.y - box.point1.y;
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
