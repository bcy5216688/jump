cc.Class({
    extends: cc.Component,

    properties: {
    	spriteFrames: {
            default: [],
            type: cc.SpriteFrame,
        },
        icon: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function () {
        this.mid = this.node.getChildByName("mid");
        this.up = this.node.getChildByName("up");
        this.down = this.node.getChildByName("down");

        this.left = this.node.getChildByName("left");
        this.right = this.node.getChildByName("right");
    },

    // update: function (dt) {

    // },

    setSpriteFrame: function () {
        this.icon.getComponent(cc.Sprite).spriteFrame = this.spriteFrames[Math.floor(Math.random() * 3)];
    },

    isJumpOnStage: function (playerDstPos, direction) {
        var midPos = this.mid.convertToWorldSpaceAR(cc.p(0,0));
        var dir = cc.pSub(playerDstPos,midPos);
        var minLen = cc.pLength(dir);
        var minPos = midPos;

        if (direction === 1) {
            var upPos = this.up.convertToWorldSpaceAR(cc.p(0,0));
            dir = cc.pSub(playerDstPos,upPos);
            var len = cc.pLength(dir);
            if (minLen > len) {
                minLen = len;
                minPos = upPos;
            }

            var downPos = this.down.convertToWorldSpaceAR(cc.p(0,0));
            dir = cc.pSub(playerDstPos, downPos);
            var len = cc.pLength(dir);
            if (minLen > len) {
                minLen = len;
                minPos = downPos;
            }
        } else {
            var leftPos = this.left.convertToWorldSpaceAR(cc.p(0,0));
            dir = cc.pSub(playerDstPos,leftPos);
            var len = cc.pLength(dir);
            if (minLen > len) {
                minLen = len;
                minPos = leftPos;
            }

            var rightPos = this.right.convertToWorldSpaceAR(cc.p(0,0));
            dir = cc.pSub(playerDstPos,rightPos);
            var len = cc.pLength(dir);
            if (minLen > len) {
                minLen = len;
                minPos = rightPos;
            }
        }

        dir = cc.pSub(playerDstPos,minPos);
        if (cc.pLength(dir) < 100) {
            playerDstPos.x = minPos.x;
            playerDstPos.y = minPos.y;
            return true
        }

        return false;
    },
});
