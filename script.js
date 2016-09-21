// Canvas elements
var stage;
var colorBG = '#222';
var colorFG = '#ddd';

// 
var EQbar, EQbarheight;

var circle, circleYoffset, circleHit;
var square, squareYoffset, squareHit;
var triangle, triangleYoffset, triangleHit;

var EQcircleDiff = [
	[-10, 1], [-2,3], [-1,-2], [-5,3], [3,6], [0,0], [0,3], [1,3]
];

var EQsquareDiff = [
	[-11, 3], [-1,1], [-5,2], [2,2], [0,1], [1,-2], [-3,3], [2,4]
];

var EQtriangleDiff = [
	[-9,1], [0,-3], [2,2], [3,3], [-1,1], [-2,3], [5,-4]
];

var EQcircle = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var EQsquare = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var EQtriangle = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

//var EQchanges = [EQcircle, EQsquare, EQtriangle];

//// AUDIO
var soundCircle, soundSquare, soundTriangle;

var panCircle = 0;
var panSquare = 0;
var panTriangle = 0;
var audioOn = false;

function init() { 
	stage = new createjs.Stage('mainCanvas');

	var outline = new createjs.Shape();
	outline.graphics.setStrokeDash([0,4]).setStrokeStyle(1.5, 'round', 'round').beginStroke(colorFG).drawRoundRect(60,120,480,360,60);
	stage.addChild(outline);

	// Creating the initial "EQbar" set of rectangles or lines
	EQbarheight = [];
	EQbar = [];
	for (var i=0; i<24; i++) {
		EQbarheight[i] = 200;

		EQbar[i] = new createjs.Shape();
		EQbar[i].graphics.beginFill(colorFG).drawRect(0,0,16,200)
			.beginFill(colorBG).drawRect(15,0,1,200);
		EQbar[i].y = EQbarheight[i];
		EQbar[i].x = 108 + 16*i;
		stage.addChild(EQbar[i]);
	}
	
	// Creating all of the shapes
	var yHeight = 520;
	
	circle = new createjs.Shape();
	circle.graphics.beginFill(colorBG).beginStroke(colorFG).drawCircle(0,0,8);
	circle.x = 275; circle.y = yHeight;
	stage.addChild(circle);
	circle.on('pressmove', function(evt) {
		evt.target.x = evt.stageX;
		evt.target.y = evt.stageY;
		circleYoffset = 300 - circle.y;
		
		if (Math.abs(circleYoffset) < 180) {
			
			for (var i=0; i<24; i++) {
				EQcircle[i] = 0;
			}

			for (var i=0; i<EQcircleDiff.length; i++) {
				if (circleHit + EQcircleDiff[i][0] >= 0) {
					EQcircle[ circleHit + EQcircleDiff[i][0] ] = EQcircleDiff[i][1] - circleYoffset;
				}
			}
			
		}
		
		genEQbar();
		
		soundCircle.volume = (480 - evt.stageY) / 360;
		soundCircle.pan = (evt.stageX - 300)/190;
		
		stage.update();
	});
	
	square = new createjs.Shape();
	square.graphics.beginFill(colorBG).beginStroke(colorFG).drawPolyStar(0,0,9,4,0,0);
	square.x = 300; square.y = yHeight;
	stage.addChild(square);
	square.on('pressmove', function(evt) {
		evt.target.x = evt.stageX;
		evt.target.y = evt.stageY;
		squareYoffset = 300 - square.y;
		
		if (Math.abs(squareYoffset) < 180) {

			for (var i=0; i<24; i++) {
				EQsquare[i] = 0;
			}

			for (var i=0; i<EQsquareDiff.length; i++) {
				if (squareHit + EQsquareDiff[i][0] >= 0) {
					EQsquare[ squareHit + EQsquareDiff[i][0] ] = EQsquareDiff[i][1] - squareYoffset;
				}
			}

			genEQbar();
		}
		
		soundSquare.volume = (480 - evt.stageY) / 360;
		soundSquare.pan = (evt.stageX - 300)/190;
		
		stage.update();
	});

	triangle = new createjs.Shape();
	triangle.graphics.beginFill(colorBG).beginStroke(colorFG).drawPolyStar(0,0,10,3,0,30);
	triangle.x = 325; triangle.y = yHeight + 2;
	stage.addChild(triangle);
	
	shapes = [circle, square, triangle];
	triangle.on('pressmove', function(evt) {
		evt.target.x = evt.stageX;
		evt.target.y = evt.stageY;
		triangleYoffset = 300 - triangle.y;
		
		if (Math.abs(triangleYoffset) < 180) {
	
			for (var i=0; i<24; i++) {
				EQtriangle[i] = 0;
			}

			for (var i=0; i<EQtriangleDiff.length; i++) {
				if (triangleHit + EQtriangleDiff[i][0] >= 0) {
					EQtriangle[ triangleHit + EQtriangleDiff[i][0] ] = EQtriangleDiff[i][1] - triangleYoffset;
				}
			}

			genEQbar();
		}
		
		soundTriangle.volume = (480 - evt.stageY) / 360;
		soundTriangle.pan = (evt.stageX - 300)/190;
		
		stage.update();
	});
	
	// Stage listener
	stage.addEventListener('stagemousedown', clickCanvas);
	
	//// AUDIO
	
	
	var audioPath = './audio/';
	var sounds = [
		{src:'amb.ogg', id:'amb'},
		{src:'drums.ogg', id:'drums'},
		{src:'hats.ogg', id:'hats'}
	];

	createjs.Sound.registerSounds(sounds, audioPath);
	createjs.Sound.addEventListener('ticker', tick);
	soundCircle = createjs.Sound.createInstance('amb');
	soundSquare = createjs.Sound.createInstance('drums');
	soundTriangle = createjs.Sound.createInstance('hats');
	
	// Tying it all to a regularly updating function
	createjs.Ticker.on('tick', tick);
	
}

function clickCanvas(event) {
	if (audioOn == false) {
		soundCircle.play({loop:-1, volume:0});
		soundSquare.play({loop:-1, volume:0});
		soundTriangle.play({loop:-1, volume:0});
		audioOn = true;
	}
}

function tick(event) {
	
	for (var i=0; i<24; i++) {
		var ct = circle.localToLocal(0,0,EQbar[i]);
		if (EQbar[i].hitTest(ct.x, ct.y)) {
			if (circleHit != i) {
				circleHit = i;
			}
		}
		
		var st = square.localToLocal(0,0,EQbar[i]);
		if (EQbar[i].hitTest(st.x, st.y)) {
			if (squareHit != i) {
				squareHit = i;
			}
		}
		
		var tt = triangle.localToLocal(0,0,EQbar[i]);
		if (EQbar[i].hitTest(tt.x, tt.y)) {
			if (triangleHit != i) {
				triangleHit = i;
			}
		}
	}
	
	stage.update(event);
}

function genEQbar() {
	for (var i=0; i<24; i++) {
		EQbarheight[i] = 200 + EQcircle[i] + EQsquare[i] + EQtriangle[i];
		EQbar[i].y = EQbarheight[i];
	}
}