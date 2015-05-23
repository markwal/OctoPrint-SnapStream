$(function() {
    function SnapStreamViewModel(parameters) {
        var self = this;

        self.global_settings = parameters[0];
        self.control = parameters[1];
        self.online = true;
        self.webcamImage = $("#webcam_image");
        self.webcamContainer = $("#webcam_container");

        self.setRotation = function() {
            self.webcamImage.toggleClass("rotate90", self.settings.rotate90());
            self.webcamContainer.toggleClass("heightequalwidth", self.settings.rotate90());
        }

        self.appendNoCacheMarker = function (url) {
            var newUrl = url;
            if (newUrl.lastIndexOf("?") > -1) {
                newUrl += "&";
            } else {
                newUrl += "?";
            }
            return newUrl + new Date().getTime();
        };

        self.snapStream = function() {
            var currentSrc = self.webcamImage.attr("src");
            if (currentSrc === undefined || currentSrc.trim() == "")
                return;
            self.webcamImage.attr("src", self.appendNoCacheMarker(self.global_settings.webcam_snapshotUrl()));
            self.webcamUpdateTimeout = setTimeout(self.webcamUpdate, 1000 / self.settings.fps());
        };

        self.webcamUpdate = function() {
            var currentSrc = self.webcamImage.attr("src");
            if (currentSrc !== undefined && currentSrc.trim() != "") {
                if (self.online) {
                    self.webcamImage.attr("src", self.appendNoCacheMarker(self.global_settings.webcam_snapshotUrl()));
                }
                self.webcamUpdateTimeout = setTimeout(self.webcamUpdate, 1000 / self.settings.fps());
            }
        }

        self.onTabChange = function (current, previous) {
            if (current == "#control") {
                if (self.settings.fallbackonly()) {
                    self.webcamImage.error(self.snapStream);
                } else {
                    self.webcamImage.attr("src", self.appendNoCacheMarker(self.global_settings.webcam_snapshotUrl()));
                    self.snapStream();
                }
            }
        };

        self.onServerDisconnect = function() {
            self.online = false;
            return true;
        }

        self.onDataUpdaterReconnect = function() {
            self.online = true;
        }

        self.onBeforeBinding = function() {
            self.settings = self.global_settings.settings.plugins.snapstream;
        };

        self.onAfterBinding = self.setRotation;

        self.onSettingsBeforeSave = self.setRotation;
    }

    OCTOPRINT_VIEWMODELS.push([
        SnapStreamViewModel,
        ["settingsViewModel", "controlViewModel"],
        ["#tab_plugin_snapstream"]
    ]);
});
