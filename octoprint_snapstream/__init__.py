# coding=utf-8
from __future__ import absolute_import

### (Don't forget to remove me)
# This is a basic skeleton for your plugin's __init__.py. You probably want to adjust the class name of your plugin
# as well as the plugin mixins it's subclassing from. This is really just a basic skeleton to get you started.

import octoprint.plugin
from octoprint.plugin import TemplatePlugin, AssetPlugin, SettingsPlugin

class SnapStreamPlugin(TemplatePlugin, AssetPlugin, SettingsPlugin):
	def get_settings_defaults(self):
		return dict(fps=4, fallbackonly=True, url="/webcam/?action=snapshot")

	def get_template_configs(self):
		return [dict(type="settings", custom_bindings=True)]

	def get_assets(self):
		return dict(js=["js/snapstream.js"], css=["css/snapstream.css"])

# If you want your plugin to be registered within OctoPrint under a different name than what you defined in setup.py
# ("OctoPrint-PluginSkeleton"), you may define that here. Same goes for the other metadata derived from setup.py that
# can be overwritten via __plugin_xyz__ control properties. See the documentation for that.
__plugin_name__ = "SnapStream"
__plugin_implementation__ = SnapStreamPlugin()

from ._version import get_versions
__version__ = get_versions()['version']
del get_versions
