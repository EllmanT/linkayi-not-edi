import { formatDate } from "../../utils/utilityFunctions";
import { clientPendingReceipt } from "src/app/models/clientPendingReceipt";
export const clientPendingReceiptsTransformer = (item: any) => {
  let clientPendingReceipts: clientPendingReceipt[] = []

  clientPendingReceipts = item.data.map((item: any) => ({
  
    receiptTotal: item.receiptTotal,
    supplierTin: item.supplierTIN,
    currency: item.receiptCurrency,
    status: item.status,
     receiptDate:formatDate(new Date(item.receiptDate)),

  }));

  return clientPendingReceipts;
};
