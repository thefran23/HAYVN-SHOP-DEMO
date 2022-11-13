export interface Product {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: number;
  max_atmosphering_speed: number;
  crew: string;
  passengers: number;
  cargo_capacity: number;
  consumables: string;
  hyperdrive_rating: string;
  MGLT: number;
  starship_class: string;
  pilots: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}

export interface SaleProduct {
  url: string;
  discount_percent: number;
  valid_until: string;
}

export interface ProductImage {
  url: string;
  image: string;
}
