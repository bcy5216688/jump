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

    moveCamera: function () {
        console.log("moveCamera");
        this.node.position = cc.p(this.target.x + 200, this.target.y + 200);
    }
});
