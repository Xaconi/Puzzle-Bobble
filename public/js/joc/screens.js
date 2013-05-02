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