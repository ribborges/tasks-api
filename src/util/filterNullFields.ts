export default function filterNullFields(data: any) {
    return Object.fromEntries(Object.entries(data).filter(([_, value]) => value != null));
}