# ESP32

## IDEs
### pymakr
https://github.com/pycom/Pymakr
### VSCode and Atom plugins
https://docs.pycom.io/pymakr/installation/

## Generic ESP32 - MicroPython
<https://github.com/neaxi/upy_workshop>

## ESP32 T-Display by LILIGO
________________________________________________
You can find firmwares here <https://github.com/loboris/MicroPython_ESP32_psRAM_LoBo/wiki/firmwares>, download a .zip file and use the flash.sh script to flash the firmware.

Documentation for the LoBo MicroPython firmware: <https://github.com/loboris/MicroPython_ESP32_psRAM_LoBo/wiki>  
(Display module API documentation: <https://github.com/loboris/MicroPython_ESP32_psRAM_LoBo/wiki/display>)  
Code snipet for writing things to display with MicroPython:
```py
import display

tft = display.TFT() 
tft.init(tft.ST7789, bgr=False, rot=tft.LANDSCAPE, miso=17, backl_pin=4, backl_on=1, mosi=19, clk=18, cs=5, dc=16)
tft.setwin(40, 52, 320, 240)
for i in range(0, 241):
    color = 0xFFFFFF - tft.hsb2rgb(i / 241 * 360, 1, 1)
    tft.line(i, 0, i, 135, color)
tft.set_fg(0x000000)
tft.ellipse(120, 67, 120, 67)
tft.line(0, 0, 240, 135)
text = "Welcome to AT&T hackathon"
tft.text(120 - int(tft.textWidth(text) / 2),
         67 - int(tft.fontSize()[1] / 2),
         text, 0xFFFFFF)
```
Connecting to WiFi:
```py
import network
# enable station interface and connect to WiFi access point
nic = network.WLAN(network.STA_IF)
nic.active(True)
nic.connect('your-ssid', 'your-key')
```

## Pycom
________________
Homepage: https://pycom.io/ \
Full documentation: https://docs.pycom.io/

To get USB connectivity insert a LoPy4 board into any of the expansion boards.<BR>

### LoPy4
ESP32 based platform supporting MicroPython\
Connectivity: LoRa, Sigfox, WiFi, Bluetooth\
docs: https://docs.pycom.io/product-info-datasheets/development/lopy4

### Pytrack
Sensors: Navstar GPS, Glonass, Galileo, QZSS, accelerometer\
docs: https://docs.pycom.io/product-info-datasheets/boards/pytrack

### Pysense
Sensors: light, barometric pressure, humidity, accelerometer, temperature\
On-board: LiPo charger, MicroSD compatible\
docs: https://docs.pycom.io/product-info-datasheets/boards/pysense

### Expansion board
Added status LEDs, jumper connectors, button to enter 'Safe mode', ...\
docs: https://docs.pycom.io/product-info-datasheets/boards/expansion3

