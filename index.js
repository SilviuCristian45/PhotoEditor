//GLOBAL VARIABLES
//reference to canvas
const img_container = document.getElementById("img_container");
const ctx = img_container.getContext('2d');
const image = new Image();

let current_opacity = 1.0;
let user_texts = [];
let selectedText = -1;
let canvas_rect = img_container.getBoundingClientRect();
let image_inserted = false;
let offsetX = canvas_rect.left;
let offsetY = canvas_rect.top;
let startX;
let startY;

let load_image = () =>{//function for loading image into canvas
    img_container.style.opacity = current_opacity;
    image_inserted = true;
    console.log(current_opacity);
    image.onload = function () {
    	ctx.drawImage(image, 0, 0,img_container.width,img_container.height);
	};
	//image.src = 'images/p2.png';
	let upload_image = document.getElementById('image_file').files[0];
	let reader = new FileReader();
    // Read in the image file as a data URL.
    reader.readAsDataURL(upload_image);
	reader.onload = function(evt){
		if( evt.target.readyState == FileReader.DONE) {
			image.src = evt.target.result;
		ctx.drawImage(image,100,100);
	}}

}

//OPACITY WORK
let increase_opacity = () =>{
	if(current_opacity < 1.0)
	{
		current_opacity += 0.10;
		setOpacity(current_opacity);
		drawPicture();
	}
	else 
	{
		alert("Deja poza are opacitate maxima");
	}
}

let decrease_opacity = () =>{
	if(current_opacity > 0.10)
	{
		current_opacity -= 0.10;
	
		setOpacity(current_opacity);

		drawPicture();
	}
	else 
	{
		alert("Deja poza are opacitate minima");
	}
}

let setOpacity = (opacity) =>{
	img_container.style.opacity = opacity;
	ctx.globalAlpha = opacity;
}

let refresh_img_container = () => {
	if(!image_inserted)
		ctx.clearRect(0, 0, img_container.width, img_container.height);
	else drawPicture();
}

let drawPicture = () =>{
	ctx.drawImage(image, 0, 0,img_container.width,img_container.height);
}

let createText = () => {
	let text = document.getElementById('text').value;
	

	let font_number = document.getElementById('font_number_text').value;
	ctx.font = font_number;
	ctx.fillStyle = document.getElementById('color').value;

	let w = ctx.measureText(text).width;
	let h = font_number;
  	
  	ctx.fillText(text, 10, 10);

  	user_texts.push({txt:text, x : 10, y : 10,width:w,height:h});
}

function handleMouseDown(e){
  e.preventDefault();
  startX= parseInt(e.clientX - offsetX);
  startY= parseInt(e.clientY - offsetY);

  // Put your mousedown stuff here
  for(let i = 0; i < user_texts.length; i++){
      if(textHittest(startX,startY,i)){
          selectedText = i;
      }
  }
  console.log("textul selectat este " + selectedText);
}

function textHittest(x,y,textIndex){
    let text = user_texts[textIndex];
    return(x>=text.x && 
        x<=text.x+text.width &&
        y>=text.y && 
        y<=text.y + text.height);
}

// by that distance
function handleMouseMove(e){
	 //if there is not a text selected
	  if(selectedText < 0){return;}

	  e.preventDefault();
	  //get the position of the mouse
	  mouseX=parseInt(e.clientX - offsetX);
	  mouseY=parseInt(e.clientY - offsetY);

	  // Put your mousemove stuff here
	  let dx= mouseX-startX;
	  let dy= mouseY-startY;
	  startX=mouseX;
	  startY=mouseY;

	  let text= user_texts[selectedText];
	  text.x += dx;
	  text.y += dy;
	  draw_text();
}

function handleMouseUp(e){
	  e.preventDefault();
	  selectedText=-1;
}
function handleMouseOut(e) {
    e.preventDefault();
    selectedText = -1;
}
let draw_text = () => {
	refresh_img_container();
	for(let i = 0; i < user_texts.length; i++){
		let text = user_texts[i];
		ctx.fillText(text.txt, text.x, text.y);
	}
}

img_container.addEventListener("mousedown",function(e){
	handleMouseDown(e);
});
img_container.addEventListener("mouseup",function(e){
	handleMouseUp(e);
});
img_container.addEventListener("mousemove",function(e){
	handleMouseMove(e);
})

let export_image = () =>{
	let img = img_container.toDataURL("image/png");
	document.write('Right click + save image as');
	document.write('<img src="'+img+'"/>');
}