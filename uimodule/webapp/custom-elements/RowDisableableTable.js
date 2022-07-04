sap.ui.define([
    "sap/ui/table/Table",
    "sap/ui/table/TableRenderer",
    "sap/ui/table/Column"
], function (Table, TableRenderer, Column) {
    "use strict";

    var rdt = Table.extend("SCO.BTP.ListadoPicking.custom-elements.RowDisableableTable", {
        renderer: TableRenderer.render
    });
    rdt.prototype.selectedIndices = [];

    var tableBeforeRendering = rdt.prototype.onBeforeRendering;
    rdt.prototype.onBeforeRendering = function (oEvent) {
        if (this.mAggregations.columns.length && !this.mAggregations.columns[0].header) {
            var headerColumn = new Column({
                width: '50px',
                hAlign: "Center",
                template: new sap.m.CheckBox({
                    selected: '{_selected}',
                    select: function (event) {
                        var selected = event.getParameter('selected');

                        var row = event.getSource().getParent();
                        var table = row.getParent();
                        var index = row.getIndex();

                        var indices = event.getSource().getParent().getParent().selectedIndices;
                        if (selected) {
                            indices.push(index);
                        } else {
                            for (var i = indices.length - 1; i >= 0; i--) {
                                if (indices[i] === index) {
                                    indices.splice(i, 1);
                                }
                            }
                        }

                        var domref = $(row.getDomRef());
                        domref.toggleClass("sapUiTableRowSel", selected);
                    }
                })
            });
            headerColumn.header = true;
            this.insertColumn(headerColumn);
        }
        tableBeforeRendering.apply(this, [oEvent]);
    };

    var tableAfterRendering = rdt.prototype.onAfterRendering;
    rdt.prototype.onAfterRendering = function (oEvent) {
        this.updateSelectedRows();
        tableAfterRendering.apply(this, [oEvent]);
    };

    rdt.prototype.updateSelectedRows = function () {
        this.getRows().forEach((r) => {
            var context = r.getBindingContext();
            if (context) {
                var obj = context.getObject();
                $(r.getDomRef()).toggleClass("sapUiTableRowSel", obj._selected ? true : false);
            }
        })
    };

    var tableUpdateSelection = rdt.prototype._updateSelection;
    rdt.prototype._updateSelection = function () {
        tableUpdateSelection.apply(this);

        this.updateSelectedRows();
    };

    rdt.prototype.getSelectedIndices = function () {
        return this.selectedIndices;
    };

    return rdt;
});

