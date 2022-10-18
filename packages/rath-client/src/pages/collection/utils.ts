import produce from "immer";
import { IFieldMeta, IInsightVizView, IResizeMode, IVegaSubset } from "../../interfaces";
import { applySizeConfig } from "../../queries/base/utils";

export function adviceVisSize(spec: IVegaSubset, fields: IFieldMeta[]) {
    let width = 260;
    let height = 260;
    let fixed = false;
    if (spec.encoding.x) {
        const targetField = fields.find(f => f.fid === spec.encoding.x?.field);
        if (targetField) {
            if (targetField.semanticType === 'nominal' && targetField.features.unique > 20) {
                fixed = true
            }
        }
    }
    if (spec.encoding.y) {
        const targetField = fields.find(f => f.fid === spec.encoding.y?.field);
        if (targetField) {
            if (targetField.semanticType === 'nominal' && targetField.features.unique > 20) {
                fixed = true
            }
        }
    }
    if (fixed) return changeVisSize(spec, width, height);
    return spec;
}


export function changeVisSize(spec: IVegaSubset, propsWidth: number, propsHeight: number): IVegaSubset {
    const nextSpec = produce(spec, (draft) => {
        let width = propsWidth;
        let height = propsHeight;
        applySizeConfig(draft, {
            mode: IResizeMode.control,
            width,
            height,
            hasFacets: Boolean(spec.encoding.row || spec.encoding.column),
        });
    });
    return nextSpec;
}

export function searchFilterView (searchContent: string, views: IInsightVizView[]) {
    const words = searchContent.split(/[\s,;\t]+/)
    const lookupPattern = new RegExp(`.*${words.map(w => `(${w})`).join('|')}.*`, 'i')
    return views.filter(view => {
        for (let field of view.fields) {
            if (field.name && lookupPattern.test(field.name)) return true;
            if (lookupPattern.test(field.fid)) return true;
        }
        return false
    })
}