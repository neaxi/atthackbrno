# Default RasPi image prep

Guide for mentors on how to prepare the image for hackathon Raspberries and curious attendees who wonder what exact changes were done to the Raspbian OS they're handed.

## 1. Download fresh Raspbian image

Without recomended software (ie bloatware)  
https://www.raspberrypi.org/downloads/raspbian/

## 2. Flash the .img to microSD

~~Windows: https://sourceforge.net/projects/win32diskimager/  
Linux: https://www.raspberrypi.org/documentation/installation/installing-images/linux.md<BR>
`$ dd bs=4M if=2019-09-26-raspbian-buster.img of=/dev/sdX conv=fsync`~~

Use official RaspberryPi flasher.
https://www.raspberrypi.com/software/

## 3. Perform pre-boot setup in the Raspi flasher

* hostname: rpi
* username and password
* headless wifi setup
* TZ: Eu/Prague
* Keyboard: US
* enable ssh
* disable telemetry

These procedures can be done also manually. See "legacy" section at the end of document.

## 5. Boot the Pi

Addresses on the network are assigned per the DHCP binding.<BR>
When in doubt, check from the DHCP server.

## 6. Access

### 6.1 Set default passwords

```sh
root:raspiroot
pi:raspipi
```

### 6.2 Set SSH keys

`x:\ssh_keys >> /home/pi/.ssh/`<BR>
Do not copy private key (id_rsa) to end users.<BR>
Make sure the keys has correct permissions:

```sh
$ chmod 700 /home/pi/.ssh
$ chmod 600 /home/pi/.ssh/*
```

Create authorized keys:<BR>
`$ cp /home/pi/.ssh/id_rsa.pub /home/pi/.ssh/authorized_keys`

## 7. OPTIONAL: `$ rpi-update`

