cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function () {

    },

    // update: function (dt) {

    // },

    moveCamera: function (direction, addPos) {
        console.log("moveCamera");
        var position = null;
        if (direction === 1) {
            position = cc.p(this.target.x + 200, this.target.y + addPos.y);
        } else if (direction === -1) {
            position = cc.p(this.target.x - 200, this.target.y + addPos.y);
        }
        var action = cc.moveTo(0.5,position);
        this.node.runAction(action);
    },
});
