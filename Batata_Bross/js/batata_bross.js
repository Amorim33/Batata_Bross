var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var cursors;
var score = 0;
var scorePoints,tutorialText;
var player,platforms,star;

function preload ()
{
    this.load.image('enemy','img/enemy.png')
	this.load.image('background', 'img/background.png');
	this.load.image('floor', 'img/platform.png');
	this.load.image('batata', 'img/icon.png');
	this.load.spritesheet('player', 'img/player.png',{frameWidth: 32, frameHeight: 48 });
}

function create ()
{
	this.add.image(400, 300, 'background');
	 
	platforms = this.physics.add.staticGroup();

	platforms.create(400, 568, 'floor').setScale(2).refreshBody();

	platforms.create(600, 400, 'floor');
	platforms.create(50, 250, 'floor');
	platforms.create(750, 220, 'floor');
	
	player = this.physics.add.sprite(100, 450, 'player');

	player.setBounce(0.2);
	player.setCollideWorldBounds(true);
    
    star = this.physics.add.group({
        key: 'batata',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    star.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    
    scorePoints = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: 'rgb(0,0,0)' });
    
    tutorialText = this.add.text(280, 16, 'Coma batatas e fique saudável!', { fontSize: '25px', fill: 'rgb(0,0,0)' });
    
    this.physics.add.overlap(player, star, collectBatatas, null, this);
    
    enemies = this.physics.add.group();

    this.physics.add.collider(enemies, platforms);

    this.physics.add.collider(player, enemies, hitEnemy, null, this);
	this.physics.add.collider(player, platforms);
    this.physics.add.collider(star, platforms);

    
    
    this.anims.create({
		key: 'left',
		frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
		frameRate: 10,
		repeat: -1
	});

	this.anims.create({
		key: 'turn',
		frames: [ { key: 'player', frame: 4 } ],
		frameRate: 20
	});

	this.anims.create({
		key: 'right',
		frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
		frameRate: 10,
		repeat: -1
	});
}

function update(){
	cursors = this.input.keyboard.createCursorKeys();
	
	if (cursors.left.isDown){
		
		player.setVelocityX(-180);

		player.anims.play('left', true);
	}
	else if(cursors.right.isDown){
		player.setVelocityX(180);

		player.anims.play('right', true);
	}
	else {
		player.setVelocityX(0);

		player.anims.play('turn', true);
	}
	
	if(cursors.up.isDown && player.body.touching.down){
		player.setVelocityY(-340);
	}
   
}

function collectBatatas(player, star){
    star.disableBody(true, true);
    
    score += 10;
    scorePoints.setText('Score: ' + score);
    
    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    var enemy = enemies.create(x, 16, 'enemy');
    enemy.setBounce(1);
    enemy.setCollideWorldBounds(true);
    enemy.setVelocity(Phaser.Math.Between(-200, 200), 20);
    enemy.allowGravity = false;
    
    if(score >= 120){
        scorePoints = this.add.text(16, 280, 'Parabéns mulekote! \n Agora você está saudável!', { fontSize: '50px', fill: 'rgb(0,0,150)' });
        this.physics.pause();
       
        player.setTint(0x0088ff);
    
        player.anims.play('turn');
    }
}
function hitEnemy (player, enemy){
    this.physics.pause();

    player.setTint(0xff0000);
    
    player.anims.play('turn');
    
    scorePoints = this.add.text(250, 280, 'Game Over', { fontSize: '50px', fill: 'rgb(250,0,0)' });   
  
}