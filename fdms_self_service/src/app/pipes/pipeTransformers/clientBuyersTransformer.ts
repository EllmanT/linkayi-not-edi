import { clientBuyerInvoice } from "src/app/models/clientBuyerInvoice";
import { formatDate } from "../../utils/utilityFunctions";



export const clientBuyerTransformer = (item: any) => {
  let clientBuyerInvoices: clientBuyerInvoice[] = []

  clientBuyerInvoices = item.data.map((item: any) => ({
 
    receiptTotal: item.receiptTotal,
    buyerTin: item.buyerTIN,
    currency: item.receiptCurrency,
    status: item.status,
     receiptDate:formatDate(new Date(item.receiptDate)),

  }));

  return clientBuyerInvoices;
};
