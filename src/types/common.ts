export type Preset = {
    baseVals : AnyKeyValueObject,
    comp: String,
    frame_eqs_str: String,
    init_eqs_str: String,
    pixel_eqs_str: String,
    shapes : AnyKeyValueObject[],
    warp: String,
    waves: AnyKeyValueObject[]
}

export type Presets = {
    [key: string] : Preset
}

type AnyKeyValueObject = {
    [key: string] : String | Number | Boolean
}