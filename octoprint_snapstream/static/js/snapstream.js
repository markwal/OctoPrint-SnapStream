$(function() {
    function SnapStreamViewModel(parameters) {
        var self = this;

        self.global_settings = parameters[0];
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
            var currentSrc = webcamImage.attr("src");
            if (currentSrc === undefined || currentSrc.trim() == "")
                return;
            webcamImage.attr("src", self.appendNoCacheMarker(self.global_settings.webcam_snapshotUrl()));
            self.webcamUpdateInterval = setInterval(function() {
                var webcamImage = $("#webcam_image");
                var currentSrc = webcamImage.attr("src");
                if (currentSrc === undefined || currentSrc.trim() == "") {
                    clearInterval(self.webcamUpdateInterval);
                }
                else {
                    webcamImage.attr("src", self.appendNoCacheMarker(self.global_settings.webcam_snapshotUrl()));
                }
            }, 1000 / self.settings.fps());
        };

        self.onTabChange = function (current, previous) {
            if (current == "#control") {
                var webcamImage = $("#webcam_image");
                if (self.settings.fallbackonly())
                    webcamImage.error(self.snapStream);
                else {
                    webcamImage.attr("src", self.appendNoCacheMarker(self.global_settings.webcam_snapshotUrl()));
                    self.snapStream();
                }
            }
        };

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
