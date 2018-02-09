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
    },

    onLoad: function () {
    	this.dstX = this.player.x;
    	this.dstY = this.player.y;
    	this.addX = 200;
    	this.addY = 200;
    	this.cameraScript = this.cameraNode.getComponent("cameraControl");

    	this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
    		this.player.stopAllActions();
    		this.player.runAction(cc.scaleTo(2,1,0.5));
    	},this);

    	this.node.on(cc.Node.EventType.TOUCH_END, function(event) {
    		this.player.stopAllActions();
    		this.player.runAction(cc.scaleTo(0.5,1,1));
    		this.jump();
    	},this);
    },

    // update: function (dt) {

    // },

    jump: function () {
    	this.dstX += this.addX;
    	this.dstY += this.addY;
    	var jumpToAction = cc.jumpTo(0.5,cc.p(this.dstX,this.dstY),100,1);
    	var rotateAction = cc.rotateBy(0.5,360);
    	var spawnAction = cc.spawn(jumpToAction,rotateAction);
    	var endFunc = cc.callFunc(function() {
    		this.cameraScript.moveCamera();
    	}.bind(this));
    	var delay = cc.delayTime(1);
    	var seqAction = cc.sequence(spawnAction,delay,endFunc);
    	this.player.runAction(seqAction);	
    }
});
