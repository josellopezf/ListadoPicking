sap.ui.define([
    "sap/ui/core/UIComponent", 
    "sap/ui/Device", 
    "SCO/BTP/ListadoPicking/model/models",  
    /**
     * @param {typeof sap.ui.core.UIComponent} UIComponent
     * @param {typeof sap.ui.Device} Device
     */
    ],function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("SCO.BTP.ListadoPicking.Component", {
            metadata: {
                manifest: "json",
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                // set the messaging model
                var oMessageModel = sap.ui.getCore().getMessageManager().getMessageModel();
                oMessageModel.setData({});
                this.setModel(oMessageModel, "message");                
            },
        });
    }
);
