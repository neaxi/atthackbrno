# Getting started with Raspberry Pi
Hello, in front of you is Raspberry Pi 3 loaded with a default Raspbian OS.<BR>
In case you would want to flash this image onto your device, ~~you can find the .img file on local file share~~ ask one of the mentors to provide you with the image.

# Network / How to connect
### Wi-Fi
Raspberry is set to connect automatically to provided wifi network. <BR>
IP address is assigned by our DHCP server.<BR>
To find an IP for your Raspberry check the label on the board.<BR>
RasPi01 = 10.10.1.1<BR>
RasPi02 = 10.10.1.2<BR>
and so on...<BR>
### Ethernet
Interface is set to 192.168.1.10/24 so please set your laptop on the same subnet if you wish to connect via cable.<BR>
The connection is available mainly for direct connection with your laptop.<BR><BR>
If you wish to test your application with ethernet connection, please change IP assignment to dhcp/dynamic before connecting to the switch. There are two options on how to do it:<BR><BR>
&nbsp;&nbsp;&nbsp; **opt GUI)** change the setting in the system Network manager<BR>
&nbsp;&nbsp;&nbsp; **opt CLI)** comment out the static assignemnt in /etc/dhcpcd.conf<BR><BR>
Once connected you'll obtain IP equal to 10.10.1.100+[raspi number]<BR>
RasPi01 = 10.10.1.101<BR>
RasPi02 = 10.10.1.102<BR>
etc...

## Access & Passwords
Available connections:
 * SSH for CLI.
 * SFTP/SCP for file transfer.
 * VNC for remote GUI control.

Passwords are the same for all the boards.<BR>
Please change them to your own as a first step to prevent access of the other teams to your device.
  
| Account | Password   |
 -------- | ---------- |
| root    | raspiroot  |
| pi      | raspipi    |
| VNC     | raspivnc   |


# Connectivity
Schematics: https://www.jameco.com/Jameco/workshop/circuitnotes/raspberry-pi-circuit-note.html <BR>
GPIO pinout details: https://pinout.xyz


# Sense HAT
Python library is already present in the Raspbian OS.<BR>
Sense HAT provides following for the Raspberry: 
  - Temperature
  - Humidity
  - Barometric pressure
  - Gyroscope
  - Acceletometer
  - Magnetometer
  - Joystick
  - 8x8 RGB LED matrix

API reference: https://pythonhosted.org/sense-hat/api/ <BR>
Tutorial: https://www.raspberrypi.org/learning/getting-started-with-the-sense-hat/
  
# Pi Camera
Camera is connected over the CSI interface on the mainboard.<BR>
Detailed info: https://projects.raspberrypi.org/en/projects/getting-started-with-picamera

You can utilize following script to test out basic functionality.
```
$ /home/pi/python_demo/pi_camera_test.py --help
Usage: pi_camera_test.py [OPTIONS]

Options:
  --preview  Shows camera image preview on physical connection only.
  --stream   Starts a server with camera stream
```

**Tech. specs**:
 - Still images: 8 Mpx (3280x2464)
 - Video modes:
   - 1920x1080 @ 30 fps
   - 1280x720 @ 60 fps
   - 640x480 @ 90 fps

# Speaker pHAT
Audio HAT containing amplifier, speaker and LED bar graph for projects requiring audio output.
Pi Zero form factor.
Tech. details: https://shop.pimoroni.com/products/speaker-phat
HAT installer: https://github.com/pimoroni/speaker-phat

# Explorer pHAT
HAT to extend Pi with 5V input/output, analog input, 
Pi Zero form factor.
Installer: https://github.com/pimoroni/explorer-hat
Documentation: https://github.com/pimoroni/explorer-hat/blob/master/documentation/Function-reference.md
