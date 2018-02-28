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

		this.addStage();
		this.addStage();

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
		var targetPos = this.player.getPosition();
		targetPos.x += this.addX * this.direction;
		targetPos.y += this.addX * this.radio;

    	var jumpToAction = cc.jumpTo(0.5,targetPos,200,1);
    	var rotateAction = cc.rotateBy(0.5,360 * this.direction);
    	var spawnAction = cc.spawn(jumpToAction,rotateAction);
    	var endFunc = cc.callFunc(function() {
			this.direction = (Math.random() < 0.5) ? -1 : 1;
			this.addStage();
			this.cameraScript.moveCamera(this.direction);
    	}.bind(this));
    	var delay = cc.delayTime(1);
    	var seqAction = cc.sequence(spawnAction,delay,endFunc);
    	this.player.runAction(seqAction);	
	},
	
	addStage: function () {
		var position = null;
		if (this.curStage === undefined) {
			var worldPos = this.node.convertToWorldSpaceAR(this.player.position);
			position = this.stageRootNode.convertToNodeSpaceAR(worldPos);
		} else {
			var distanceX = 250 + Math.random() * 200;
			position = this.curStage.position;
			position.x += (distanceX * this.direction);
			position.y += (distanceX * this.radio);
		}
		var stageNode = cc.instantiate(this.stagePrefab);
		var stageScript = stageNode.getComponent("stage");
		stageScript.setSpriteFrame();
		this.curStage = stageNode;
		stageNode.parent = this.stageRootNode;
		stageNode.position = position;
	},
});
