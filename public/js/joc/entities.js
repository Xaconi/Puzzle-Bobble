/*
 *	Definció de constants
 */
 
me.game.mutex = 0 ;

me.game.BALL_OBJECT = 1;	// Tipus d'objecte bola

me.game.midaImatge = 32;	// Mida de la imatge de la bola

me.game.posicions = new Array(10);	// Array amb totes les posicions possibles de les boles

me.game.boles = new Array(10);
for(var i=0; i<me.game.posicions.length; i++){
	me.game.posicions[i] = new Array(9);
	me.game.boles[i] = new Array(9);
	for(var j=0; j<me.game.posicions[i].length; j++){
		me.game.posicions[i][j] = new Array(2);
		me.game.boles[i][j] = null;
		me.game.posicions[i][j][0] = j*32;
		if(i % 2 == 1) me.game.posicions[i][j][0] += 12;
		me.game.posicions[i][j][1] = i*32;
		me.game.boles[i][j] = null;
	}
}

/*
 * player entity
 */
var PlayerEntity = me.ObjectEntity.extend(
{
	/*
	 * constructor
	 */
	init: function(x, y)
	{
		// call the parent constructor
		//this.parent(x, y, {image: "ship"});
		this.parent(x, y, {image: "arrow"});

		// set the default horizontal & vertical speed (accel vector)
		this.setVelocity(3, 3);

		// init variables
		this.gravity = 0;

		// enable collision
		this.collidable = true;
		
		/*for(var i=0; i<4; i++){
			for(var j=0; j<me.game.posicions[i].length; j++){
				var ball = new BallEntity(me.game.posicions[i][j][0], me.game.posicions[i][j][1], 1);
				ball.visible = true ;
				me.game.add(ball,this.z);
				me.game.sort();
			}
		}*/
	},

	/*
	 * update the player pos
	 */
	update: function()
	{
		// move left
		if (me.input.isKeyPressed("left"))
		{
			// update the entity velocity
			//this.vel.x -= this.accel.x * me.timer.tick;
			if(this.angle > -1.5) this.angle -= this.accel.x * me.timer.tick * 0.005;
			//if (this.pos.x < 0)
				//this.pos.x = 0;
		}
		// move right
		else if (me.input.isKeyPressed("right"))
		{
			// update the entity velocity
			//this.vel.x -= this.accel.x * me.timer.tick;
			if(this.angle < 1.5) this.angle += this.accel.x * me.timer.tick * 0.005;
			//if (this.pos.x > me.video.getWidth() - this.image.width)
				//this.pos.x = me.video.getWidth() - this.image.width;
		}
		else
			this.vel.x = 0;

		// move up
		if (me.input.isKeyPressed("up"))
		{
			// update the entity velocity
			//this.vel.y -= this.accel.y * me.timer.tick;
			//if (this.pos.y < 0)
			//	this.pos.y = 0;
		}
		// move down
		else if (me.input.isKeyPressed("down"))
		{
			// update the entity velocity
			//this.vel.y += this.accel.y * me.timer.tick;
			//if (this.pos.y > me.video.getHeight() - this.image.height)
			//	this.pos.y = me.video.getHeight() - this.image.height;
		}
		else
			this.vel.y = 0;

		// fire
		if (me.input.isKeyPressed("fire"))
		{
			if( me.game.mutex == 0 ){
				// play sound
				// me.audio.play("missile");

				// create a missile entity
				//var missile = new MissileEntity(this.pos.x + 34, this.pos.y + 15);
				var conv = (this.angle * 90) / 1.5749999999999995 ;	// Calcular els graus
				var ball = new BallEntity(134, 384, conv);
				me.game.mutex = 1 ;
				//me.game.add(missile, this.z);
				me.game.add(ball,this.z);
				me.game.sort();
			}
		}

		// check & update player movement
		this.computeVelocity(this.vel);
		this.pos.add(this.vel);

		// update animation if necessary
		var updated = (this.vel.x != 0 || this.vel.y != 0);
		return updated;
	}
});

/*
 * ball entity
 */
