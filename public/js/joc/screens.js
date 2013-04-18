/*
 * play screen
 */
var PlayScreen = me.ScreenObject.extend(
{
	/*
	 * action to perform when game starts
	 */
	onResetEvent: function()
	{
		// add parallax background
		me.game.add(new BackgroundObject(), 1);
	
		// add main player
		//var ship = new PlayerEntity(100, 265);
		//me.game.add(ship, 10);
		
		var arrow = new PlayerEntity(125, 360);
		me.game.add(arrow, 10);

		// make sure everything is in the right order
		me.game.sort();
	},

    /*
     * action to perform when game is finished (state change)
     */
	onDestroyEvent: function() {
		// remove the HUD
		//me.game.disableHUD();
	}
});