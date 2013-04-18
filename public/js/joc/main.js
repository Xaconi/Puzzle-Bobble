/*
 * main functions
 */

// game resources
var g_resources = [
	// parallax background
	{name: "bkg0", type:"image", src: "../../images/joc/bkg0.png"},
	{name: "bkg1", type:"image", src: "../../images/joc/bkg1.png"},

	// game
	{name: "arrow", type:"image", src: "../../images/joc/arrow.png"},
	{name: "ballYellow", type:"image", src: "../../images/joc/ballYellow.png"},
	{name: "ballBlack", type:"image", src: "../../images/joc/ballBlack.png"},
	{name: "ballBlue", type:"image", src: "../../images/joc/ballBlue.png"},
	{name: "ballRed", type:"image", src: "../../images/joc/ballRed.png"},
	{name: "ballGreen", type:"image", src: "../../images/joc/ballGreen.png"},
	{name: "implosion", type:"image", src: "../../images/joc/implosion.png"}
];


var jsApp =
{	
	/*
	 * Initialize the jsApp
	 */
	onload: function()
	{
		// init the video
		if (!me.video.init("jsapp", 300, 400))
		{
			alert("Sorry but your browser does not support html 5 canvas. Please try with another one!");
			return;
		}

        // initialize the audio
        me.audio.init("mp3,ogg");

		// set all resources to be loaded
		me.loader.onload = this.loaded.bind(this);
		me.loader.preload(g_resources);

		// load everything & display a loading screen
		me.state.change(me.state.PLAY);
	},

	/*
	 * callback when everything is loaded
	 */
	loaded: function ()
	{
		// set the "Play" Screen Object
		me.state.set(me.state.PLAY, new PlayScreen());

		// enable the keyboard
		me.input.bindKey(me.input.KEY.LEFT, "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.UP, "up");
		me.input.bindKey(me.input.KEY.DOWN, "down");
		me.input.bindKey(me.input.KEY.SPACE, "fire", true);

		// draw menu
		me.state.change(me.state.PLAY);
	}
}; // jsApp

// bootstrap :)
window.onReady(function() 
{
	jsApp.onload();
});
