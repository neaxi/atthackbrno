# TI hardware
Following boards are in front of you:<BR>
MSP430F5529 - Main LaunchPad board<BR>
CC3100 - WiFi plug-on board<BR><BR>

It's enough to put power cable only into the MSP430F5229 board. The wifi will be powered from it<BR>

### Launchpad pinout
Pinout mapping definitions in the library<BR> 
https://github.com/energia/Energia/blob/master/hardware/msp430/variants/launchpad_f5529/pins_energia.h
<BR> <BR> 
Graphical pinout<BR> 
https://energia.nu/pinmaps/img/MSP-EXP430F5529LP.jpeg
![alt text](https://energia.nu/pinmaps/img/MSP-EXP430F5529LP.jpeg "MSP430F5529 pinout")

Pinout mapping on the WiFi CC3100 boost module<BR> 
https://energia.nu/pinmaps/img/CC3100BOOST.jpg
![alt text](https://energia.nu/pinmaps/img/CC3100BOOST.jpg "CC3100 pinout")


# TI software
## Energia IDE
http://energia.nu/<BR>
Energia is an open-source electronics prototyping platform …. with the goal to bring the Wiring and Arduino framework to the Texas Instruments MSP430 based LaunchPad. <BR>
The Energia IDE is cross platform and supported on Mac OS, Windows, and Linux. 

## Setup guide for the MSP430F5529
https://energia.nu/pinmaps/msp-exp430f5529/<BR><BR>


When you connect the board to your computer it's should create 2 COM ports.<BR>
One is marked as MSP Application and the other as MSP Debug.<Br>
The Debug is used to upload your code to the LaunchPad board. Serial monitor works on the Application port.<BR>
![alt text](https://support.impinj.com/hc/en-us/article_attachments/201092066/Figure_5_-_MSP430_COM_Port_in_Windows_Device_Manager.png "COM port sample windows")



## WiFi API reference
https://energia.nu/guide/libraries/wifi/<BR>


To test out the wifi connection select "GetMacAddress" sample in the Energia IDE:<BR>
https://github.com/energia/Energia/blob/master/hardware/cc3200/libraries/WiFi/examples/GetMacAddress/GetMacAddress.ino<BR>
You'll have to manually specify the SSID and password, ie:
` WiFi.begin("hackathon", "att4hack");`<BR>
Once compiled and loaded into the LaunchPad over the MSP Debug COM port, start a Serial Monitor on debug interface and reset the board. ( Location of the reset button: http://www.mouser.com/images/microsites/TI_MSP-430F5529LP_overview.jpg )<BR>
Serial interface should display the connection progress, obtained IP address and MAC address of the board.



# Online API sidenote
 - ThingSpeak<BR>https://thingspeak.com/<BR>http://community.thingspeak.com/documentation%20.../api/<BR>https://www.mathworks.com/help/thingspeak/rest-api.html
 

 - LaunchPad Energia M2X API Client<BR>
https://m2x.att.com/developer/tutorials/launchpad-energia<BR>
https://github.com/attm2x/m2x-launchpad-energia/blob/master/README.md<BR>
https://energia.nu/guide/tutorials/connectivity/tutorial_att_m2x/

