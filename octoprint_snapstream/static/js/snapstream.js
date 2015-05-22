$(function() {
    function SnapStreamViewModel(parameters) {
        var self = this;

        self.settings = parameters[0];
        self.control = parameters[1];

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
            var webcamImage = $("#webcam_image");
            webcamImage.attr("src", self.appendNoCacheMarker(self.settings.webcam_snapshotUrl()));
            self.webcamUpdateInterval = setInterval(function() {
                var webcamImage = $("#webcam_image");
                var currentSrc = webcamImage.attr("src");
                if (currentSrc === undefined || currentSrc.trim() == "") {
                    clearInterval(self.webcamUpdateInterval);
                }
                else {
                    webcamImage.attr("src", self.appendNoCacheMarker(self.settings.webcam_snapshotUrl()));
                }
            }, 1000 / self.settings.plugin.snapstream.fps);
        };

        self.onTabChange = function (current, previous) {
            if (current == "#control") {
                var webcamImage = $("#webcam_image");
                if (self.settings.plugin.snapstream.fallbackonly())
                    webcamImage.error(self.snapStream);
                else
                    self.snapStream();
            }
        };
    }

    OCTOPRINT_VIEWMODELS.push([
        SnapStreamViewModel,
        ["settingsViewModel", "controlViewModel"],
        ["#tab_plugin_snapstream"]
    ]);
});
