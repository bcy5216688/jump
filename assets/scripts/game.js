cc.Class({
    extends: cc.Component,

    properties: {
    	player: {
    		default: null,
    		type: cc.Node
    	},
    	cameraNode: {
    		default: null,
    		type: cc.Node,
		},
		stageRootNode: {
			default: null,
			type: cc.Node,
		},
		stagePrefab: {
			default: null,
			type: cc.Prefab,
		},
		initSpeed: 150,
		power: 600,
		radio: 0.5560472,
    },

    onLoad: function () {
		this.cameraScript = this.cameraNode.getComponent("cameraControl");
		this.isPushScreen = false;
		this.speed = 0;
		this.addX = 0;
		this.direction = 1;
		this.curStage = undefined;

		var worldPos = this.node.convertToWorldSpaceAR(this.player.position);
		var stagePos = this.stageRootNode.convertToNodeSpaceAR(worldPos);
		this.addStage(stagePos);

    	this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
			this.isPushScreen = true;
			this.speed = this.initSpeed;
			this.addX = 0;
    		this.player.stopAllActions();
    		this.player.runAction(cc.scaleTo(2,1,0.5));
    	},this);

    	this.node.on(cc.Node.EventType.TOUCH_END, function(event) {
			this.isPushScreen = false;
    		this.player.stopAllActions();
    		this.player.runAction(cc.scaleTo(0.5,1,1));
    		this.jump();
    	},this);
    },

    update: function (dt) {
		if (this.isPushScreen) {
			this.speed += (this.power * dt);
			this.addX += (this.speed * dt);
		}
    },

    jump: function () {
		var playerPos = this.player.getPosition();
		playerPos.x += this.addX * this.direction;
		playerPos.y += this.addX * this.radio;

    	var jumpToAction = cc.jumpTo(0.5,cc.p(playerPos.x,playerPos.y),100,1);
    	var rotateAction = cc.rotateBy(0.5,360 * this.direction);
    	var spawnAction = cc.spawn(jumpToAction,rotateAction);
    	var endFunc = cc.callFunc(function() {
			var position = this.curStage.position;
			position.x += 200;
			position.y += (position.x * this.radio);
			this.addStage(position);
			this.cameraScript.moveCamera(this.direction);
    	}.bind(this));
    	var delay = cc.delayTime(1);
    	var seqAction = cc.sequence(spawnAction,delay,endFunc);
    	this.player.runAction(seqAction);	
	},
	
	addStage: function (position) {
		var stage = cc.instantiate(this.stagePrefab);
		this.curStage = stage;
		stage.parent = this.stageRootNode;
		stage.position = position;
	},
});
