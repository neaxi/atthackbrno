"""
## WHAT

the goal is to have an addressable LED strip showing remaining time to speakers and to judges

## OPERATION

the countdown starts at `COUNTDOWN_TIME` or whatever is supplied on the terminal as `GOOD` (green)
as the remaining time decrements, LED segments of the strip should be turning ti `EXPIRING` (red)
total number of LEDs must be provided in `NUM_LEDS`

when stopped, 1 button click to start countdown
when running, 2 button clicks to restart

## SETUP:

powered via 5V/12V (based on the strip - WS2812?). the ESP has own step-down convertor
make sure to connect a button, not a switch
"""

import machine
import neopixel
import time

from tm1637 import TM1637

# Configuration constants
LED_PIN = 5  # GPIO pin connected to the LED strip
BUTTON_PIN = 13  # GPIO pin connected to the button
NUM_LEDS = 20  # Length of the LED strip (adjust for 30, 60, 100 LEDs, etc.)
COUNTDOWN_TIME = 180  # Countdown time in seconds
LED_UPDATE_INTERVAL = (
    COUNTDOWN_TIME / NUM_LEDS
)  # Time interval for each LED to turn off

# Initialize the NeoPixel strip
np = neopixel.NeoPixel(machine.Pin(LED_PIN), NUM_LEDS)

# Button setup
button = machine.Pin(BUTTON_PIN, machine.Pin.IN, machine.Pin.PULL_UP)


# display
lcd = TM1637(machine.Pin(14), machine.Pin(12))
lcd.brightness(7)

# Globals for state tracking
countdown_running = False
seconds_left = COUNTDOWN_TIME
button_pressed_time = 0
click_count = 0

# colors .. RBG not RGB with this strip!
STANDBY = (0, 255, 0)
GOOD = (0, 0, 255)
EXPIRING = (255, 0, 0)
CLEAR = (0, 0, 0)
BLINK_DELAY = 0.5

# Timer for countdown
timer = machine.Timer(-1)


def set_whole_strip(color):
    """All LEDs to specific color."""
    for i in range(NUM_LEDS):
        np[i] = color
    np.write()
    print(f"LED strip set to {color}.")


def blink_all():
    print("blinking")
    for _ in range(4):
        set_whole_strip(CLEAR)
        time.sleep(BLINK_DELAY)
        set_whole_strip(EXPIRING)
        time.sleep(BLINK_DELAY)


def update_leds():
    """Update the LED strip to show the current countdown state."""

    active_leds = int((seconds_left / COUNTDOWN_TIME) * NUM_LEDS)
    # print(leds_to_turn_off)
    for i in range(NUM_LEDS):
        if i >= active_leds:
            np[i] = EXPIRING  # Red for turned-off LEDs
        else:
            np[i] = GOOD  # Green for active LEDs
    np.write()
    print(f"LEDs updated: {seconds_left} seconds left ({active_leds} LEDs active).")


def countdown_callback(timer):
    """Callback function for the countdown timer."""
    global seconds_left, countdown_running

    if seconds_left > 0:
        seconds_left -= 1
        update_leds()
        lcd.number(seconds_left)
    else:
        countdown_running = False
        lcd.number(COUNTDOWN_TIME)
        timer.deinit()  # Stop the timer
        print("Countdown complete!")
        blink_all()
        set_whole_strip(STANDBY)


def reset_countdown():
    """Reset and clear the countdown."""
    global countdown_running, seconds_left
    print("Stopping and resetting countdown.")
    timer.deinit()
    countdown_running = False
    seconds_left = COUNTDOWN_TIME
    set_whole_strip(STANDBY)


def button_handler(pin):
    """Interrupt handler for the button."""
    global countdown_running, button_pressed_time, click_count

    current_time = time.ticks_ms()
    # Debounce check: Ignore button presses occurring within 300ms of each other
    if time.ticks_diff(current_time, button_pressed_time) < 300:
        return
    button_pressed_time = current_time

    click_count += 1  # Track button presses

    def process_clicks():
        global click_count
        if click_count == 1:
            if not countdown_running:
                # Single click starts the countdown
                print("countdown not running + single click detected")
                start_countdown()
        elif click_count == 2:
            # Double click stops and resets the countdown
            print("double click detected")
            lcd.number(COUNTDOWN_TIME)
            reset_countdown()
        click_count = 0  # Reset click count after processing

    # Schedule click processing after a short delay to distinguish single and double clicks
    machine.Timer(-1).init(
        period=400, mode=machine.Timer.ONE_SHOT, callback=lambda t: process_clicks()
    )


def start_countdown(total_time=COUNTDOWN_TIME):
    """Start the countdown."""
    global countdown_running, seconds_left
    global COUNTDOWN_TIME
    COUNTDOWN_TIME = total_time

    if not countdown_running:
        print("Starting countdown. (counter not running + single click)")
        set_whole_strip(GOOD)

        countdown_running = True
        seconds_left = total_time
        update_leds()
        timer.init(
            period=1000, mode=machine.Timer.PERIODIC, callback=countdown_callback
        )


button.irq(trigger=machine.Pin.IRQ_FALLING, handler=button_handler)
if __name__ == "__main__":
    while True:
        print("\n" * 3)
        set_whole_strip(STANDBY)
        print("System ready. Press the button to start the countdown.")
        print("or provide the countdown here:")
        sec = input("Seconds to countdown: ")
        try:
            start_countdown(int(sec))
            time.sleep(
                COUNTDOWN_TIME + 5 * BLINK_DELAY
            )  # don't return prompt while the async is running
        except:
            print("lol, you don't know what a number is")
