IKEA TRÅDFRI
===================
# Basic info
TRÅDFRI line of products targets remote lighting, which can be integrated into smart home solutions. Core of the platform is the remote control, which is paired with rest of the devices.
Available devices:

 - LED bulbs (white, RGB, furniture built-ins)
 - Control elements (remote control, dimmer, motion detector)
 - Network Gateway

Network gateway is by default availble on local network only, ie. no internet access. In order to control the gateway from your phone or other devices, make sure you're in the same network.

## First steps
 1. Power on your bulbs
 2. Pair the remote with them
 3. Test that you can control the bulbs with your remote

## Next steps
 4. Connect gateway to the network and pair it with the remote
 5. You can controll your Tradfri from mobile devices or smart sollution like [Home Assistant](https://home-assistant.io/)

In order to write your own application controlling the device install pytradfri library and related CoAP tools<BR>https://github.com/ggravlingen/pytradfri

# pytradfri and coap communication
The communication with the gateway over network is secured with DTLS. You need to generate PSK key in order to communicate with the gateway. Security key printed on the bottom of the gateway is used to request new PSK. This is already handled by the library - PSK for identity "pytradfri" is stored and used for all future communicaton.
If the setup was succesfull it should be possible to establish connection with the gateway.
```
 python3 -i -m pytradfri IP KEY
```
In our case IP addresses assigned to gatways are binded in the DHCP and are correlated with their number:

 - tradfri1: 10.10.2.101 
 - tradfri2: 10.10.2.102

## Manual coap communication
In case you would want to try the PSK setup process manually, you have to install coap-client.<BR>
PSK can be requested only once per identity!

```
coap-client -m post -u "Client_identity" -k "SECURITY_CODE" -e '{"9090":"IDENTITY"}' "coaps://IP_ADDRESS:5684/15011/9063"
```
**SECURITY_CODE**: code printed on bottom of the gateway<BR>
**IDENTITY**: name of the account for which the PSK key will be generated<BR>
**IP_ADDRESS**: address of the gateway

 - Gateway responds with the PSK key, which is then utilized for all communication.
PSK request, response sample:

```
$ coap-client -m POST -u "Client_identity" -k "SEC_CODE" -e '{"9090":"newclient"}' "coaps://IP:5684/15011/9063"
v:1 t:CON c:POST i:58a1 {} [ Uri-Path:15011, Uri-Path:9063 ] :: '{"9090":"newclient"}'
{"9091":"FSfiXXXXXXXXXQSd","9029":"1.2.0042"}
```
Identity "newclient" with PSK key "FSfiXXXXXXXXXQSd" would be used for all future communication from this point. Gateway won't respond to another key request for the same identity.


More details are available in linked discussions<BR>
https://bitsex.net/software/2017/coap-endpoints-on-ikea-tradfri/ <BR>
https://github.com/home-assistant/home-assistant/issues/10252 <BR>
https://github.com/ggravlingen/pytradfri/issues/90
