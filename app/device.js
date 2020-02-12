const mqtt = require("mqtt");
const EventEmitter = require("events").EventEmitter


const cert = `-----BEGIN CERTIFICATE-----
MIIDUDCCAjgCCQD2MhiUkZmeKjANBgkqhkiG9w0BAQsFADBqMQswCQYDVQQGEwJp
dDELMAkGA1UECAwCYm8xCzAJBgNVBAcMAmJvMQ4wDAYDVQQKDAVhcmNlczEOMAwG
A1UECwwFYXJjZXMxITAfBgNVBAMMGGJvc3dhbXAtMS5hcmNlcy51bmliby5pdDAe
Fw0xOTEyMDUxNDQ4MDZaFw0yMDExMjkxNDQ4MDZaMGoxCzAJBgNVBAYTAml0MQsw
CQYDVQQIDAJibzELMAkGA1UEBwwCYm8xDjAMBgNVBAoMBWFyY2VzMQ4wDAYDVQQL
DAVhcmNlczEhMB8GA1UEAwwYYm9zd2FtcC0xLmFyY2VzLnVuaWJvLml0MIIBIjAN
BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8IUJ7Htyj5kmdUinBGLW/66zplvR
YP34HTRR941QR/4Jy7jkOwOHy9qp3TkvLfDfVo2TKgp01pLWlUs+DAIetQbnBJVk
V56NoimNzr2VZVBjz8n0Xhxz/nbVpy+MqtTjGsZyrES90yi5dXvQhUegBrNz7MH0
KbTwnRjxkAs0JOBpZpsn1gbIbq7yTDhEwJ7cp2SebkpT0nFhIMzsO5yFMp24evls
oekt8W3pYoXpiLpd0w5vc4bDheanXTLHQ2ulWq0yTWaD2BeWAxG0+TauUIetTa1z
Uf52dC8XIidRuE0JAp+DxX6C4hy2VaO2D8bzzbINguLA+nDsXov6EfHMeQIDAQAB
MA0GCSqGSIb3DQEBCwUAA4IBAQBfINceeQzGjki2c1PlZHsWLHYrvtSTnau+DmnN
BWNP9zKmHN3eBquhgjn2Umu724Nepp3+OVm/Lvpt4Xe2RAkYKk92quhVXDS+yM5u
ulXxVxZyEzhaU4Li5ec8cFaYZblPAdTtM+tRS2xCQpjsvYgHIL1LFMzviEBDwo3f
MGUsEc7pcTB6uv3jUxLJ/meo/i/VNT2p65AgSs+lNOMCrd+Mx4Qu/YRoXFXv6mpH
Em2GIB/5Ji3fBqLbsa7KyqD4xT+n2ftGRR8QD/nlImsBEUSZnh9DBoTCDf5esa0C
JkMbxsRsPC/IJDnAlHWocBdhShI8+6mAaVGPSQ/h0Krl/860c
-----END CERTIFICATE-----
`

module.exports = class Device extends EventEmitter {

    constructor(deviceID,duty,client){
        super();
        this.deviceID = deviceID
        this.client = client
        this.duty = duty
        this.client.subscribe(`application/10/device/${deviceID}/rx`)

        this.client.on('message', function (topic, message) {
            if (topic === `application/10/device/${deviceID}/rx` ){
                const data = JSON.parse(message.toString())
                console.info("Device", deviceID, "duty cycle:", data.object.Dutycycle_min)
                
                this.duty = data.object.Dutycycle_min
            }
        })
    }

    updateDuty(newDuty){
        newDuty = Number.parseInt(newDuty)

        if(newDuty < 0 ){
            throw new Error("Negative dutycycle not permitted")
        }

        if(newDuty === this.duty){
            return;
        }

        const data = JSON.stringify({
            "fPort": 100,
            "data": Buffer.from(new Uint8Array([newDuty])).toString("base64")
        })
        
        client.publish(`application/10/device/${this.newDuty}/tx`, data)
    }
}