OctoPrint SnapStream Plugin
===========================

This plugin replaces the mjpg-streamer on the control tab with the static snapshot
image and updates it with a javascript interval timer. You can set it to only
do this if the mjpg-streamer fails.

This plugin could be useful if you're using a browser that doesn't support mjpeg
streams (IE) or if you would like to reduce bandwidth usage when accessing from
the internet perhaps.

Setup
-----
```
pip install https://github.com/MarkWal/OctoPrint-SnapStream/archive/master.zip
```
Make sure you use the same Python environment that you installed OctoPrint under
otherwise the pip install will fail because the plugin won't be able to find its
dependencies. For octopi this means:
```
source ~/oprint/bin/activate
```
before you do the pip install.

Restart OctoPrint and the octoprint.log should show the plugin was successfully
found and loaded.

This plugin uses the url's for the webcam from OctoPrint's webcam settings panel
so the snapshot url has to point to something your browser can reach.

Plugin Settings
---------------
In the settings panel under SnapStream you can choose fps (probably needs to be
something low like 1 or 2).  You can also select whether to use the snapshot
mode all the time or only when the mjpg stream fails.
