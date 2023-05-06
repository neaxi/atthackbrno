#!/usr/bin/env python3

# Sample of shutdown button using GPIO and interrupts
# https://raspi.tv/2013/how-to-use-interrupts-with-python-on-the-raspberry-pi-and-rpi-gpio-part-3

# run following to ensure libraries are available
# sudo apt-get install python3-dev python3-rpi.gpio

import RPi.GPIO as GPIO  
import os
from time import sleep
GPIO.setmode(GPIO.BCM)  

# GPIO 14 used for the button connection
PIN_PWR_BUTTON = 14

# init the button pin
GPIO.setup(PIN_PWR_BUTTON, GPIO.IN, pull_up_down=GPIO.PUD_UP)  


def shutdown_routine(channel):  
    sleep(0.5)
    print('falling edge detected on GPIO ' + str(PIN_PWR_BUTTON))
    if GPIO.input(PIN_PWR_BUTTON) == GPIO.LOW:
        print('PWR button pushed. Waiting 5 sec to confirm')
        for i in range(5, 0, -1):
            print('Shutdown countdown: ' + str(i))
            sleep(1)
            if GPIO.input(PIN_PWR_BUTTON) == GPIO.HIGH:
                print('Shutdown countdown: ABORTED - Button released.')
                return
        if GPIO.input(PIN_PWR_BUTTON) == GPIO.LOW:
            ''' killing OLED display contoller
            
            !!! SIGINT WONT WORK to simulate Ctrl^C to trigger Class destructor in order to show the exit message
            https://unix.stackexchange.com/questions/239519/how-can-i-kill-a-program-started-from-rc-local-when-ctrl-c-doesnt-work
            If you start the program from rc.local, then you cannot login to a shell and type ctrl-c to stop it. 
            The reason is that the program was not started from the shell that you're logged into.
            
            Therefore proper handling of SIGTERM and SIGHUP is needed within the script through signal handlers.
            '''
            os.system('pkill -SIGTERM -f statusDisplay')

            print('Shutdown countdown: Confirmed! Shutting down.')
            os.system('shutdown now -h')
            



print('Monitoring PWR button push.')
# https://sourceforge.net/p/raspberry-gpio-python/wiki/Inputs/
GPIO.add_event_detect(PIN_PWR_BUTTON, GPIO.FALLING, callback=shutdown_routine, bouncetime=500)  

while True:
    # lets wait and sleep
    # https://stackoverflow.com/questions/17075788/python-is-time-sleepn-cpu-intensive
    sleep(99999)

