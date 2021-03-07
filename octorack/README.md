# init
- download octopi
- https://github.com/neaxi/atthackbrno/blob/master/raspberry_image_prep.md
  - #2, #3, #4, #5, #6 (pi:raspberry), #7, #8, #9, #11.2, #13
- IPv6 disable - https://cwesystems.com/?p=231


# passwords / config
pi:$(pipwd)  
root:$(rootpwd)  

AP:   
OctoMKX:$(appwd)  
IP: 192.168.69.1  

Ethernet fallback access   
IP: 192.168.99.10   



## change hostname 
`sudo raspi-config`

## MOTD
`/etc/motd`  
https://fishi.devtail.io/weblog/2015/02/06/dyamic-login-messages-update-motd/  
```bash
/etc/update-motd.d/00-sysinfo
sudo run-parts /etc/update-motd.d
```


## modify welcome script to show interface + ip and remove bullshit
`/home/pi/scripts/welcome`
```bash
#        echo "    $ip"
         echo -e  "$(ifconfig | grep -B 1 $ip | head -n 1 | awk '{print $1}' FS=':'): \t$ip"
```



# webcam setup
`/boot/octopi.txt`
```
camera="auto"
camera_usb_options="-r 1920x1080 -f 30"
```
## Bitrates:
[Recommended upload encoding settings](https://support.google.com/youtube/answer/1722171?hl=en)  

`OctoPrint > Settings > Octolapse > Rendering > Edit profile > Customize: Enabled > Quality > Bitrate`

|   SDR   | 24-30 fps | 48-60 fps |   |   |
|:-------:|:---------:|:---------:|:-:|:-:|
|  1080p  |   8 Mbps  |  12 Mbps  |   |   |
|   720p  |   5 Mbps  |  7.5 Mbps |   |   |
|         |           |           |   |   |
| **HDR** |           |           |   |   |
|  1080p  |  10 Mbps  |  15 Mbps  |   |   |
|   720p  |  6.5 Mbps |  9.5 Mbps |   |   |


# MMU2 Printer profile
```
OctoPrint > Settings > Printer Profiles > MMU2 > Edit > Hotend & extruder:
Number of extruders: 5
Shared nozzle: True
```

# fallback AP setup
Utilize hotspot installer: https://www.raspberryconnect.com/projects/65-raspberrypi-hotspot-accesspoints/183-raspberry-pi-automatic-hotspot-and-static-hotspot-installer  
```sh
curl "https://www.raspberryconnect.com/images/hsinstaller/AutoHotspot-Setup.tar.gz" -o AutoHotspot-Setup.tar.gz
tar -xzvf AutoHotspot-Setup.tar.gz
cd Autohotspot
sudo ./autohotspot-setup.sh
```

opt5 - change target SSID and password  
opt7 - change AP SSID and password  
opt1 - Install autohotspot  
x - reboot   
x - modify the script to prevent outlined issues - https://gist.github.com/neaxi/cbd68f9de00efb9ce1c5145d875de163   
x - if you wish to change RasPi AP IP, do so in `/usr/bin/autohotspot[N]`  
opt6 - Force hotspot to activate and test  










# timelapse flash
https://www.raspberrypi.org/forums/viewtopic.php?t=205016
```bash
sudo mkdir /media/timelapse_flash
sudo chown -R pi:pi /media/timelapse_flash
sudo chmod -R 775 /media/timelapse_flash
find UUID: blkid
sudo nano /etc/fstab
UUID=7226-23CC  /media/timelapse_flash  vfat    defaults,nofail,uid=pi,gid=pi,rw,x-systemd.automount 0       0
sudo mount -a
ls -l /media/timelapse_flash/
```
`OctoPrint > Settings > Folders > Timelapse Folders`  
`OctoPrint > Settings > Plugins > OctoLapse > Main > Edit main > Folders`


# tmpfs setup
OctoLapse needs ~300MB space even for 2cm prints (0.1mm layer, snapshot on layer change = 200 snaps). The snapshots will fit just fine, but the final rendering requires more disk space.  
As the Pi3 has 1 GiB RAM, it's not possible to have tmpfs large enough for longer print/larger timelapse rendering.  
**Tmpfs approach is therefore discouraged** and replaced with tmp folder on persistent flash drive.

```
ls -l /media/timelapse_flash/
mkdir /media/timelapse_flash/tmp
```

`OctoPrint > Settings > Folders > Timelapse Folders`  
`OctoPrint > Settings > Plugins > OctoLapse > Main > Edit main > Folders`

~temp folder would be for the screenshots, and the timelapse folder for the actual video files.  
temp folder must have at least couple hundreds MBs
https://www.domoticz.com/wiki/Setting_up_a_RAM_drive_on_Raspberry_Pi~
```bash
# sudo mkdir /media/timelapse_tmpfs
# sudo nano /etc/fstab
# tmpfs   /media/timelapse_tmpfs   tmpfs   nodev,nosuid,size=300M   0       0
```

# plugins
 - Astroprint
   - $(astroapi)
 - Bed visualizer (jneilliii)
   - `apt install libatlas3-base` for [py3 silent install fail](https://github.com/jneilliii/OctoPrint-BedLevelVisualizer#known-issues)
 - DisplayLayerProgress
 - Octolapse
 - OctoRant
   - https://discord.com/api/webhooks/760936182640148560/hNLYF2UJxHhrUirh8feeEwL0IfOj30KHByAfbQS_xGf3QIb1i8q9ks8MddhYt4uvs16L
 - Printer Stats
 - Themeify
 - TouchUI
 - Webcam Tab
 
 
# OLED LCD 
## OLED python setup
https://navody.arduino-shop.cz/navody-k-produktum/raspberry-pi-i2c-oled-displej-ssd1306.html
```bash
sudo apt install i2c-tools
i2cdetect -y 1   (possible 0x3c)

# following has to be installed as root in order to have the libraries available through rc.local
sudo su
pip3 install pillow oled_text adafruit-blinka
```

FONTS: https://fontawesome.com/cheatsheet/free/solid  
LAYOUTS: https://bitbucket.org/bachi76/oled-ssd1306-text/src/master/oled_text/Layout32.py  
src oled: https://bitbucket.org/bachi76/oled-ssd1306-text/src/master/oled_text/__init__.py  
src adaf: https://github.com/adafruit/Adafruit_Python_SSD1306/blob/master/Adafruit_SSD1306/SSD1306.py  

## increase i2c speed
https://learn.adafruit.com/monochrome-oled-breakouts/python-setup
```bash
sudo nano /boot/config
dtparam=i2c_baudrate=1000000
```
## API setup https://docs.octoprint.org/en/master/api/general.html
`Settings > API > Enable CORS`
 
create read only user with own API key to be used within the script  
Application keys plugin is bundled with the OctoPrint  
Click on the `user in top right corner > user setting > Application keys > Generate`  
python_oled: $(APIKEY)  


### API samples
```json
# curl -k -H "X-Api-Key: $(APIKEY)" "http://192.168.1.152/api/connection"
{
	"current": {
		"baudrate": 115200,
		"port": "/dev/ttyACM0",
		"printerProfile": "_default",
		"state": "Printing"
	},
	"options": {
		"baudratePreference": null,
		"baudrates": [250000, 230400, 115200, 57600, 38400, 19200, 9600],
		"portPreference": null,
		"ports": ["/dev/ttyACM0"],
		"printerProfilePreference": "_default",
		"printerProfiles": [{
			"id": "_default",
			"name": "MK3 MMU2"
		}, {
			"id": "mk2s",
			"name": "MK2S"
		}]
	}
}
```

```json
# curl -k -H "X-Api-Key: $(APIKEY)" "http://192.168.1.152/api/job"
{
	"job": {
		"averagePrintTime": null,
		"estimatedPrintTime": 970.5524787902941,
		"filament": {
			"tool0": {
				"length": 1100.275339999984,
				"volume": 2.646472333256689
			}
		},
		"file": {
			"date": 1601876339,
			"display": "tiskarn-o-rack (5)_0.2mm_PLA_MK3MMU2_23m.gcode",
			"name": "tiskarn-o-rack_(5)_0.2mm_PLA_MK3MMU2_23m.gcode",
			"origin": "local",
			"path": "tiskarn-o-rack_(5)_0.2mm_PLA_MK3MMU2_23m.gcode",
			"size": 595254
		},
		"lastPrintTime": null,
		"user": "_api"
	},
	"progress": {
		"completion": 8.942233063532543,
		"filepos": 53229,
		"printTime": 402,
		"printTimeLeft": 4214,
		"printTimeLeftOrigin": "linear"
	},
	"state": "Printing"
}
```

```json
# curl -k -H "X-Api-Key: $(APIKEY)" "http://192.168.1.152/api/printer"
{
	"sd": {
		"ready": true
	},
	"state": {
		"flags": {
			"cancelling": false,
			"closedOrError": false,
			"error": false,
			"finishing": false,
			"operational": true,
			"paused": false,
			"pausing": false,
			"printing": true,
			"ready": false,
			"resuming": false,
			"sdReady": true
		},
		"text": "Printing"
	},
	"temperature": {
		"bed": {
			"actual": 59.8,
			"offset": 0,
			"target": 60.0
		},
		"tool0": {
			"actual": 210.0,
			"offset": 0,
			"target": 210.0
		}
	}
}
```

```json
# curl -k -H "X-Api-Key: $(APIKEY)" "http://192.168.1.152/plugin/DisplayLayerProgress/values"
{
	"fanSpeed": "-",
	"feedrate": "-",
	"feedrateG0": "-",
	"feedrateG1": "-",
	"height": {
		"current": "-",
		"currentFormatted": "-",
		"total": "-",
		"totalFormatted": "-"
	},
	"layer": {
		"averageLayerDuration": "-",
		"averageLayerDurationInSeconds": "-",
		"current": "-",
		"lastLayerDuration": "-",
		"lastLayerDurationInSeconds": "-",
		"total": "-"
	},
	"print": {
		"changeFilamentCount": 0,
		"changeFilamentTimeLeft": "-",
		"changeFilamentTimeLeftInSeconds": 0,
		"estimatedChangedFilamentTime": "-",
		"estimatedEndTime": "-",
		"progress": "0",
		"timeLeft": "-",
		"timeLeftInSeconds": "-"
	}
}
```

## add the script to auto startup
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



# TODO
 - additional button to bounce wifi
   - in case the raspi networking ends up in undefined state, seems to be connected, but can't be pinged
   - bounce all available network interfaces
 - delayed start of the fallback AP service
   - to give wlan0 enough time to connect on it's own after power up prior intervening with fallback 
