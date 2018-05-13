// Create a raster item using the image tag with id='face'
var image = document.getElementById('face');
var canvas = document.getElementById('myCanvas');
var canvasContext = canvas.getContext('2d');

var TO_RADIANS = Math.PI/180; 
function drawRotatedImage(image, x, y, angle)
{ 
    // save the current co-ordinate system 
    // before we screw with it
    canvasContext.save(); 

    // move to the middle of where we want to draw our image
    canvasContext.translate(x, y);

    // rotate around that point, converting our 
    // angle from degrees to radians 
    canvasContext.rotate(angle * TO_RADIANS);

    // draw it up and to the left by half the width
    // and height of the image 
    canvasContext.drawImage(image, -(image.width/2), -(image.height/2));

    // and restore the co-ords to how they were when we began
    canvasContext.restore(); 
}
 
drawRotatedImage(image, 600, 450, 15);

var imgURL = canvas.toDataURL();

var raster = new Raster({
	source: imgURL
});

// Hide the raster
raster.visible = true;

// The size of our grid cells
var gridSize = 15;

// Raster dimensions
var rasterWidth = 60;
var rasterHeight = 45;

// Space the cells by 100%
var spacing = 1;

// The amount of phases in one grid cell
var phasesPerGridCell = 3;
var segmentsPerPhase = 4;
var segmentsPerGridCell = phasesPerGridCell * segmentsPerPhase;

// As the web is asynchronous, we need to wait for the raster to load
// before we can perform any operation on its pixels.
raster.on('load', function() {

	// Since the example image we're using is much too large,
	// and therefore has way too many pixels, lets downsize it to
	// 60 pixels wide and 45 pixels high:

	raster.size = new Size(rasterWidth, rasterHeight);

	for (var y = 0; y < raster.height; y++) {

		for(var x = 0; x < raster.width; x++) {
			
			// Get the color of the pixel:
			
			var color = raster.getPixel(x, y);

			// Create a circle shaped path:
			/*var path = new Path.Circle({
				center: new Point(x, y) * gridSize,
				radius: gridSize / 2 / spacing,
				fillColor: 'black'
			});*/

			// Create a new path and style it:
			var path = new Path({
				strokeColor: '#C0C0C0',
				strokeWidth: 1.5,
				strokeCap: 'butt',
				selected: false
			});

			// Add amount of segment points to the path spread out
			// over the width of the gridSize:
			for (var i = 0; i <= segmentsPerGridCell; i++) {
				path.add(new Point(x + (i / segmentsPerGridCell), y) * gridSize);
			}

			var counter = 0;
			var increase =  (Math.PI * 2 / segmentsPerPhase);

			// Loop through the segments of the path
			for (var i = 0; i <= segmentsPerGridCell; i++) {
				var segment = path.segments[i];
				
				// Change the y position of the segment point
				segment.point.y = Math.sin( counter ) * (color.gray) * (gridSize / 2) + (y * gridSize);
				counter += increase;
				//console.log(segment.point.x, segment.point.y);
			}

			// Smooth the paths points
			//path.rotate(30, view.center);
			path.smooth();

		}
	}

	// Move the active layer to the center of the view, so all 
	// the created paths in it appear centered.
	project.activeLayer.position = view.center;
	project.activeLayer.rotate(-15);
});
