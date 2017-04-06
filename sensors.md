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
Sensor Types
A - analog<BR>
D - digital<BR>
A/D - analog which works also as a digital with expected limitations

Stuttgart university Git: https://github.com/timwaizenegger/raspberrypi-examples  <BR>
More resources on the sensors: <BR>
https://tkkrlab.nl/wiki/Arduino_37_sensors <BR>
http://linksprite.com/wiki/index.php5?title=Advanced_Sensors_Kit_for_Arduino <BR>


