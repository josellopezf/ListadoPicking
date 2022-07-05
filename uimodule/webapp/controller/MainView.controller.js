sap.ui.define([
    "./BaseController",
//    "sap/ui/model/json/JSONModel",
    "SCO/BTP/ListadoPicking/utils/utils",
    "SCO/BTP/ListadoPicking/model/models",
    "sap/m/Dialog",
    "sap/m/Button",
    "SCO/BTP/ListadoPicking/utils/validator",
    "../lib/jspdf.umd",
    "../lib/jspdf.plugin.autotable"    
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof SCO.BTP.ListadoPicking.utils.utils} utils
     * @param {typeof SCO.BTP.ListadoPicking.model.models} models
     * @param {typeof sap.m.Dialog} Dialog
     * @param {typeof sap.m.Button} Button
     * @param {typeof SCO.BTP.ListadoPicking.utils.validator} Validator
     */
],function (Controller, utils, models, Dialog, Button, Validator) {
        "use strict";

        return Controller.extend("SCO.BTP.ListadoPicking.controller.MainView", {
            onInit: function () {
                this._basicInit();
    
                var that = this;
                this.getView().getModel().setProperty('/allowedWarehousesText', 'Ninguno');
                this.getView().getModel().setProperty('/allowedWarehouses', []);
/*Jose Lopez                
                utils.getUserData(data => {
                    this.getView().getModel().setProperty('/allowedWarehousesText', data.T_DATEMPR.filter((d) => d.ID_TIPO == 'LGORT').map((d) => d.VALOR).join(', ') || 'Ninguno');
                    this.getView().getModel().setProperty('/allowedWarehouses', data.T_DATEMPR.filter((d) => d.ID_TIPO == 'LGORT').map((d) => d.VALOR));
                });
                // this.getView().getModel().setProperty('/filters/query', '43116555');
                // this.handleSearch();
Jose Lopez*/
                var oScoModel = new sap.ui.model.json.JSONModel();
                oScoModel.loadData("/model/data.json");
                oScoModel.attachRequestCompleted(function(oEvent) {
                    const data = oScoModel.getProperty("/ZPWD_004_DATUSER/response")
                    let almacenText = data.T_DATEMPR.filter((d) => d.ID_TIPO == 'LGORT').map((d) => d.VALOR).join(', ');
                    that.getView().getModel().setProperty('/allowedWarehousesText', almacenText );//|| 'Ninguno');
                    let almacen = data.T_DATEMPR.filter((d) => d.ID_TIPO == 'LGORT').map((d) => d.VALOR);
                    that.getView().getModel().setProperty('/allowedWarehouses', almacen );

                });

            },
    
            _basicInit: function () {
                var model = models.createLocalModel();
                var view = this.getView();
                model.setProperty('/filters', {
                    sortBy: 'I_AUFNR',
                    sortByOptions: [{text: 'Nº Orden', key: 'I_AUFNR'}, {text: 'Nº Reserva', key: 'I_RSNUM'}]
                });
                view.setModel(model);
                utils.view = view;
    
                this._oMessagePopover = new sap.m.MessagePopover({
                    items: {
                        path: "message>/",
                        template: new sap.m.MessageItem({
                            description: "{message>description}",
                            type: "{message>type}",
                            title: "{message>message}"
                        })
                    }
                });
                this.getView().addDependent(this._oMessagePopover);
            },
    
            handleMessagePopoverPress: function (oEvent) {
                this._oMessagePopover.openBy(oEvent.getSource());
            },
    
            handleSearch: function () {
                let that = this; 
                var model = this.getView().getModel();
                var filters = model.getProperty('/filters');
    
                var validator = new Validator();
                var valid = validator.validate(this.byId("filters"));
                if (valid) {
                    var query = {};
                    query[filters.sortBy] = filters.query;
    
                    model.setProperty('/materiales', []);
/* Jose Lopez                    
                    utils.httpCall({
                        service: 'ZPWD_103_R_LISTPICK_MB26',
                        query,
                        success: (data) => {
                            if (data.E_RETURN.TYPE === 'S') {
                                let allowedWarehouses = model.getProperty('/allowedWarehouses');
                                data.GT_RESDATA = data.GT_RESDATA.filter((item) => allowedWarehouses.includes(item.LGORT_D));
    
                                if (!data.GT_RESDATA.length) {
                                    sap.m.MessageBox.warning('No hay materiales para sus almacenes', {title: "Información"});
                                } else {
                                    model.setProperty('/orden', data.GT_RESDATA[0].AUFNR);
                                    utils.httpCall({
                                        type: 'post',
                                        service: 'Zpwd_103_W_Consumopicking_Mb26',
                                        query: {
                                            GT_RESDATA: data.GT_RESDATA,
                                            I_GMCODE: '03',
                                            I_TESTRUN: 'X'
                                        },
                                        success: (data) => {
                                            data.GT_RETURN.forEach((item) => {
                                                var resdata = data.GT_RESDATA[item.ROW - 1];
                                                Object.assign(resdata, item);
                                                resdata.ERFMG = resdata.BDMNG - resdata.ENMNG;
                                            });
                                            model.setProperty('/materiales', data.GT_RESDATA);
                                            setTimeout(() => this.byId('mainTable').autoResizeColumn(10), 0);
                                        }
                                    });
                                }
                            } else {
                                sap.m.MessageBox.error(data.E_RETURN.MESSAGE);
                            }
                        }
                    })
Jose Lopez */
                    var oScoModel = new sap.ui.model.json.JSONModel();
                    oScoModel.loadData("/model/data2.json");
                    oScoModel.attachRequestCompleted(function(oEvent) {
                        const data = oScoModel.getProperty("/ZPWD_103_R_LISTPICK_MB26/response")
                        if (data.E_RETURN.TYPE === 'S') {
                            let allowedWarehouses = model.getProperty('/allowedWarehouses');
                            data.GT_RESDATA = data.GT_RESDATA.filter((item) => allowedWarehouses.includes(item.LGORT_D));

                            if (!data.GT_RESDATA.length) {
                                sap.m.MessageBox.warning('No hay materiales para sus almacenes', {title: "Información"});
                            } else {
                                model.setProperty('/orden', data.GT_RESDATA[0].AUFNR);
                                var oScoModel2 = new sap.ui.model.json.JSONModel();
                                oScoModel2.loadData("/model/data2.json");
                                oScoModel2.attachRequestCompleted(function(oEvent) {
                                    const data2 = oScoModel.getProperty("/Zpwd_103_W_Consumopicking_Mb26/response")
                                    data2.GT_RETURN.forEach((item) => {
                                        var resdata = data2.GT_RESDATA[item.ROW - 1];
                                        Object.assign(resdata, item);
                                        resdata.ERFMG = resdata.BDMNG - resdata.ENMNG;
                                    });
                                    model.setProperty('/materiales', data2.GT_RESDATA);
                                    setTimeout(() => that.byId('mainTable').autoResizeColumn(10), 0);

                                });
                            }
                        }
                    });


                }
            },
    
            getSelectedRows: function () {
                return this.getView().getModel().getProperty('/materiales').filter((r) => r._selected);
            },
    
            validatePickingAmounts: function () {
                let valid = true;
                this.getSelectedRows().forEach(r => {
                    if (r.ERFMG > r.BDMNG - r.ENMNG) {
                        sap.ui.getCore().getMessageManager().addMessages(
                            new sap.ui.core.message.Message({
                                message: `Mat. ${r.MATNR} - Cantidad a pickear muy alta (Elegida: ${r.ERFMG} Max.: ${r.BDMNG - r.ENMNG})`,
                                type: sap.ui.core.MessageType.Error,
                            })
                        );
                        valid = false;
                    } else if(isNaN(parseInt(r.ERFMG)) || r.ERFMG <= 0){
                        sap.ui.getCore().getMessageManager().addMessages(
                            new sap.ui.core.message.Message({
                                message: `Mat. ${r.MATNR} - Cantidad a pickear debe ser un número positivo válido`,
                                type: sap.ui.core.MessageType.Error,
                            })
                        );
                        valid = false;
                    }
                });
    
                if (!valid) {
                    setTimeout(() => this._oMessagePopover.openBy(this.byId('errorPopover')), 0);
                }
    
                return valid;
            },
    
            handleContabilizar: function (oEvent) {
                let validator = new Validator();
                var valid = validator.validate(this.byId("mainTable"));
                if (valid) {
                    var that = this;
    
                    if (!that.getSelectedRows().length) {
                        sap.ui.getCore().getMessageManager().addMessages(
                            new sap.ui.core.message.Message({
                                message: 'Debes seleccionar algun material',
                                type: sap.ui.core.MessageType.Error,
                            })
                        );
                        setTimeout(() => this._oMessagePopover.openBy(this.byId('errorPopover')), 0);
                    } else if (this.validatePickingAmounts()) {
                        var dialog = new Dialog({
                            title: 'Contabilizar picking',
                            type: 'Message',
                            state: 'Warning',
                            content: new sap.m.Text({text: '¿Está seguro que desea contabilizar el consumo de los componentes?'}),
                            beginButton: new Button({
                                text: 'Aceptar',
                                press: function () {
/* Jose Lopez                                    
                                    utils.httpCall({
                                        type: 'post',
                                        service: 'Zpwd_103_W_Consumopicking_Mb26',
                                        query: {
                                            GT_RESDATA: that.getSelectedRows(),
                                            I_GMCODE: '03',
                                            I_TESTRUN: ''
                                        },
                                        success: (data) => {
                                            if (data.GT_RETURN.length) {
                                                data.GT_RETURN.forEach((item) => {
                                                    var resdata = data.GT_RESDATA[item.ROW];
                                                    Object.assign(resdata, item);
                                                    resdata.ERFMG = resdata.BDMNG - resdata.ENMNG;
                                                });
                                                that.getView().getModel().setProperty('/materiales', data.GT_RESDATA);
                                                sap.m.MessageBox.warning('Han ocurrido algunos problemas al intentar el contabilizar. Se muestran en la lista.', {title: "Información"});
                                                setTimeout(() => that.byId('mainTable').autoResizeColumn(10), 0);
                                            } else {
                                                sap.m.MessageBox.success('Contabilización realizada exitosamente.');
                                                that.generatePdf();
                                                that.handleSearch();
                                            }
                                        }
                                    });
Jose Lopez */                                   
                                    var oScoModel2 = new sap.ui.model.json.JSONModel();
                                    oScoModel2.loadData("/model/data2.json");
                                    oScoModel2.attachRequestCompleted(function(oEvent) {
                                        const data2 = oScoModel2.getProperty("/Zpwd_103_W_Consumopicking_Mb26/response");
                                        if (!data2.GT_RETURN.length) {
                                            data2.GT_RETURN.forEach((item) => {
                                                var resdata = data2.GT_RESDATA[item.ROW-1];
                                                Object.assign(resdata, item);
                                                resdata.ERFMG = resdata.BDMNG - resdata.ENMNG;
                                            });
                                            that.getView().getModel().setProperty('/materiales', data2.GT_RESDATA);
                                            sap.m.MessageBox.warning('Han ocurrido algunos problemas al intentar el contabilizar. Se muestran en la lista.', {title: "Información"});
                                            setTimeout(() => that.byId('mainTable').autoResizeColumn(10), 0);
                                        } else {
                                            sap.m.MessageBox.success('Contabilización realizada exitosamente.');
                                            that.generatePdf();
                                            that.handleSearch();
                                        }

                                    });
                                    dialog.close();
                                }
                            }),
                            endButton: new Button({
                                text: 'Cancelar',
                                press: function () {
                                    dialog.close();
                                }
                            }),
                            afterClose: function () {
                                dialog.destroy();
                            }
                        });
    
                        dialog.open();
                    }
                }
            },
    
            generatePdf: function () {
                var that = this;
                var selectedRows = that.getSelectedRows(); // cargar en variable antes del success porque se genera condición de carrera
/* Jose Lopez
                utils.httpCall({
                    type: 'post',
                    service: 'Zpwd_103_R_Cabecera_Orden',
                    query: {
                        I_ORDEN: that.getView().getModel().getProperty('/orden'),
                    },
                    success: (data) => {
                        that.openPdfFromTemplate(data, selectedRows);
                    }
                });
Jose Lopez*/    
                var oScoModel = new sap.ui.model.json.JSONModel();
                oScoModel.loadData("/model/data2.json");
                oScoModel.attachRequestCompleted(function(oEvent) {
                    const data = oScoModel.getProperty("/Zpwd_103_R_Cabecera_Orden/response");
                    that.openPdfFromTemplate(data, selectedRows);
                });

            },
    
            openPdfFromTemplate: function (header, rows) {
                var logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN0AAABCCAYAAADT9NOMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTYzNEZENkZFMTlGMTFFNjk2MkFDRjFEREZGMjI1OTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTYzNEZENzBFMTlGMTFFNjk2MkFDRjFEREZGMjI1OTkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxNjM0RkQ2REUxOUYxMUU2OTYyQUNGMURERkYyMjU5OSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxNjM0RkQ2RUUxOUYxMUU2OTYyQUNGMURERkYyMjU5OSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpEM1LEAAB+ZSURBVHja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'
                
                applyPlugin(jspdf.jsPDF);
                
                var doc = new jspdf.jsPDF();
                
                var now = new Date();
    
                doc.addImage(logo, 'JPEG', 5, 5);
                doc.setFontSize(20);
                doc.text(90, 10, 'PICKING');
                doc.setFontSize(9);
    
                // Fecha y hora
                doc.text(160, 6, 'Fecha:');
                doc.text(175, 6, now.toLocaleDateString("es-ES"));
                doc.text(160, 12, 'Hora:');
                doc.text(175, 12, now.toLocaleTimeString("es-ES"));
    
                // Detalles
                doc.text(5, 30, '# Aviso:');
                doc.text(25, 30, header.E_HEADER_ORDER.NOTIF_NO);
                doc.text(5, 35, '# Orden:');
                doc.text(25, 35, header.E_HEADER_ORDER.ORDERID);
    
                doc.text(5, 45, 'Vehículo:');
                doc.text(25, 45, header.E_EQUIPO.DESCRIPT);
                doc.text(5, 50, 'Patente:');
                doc.text(25, 50, header.E_EQUIPO_ESP.LICENSE);
                doc.text(5, 55, 'Cliente:');
                doc.text(25, 55, `${header.E_COD_CLIENTE} ${header.E_TXT_CLIENTE}`);
    
                doc.text(75, 30, 'Oficina:');
                doc.text(95, 30, `${header.E_ORDER_AREA_VTA.SALES_OFF} - ${header.E_TXT_OFICINA_VTA}`);
                doc.text(75, 35, 'Receptor:');
                doc.text(95, 35, `${header.E_COD_RECEPTOR} ${header.E_TXT_RECEPTOR}`);   
    
//                var columns = [ ["Cod Sap", "Nombre", "Vale", "Fecha", "Almacén", "Cant.\nSolicitada", "U.M", "Cant.\nEntreg"] ];
                var columns = [ ["Cod Sap", "Nombre", "Vale", "Fecha", "Almacén", "Cant.", "U.M", "Cant."] ];
                rows = rows.map((r) => [r.MATNR, r.MAKTX, r.RSNUM, now.toLocaleString("es-ES"), r.LGORT_D, r.BDMNG, r.ERFME, r.ERFMG]);

                var head = [['ID', 'Country', 'Rank', 'Capital']];
                var body = [
                  [1, 'Denmark', 7.526, 'Copenhagen'],
                  [2, 'Switzerland', 7.509, 'Bern'],
                  [3, 'Iceland', 7.501, 'Reykjavík'],
                ];
                
                doc.autoTable({ head: columns, body: rows, columnStyles: {
                    1: {halign: 'left'}
                },
                styles: {
                    lineWidth: 0.1,
                    lineColor: 0,
                    fontSize: 6,
                    cellPadding: 1,
                    halign: 'center',
                },
                headerStyles: {
                    fontSize: 9,
                    lineColor: 0,
                    fillColor: 245,
                    textColor: 0,
                    halign: 'center',
                    valign: 'middle',
                },
                startY: 60,
                margin: {bottom: 44, right: 5, left: 5},
                theme: 'plain'});                

                /*                
                doc.autoTable(columns, rows, {
                    columnStyles: {
                        1: {halign: 'left'}
                    },
                    styles: {
                        lineWidth: 0.1,
                        lineColor: 0,
                        fontSize: 6,
                        cellPadding: 1,
                        halign: 'center',
                    },
                    headerStyles: {
                        fontSize: 9,
                        lineColor: 0,
                        fillColor: 245,
                        textColor: 0,
                        halign: 'center',
                        valign: 'middle',
                    },
                    startY: 60,
                    margin: {bottom: 44, right: 5, left: 5},
                    theme: 'plain'
                });
*/    
                doc.setDrawColor(0);
    
                doc.lines([[50, 0]], 34, 247);
                doc.text(47, 252, 'Firma Bodeguero');
                doc.lines([[41, 0]], 43, 260);
                doc.text(34, 260, 'Rut:');
    
                doc.lines([[50, 0]], 134, 247);
                doc.text(152, 252, 'Firma Retiro');
                doc.lines([[41, 0]], 143, 260);
                doc.text(134, 260, 'Rut:');
    
    
                doc.text(10, 264, 'Nota:');
                doc.rect(10, 265, 190, 25);
    
                window.open(doc.output('bloburi'));
            },
    
            formatAvailableToIcon: function (type) {
                return type === 'E' ? "sap-icon://error" : "";
            },
        });
    });