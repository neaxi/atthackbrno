# Getting started with Raspberry Pi
Hello, in front of you is lying Raspberry Pi 3 loaded with a default Raspbian OS.

# How to connect
## Network
### Wi-Fi
Raspberry is set to connect automatically to provided wifi network. <BR>
IP address is assigned dynamically.<BR>
To find an IP for your Raspberry check the label on the board.<BR>
RasPi01 = 10.10.1.1,<BR>
RasPi02 = 10.10.1.2,<BR>
and so on...<BR>
### Ethernet
Interface is set to 192.168.1.10/24 so please set your laptop on the same subnet if you wish to connect via cable.<BR>
The connection is available mainly for direct connection with your laptop.<BR>
If you wish to test your application with ethernet connection, please change IP assignment to dhcp/dynamic before connecting to the switch.<BR>
  opt GUI) change the setting in the system Network manager<BR>
  opt CLI) comment out the static assignemnt in /etc/dhcpcd.conf<BR>
Once connected you'll obtain IP equal to 10.10.1.100+raspi number<BR>
RasPi01 = 10.10.1.101,<BR>
RasPi02 = 10.10.1.102,<BR>
etc...

## Access & Passwords
Available connections:
 * SSH for CLI.
 * SFTP for file transfer.
 * VNC for remote GUI control.

Passwords are the same for all the boards.<BR>
Please change them to your own as a first step to prevent access of the other teams to your device.

 * root:&nbsp;raspiroot
 * pi:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;raspipi
 * vnc:&nbsp;&nbsp;raspivnc
