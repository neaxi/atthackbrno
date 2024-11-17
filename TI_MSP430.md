# TI MSP430

## TI hardware

Following boards are available to you:  
MSP430F5529 - Main LaunchPad board  
CC3100 - WiFi plug-on board  

It's enough to put power cable only into the MSP430F5229 board. The wifi will be powered from it  

### Launchpad pinout

Pinout mapping definitions in the library  
https://github.com/energia/Energia/blob/master/hardware/msp430/variants/launchpad_f5529/pins_energia.h
  
Graphical pinout  
https://energia.nu/pinmaps/img/MSP-EXP430F5529LP.jpeg
![alt text](https://energia.nu/pinmaps/img/MSP-EXP430F5529LP.jpeg "MSP430F5529 pinout")

Pinout mapping on the WiFi CC3100 boost module  
https://energia.nu/pinmaps/img/CC3100BOOST.jpg
![alt text](https://energia.nu/pinmaps/img/CC3100BOOST.jpg "CC3100 pinout")

## TI software

### Energia IDE

<http://energia.nu/>  

Energia is an open-source electronics prototyping platform …. with the goal to bring the Wiring and Arduino framework to the Texas Instruments MSP430 based LaunchPad.  
The Energia IDE is cross platform and supported on Mac OS, Windows, and Linux.

### Setup guide for the MSP430F5529

<https://energia.nu/pinmaps/msp-exp430f5529/>  

When you connect the board to your computer it's should create 2 COM ports.  
One is marked as MSP Application and the other as MSP Debug.  
The Debug is used to upload your code to the LaunchPad board. Serial monitor works on the Application port.  
![alt text](https://e2e.ti.com/cfs-file/__key/communityserver-discussions-components-files/166/2019_2D00_08_2D00_07-16_5F00_15_5F00_02_2D00_DVLLPY01-_2D00_-TeamViewer.png "COM port sample windows")

### WiFi API reference

<https://energia.nu/guide/libraries/wifi/>  

To test out the wifi connection select "GetMacAddress" sample in the Energia IDE:  
<https://github.com/energia/Energia/blob/master/hardware/cc3200/libraries/WiFi/examples/GetMacAddress/GetMacAddress.ino>  
You'll have to manually specify the SSID and password, ie:
`WiFi.begin("hackathon", "att4hack");`  
Once compiled and loaded into the LaunchPad over the MSP Debug COM port, start a Serial Monitor on debug interface and reset the board. ( Location of the reset button: <https://web.archive.org/web/20151002205944/http://www.mouser.com/images/microsites/TI_MSP-430F5529LP_overview.jpg> )  
Serial interface should display the connection progress, obtained IP address and MAC address of the board.

## Online API sidenote

- ThingSpeak  
  <https://thingspeak.com/>  
  <https://www.mathworks.com/help/thingspeak/rest-api.html>

- ~~LaunchPad Energia M2X API Client  
https://m2x.att.com/developer/tutorials/launchpad-energia  
https://github.com/attm2x/m2x-launchpad-energia/blob/master/README.md  
https://energia.nu/guide/tutorials/connectivity/tutorial_att_m2x/~~
