# Getting started with Raspberry Pi
Hello, in front of you is lying Raspberry Pi 3 loaded with a default Raspbian OS (release 2017-03-02).

# How to connect
## Network
### Wi-Fi
Raspberry is set to connect automatically to provided wifi network. 
IP address is assigned dynamicaly.
To find an IP for your Raspberry check the label on the board.
RasPi01 = 10.10.1.1,
RasPi02 = 10.10.1.2,
and so on...
### Ethernet
For direct connection to your laptop only.
Interface is set to 192.168.1.10/24 so please set your laptop on the same subnet if you wish to connect via cable.
## Access & Passwords
Available connections:
 * SSH for CLI.
 * SFTP for file transfer.
 * VNC for remote GUI control.

Passwords are the same for all the boards.
Please change them to your own as a first step to prevent access of the other teams to your device.

root:&nbsp;raspiroot

pi:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;raspipi

vnc:&nbsp;&nbsp;raspivnc
