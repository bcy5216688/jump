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
		checkGameNode: {
			default: null,
			type: cc.Node,
		},
		initSpeed: 150,
		power: 600,
		radio: 0.5560472,
		stageLeftOrg: cc.p(-140,-420),
    },

    onLoad: function () {
		this.cameraScript = this.cameraNode.getComponent("cameraControl");
		this.isPushScreen = false;
		this.speed = 0;
		this.addX = 0;
		this.direction = 1;
		this.stageNodeArr = new Array();
		this.curStage = undefined;

		this.addStage();
		this.addPlayer();
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
		var addPos = this.node.convertToWorldSpaceAR(targetPos);
		targetPos.x += this.addX * this.direction;
		targetPos.y += this.addX * this.radio;

		var worldPos = this.node.convertToWorldSpaceAR(targetPos);
		var isGameOver = false;
		var curStageScript = this.curStage.getComponent("stage");
		if (curStageScript.isJumpOnStage(worldPos,this.direction)) {
			addPos.x = worldPos.x - addPos.x;
			addPos.y = worldPos.y - addPos.y;
			targetPos = this.node.convertToNodeSpaceAR(worldPos);
		} else {
			isGameOver = true;
		}

    	var jumpToAction = cc.jumpTo(0.5,targetPos,200,1);
    	var rotateAction = cc.rotateBy(0.5,360 * this.direction);
    	var spawnAction = cc.spawn(jumpToAction,rotateAction);
    	var endFunc = cc.callFunc(function() {
			if (isGameOver) {
				this.gameOverShow();
			} else {
				this.direction = (Math.random() < 0.5) ? -1 : 1;
				this.addStage();
				this.cameraScript.moveCamera(this.direction, addPos);
				this.removeNotUseStage();
			}
    	}.bind(this));
    	var delay = cc.delayTime(1);
    	var seqAction = cc.sequence(spawnAction,endFunc);
    	this.player.runAction(seqAction);	
	},
	
	addStage: function () {
		var stageNode = cc.instantiate(this.stagePrefab);
		var stageScript = stageNode.getComponent("stage");
		stageScript.setSpriteFrame();
		stageNode.parent = this.stageRootNode;
		this.stageNodeArr.push(stageNode);

		var position = null;
		if (this.curStage === undefined) {
			// var worldPos = this.node.convertToWorldSpaceAR(this.player.position);
			// position = this.stageRootNode.convertToNodeSpaceAR(worldPos);
			position = this.stageLeftOrg;
		} else {
			var distanceX = 250 + Math.random() * 200;
			position = this.curStage.position;
			position.x += (distanceX * this.direction);
			position.y += (distanceX * this.radio);
		}
		this.curStage = stageNode;
		stageNode.position = position;
	},

	addPlayer: function () {
		var stageMidNode = this.curStage.getChildByName("mid");
		var stageMidPos = stageMidNode.convertToWorldSpaceAR(cc.p(0,0));
		var playerPos = this.node.convertToNodeSpaceAR(stageMidPos);
		this.player.position = playerPos;
	},

	gameOverShow: function () {
		this.checkGameNode.active = true;
	},

	onGameAgain: function () {
		cc.director.loadScene("gameScene");
	},

	removeNotUseStage: function () {
		for (var i = 0; i < this.stageNodeArr.length; i ++) {
			var node = this.stageNodeArr[i];
			cc.log("stage node y:",node.y);
			if ((this.cameraNode.y - node.y) > 800) {
				this.stageNodeArr.splice(i,1);
				i--;
				node.destroy();
				cc.log("stage count:",this.stageNodeArr.length);
			}
		}
	},
});
