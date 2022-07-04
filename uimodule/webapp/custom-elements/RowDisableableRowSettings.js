sap.ui.define([
    "sap/ui/table/RowSettings"
], function (RowSettings) {
    "use strict";

    var rdrs = RowSettings.extend("SCO.BTP.ListadoPicking.custom-elements.RowDisableableRowSettings", {
        metadata: {
            library: "sap.ui.table",
            properties: {

                /**
                 * The highlight state of the rows.
                 * If the highlight is set to {@link sap.ui.core.MessageType.None} (default), no highlights are visible.
                 * @since 1.48.0
                 */
                highlight : {type : "sap.ui.core.MessageType", group : "Appearance", defaultValue : "None"},
                selectable : {type : "boolean", group : "Appearance", defaultValue : true}
            }
        }
    });
    rdrs.prototype.setSelectable = function(selectable) {
        this.setProperty("selectable", selectable, true);

        var oRow = this._getRow();
        if (oRow == null) {
            return this;
        }

        var cells = oRow.getCells();
        if (cells && cells.length && cells[0].setEnabled) {
            cells[0].setEnabled(selectable);
        }

        return this;
    };

    return rdrs;
});

