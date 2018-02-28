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

    },

    // update: function (dt) {

    // },

    setSpriteFrame: function () {
        this.icon.getComponent(cc.Sprite).spriteFrame = this.spriteFrames[Math.floor(Math.random() * 3)];
    },
});
