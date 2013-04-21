/*
 *	Definció de constants
 */

me.game.mutex = 0 ;   		// Mutex per no tirar més d'una bola, o quan hi ha game over

me.game.BALL_OBJECT = 1;	// Tipus d'objecte bola

me.game.midaImatge = 32;	// Mida de la imatge de la bola

me.game.posicions = new Array(10);	// Array amb totes les posicions possibles de les boles

// Inicialització de les matrius que contenen les posicions en pixels de les boles i si aquestes estan ocupades
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
 * Entitat jugador
 */
var PlayerEntity = me.ObjectEntity.extend(
    {
        /*
         * constructor
         */
        init: function(x, y)
        {
            // crida del constructor pare
            this.parent(x, y, {image: "arrow"});

            // fixa la velocitat
            this.setVelocity(3, 3);

            // fixa la gravetat
            this.gravity = 0;

            // fixa si es un objecte colisionable
            this.collidable = true;
        },

        /*
         * Actualitzar la posició del juegar
         */
        update: function()
        {
            // mou esquerra
            if (me.input.isKeyPressed("left"))
            {
                // Moviment angular de la fletxa
                if(this.angle > -1.5) this.angle -= this.accel.x * me.timer.tick * 0.005;

            }
            // mou dreta
            else if (me.input.isKeyPressed("right"))
            {
                // Moviment angular de la fletxa
                if(this.angle < 1.5) this.angle += this.accel.x * me.timer.tick * 0.005;

            }
            else
                this.vel.x = 0;

            // mou adalt
            if (me.input.isKeyPressed("up"))
            {
            }
            // mou abaix
            else if (me.input.isKeyPressed("down"))
            {
            }
            else
                this.vel.y = 0;

            // dispara
            if (me.input.isKeyPressed("fire"))
            {
                if( me.game.mutex == 0 ){

                    // crea una entitat bola
                    var conv = (this.angle * 90) / 1.5749999999999995 ;	// Calcular els graus
                    var ball = new BallEntity(134, 384, conv);
                    me.game.mutex = 1 ;
                    me.game.add(ball,this.z);
                    me.game.sort();
                }
            }

            // actualitza la velocitat i pinta la pilota per pantalla
            this.computeVelocity(this.vel);
            this.pos.add(this.vel);

            // update de les animacions
            var updated = (this.vel.x != 0 || this.vel.y != 0);
            return updated;
        }
    });

