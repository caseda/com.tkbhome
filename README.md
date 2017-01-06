# TKB Home
This app adds support for TKB Home devices in Homey.

## Supported devices:
+ TSM02 - 4-in-1 Multi Sensor
+ TSP01 - 3-in-1 Multi Sensor
+ TZ35 - Single & Dual Wall Dimmer
+ TZ36 - Single & Dual Wall Switch
+ TZ55 - Single & Dual Wall Dimmer
+ TZ56 - Single & Dual Wall Switch
+ TZ65 - Single & Dual Wall Dimmer
+ TZ66 - Single & Dual Wall Switch
+ TZ67 - Wallplug Dimmer (all types)
+ TZ67-PLUS - Wallplug Dimmer (Z-Wave Plus) (all types)
+ TZ68 - Wallplug Switch (all types)
+ TZ68-PLUS - Wallplug Switch (Z-Wave Plus) (all types)

## Supported Languages:
* English
* Dutch (Nederlands)

### Notes:
**TZ35/TZ55/TZ65**
The TZ35/TZ55/TZ65 needs to use polling to get the correct dim state of the output in certain situations.  
The is by default on 300 seconds (5 minutes).  
It is not recommended to put this below 60 seconds (1 minute),  
it might cause too much traffic.  
you can also manually update the state by just pressing the left switch  
You can turn it off (value: 0), if you only want/need to update the state manually

## Change Log:
**1.0.1:**
Added support:
+ TSM02 - 4-in-1 Multi Sensor
* TSP01 - 3-in-1 Multi Sensor
* TZ35 - Single & Dual Wall Dimmer
* TZ36 - Single & Dual Wall Switch
* TZ55 - Single & Dual Wall Dimmer
* TZ56 - Single & Dual Wall Switch
* TZ67-PLUS Wallplug Dimmer (Z-Wave Plus)  
Updated Association Group Hints  
Updated Z-wave driver (1.1.2)

**1.0.0:**
Update Z-Wave driver (1.1.0)  
Fixed TZ65D right button flow triggers  
Add support TZ66 (Single & Dual)  
Add support TZ68-PLUS (all types)  
Add Polling for TZ67 and TZ68 (needed if people use the hardware button.)

**0.9.4:**
Fixed TZ67 & TZ68 their HardWare state change report

**0.9.3:**
Fixed TZ68 not using the right Command Class  
Fixed flow cards TZ65

**0.9.2:**
Fixed a bug in flow triggers TZ65(D)  
Fixed a bug that TZ67 & TZ68 state in homey did not change on physical changes

**0.9.1:**
Changed TZ65D to TZ65 (TZ65S & TZ65D are both same driver)  

**0.9.0:**
First Addition to app-store.

### Donate:
If you like the work that I have done, and loved the magic.  
Maybe you can think about filling my magic meter again:  
[![Paypal Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CH7AVGUY9KEQJ)
