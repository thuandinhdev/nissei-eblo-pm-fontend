/**
 *    Returns array response for datatable pagination length, records par page length etc.
 *
 *    @class DatatablesResponse
 */
export class DatatablesResponse {
    data: any[];
    parentData: any[];
    draw: number;
    recordsFiltered: number;
    colspan: number;
    recordsTotal: number;
}
