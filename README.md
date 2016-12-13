# TKB Home
This app adds support for TKB Home devices in Homey.

## Supported devices:
+ TZ65 - Single & Dual Wall Dimmer
+ TZ67 - Wallplug Dimmer (all types)
+ TZ68 - Wallplug Switch (all types)

## Supported Languages:
* English
* Dutch (Nederlands)

### Notes:
**TZ65**
The TZ65 needs to use polling to get the correct dim state of the output.  
The is by default on 300 seconds (5 minutes).  
It is not recommended to put this below 60 seconds (1 minute),  
it might cause too much traffic.  
you can manually update the state by just pressing the left switch  
You can turn it off (value: 0), if you only want/need to update the state manually

## Change Log:
**0.9.5:**
Update Z-Wave driver (1.1.0)  
Fixed TZ65D right button triggers

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
