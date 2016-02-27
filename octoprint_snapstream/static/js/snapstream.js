$(function() {
    function SnapStreamViewModel(parameters) {
        var self = this;

        self.global_settings = parameters[0];
        self.control = parameters[1];
        self.tab = "";
        self.online = true;
        self.failureCounter = 0;
        self.webcamImage = $("#webcam_image");

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
            self.webcamImage.attr("src", self.appendNoCacheMarker(self.settings.url()));
            self.webcamUpdateTimeout = setTimeout(self.webcamUpdate, 1000 / self.settings.fps());
            self.failureCounter = 0;
            self.webcamImage.off("error.snapstream");
            self.webcamImage.off("load.snapstream");
            self.webcamImage.on("error.snapstream", function() { self.failureCounter += 1; });
            self.webcamImage.on("load.snapstream", function() { self.failureCounter = 0; });
        };

        self.webcamUpdate = function() {
            var currentSrc = self.webcamImage.attr("src");
            if (currentSrc !== undefined && currentSrc.trim() != "") {
                if (self.online) {
                    self.webcamImage.attr("src", self.appendNoCacheMarker(self.settings.url()));
                }
                if (self.failureCounter < 4) {
                    self.webcamUpdateTimeout = setTimeout(self.webcamUpdate, 1000 / self.settings.fps());
                    return;
                }
            }
            self.webcamImage.off("load.snapstream");
            self.webcamImage.off("error.snapstream");
        }

        self.onTabChange = function (current, previous) {
            self.tab = current;
            if (current == "#control") {
                if (self.settings.fallbackonly()) {
                    self.webcamImage.one("error", self.snapStream);
                } else {
                    self.webcamImage.attr("src", self.appendNoCacheMarker(self.settings.url()));
                    self.snapStream();
                }
            }
        };

        self.onBrowserTabVisibilityChange = function(status) {
            if (status && self.tab == "#control") {
                self.onTabChange("#control", "");
            }
        }

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
    }

    OCTOPRINT_VIEWMODELS.push([
        SnapStreamViewModel,
        ["settingsViewModel", "controlViewModel"],
        ["#tab_plugin_snapstream"]
    ]);
});
