import {Pipe, PipeTransform} from '@angular/core';

import { clientSupplierTransformer } from './pipeTransformers/clientSuppliersTransformer';
import { clientBuyerTransformer } from './pipeTransformers/clientBuyersTransformer';
import { clientPendingReceiptsTransformer } from './pipeTransformers/clientPendingReceiptsTransformer';
import { clientDetailsTransformer } from './pipeTransformers/clientDetailsTransformer';

@Pipe({
  name: 'getTableData'
})
export class GetTableDataPipe implements PipeTransform {

  transform(data: any, args: [string]): any {
    const [type] = args;

    // convert type to kebab case eg admin-companies change to adminCompanies
    const kebabToCamel = (str: string) => {
      return str.replace(/-./g, match => match.charAt(1).toUpperCase());
    };

    const transformers = {
    
      clientSupplierTransformer,
      clientBuyerTransformer,
      clientPendingReceiptsTransformer,
      clientDetailsTransformer,
    };

    console.log('type: ', kebabToCamel(type) + 'Transformer');
    
    // @ts-ignore
    const transformerFunction = transformers[`${kebabToCamel(type)}Transformer`];

    if (transformerFunction) {
      return transformerFunction(data);
    } else {
      throw new Error(`Transformer function for type "${type}" not found.`);
    }
  }
}
