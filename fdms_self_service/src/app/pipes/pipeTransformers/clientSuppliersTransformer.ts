import { formatDate } from "../../utils/utilityFunctions";


import { clientSupplierInvoice } from "src/app/models/clientSupplierInvoice";
export const clientSupplierTransformer = (item: any) => {
  let clientSupplierInvoices: clientSupplierInvoice[] = []

  clientSupplierInvoices = item.data.map((item: any) => ({
  
    receiptTotal: item.receiptTotal,
    supplierTin: item.supplierTIN,
    currency: item.receiptCurrency,
    status: item.status,
     receiptDate:formatDate(new Date(item.receiptDate)),

  }));

  return clientSupplierInvoices;
};
