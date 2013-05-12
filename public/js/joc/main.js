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
     {name: "implosion", type:"image", src: "../../images/joc/implosion.png"},
     {name: "bar", type:"image", src: "../../images/joc/bar.png"},

    //Menus
    {name: "titulo", type:"image", src: "../../images/joc/titulo.png"},
    {name: "titulo_hover", type:"image", src: "../../images/joc/titulo_hover.png"},
    {name: "ending", type:"image", src: "../../images/joc/ending.png"},
    {name: "ending_hover", type:"image", src: "../../images/joc/ending_hover.png"}
];

var jsApp =
{
    /*
     * Creació del canvas
     */
    onload: function()
    {
        // Inicialització
        if (!me.video.init("jsapp", 304, 500))
        {
            alert("Sorry but your browser does not support html 5 canvas. Please try with another one!");
            return;
        }

        // Carrega d'elements
        me.loader.onload = this.loaded.bind(this);
        me.loader.preload(g_resources);

        // Canvia l'estat de joc a la pantalla de play
        me.state.change(me.state.START);
    },

    /*
     * callback quan tot està carregat
     */
    loaded: function ()
    {
        // Posem star a l'objecte pantalla
        me.state.set(me.state.START, new StartScreen());

        // Posem play a l'objecte pantalla
        me.state.set(me.state.PLAY, new PlayScreen());

        // Posem game over a l'objecte pantalla
        me.state.set(me.state.GAMEOVER, new GameOverScreen());

        // habilitem el teclat
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP, "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");
        me.input.bindKey(me.input.KEY.SPACE, "fire", true);
        me.state.change(me.state.START);
    }
}; // jsApp


// Carrega de tot
window.onReady(function()
{
    jsApp.onload();
});
