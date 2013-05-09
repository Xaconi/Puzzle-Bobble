/*
 * Unica pantalla de joc
 */
var PlayScreen = me.ScreenObject.extend(
    {
        /*
         * Accions que s'executen a l'inciar el joc
         */
        onResetEvent: function()
        {
            // Afegir fons
            me.game.add(new BackgroundObject(), 1);

            // Creem la fletxa de disparar
            var arrow = new PlayerEntity(102, 430);
            me.game.add(arrow, 10);

            var bar = new barEntity(0, 325);
            me.game.add(bar, 10);
            // Assegurem que tot està en ordre
            me.game.sort();
        },

        /*
         * Accions que s'executen al finalitzar el joc
         */
        onDestroyEvent: function() {
            // remove the HUD
            //me.game.disableHUD();
        }
    });

/*
 * draw a button on screen
 */
var Button = me.Rect.extend(
    {
        /*
         * constructor
         */
        init: function(image, action, y)
        {
            // init stuff
            this.image = me.loader.getImage(image);
            this.image_hover = me.loader.getImage(image + "_hover");
            this.action = action;
            this.pos = new me.Vector2d((me.video.getWidth() / 2 - this.image.width / 2), y);

            // call parent constructor
            this.parent(this.pos, this.image.width, this.image.height);

            // register mouse event
            me.input.registerMouseEvent("mousedown", this, this.clicked.bind(this));
        },

        /*
         * action to perform when a button is clicked
         */
        clicked: function()
        {
            // start action
            me.state.change(this.action);
        },

        /*
         * drawing function
         */
        draw: function(context)
        {
            // on button hovered
            if (this.containsPoint(me.input.mouse.pos))
                context.drawImage(this.image_hover, this.pos.x, this.pos.y);
            else
                context.drawImage(this.image, this.pos.x, this.pos.y);
        },

        /*
         * destroy event function
         */
        onDestroyEvent: function()
        {
            // release mouse events
            me.input.releaseMouseEvent("mousedown", this);
        }
    });



/*
 * start screen
 */
var StartScreen = me.ScreenObject.extend(
    {
        /*
         * constructor
         */
        init: function()
        {
            // call parent constructor
            this.parent(true, true);

            // init stuff
            this.restart = null;
        },

        /*
         * reset function
         */
        onResetEvent: function()
        {

            // add parallax background
            me.game.add(new BackgroundObject(), 1);

            // buttons
            this.restart = new Button("titulo", me.state.PLAY, 80);
        },

        /*
         * drawing function
         */
        draw: function(context)
        {
            // draw buttons
            this.restart.draw(context);

        },

        /*
         * destroy event function
         */
        onDestroyEvent: function()
        {
            // release mouse event
            me.input.releaseMouseEvent("mousedown", this.restart);
        }
    });



/*
 * game over screen
 */
var GameOverScreen = me.ScreenObject.extend(
    {
        /*
         * constructor
         */
        init: function()
        {
            // call parent constructor
            this.parent(true, true);

            // init stuff
            this.restart = null;
        },

        /*
         * reset function
         */
        onResetEvent: function()
        {

            // add parallax background
            me.game.add(new BackgroundObject(), 1);

            // buttons
            this.restart = new Button("ending", me.state.PLAY, 80);
        },

        /*
         * drawing function
         */
        draw: function(context)
        {
            // draw buttons
            this.restart.draw(context);

        },

        /*
         * destroy event function
         */
        onDestroyEvent: function()
        {
            // release mouse event
            me.input.releaseMouseEvent("mousedown", this.restart);
        }
    });
