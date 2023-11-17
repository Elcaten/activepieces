export interface GetCategoriesResponse {
    categories: CategoriesItem[];
}
interface CategoriesItem {
    id: number;
    name: string;
    icon: string;
    icon_types: Icon_types;
    subcategories: SubcategoriesItem[];
}
interface Icon_types {
    slim: Slim;
    square: Square;
}
interface Slim {
    small: string;
    large: string;
}
interface Square {
    large: string;
    xlarge: string;
}
interface SubcategoriesItem {
    id: number;
    name: string;
    icon: string;
    icon_types: Icon_types;
}
