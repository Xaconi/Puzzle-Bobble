/*
 * Funcions del main
 */

// Carrega d'elements del joc
var g_resources = [
    // Fons
    {name: "bkg0", type:"image", src: "../../images/joc/bkg0.png"},
     {name: "bkg1", type:"image", src: "../../images/joc/bkg1.png"},

    // Elements de joc
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
     * Creació del canvas
     */
    onload: function()
    {
        // Inicialització
        if (!me.video.init("jsapp", 300, 400))
        {
            alert("Sorry but your browser does not support html 5 canvas. Please try with another one!");
            return;
        }

        // Carrega d'elements
        me.loader.onload = this.loaded.bind(this);
        me.loader.preload(g_resources);

        // Canvia l'estat de joc a la pantalla de play
        me.state.change(me.state.PLAY);
    },

    /*
     * callback quan tot està carregat
     */
    loaded: function ()
    {
        // Posem play a l'objecte pantalla
        me.state.set(me.state.PLAY, new PlayScreen());

        // habilitem el teclat
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP, "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");
        me.input.bindKey(me.input.KEY.SPACE, "fire", true);
        me.state.change(me.state.PLAY);
    }
}; // jsApp

// Carrega de tot
window.onReady(function()
{
    jsApp.onload();
});
