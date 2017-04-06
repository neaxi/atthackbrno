Python focused

# RC522 - RFID reader
https://github.com/ondryaso/pi-rc522
Connected by the table, git clone/pip install, executed the samples, works.<BR>
Can read/write the chips - check git examples.

# MPU-6050 - Gyro and accelerometer
http://blog.bitify.co.uk/2013/11/interfacing-raspberry-pi-and-mpu-6050.html <BR>
http://blog.bitify.co.uk/2013/11/reading-data-from-mpu-6050-on-raspberry.html <BR>
Check on which i2c bus is the sensor present. Should be 0 for old RasPi and 1 for newer models. 
Modify your source code accordingly to use correct bus.<BR>
`i2cdetect -y 01`

# SenseHAT
Python library is already present.<BR>
Complete API reference: https://pythonhosted.org/sense-hat/api/ <BR>
Tutorials: https://www.raspberrypi.org/learning/getting-started-with-the-sense-hat/

# Sensor kit
## Sensors types
A - analog<BR>
D - digital<BR>
A/D - analog which works also as a digital with expected limitations

Most of the sensors are digital input output and will work with basic GPIO.
**Simple output pin**
`GPIO.setmode(GPIO.BOARD)    # OR GPIO.BCM<BR>
usedPin = 37                # pin 37 = BCM GPIO26<BR>
GPIO.setup(usedPin , GPIO.OUT)<BR>
GPIO.output(usedPin , GPIO.HIGH)<BR>
GPIO.output(usedPin , GPIO.LOW)`

**Simple input pin**
`GPIO.setmode(GPIO.BOARD)    # OR GPIO.BCM<BR>
usedPin = 37                # pin 37 = BCM GPIO26<BR>
GPIO.setup(usedPin , GPIO.IN, pull_up_down=GPIO.PUD_UP) <BR>
GPIO.input(usedPin) `


## Additional resources & code examples
Stuttgart university Git: https://github.com/timwaizenegger/raspberrypi-examples  <BR>
More resources on the sensors: <BR>
https://tkkrlab.nl/wiki/Arduino_37_sensors <BR>
http://linksprite.com/wiki/index.php5?title=Advanced_Sensors_Kit_for_Arduino <BR>

## Overview and notes
| No. | Type | Sensor | Notes
| --- | --- | --- | ----
| KY001| digital| Temp module| https://tkkrlab.nl/wiki/Arduino_KY-001_Temperature_sensor_module
| KY002| digital| Vibration sensor| 
| KY003| analog| Hall sensor| 
| KY004| digital| Button| Connects S and (-) pins when pressed. <BR> (+) pin is not connected. <BR> Remember to set pin as pull-up.
| KY005| digital| IR transmitter| Only (s) and (-) pins connected. Use resistor! <BR> For use with IR receiver, you have to generate proper frequency
| KY006| analog/digital| buzzer| (without label)-creates tones, you have to create frequency output on a pin
| KY008| digital| laser diode| Only (-) and (signal) pins connected.  <BR> Use current limiting resistor!
| KY009| analog/digital| RGB SMD LED diode| WARNING: needs resistors! <BR> Attention: pins GREEN and RED swapped
| KY010| digital| Optical end stop| Gives HIGH, when something blocks the light
| KY011| digital| 2-color LED| (-) pin is common ground (cathode)
| KY012| analog/digital| active buzzer| (it's with white sticker) - creates sound when connected to power
| KY013| analog| temp module| 
| KY015| digital| DHT11| https://github.com/szazo/DHT11_Python
| KY016| analog/digital| RGB LED diode| WARNING: this is Common Anode diode, so pin (-) is to be connected with + voltage, diode is lit when LOW is put onto pin <BR> Attenion: pins BLUE and RED swapped
| KY017| digital| Mercury tilt switch| Digital input. + pin not connected
| KY018| analog| Photoresistor| Analog measurement of light intensity, changes resistance. Measure resistance and design voltage divider
| KY019| digital| 5V relay| (+) and (-) have to be connected, when S is pull up
| KY020| digital| Tilt switch| 
| KY021| digital| Mini reed relay| 
| KY022| digital| IR receiver| http://ozzmaker.com/how-to-control-the-gpio-on-a-raspberry-pi-with-an-ir-remote/
| KY023| analog| 2 axis joystick| 
| KY024| digital| Hall sensor| Digital, compares field to preset level
| KY025| digital| Reed relay| 
| KY026| digital| Flame sensor| 
| KY027| digital| LED + mercury tilt| LED can be driven from controller or by tilt of sensor.
| KY028| digital| Temp module| 
| KY029| digital| 2-color LED| (-) pin is common ground (cathode)
| KY031| digital| Knock sensor| 
| KY032| digital| Obstacle avoidance| WARNING: EN pin connected directly to GND <BR> No need to connect EN pin
| KY033| digital| Tracking / Line following sensor| Digital comparator, LM393
| KY034| digital| Random flashing LED| 
| KY035| analog| Hall sensor| Analog, gives approx 0,8-2,5 V according to magnetic field
| KY036| digital| Metal touch sensor| 
| KY037| digital| Sensitive microphone| Compares level of sound with level set by potentiometer, output low when sound is louder. Analog output present
| KY038| digital| microphone| Same as above
| KY039| analog| heartbeat sensor| 
| KY040| digital| Rotary encoder| Technical details: http://guy.carpenter.id.au/gaugette/2013/01/14/rotary-encoder-library-for-the-raspberry-pi/ <BR> How to connect + source: http://www.stuffaboutcode.com/2015/05/raspberry-pi-and-ky040-rotary-encoder.html