var BallEntity = me.ObjectEntity.extend(
{

	angle : 0,		// Angle en radians sobre el qual es faran les operacions
	alpha : 0,		// Angle en graus sobre el qual es faran les comprovacions
	speed : 8,		// Velocitat de la bola
	direccio : 0,	// Direcció de la bola: 1- Esquerra 2 - Dreta
	xocat : false,	// Diu si la bola ha xocat contra els laterals del canvas
	stop : false,	// Diu si la bola ha xocat amb una altra, i per tant, cal 
					// que pari de moure's
	x : 10000,		// Posició X del mapejat generat a la qual es troba
	y : 10000,		// Posició Y del mapejat generat a la qual es troba
	color : 0,		// 0 - Yellow
					// 1 - Black
					// 2 - Blue
					// 3 - Red
					// 4 - Green
	
	/*
	 * constructor
	 */
	init: function(x, y, a)
	{
		// call the parent constructor
		var settings = {};
		this.color = Math.floor(Math.random()*5);
		if(this.color == 0) settings.image = "ballYellow";
		else if(this.color == 1) settings.image = "ballBlack";
		else if(this.color == 2) settings.image = "ballBlue";
		else if(this.color == 3) settings.image = "ballRed";
		else if(this.color == 4) settings.image = "ballGreen";
		// Resta de colors...
		settings.type = me.game.BALL_OBJECT;
		this.parent(x, y, settings);
		a = Math.round(a*100)/100;
		if(a == 0){
			this.alpha = -360;
			this.angle = (-360*Math.PI)/180;
		}else{
			this.alpha = a;
			this.angle = (this.alpha*Math.PI)/180;
		}
		
		// init variables
		this.gravity = 0;

		// set the default horizontal speed (accel vector)
		this.setVelocity(-1, -1);
		
		// enable collision
		this.collidable = true;
	},

	/*
	 * update function
	 */
	update: function()
	{
		
		// call parent constructor
		this.parent(this);
		
		// calculate missile velocity
		//console.log(Math.sin(this.angle));
		//this.vel.y += Math.cos(this.angle);
		//this.vel.x += Math.sin(this.angle);

		// if the missile object goes out from the screen,
		// remove it from the game manager
		if (!this.visible)
			me.game.remove(this);
			
		if(!this.stop) this.checkColisio();
		// check & update missile movement
		//this.computeVelocity(this.vel);
		
		// Comprovar si ha xocat amb els limits laterals
		if(!this.checkLateral() && !this.xocat && !this.stop){
			this.pos.x += this.speed*Math.sin(this.angle);
			this.pos.y -= this.speed*Math.cos(this.angle);
			if(this.checkLateral()) this.xocat = true;
		}else if(this.xocat && this.direccio == 1 && !this.stop){	// Xoca amb el limit esquerre
			this.pos.x += this.speed*Math.sin(this.angle);
			this.pos.y -= this.speed*Math.cos(this.angle);
		}else if(this.xocat && this.direccio == 2 && !this.stop){	// Xoca amb el limit dret
			this.pos.x += this.speed*Math.sin(this.angle);
			this.pos.y -= this.speed*Math.cos(this.angle);
		}
		
		//console.log(this.pos.y);
		return true;
	},
	
	/*
	 * Testeja la colisió lateral
	 */
	checkLateral: function()
	{
		var parat = false;
		if (this.pos.x < 0 && (this.direccio == 0 || this.direccio == 2)){
			parat = true;
			this. direccio = 1; // Direccio cap a l'esquerra
			this.alpha = 90-(180 - 90 + this.alpha);
			this.angle = (this.alpha*Math.PI)/180;
		}else if(this.pos.x > (me.video.getWidth()- this.image.width) && (this.direccio == 0 || this.direccio == 1)){
			parat = true;
			this. direccio = 2; // Direccio cap a la dreta
			this.alpha = -(90-(180 - 90 - this.alpha));
			this.angle = (this.alpha*Math.PI)/180;
		}
		return parat;
	},
	
	/*
	 * Testeja la colisió amb altres boles o el límit superior
	 */
	checkColisio : function()
	{
		var res = me.game.collide(this);
		//if(typeof res != 'undefined' && res != null) console.log(res.obj.type);
		if (((res && res.obj.type == me.game.BALL_OBJECT) || this.pos.y < 0) && this.pos.y < 305)
		{
			me.game.mutex = 0 ;
			/*this.pos.y = Math.ceil(this.pos.y/this.image.height)*this.image.height;
			this.pos.y = Math.floor(Math.ceil(this.pos.y) / this.image.height)*this.image.height;
			//this.pos.x = Math.ceil(this.pos.x/this.image.width)*this.image.width;
			
			// Control de la tasa de refresc del update de la entity ball
			var xProv;
			var margeXalt = Math.ceil(this.pos.x/this.image.height)*this.image.height;
			var margeXbaix = Math.floor(this.pos.x/this.image.height)*this.image.height;
			
			//if(Math.abs(this.pos.x - margeXalt) <= Math.abs(this.pos.x - margeXbaix)) xProv = margeXalt;
			if(typeof res != 'undefined' && res != null)
			{
				if(Math.abs(res.obj.pos.x - margeXalt) <= Math.abs(res.obj.pos.x - margeXbaix))
				{ 
					if(res.obj.pos.y == this.pos.y) xProv = margeXalt;
					else xProv = margeXbaix;
				}
				else xProv = margeXbaix;
			} 
			else
			{
				if(Math.abs(this.pos.x - margeXalt) <= Math.abs(this.pos.x - margeXbaix)) xProv = margeXalt;
				else xProv = margeXbaix;
			}
			
			if((this.pos.y / this.image.height) % 2 == 1) xProv += 12;
			this.pos.x = xProv;*/
			var fila = (Math.floor(this.pos.y/this.image.height)*this.image.height)/this.image.height;
			if(fila != -1) var pos = this.calcularXocMig(fila);
			if(typeof pos != 'undefined' && pos.x != null && pos.x != 100000){
				this.pos.x = pos.x;
				this.pos.y = pos.y;
				me.game.boles[fila][pos.pos] = this;
				this.x = fila;
				this.y = pos.pos;
				//this.pos.x = Math.floor(Math.ceil(this.pos.x) / this.image.width)*this.image.width;
				this.stop = true;
			}
			else{
				var dif = 100000000;
				var posX, posY;
				var x, y
				for(var i=0; i<me.game.posicions.length; i++){
					for(var j=0; j<me.game.posicions[i].length; j++){
						if((Math.abs((me.game.posicions[i][j][0] + (this.image.width/2))-this.pos.x) + Math.abs((me.game.posicions[i][j][1] + (this.image.height/2))-this.pos.y) < dif)
						&& this.posicioValida(i,j) && me.game.boles[i][j] == null)
						{
							//difX = Math.abs((this.pos.x + (this.image.width/2))-me.game.posicions[i][j][0]);
							//difY = Math.abs((this.pos.y + (this.image.height/2))-me.game.posicions[i][j][1]);
							dif = Math.abs((this.pos.x + (this.image.width/2))-me.game.posicions[i][j][0]) + Math.abs((this.pos.y + (this.image.height/2))-me.game.posicions[i][j][1]);
							posX = me.game.posicions[i][j][0];
							posY = me.game.posicions[i][j][1];
							this.x = i;
							this.y = j;
						}
					}
				}
				this.pos.x = posX;
				this.pos.y = posY;
				me.game.boles[this.x][this.y] = this;
				//this.pos.x = Math.floor(Math.ceil(this.pos.x) / this.image.width)*this.image.width;
				this.stop = true;
			}
			var res = this.mirarGrup(new Array());
			//console.log(res.nombre);
			if(res.nombre >= 3){
				this.eliminarGrup(res);
			}
		}
		else if((res && res.obj.type == me.game.BALL_OBJECT) && this.pos.y >= 305)
		{
			if(this.pos.y < 316)
			{
				var pos = this.calcularXocMig(9);
				if(typeof pos != 'undefined' && pos.x != null && pos.x != 100000){
					this.pos.x = pos.x;
					this.pos.y = pos.y;
					me.game.boles[9][pos.pos] = this;
					//this.pos.x = Math.floor(Math.ceil(this.pos.x) / this.image.width)*this.image.width;
					this.stop = true;
				}
				else{
					alert("GAME OVER");
					me.game.remove(this);
				}
			}
			else{
				alert("GAME OVER");
				me.game.remove(this);
			}
		}
	},
	/*
	 * Comprova si la possible posició de la bola es correcta (boles al voltant o bola al límit superior de la pantalla)
	 */
	posicioValida : function(i,j)
	{
		var bola = false;
		if(this.pos.y < 0) return true;
		else
		{
			if(i % 2 == 0){
				if(i != 0) bola = bola || me.game.boles[i-1][j] != null;
				if(j != 0) bola = bola || me.game.boles[i][j-1] != null;
				if(i != 0 && j != 0) bola = bola || me.game.boles[i-1][j-1] != null;
				if(i != 9) bola = bola || me.game.boles[i+1][j] != null;
				if(j != 9) bola = bola || me.game.boles[i][j+1] != null;
				if(i != 9 && j != 0) bola = bola || me.game.boles[i+1][j-1] != null;
			}else{
				if(i != 0) bola = bola || me.game.boles[i-1][j] != null;
				if(j != 0) bola = bola || me.game.boles[i][j-1] != null;
				if(i != 9) bola = bola || me.game.boles[i+1][j] != null;
				if(j != 9) bola = bola || me.game.boles[i][j+1] != null;
				if(i != 9 && j != 9) bola = bola || me.game.boles[i+1][j+1] != null;
				if(i != 0 && j != 9) bola = bola || me.game.boles[i-1][j+1] != null;
			}
			return bola;
		}
	},
	calcularXocMig : function(fila)
	{
		var posicio = {};
		var pos = (Math.ceil(this.pos.x/this.image.width)*this.image.width)/32 - 1;
		if(pos == 0){
			if(me.game.boles[fila][pos+1] != null && me.game.boles[fila][pos] == null){
				posicio.x = me.game.posicions[fila][pos][0];
				posicio.y = me.game.posicions[fila][pos][1];
				posicio.pos = pos;
			}
			else
			{
				posicio.x = 100000;
				posicio.y = 100000;
			}
		}else if(pos == 8){
			if(me.game.boles[fila][pos-1] != null && me.game.boles[fila][pos] == null){
				posicio.x = me.game.posicions[fila][pos][0];
				posicio.y = me.game.posicions[fila][pos][1];
				posicio.pos = pos;
			}
			else{
				posicio.x = 100000;
				posicio.y = 100000;
			}
		}else{
			if( ( me.game.boles[fila][pos-1] != null || me.game.boles[fila][pos+1] != null) && me.game.boles[fila][pos] == null){
				posicio.x = me.game.posicions[fila][pos][0];
				posicio.y = me.game.posicions[fila][pos][1];
				posicio.pos = pos;
			}
			else
			{
				posicio.x = 100000;
				posicio.y = 100000;
			}
		}
		return posicio;
	},
	mirarGrup : function(llista)
	{
		var grup = 0;
		llista[llista.length] = {};
		llista[llista.length-1].x = this.x;
		llista[llista.length-1].y = this.y;
		var i = this.x;
		var j = this.y;
		var resultat = {};
		resultat.llista = llista;
		resultat.nombre = 1;
		var aux;
		if(i % 2 == 0){
			if(i != 0 &&  me.game.boles[i-1][j] != null && me.game.boles[i-1][j].color == this.color && !this.mirarLlistaPosicions(i-1,j,llista)){
				aux = me.game.boles[i-1][j].mirarGrup(llista);
				resultat.nombre += aux.nombre;
				resultat.llista = aux.llista;
			}
			if(j != 0 && me.game.boles[i][j-1] != null && me.game.boles[i][j-1].color == this.color && !this.mirarLlistaPosicions(i,j-1,llista)) {
				aux = me.game.boles[i][j-1].mirarGrup(llista);
				resultat.nombre += aux.nombre;
				resultat.llista = aux.llista;
			}
			if(i != 0 && j != 0 && me.game.boles[i-1][j-1] != null && me.game.boles[i-1][j-1].color == this.color && !this.mirarLlistaPosicions(i-1,j-1,llista)){
				aux = me.game.boles[i-1][j-1].mirarGrup(llista);
				resultat.nombre += aux.nombre;
				resultat.llista = aux.llista;
			}
			if(i != 9 && me.game.boles[i+1][j] != null && me.game.boles[i+1][j].color == this.color && !this.mirarLlistaPosicions(i+1,j,llista)){
				aux = me.game.boles[i+1][j].mirarGrup(llista);
				resultat.nombre += aux.nombre;
				resultat.llista = aux.llista;
			}
			if(j != 9 && me.game.boles[i][j+1] != null && me.game.boles[i][j+1].color == this.color && !this.mirarLlistaPosicions(i,j+1,llista)){
				aux = me.game.boles[i][j+1].mirarGrup(llista);
				resultat.nombre += aux.nombre;
				resultat.llista = aux.llista;
			}
			if(i != 9 && j != 0 && me.game.boles[i+1][j-1] != null && me.game.boles[i+1][j-1].color == this.color && !this.mirarLlistaPosicions(i+1,j-1,llista)){
				aux = me.game.boles[i+1][j-1].mirarGrup(llista);
				resultat.nombre += aux.nombre;
				resultat.llista = aux.llista;
			}
		}else{
			if(i != 0 &&  me.game.boles[i-1][j] != null && me.game.boles[i-1][j].color == this.color && !this.mirarLlistaPosicions(i-1,j,llista)){
				aux = me.game.boles[i-1][j].mirarGrup(llista);
				resultat.nombre += aux.nombre;
				resultat.llista = aux.llista;
			}
			if(j != 0 && me.game.boles[i][j-1] != null && me.game.boles[i][j-1].color == this.color && !this.mirarLlistaPosicions(i,j-1,llista)) {
				aux = me.game.boles[i][j-1].mirarGrup(llista);
				resultat.nombre += aux.nombre;
				resultat.llista = aux.llista;
			}
			if(i != 9 && me.game.boles[i+1][j] != null && me.game.boles[i+1][j].color == this.color && !this.mirarLlistaPosicions(i+1,j,llista)){
				aux = me.game.boles[i+1][j].mirarGrup(llista);
				resultat.nombre += aux.nombre;
				resultat.llista = aux.llista;
			}
			if(j != 9 && me.game.boles[i][j+1] != null && me.game.boles[i][j+1].color == this.color && !this.mirarLlistaPosicions(i,j+1,llista)){
				aux = me.game.boles[i][j+1].mirarGrup(llista);
				resultat.nombre += aux.nombre;
				resultat.llista = aux.llista;
			}
			if(i != 9 && j != 9 && me.game.boles[i+1][j+1] != null && me.game.boles[i+1][j+1].color == this.color && !this.mirarLlistaPosicions(i+1,j+1,llista)){
				aux = me.game.boles[i+1][j+1].mirarGrup(llista);
				resultat.nombre += aux.nombre;
				resultat.llista = aux.llista;
			}
			if(i != 0 && j != 9 && me.game.boles[i-1][j+1] != null && me.game.boles[i-1][j+1].color == this.color && !this.mirarLlistaPosicions(i-1,j+1,llista)){
				aux = me.game.boles[i-1][j+1].mirarGrup(llista);
				resultat.nombre += aux.nombre;
				resultat.llista = aux.llista;
			}
		}
		return resultat;
	},
	eliminarGrup : function(resposta)
	{
		var i = 0;
		while(i < resposta.llista.length){
			me.game.boles[resposta.llista[i].x][resposta.llista[i].y].remove();
			me.game.boles[resposta.llista[i].x][resposta.llista[i].y] = null;
			i++;
		}
	},
	remove: function()
	{
		// remove this entity
		me.game.remove(this, true);

		// init implosion
		var implosion = new Implosion(this.pos.x, this.pos.y);
		me.game.add(implosion, 15);
		me.game.sort();
	},
	mirarLlistaPosicions : function(i,j,llista)
	{
		var k = 0;
		var trobat = false;
		while(k < llista.length && trobat == false)
		{
			if(llista[k].x == i && llista[k].y == j){
				trobat = true;
			}
			k++;
		}
		return trobat;
	}
});

