
# OLED LCD 
## OLED python setup
https://navody.arduino-shop.cz/navody-k-produktum/raspberry-pi-i2c-oled-displej-ssd1306.html
```bash
sudo apt install i2c-tools 
i2cdetect -y 1   (possible 0x3c)

# following has to be installed as root in order to have the libraries available through rc.local
sudo su
pip3 install pillow oled_text adafruit-blinka busio
```

FONTS: https://fontawesome.com/cheatsheet/free/solid  
LAYOUTS: https://bitbucket.org/bachi76/oled-ssd1306-text/src/master/oled_text/Layout32.py  
src oled: https://bitbucket.org/bachi76/oled-ssd1306-text/src/master/oled_text/__init__.py  
src adaf: https://github.com/adafruit/Adafruit_Python_SSD1306/blob/master/Adafruit_SSD1306/SSD1306.py  


## API setup 
https://docs.octoprint.org/en/master/api/general.html  
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
