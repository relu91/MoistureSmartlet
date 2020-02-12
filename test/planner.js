const assert = require("assert")
const Device = require("../app/device")
const planner = require("../app/planner")

class MockDevice extends Device{
    constructor(){
        super("",{
            on: () => { },
            subscribe: () => {}
        })
        this.duty = 50
    }

    updateDuty(newDuty){
        this.duty = newDuty
    }
}

describe('Basic planner', () => {
    it('should not activate min duty', () => {
        const dev = new MockDevice();
        planner(dev,[],20,5);
        assert.equal(dev.duty,20,"Wrong duty")
    });
    it('should activate min duty', () => {
        const dev = new MockDevice();
        var now = new Date();
    
        planner(dev, [{
            from : new Date (now.getTime() + 20*60000),
            to: new Date(now.getTime() + 30 * 60000),
            mm: 2
        }], 20, 5);

        assert.equal(dev.duty, 5, "Wrong duty")
    });
});