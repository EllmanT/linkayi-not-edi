import { formatDate } from "../../utils/utilityFunctions";
import {Warehouse} from "../../models/Warehouse";
import {Product} from "../../models/Product";

export const companyProductsTransformer = (item: any) => {
  let products: Product[] = []

  products = item.products.data.map((item: any) => ({
    id: item.id,
    isMainWarehouse: item.is_main_warehouse === 1,
    code: item.code,
    name: item.name,
    location: item.location,
    mainWarehouseId: item.main_warehouse_id,
    createdAt: formatDate(new Date(item.created_at)),
    updatedAt: (new Date(item.updated_at)),
    companyId: item.company_id
  }));

  return products;
};
