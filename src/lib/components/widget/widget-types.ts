export const WIDGET_TYPES = ['welcome', 'srs', 'weather', 'joke', 'garbage'] as const;
export type WidgetType = typeof WIDGET_TYPES[number];

export type WidgetConfig = {
    id: WidgetType,
    options: Record<string, number | string>
}