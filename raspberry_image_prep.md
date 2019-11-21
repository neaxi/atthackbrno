# 1. Download fresh Raspbian image
Without recomended software (ie bloatware)<BR>
https://www.raspberrypi.org/downloads/raspbian/

# 2. Flash the .img to microSD
Windows: https://sourceforge.net/projects/win32diskimager/<BR>
Linux: https://www.raspberrypi.org/documentation/installation/installing-images/linux.md<BR>
`$ dd bs=4M if=2019-09-26-raspbian-buster.img of=/dev/sdX conv=fsync`

# 3. Headless wi-fi setup
Copy wpa_supplicant.conf into /boot.<BR>
https://howchoo.com/g/ndy1zte2yjn/how-to-set-up-wifi-on-your-raspberry-pi-without-ethernet
```bash
country=US # Your 2-digit country code
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
network={
    ssid="YOUR_NETWORK_NAME"
    psk="YOUR_PASSWORD"
    key_mgmt=WPA-PSK
}
```

# 4. Enable SSH headless style
Create empty file named ```ssh``` on /boot.

# 5. Boot the Pi
Addresses on the network are assigned per the DHCP binding.<BR>
When in doubt, check from the DHCP server.

# 6. Access
## 6.1 Set default passwords
```
root:raspiroot
pi:raspipi
```
## 6.2 Set SSH keys
`x:\ssh_keys >> /home/pi/.ssh/`<BR>
Do not copy private key (id_rsa) to end users.<BR>
Make sure the keys has correct permissions:
~~~~
$ chmod 700 /home/pi/.ssh
$ chmod 600 /home/pi/.ssh/*
~~~~
Create authorized keys:<BR>
`$ cp /home/pi/.ssh/id_rsa.pub /home/pi/.ssh/authorized_keys`

# 7. OPTIONAL: `$ rpi-update`
**Q**: Why we don't need to run firmware upgrade on each Raspberry?<BR>
**A**: *"Since the place the firmware is stored is actually flashed to the first partition of the SD card (sort of like a BIOS), you will not need to run this on every device. Once you load a new version of software or firmware onto an SD card, any device you plug that card into will be running that version."* -[src](https://raspberrypi.stackexchange.com/questions/4355/do-i-still-need-rpi-update-if-i-am-using-the-latest-version-of-raspbian)


# 8. `$ raspi-config`
`network -> hostname -> rpi`  (shorter in the cli)<BR>
`network -> predictable interface names -> yes` (we're prototyping and want things easier for us)<BR>
`boot option -> desktop/cli -> desktop autologin` (xserver for the VNC session, user can turn if of if GUI is not needed)<BR>
`boot option -> splash screen -> no` (when i go from headless to monitor i want to see the boot process)<BR>
`localisation -> timezone -> Prague`<BR>
`interfacing -> camera/ssh/vnc/spi/i2c/1-wire: YES` (we want most sensor functional out of the box)<BR>
`interfacing -> serial/remote GPIO: NO` (special cases, turn on only when needed)<BR>
`advanced -> expand file system`<BR>
`advanced -> resolution -> 1280x720` (used for VNC)


# 9. `$ apt update && apt upgrade`


# 10. VNC
`$ nano /root/.vnc/config.d/vncserver-x11`<BR>
Replace `Authentication=SystemAuth` with `Authentication=VncAuth`.<BR>
Configure VNC password: 
`$ vncpasswd -service`


# 11. minor stuff
## 11.1 MOTD
`nano /etc/motd`
## 11.2 `~/.bashrc`
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


## 11.4 upload pyCam demo
~~~~
mkdir ~/pi_camera
X:\RasPi\python_codes\PiCam >> ~/pi_camera
chmod a+x /home/pi/pi_camera/*
~~~~

## 11.5 Removing additional software packages
To list  installed packages by their size<BR>
`dpkg-query --show --showformat='${Package;-50}\t${Installed-Size} ${Status}\n' | sort -k 2 -n |grep -v deinstall`
```
apt remove <pkg>
apt purge <pkg>
apt autoremove
```


# 12. Cover your traces and dump CLI history
```
rm ~/.bash_history
history -cw; >$HISTFILE
```