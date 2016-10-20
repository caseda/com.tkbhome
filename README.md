# TKB Home
This app adds support for TKB Home devices in Homey.

## Supported devices:
+ TZ65 - Single & Dual Wall Dimmer
  - TZ65D => only Right Switch flow triggers #1:
    - On
    - Off
+ TZ67 - Wallplug Dimmer (all types)
+ TZ68 - Wallplug Switch (all types)

## Supported Languages:
* English
* Dutch (Nederlands)

### Notes:
#1:  
The TZ65(D) doesn't work properly yet (only right switch (TZ65D) work with "on & off").
Expect it to fully work in the next update (0.9.5), very soon.

## Change Log:
**0.9.4:**
Fixed TZ67 & TZ68 not responding to hardware changes (used wrong report command).

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