/*
 * background layer
 */
var BackgroundLayer = me.ImageLayer.extend(
{
	/*
	 * constructor
	 */
	init: function(image, speed)
	{
		name = image;
		width = 1000;
		height = 450;
		z = 1;
		ratio = 1;
		this.speed = speed;

		// call parent constructor
		this.parent(name, width, height, image, z, ratio);
	},

	/*
	 * update function
	 */
	update: function()
	{
		// recalibrate image position
		if (this.offset.y >= this.imageheight)
			this.offset.y = 0;

		// increment horizontal background position
		this.offset.y += this.speed;

		return true;
	}
});

/*
 * parallax background
 */
var BackgroundObject = Object.extend(
{
	/*
	 * constructor
	 */
	init: function()
	{
		me.game.add(new BackgroundLayer("bkg0", 0.3), 1); // layer 1
		me.game.add(new BackgroundLayer("bkg1", 0.7), 2); // layer 2
		me.game.sort();
	},

	/*
	 * update function
	 */
	update: function()
	{
		return true;
	}
});

/*
 * implosion animation
 */
var Implosion = me.AnimationSheet.extend(
{
	/*
	 * constructor
	 */
	init: function(x, y)
	{
		// call parent constructor
		var image = me.loader.getImage("implosion");
		this.parent(x, y, image, 32, 32);

		// add animation with all sprites
		this.addAnimation("implosion", null, 0.1);

		// set animation
		this.setCurrentAnimation("implosion", function() {
			me.game.remove(this);
			me.game.sort();
		});
	}
});
