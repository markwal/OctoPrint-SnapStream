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

	def get_update_information(self, *args, **kwargs):
		return dict(
			snapstream=dict(
				displayName="SnapStream",
				displayVersion=self._plugin_version,

				# use github release method of version check
				type="github_release",
				user="markwal",
				repo="OctoPrint-SnapStream",
				current=self._plugin_version,

				# update method: pip
				pip="https://github.com/markwal/OctoPrint-SnapStream/archive/{target_version}.zip"
			)
		)

__plugin_name__ = "SnapStream"

def __plugin_load__():
	global __plugin_implementation__
	plugin = SnapStreamPlugin()
	__plugin_implementation__ = plugin

	global __plugin_hooks__
	__plugin_hooks__ = {
		"octoprint.plugin.softwareupdate.check_config": plugin.get_update_information,
	}

from ._version import get_versions
__version__ = get_versions()['version']
del get_versions
