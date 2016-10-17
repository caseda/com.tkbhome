# TKB Home
This app adds support for TKB Home devices in Homey.

## Supported devices:
+ TZ65 - Single & Dual Wall Dimmer
  - TZ65D => Right Switch only flow triggers:
    - On
    - Off
    - Dim Level Changed
    - Held Up (experimental)
    - Held Down (experimental)
    - Hold Released (experimental)
+ TZ67 - Wallplug Dimmer (all types)
+ TZ68 - Wallplug Switch (all types)

## Supported Languages:
* English
* Dutch (Nederlands)

### Notes:
Experimental:  
These might trigger on left switch as well.  
If so, I will need to change the name/remove them.  
..Caseda

## Change Log:
**0.9.2:**
Fixed a bug in flow triggers TZ65(D)  
Fixed a bug that homey's state did not change on physical changes

**0.9.1:**
Changed TZ65D to TZ65 (TZ65S & TZ65D are both same driver)  

**0.9.0:**
First Addition to app-store.