**Q**: Why we don't need to run firmware upgrade on each Raspberry?<BR>
**A**: *"Since the place the firmware is stored is actually flashed to the first partition of the SD card (sort of like a BIOS), you will not need to run this on every device. Once you load a new version of software or firmware onto an SD card, any device you plug that card into will be running that version."* -[src](https://raspberrypi.stackexchange.com/questions/4355/do-i-still-need-rpi-update-if-i-am-using-the-latest-version-of-raspbian)

## 8. `$ raspi-config`

`network -> hostname -> rpi`  (shorter in the cli)<BR>
`network -> predictable interface names -> yes` (we're prototyping and want things easier for us)<BR>
`boot option -> desktop/cli -> desktop autologin` (xserver for the VNC session, user can turn if of if GUI is not needed)<BR>
`boot option -> splash screen -> no` (when i go from headless to monitor i want to see the boot process)<BR>
`localisation -> timezone -> Prague`<BR>
`interfacing -> camera/ssh/vnc/spi/i2c/1-wire: YES` (we want most sensor functional out of the box)<BR>
`interfacing -> serial/remote GPIO: NO` (special cases, turn on only when needed)<BR>
`advanced -> expand file system`<BR>
~~`advanced -> resolution -> 1280x720` (used for VNC)~~

## 9. `$ apt update && apt upgrade`


## 11. minor stuff

### 11.1 MOTD

`nano /etc/motd`  
`cd ~; rmdir Desktop Documents Music Pictures Public Templates Videos`

### 11.2 `~/.bashrc`

Increase command history
```
HISTSIZE=10000
HISTFILESIZE=20000
```
Colored prompts with a timestamp
```
# pi user - green
'${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w \$\[\033[00m\] '

# root user - red
'${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w \$\[\033[00m\] '
```

## 11.3 Aliases

`alias ll="ls -l"`

## 11.4 Pi Camera

### picamera2

`apt install imx500-all libcap-dev libcamera-dev`

New API, new modules.  
Full documentation + examples available here:  
https://github.com/raspberrypi/picamera2/

https://www.raspberrypi.com/news/how-to-get-started-with-your-raspberry-pi-ai-camera/

### PiCamera demo

https://github.com/shillehbean/youtube-p2/blob/main/stream_usb_camera.py

```sh
# copy files from share
mkdir ~/pi_camera
X:\RasPi\python_codes\PiCam >> ~/pi_camera
chmod a+x /home/pi/pi_camera/* 

# run demo camera server
cd ~/pi_camera
bash create_cam_venv.sh
. venv/bin/activate
python3 cam_serv_new.py
```

## 11.5 Removing additional software packages

To list  installed packages by their size<BR>
`dpkg-query --show --showformat='${Package;-50}\t${Installed-Size} ${Status}\n' | sort -k 2 -n |grep -v deinstall`

```sh
apt remove <pkg>
apt purge <pkg>
apt autoremove
```

## 12. Sense HAT Python support

Install: `python3 -m pip install sense-hat`<BR>
Test: `from sense_hat import SenseHat`

## 13. Static IP config for eth0

### 13.1 Network interface naming

Turn of network interface name randomization.<BR>
Add `net.ifnames=0 biosdevname=0` into `/boot/cmdline.txt` and reboot.

### 13.2 Static IP configuration

Debian 12 switched to NetworkManager.  
Use `sudo nmtui` to configure it.  
Configuration is stored in:  
`/etc/NetworkManager/system-connections/Wired\ connection\ 1.nmconnection`


## Utilities

`apt install  git mc tmux dnsutils htop btop nmap iotop`

## LAST. Cover your traces and dump CLI history

```sh
rm ~/.bash_history
history -cw; >$HISTFILE
```

## Save and compress the image

https://maskaravivek.medium.com/creating-and-shrinking-bootable-for-rasberry-pi-image-from-sd-card-d9355cb29ee8

## Nothing of interest lies below...

|

|

|

|

|

|

|

|

|

|

|

|

|

## LEGACY

## 3. Headless wi-fi setup

~~Create `wpa_supplicant.conf` in `/boot` folder with wi-fi config.  
https://howchoo.com/g/ndy1zte2yjn/how-to-set-up-wifi-on-your-raspberry-pi-without-ethernet  
`$ wpa_passphrase YOUR_SSID YOUR_PASSWORD` can be used to generate network entry.~~

```sh
country=US # Your 2-digit country code
update_config=1
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
network={
    ssid="YOUR_NETWORK_NAME"
    psk="YOUR_PASSWORD"
    key_mgmt=WPA-PSK
}
```

## 4. Pre-boot setup

### 4.1. Enable SSH headless style

Create empty file named ```ssh``` on /boot.

### 4.2. Setup a new user

["wizard is no longer optional, as this is how a user account is created; until you create a user account, you cannot log in to the desktop"](https://www.raspberrypi.com/news/raspberry-pi-bullseye-update-april-2022/)  
Get encrypted password: `echo 'mypassword' | openssl passwd -6 -stdin`  
Create `/boot/userconf.txt`  
Content: `pi:$6$jBPcARXlTKaqzGmk$cRN70EK0Ir/XDHwPMhpmLYFC9xKtyrUdZogDTVnbjfamTk7GokusEWaQjbucccqJ0oanMhfHUcd34ePWiXq85.`

## 10. VNC

deprecated - UVNC 1.5 now supports RSA and can use native RasPi VNC auth.

Configure VNC password: `$ vncpasswd -service`
`$ nano /root/.vnc/config.d/vncserver-x11`<BR>
Replace `Authentication=SystemAuth` with `Authentication=VncAuth`.<BR>
sample:

```sh
# cat .vnc/config.d/vncserver-x11

Authentication=VncAuth
Encryption=PreferOff
Password=a421a8df5bcf5b7f
```

In case of persisting issues, it might be needed to go through GUI:  
`VNC > Options > Users & Perms > Standard user > Add > Allow connections from legacy VNC`

## 13.2 Static IP

~~Configuration is done in `/etc/dhcpcd.conf`<BR>
Do NOT touch `/etc/network/interfaces` ! <BR>
WAIT! - dhclient timeout must occur prior fallback to static is executed.~~

```sh
profile static_eth0
static ip_address=192.168.1.10/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1

# fallback to static profile on eth0
interface eth0
fallback static_eth
```
