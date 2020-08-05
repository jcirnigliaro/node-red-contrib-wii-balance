module.exports = function(RED) {
    "use strict";
    var BalanceBoard = require('wii-balance-board-pi');

    function BalanceNode(n) {
        RED.nodes.createNode(this, n);
        this.topic = n.topic;
        var node = this;
        var balance = new BalanceBoard();
        balance.connect();

        balance.on("data", function(data) {
            if(data.connected && (
               data.topLeft >= 1 ||
               data.topRight >= 1 ||
               data.bottomLeft >= 1 ||
               data.bottomRight >= 1 )) {
                var msg = {'topic': node.topic};
                msg.payload = data;
                node.send(msg);
            }
        });
        this.on("close", function(removed, done) {
            balance.disconnect();
            done();
        });
    }
    RED.nodes.registerType("wii-balance", BalanceNode);
}