/*
 * Entitat bola
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

            //Definim el color de la bola
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
            // Si l'angle es proper a 0 es un cas especial (posem l'angle a -360)
            a = Math.round(a*100)/100;
            if(a == 0){
                this.alpha = -360;
                this.angle = (-360*Math.PI)/180;
            }else{
                this.alpha = a;
                this.angle = (this.alpha*Math.PI)/180;
            }

            // Inicialitzem la gravetat
            this.gravity = 0;

            // Inicialitzem la velocitat
            this.setVelocity(-1, -1);

            // Objecte amb colisions
            this.collidable = true;
        },

        /*
         * Funcio actualitzar
         */
        update: function()
        {

            // crida la funcio pare
            this.parent(this);

            // si s'ha d'eleminar, s'elimina
            if (!this.visible)
                me.game.remove(this);

            // si la bola no ha parat es mira si hi ha colisio
            if(!this.stop) this.checkColisio();

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

            return true;
        },

        /*
         * Testeja la colisió lateral amb la paret
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
            if (((res && res.obj.type == me.game.BALL_OBJECT) || this.pos.y < 0) && this.pos.y < 305) // Si la posicio de la bola no sobrepasa el limit inferior permes
            {
                me.game.mutex = 0 ;
                var fila = (Math.floor(this.pos.y/this.image.height)*this.image.height)/this.image.height;
                if(fila != -1) var pos = this.calcularXocMig(fila);
                // Si es detecta que hi ha un posició lliure molt a prop de la colisió, i en mig de dues boles, es posa la bola allà
                if(typeof pos != 'undefined' && pos.x != null && pos.x != 100000){
                    this.pos.x = pos.x;
                    this.pos.y = pos.y;
                    me.game.boles[fila][pos.pos] = this;
                    this.x = fila;
                    this.y = pos.pos;
                    this.stop = true;
                }
                // Altrament, es mira la posició lliure més vàlida, i es posa la bola allà
                else{
                    var dif = 100000000;
                    var posX, posY;
                    var x, y
                    for(var i=0; i<me.game.posicions.length; i++){
                        for(var j=0; j<me.game.posicions[i].length; j++){
                            if((Math.abs((me.game.posicions[i][j][0] + (this.image.width/2))-this.pos.x) + Math.abs((me.game.posicions[i][j][1] + (this.image.height/2))-this.pos.y) < dif)
                                && this.posicioValida(i,j) && me.game.boles[i][j] == null)
                            {
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
                    this.stop = true;
                }
                // Mirem si la bola passa a formar part d'un grup de tres boles o més del mateix color
                var res = this.mirarGrup(new Array());
                if(res.nombre >= 3){
                    // Si es el cas, eliminem tot el grup
                    this.eliminarGrup(res);
                }
            }
            // Altrament, si la bola sobrepassa el límit inferior, mirem si a prop hi han dues boles amb un espai al mig per posar la nostra bola allà
            else if((res && res.obj.type == me.game.BALL_OBJECT) && this.pos.y >= 305)
            {
                if(this.pos.y < 316)
                {
                    var pos = this.calcularXocMig(9);
                    if(typeof pos != 'undefined' && pos.x != null && pos.x != 100000){
                        this.pos.x = pos.x;
                        this.pos.y = pos.y;
                        me.game.boles[9][pos.pos] = this;
                        this.stop = true;
                    }
                    else{
                        alert("GAME OVER");
                        me.game.remove(this);
                    }
                }
                // Si la posició es masssa a sota de la pantalla, s'acaba la partida
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
        /*
         * Comprova si, molt a prop de la posició de xoc de la bola actual, hi han dues boles (o una bola i una paret) amb un lloc buit al mig
         */
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
        /*
         * Mira si, donada una bola nova a una posició que ja sabem, esta en contacte amb dues o més boles del mateix color
         */
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
        /*
         * Elimina un grup de boles, donada una llista de posicions
         */
        eliminarGrup : function(resposta)
        {
            var i = 0;
            while(i < resposta.llista.length){
                me.game.boles[resposta.llista[i].x][resposta.llista[i].y].remove();
                me.game.boles[resposta.llista[i].x][resposta.llista[i].y] = null;
                i++;
            }
        },
        /*
         * Sobreescriu la funció d'eliminar una bola del motor
         */
        remove: function()
        {
            // remove this entity
            me.game.remove(this, true);

            // init implosion
            var implosion = new Implosion(this.pos.x, this.pos.y);
            me.game.add(implosion, 15);
            me.game.sort();
        },
        /*
         * Mira si una posició d'una bola es present a una llista
         */
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
 * Capa del fons
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

            // Crida a la funció pare
            this.parent(name, width, height, image, z, ratio);
        },

        /*
         * Funció d'actualització
         */
        update: function()
        {
            // Recalibra la posició de la imatge
            if (this.offset.y >= this.imageheight)
                this.offset.y = 0;

            // Incrementa la posició vertical del fons
            this.offset.y += this.speed;

            return true;
        }
    });

/*
 * Fons en paral·lel
 */
var BackgroundObject = Object.extend(
    {
        /*
         * constructor
         */
        init: function()
        {
            // Afegim els dons fons al fons en paral·lel
            me.game.add(new BackgroundLayer("bkg0", 0.3), 1);
            me.game.add(new BackgroundLayer("bkg1", 0.7), 2);
            me.game.sort();
        },

        /*
         * Funció d'actualització
         */
        update: function()
        {
            return true;
        }
    });

/*
 * Animació d'implosió de boles
 */
var Implosion = me.AnimationSheet.extend(
    {
        /*
         * constructor
         */
        init: function(x, y)
        {
            // Crida a la funció pare
            var image = me.loader.getImage("implosion");
            this.parent(x, y, image, 32, 32);

            // Afegim l'animació amb sprites
            this.addAnimation("implosion", null, 0.1);

            // Fixem l'animació actual
            this.setCurrentAnimation("implosion", function() {
                me.game.remove(this);
                me.game.sort();
            });
        }
    });
