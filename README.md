# TKB Home
This app adds support for TKB Home devices in Homey.

## Supported devices:
+ TSM02 - 4-in-1 Multi Sensor
+ TSP01 - 3-in-1 Multi Sensor
+ TZ35 - Single & Double Wall Dimmer
+ TZ36 - Single & Double Wall Switch
+ TZ37 - Double Relay Wall Switch
+ TZ55 - Single & Double Wall Dimmer
+ TZ56 - Single & Double Wall Switch
+ TZ57 - Double Relay Wall Switch
+ TZ65 - Single & Double Wall Dimmer
+ TZ66 - Single & Double Wall Switch
+ TZ67 - Wallplug Dimmer (all types)
+ TZ67-PLUS - Wallplug Dimmer (Z-Wave Plus) (all types)
+ TZ68 - Wallplug Switch (all types)
+ TZ68-PLUS - Wallplug Switch (Z-Wave Plus) (all types)
+ TZ69 - Smart Energy Wallplug (Z-Wave Plus) (all types)
+ TZ88 - Smart Energy Wallplug (Z-Wave Plus) (all types)

## Supported Languages:
* English
* Dutch (Nederlands)

### Notes:
**TZ35/TZ55/TZ65**
The Wall Dimmers need to be polled to get the correct dim state when you dim it with the switch itself.  
The interval is by default on 300 seconds (5 minutes).  
It is not recommended to put this below 60 seconds (1 minute), it might cause too much traffic.  
You can also "immediately" update its state in homey, by just pressing any of the switches once.  
The dim level takes about 2.5 seconds to update when switching on, since the dimmer dims up to its set brightness.  

**TZ67(-PLUS)/TZ68(-PLUS)/TZ69**
The wallplugs only use the polling interval if you use the button on the wallplug itself.  
It is not recommended to put this below 60 seconds (1 minute), it might cause too much traffic.

**TZ88**
It sends the wattage value when the load changes (more then) 5%.  
This can't be edited and could cause of a lot of data if the load changes the power usage a lot.  
All other manufacturers have this on at least 20% for this reason, so do keep this in mind.  
The voltage and amperage don't get reported on intervals, added polling for this (by default poll is off to save traffic).

## Change Log:
**2.0.0:**
- Full rewrite to SDKv2;
- Fixed Meter Reset flow cards (TZ69 & TZ88);
- Added (bad) manufacturer ID TZ67;
- Added flow cards TZ37/TZ55

**1.0.11:**
Add extra ID to TZ55 driver

**1.0.10:**
Add support:  
TZ69 - Smart Energy Wallplug (Z-Wave Plus)

**1.0.9:**
Fix:  
TZ65/TZ67/TZ67-PLUS - Fix a rare crash that could occur

**1.0.8:**
Add support:  
TZ37 - Double Relay Wall Switch  
TZ57 - Double Relay Wall Switch

**1.0.7:**
Fix:  
TZ88 - Accidentally used the wrong capability ID

**1.0.6:**
Add support:  
TZ88 - Smart Energy Wallplug

**1.0.4/1.0.5:**
Some small bug fixes.

**1.0.3:**
Fix:  
All wall switches/dimmers: the right switch should work again  
  Do make sure homey's ID (1) is in association groups 2 and 3 only, not in 1 and 4  
Update:  
All switch icons.  
Multi sensor icons.  
Z-wave driver to 1.1.8.

**1.0.2:**
Fix:  
TZ36 - ID's were incorrect  
TZ56 - ID's were incorrect  
"set dim level" flow cards, now work properly

**1.0.1:**
Added support:  
TSM02 - 4-in-1 Multi Sensor  
TSP01 - 3-in-1 Multi Sensor  
TZ35 - Single & Dual Wall Dimmer  
TZ36 - Single & Dual Wall Switch  
TZ55 - Single & Dual Wall Dimmer  
TZ56 - Single & Dual Wall Switch  
TZ67-PLUS Wallplug Dimmer (Z-Wave Plus)  
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
