/** Ease-out-xpo motion curve — neutral deceleration (impeccable motion guide) */
export const EASE_OUT_EXPO: [number, number, number, number] = [
  0.16, 1, 0.3, 1,
];

export const ROUTES = {
  home: "/",
  catalogo: "/catalogo",
  cart: "/cart",
  product: (id: string | number) => `/productos/${id}`,
  subproduct: (id: string | number) => `/subproductos/${id}`,
  profile: "/profile",
  myOrders: "/profile/my-orders",
};
