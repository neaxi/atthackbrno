
**Intro**  
As our minds are removing old information in LRU fashion, there is a significant possibility of corrupted memory and diminished data retainability next time another OctoPi has to be set up. Following guide attempts to alleviate this issue by documenting the changes made to default image and to provide sort of a setup template. The outlined manual procedure is, in our case, used rarely therefore not worth an automation effort at this point in time and space.
____

# **#00 - init**
- [download OctoPi](https://octoprint.org/download/)
- [reuse hackathon RPi prep guide](https://github.com/neaxi/atthackbrno/blob/master/raspberry_image_prep.md)
  - #2 - Flash .img to microSD  
  - #3 - headless wifi setup
  - #4 - enable ssh
  - #5 - boot the Pi
    - default login: `pi:raspberry`
  - #7 - firmware update - `rpi-update`
  - #8 - `raspi-config`
    - hostname, e.g.: `octomk#`
    - `boot -> console`
    - `splash screen -> no`
    - `interfacing -> i2c: yes` (I2C is needed for OLED displays)
    - `localisation -> timezone -> Prague`
    - `localisation -> locale -> en_US.UTF-8`
    - `advanced -> expand file system`
    - `advanced -> predictable network interface names`
  - #9 - `apt update && apt upgrade`
  - #13 - fallback to static ethernet address when DHCP fails
- optional - disable IPv6 - https://cwesystems.com/?p=231  
  must use `service procps force-reload` as `reload` option is [no longer available](https://bugs.launchpad.net/ubuntu/+source/procps/+bug/1908241)

___

# **#01 - CLI setup**
## Passwordless sudo
- `sudo visudo`  
- Add `pi` user at the bottom of the file. ([why bottom](https://askubuntu.com/a/100112))  
 `pi      ALL=(ALL) NOPASSWD: ALL`

## Trimming MOTD
Clear up unnecessary info within MOTD.  
Using truncate as redirected echo was leaving blank lines.  
```bash
sudo sh -c ' \
truncate -s 0 /etc/motd; \
rm /etc/update-motd.d/*; \
run-parts /etc/update-motd.d' 
```
details: https://fishi.devtail.io/weblog/2015/02/06/dyamic-login-messages-update-motd/  

optional `/etc/update-motd.d/00-sysinfo` banner  
https://gist.github.com/fishi0x01/417de50e68d4b8d0f6f1#file-sys-info-sh  
`sudo wget -O /etc/update-motd.d/00-sysinfo https://raw.githubusercontent.com/neaxi/atthackbrno/master/octorack/00-sysinfo`

### modify welcome script to show interface + ip and remove extra chitchat
`/home/pi/scripts/welcome`  
`wget -O /home/pi/scripts/welcome https://raw.githubusercontent.com/neaxi/atthackbrno/master/octorack/welcome`

### .bashrc mods
`wget -O /home/pi/.bashrc https://raw.githubusercontent.com/neaxi/atthackbrno/master/octorack/.bashrc`
- aliases
- extend history
- ensure color prompt  
 
### optional install 
 - [*The Fuck*](https://github.com/nvbn/thefuck#installation)
 - `apt install tmux mc`


## increase i2c speed
https://learn.adafruit.com/monochrome-oled-breakouts/python-setup
- `sudo nano /boot/config.txt`
- find hardware interfaces / dtparam section and add following:  
 `dtparam=i2c_baudrate=1000000`


## HDMI touchscreen
`sudo /home/pi/scripts/install-desktop`  
`sudo raspi-config` ...  `-> system -> boot -> autologin desktop`  

setup browser in [kiosk mode](https://blog.deepgram.com/chromium-kiosk-pi/)  
`sudo nano /etc/xdg/lxsession/LXDE-pi/autostart`



configure LCD in `/boot/config.txt`
```bash
disable_overscan=1

overscan_left=40
overscan_right=-40
overscan_top=0
overscan_bottom=0

framebuffer_width=1024
framebuffer_height=600

hdmi_group=1
hdmi_mode=4
```
___
# **#02 - Configuration involving OctoPrint**
## Python3
Make sure your Octoprint instance is running on Python3. If not, update it. If it is and the script is executed, it'll announce the virtual env is on Python3 already.  
https://octoprint.org/blog/2020/09/10/upgrade-to-py3/  
`curl -L https://get.octoprint.org/py3/upgrade.py --output upgrade.py`  
`python3 upgrade.py`

## 1st launch
`Next > No backup > usr:pwd > Disable tracking > Enable check > Enable blacklist`  
Printer profiles: https://community.octoprint.org/t/known-printer-profiles-for-octoprint/3032  
MK2 & MK3: 250 x 210 x 210, 6000 (X, Y), 200 (Z), 300 (E)  
**!!!** MMU: Extruders: 5, Shared nozzle

Update to latest:
`Settings > Software Update > Update all`


## plugins
 - Astroprint
   - set astroprint API token
 - Bed level visualizer (jneilliii)
   - `apt install libatlas3-base` for [py3 silent install fail](https://github.com/jneilliii/OctoPrint-BedLevelVisualizer#known-issues)
 - DisplayLayerProgress
 - Octolapse
 - OctoRant
   - set up discord bot hooks
 - Printer Statistics
 - Themeify
 - TouchUI
 - WebcamTab




### webcam / octolapse setup
Resoltuion guides for CSI camera: https://picamera.readthedocs.io/en/latest/fov.html#sensor-modes  
Omit FPS `-f` parameter if you're getting poor resolution/low color space.  
`sudo nano /boot/octopi.txt`  
USB webcam:
```bash
camera="auto"
camera_usb_options="-r 1920x1080 -q 80 -rot 180"
```

CSI webcam. In case it's not being detected, change to `camera="auto"`
```bash
camera="raspi"
camera_raspi_options="-r 1920x1080 -q 80 -rot 180"  
```

If webcam image quality issues prevails, create a systemd service which resetes the webcamd service after the platform boots. Guide: https://www.golinuxcloud.com/run-script-after-n-minutes-of-boot-systemd/
```bash
# cat /etc/systemd/system/reset_webcamd_after_boot.timer
[Unit]
Description="Reset webcamd 1 min after startup"

[Timer]
OnBootSec=1min

[Install]
WantedBy=default.target

# cat /etc/systemd/system/reset_webcamd_after_boot.service
[Unit]
Description="Reset webcamd 1 min after startup"

[Service]
Type=oneshot
ExecStart=systemctl restart webcamd.service

# sudo systemctl disable reset_webcamd_after_boot.service
# sudo systemctl enable reset_webcamd_after_boot.timer
# systemctl status reset_webcamd_after_boot.timer
```
Profile has to be created:  
`OctoPrint > Settings > Octolapse > Printer > Add Profile > Import Printer`

### Triggers & Stabilization
`OctoPrint > Settings > Octolapse > Stabilization` 

### Bitrates:
[Recommended upload encoding settings](https://support.google.com/youtube/answer/1722171?hl=en)  
`OctoPrint > Settings > Octolapse > Rendering > Edit profile > Customize: Enabled > Quality > Bitrate`

|   SDR   | 24-30 fps | 48-60 fps |
|:-------:|:---------:|:---------:|
|  1080p  |   8 Mbps  |  12 Mbps  |
|   720p  |   5 Mbps  |  7.5 Mbps |
|         |           |           |
| **HDR** |           |           |
|  1080p  |  10 Mbps  |  **15 Mbps**  |
|   720p  |  6.5 Mbps |  9.5 Mbps |

### Timelapse text overlay
`OctoPrint > Settings > Octolapse > Rendering > Edit profile > Customize: Enabled > Overlay`  
- text: `{time_elapsed} - {snapshot_number}`
- size: 30 pt
- font: `DejaVuSansMono-Bold.ttf`

### timelapse flashdrive
https://www.raspberrypi.org/forums/viewtopic.php?t=205016
1. format flashdrive to FAT32 and assign it a label; e.g. OCTOMK2 
2. insert drive to RasPi USB
3. `sudo mkdir /media/timelapse_flash`
4. `sudo chown -R pi:pi /media/timelapse_flash`
5. `sudo chmod -R 775 /media/timelapse_flash`
6. `sudo nano /etc/fstab`
7. Find flash drive UUID in `blkid`
7. add mountpoint with known UUID  
`LABEL=XXXX-YYYY  /media/timelapse_flash  vfat    defaults,nofail,uid=pi,gid=pi,rw,x-systemd.automount 0       0`
8. `sudo mount -a`
9. `ls -l /media/timelapse_flash/`
10. `rm -rf /media/timelapse_flash/*`

`OctoPrint > Settings > Folders > Timelapse Folders`  
`OctoPrint > Settings > Plugins > OctoLapse > Main > Edit main > Folders`


### tmp folder
```
ls -l /media/timelapse_flash/
mkdir /media/timelapse_flash/tmp
```
`OctoPrint > Settings > Folders > Timelapse Folders`  
`OctoPrint > Settings > Plugins > OctoLapse > Main > Edit main > Folders`

Replacing a folder with a tmpfs filesystem is discouraged due to fact the Pi3 is limited by 1 GiB RAM and therefore tmpfs would like sufficient storage space during longer prints.

___
# **#03 - Possible additional HW**
 - [custom OLED](custom_OLED.md)
 - [safe shutdown button](safe_shutdown.py)
   - `wget -O /home/pi/scripts/safe_shutdown.py https://raw.githubusercontent.com/neaxi/atthackbrno/master/octorack/safe_shutdown.py`
 - https://github.com/sethvoltz/OctoPrint-DisplayPanel

## script auto startup
add the following into `/etc/rc.local` as needed
```bash
exec 2> /tmp/rc.local.log      # send stderr from rc.local to a log file
exec 1>&2                      # send stdout to the same log file
set -x                         # tell sh to display commands before execution

# starting OLED script
# -u = unbuffered stderr and stdout, so the output 
# from scripts is written to a logfile immediately
python3 -u /home/pi/scripts/oled_status/prod/statusDisplay.py &
python3 -u /home/pi/scripts/safe_shutdown.py &
```
___
# #04 - Checklist
- `pi` and `root` passwords changed
- hotspot password set (if installed)
- static IPs for ethernet and hotspot fallback set
- Octoprint credentials changed
- Octoprint plugins configured
- API keys provided where needed (custom script, astroprint, octorant)
___
# #05 - Optional

##  Home Assistant integration
[RPi Reporter MQTT2HA Daemon](https://github.com/ironsheep/RPi-Reporter-MQTT2HA-Daemon)  
Change `interval_in_minutes` to 1 minute.   
[custom Lovelace dashboard card](https://github.com/ironsheep/lovelace-rpi-monitor-card)

___

## fallback AP setup
Utilize hotspot installer:  
https://www.raspberryconnect.com/projects/65-raspberrypi-hotspot-accesspoints/183-raspberry-pi-automatic-hotspot-and-static-hotspot-installer  
```sh
curl "https://www.raspberryconnect.com/images/hsinstaller/AutoHotspot-Setup.tar.gz" -o AutoHotspot-Setup.tar.gz
tar -xzvf AutoHotspot-Setup.tar.gz
cd Autohotspot
sudo ./autohotspot-setup.sh
```
- opt1 - Install autohotspot  
- opt5 - change target SSID and password  
- opt7 - change AP SSID and password   

If you wish to change the default RasPi AP IP (`192.165.50.5`), do so in `/usr/bin/autohotspotN`.  
e.g.: `sudo sed -i 's/192.168.50.5/192.168.69.1/' /usr/bin/autohotspotN`.  
Related DHCP ip range is set in `/etc/dnsmasq.conf`    
```bash
cd; awk '!/dhcp-range/' /etc/dnsmasq.conf | awk NF > temp_dnsmasq
echo -e "dhcp-range=192.168.69.150,192.168.69.200,12h\n" >> temp_dnsmasq
sudo mv temp_dnsmasq /etc/dnsmasq.conf
```

- [issues with newlines and special chars](https://gist.github.com/neaxi/cbd68f9de00efb9ce1c5145d875de163) are already resolved
- reboot   
- opt6 - Force hotspot to activate and test  
  - **!!will cause connection drop for a headless wifi setup**
  - `sudo /home/pi/Autohotspot/autohotspot-setup.sh`  

___
# #06 - touch LCD

## Setting up the LCD
https://wiki.ubuntu.com/X/InputCoordinateTransformation
1. rotation  
    `$ cat /boot/config.txt`  
    `display_rotate=3`
2. calibration  
    https://raspberrypi.stackexchange.com/questions/60872/inverted-gpio-touchscreen-using-99-calibration-conf

example: https://gist.github.com/neaxi/9425f1b5ff99eacfba08fa9ce70f1544

## Launch the webpage/UI after reboot

1. `apt install epiphany-browser`
2. open it and:
   - manually navigate to `http://127.0.0.1`
   - log into the octoprint and check "Remember me" for autologin
3. create a launcher:
   - no need to specify a webpage. Epiphany will resume with the last opened tab -> the one manually opened in #2
   - `/home/pi/browser_launch.sh`
   ```sh
     #!/bin/bash
     sleep 60 # give some time for OPrint to boot
     # Launch Epiphany browser and wait for it to open
     epiphany-browser --display=:0 &
     ```
4. add to autostart. make sure LXDE panels/UI is launched too  
    LXDE autostart - `/etc/xdg/lxsession/LXDE/autostart`   
    user autostart - `~/.config/lxsession/LXDE-pi/autostart`
    ```sh
    @lxpanel --profile LXDE-pi
    @pcmanfm --desktop --profile LXDE-pi
    @xscreensaver -no-splash
    @xset s off
    @xset s noblank
    @/home/pi/browser_launch.sh
    ```

___
# #07 - Possible TODO
 - additional button to bounce wifi
   - in case the raspi networking ends up in undefined state, seems to be connected, but can't be pinged
   - bounce all available network interfaces?
 - delayed start of the fallback AP service
   - to give wlan0 enough time to connect on it's own after power up prior intervening with fallback 
