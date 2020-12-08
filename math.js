function min(n1, n2){ return (n1 <= n2)? n1:n2}
function max(n1, n2){ return (n1 >= n2)? n1:n2}

function getPoint(p, width){
	if(p == 0){ return {"x": 0, "y": 0}}
	let y = Math.floor(p/width);
	let x = p-y*width;
	return{"x": x, "y": y}
}

//checks if a point is inbounds of a box
function inBounds(point, box){
	if(point.x >= box.point1.x && point.x <= box.point2.x){
		if(point.y >=box.point1.y && point.y <= box.point2.y){
			return true;
		}
	}

	return false;
}

//2 dimensional check if a point is in a section of a line
function inbetween(n, p1, p2){
	if(n <= p2 && n >= p1){
		return true;
	}

	return false;
}

//checks if 2 boxes intersect
function interSect(box1, box2){
	let width1 = box1.point1.x2-box1.point1.x1;
	let width2 = box2.point1.x2-box2.point1.x1;
	let height1 = box1.point1.y2-box1.point1.y1;
	let height2 = box2.point1.y2-box2.point1.y1;
	if(inBounds(box1.point1, box2)){
		return true;
	}

	if(inBounds(box1.point2, box2)){
		return true;
	}

	if(inBounds(box2.point1, box1)){
		return true;
	}

	if(inBounds(box2.point2, box1)){
		return true;
	}

	if(inbetween(box1.point1.x, box2.point1.x, box2.point2.x)){
		if(box1.point1.y < box2.point2.y){
			if(inbetween(box1.point2.y, box2.point1.y, box2.point2.y)){
				return true;
			}
		}
	}

	if(inbetween(box2.point1.x, box1.point1.x, box1.point2.x)){
		if(box2.point1.y < box1.point2.y){
			if(inbetween(box2.point2.y, box1.point1.y, box1.point2.y)){
				return true;
			}
		}
	}

	return false;
}