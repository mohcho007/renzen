export type CustomerType = "private" | "company" | "community" | "outdoor";

export const SERVICES_MAP: Record<
  CustomerType,
  ReadonlyArray<{ id: string; label: string }>
> = {
  private: [
    { id: "regular_cleaning", label: "Fast rengøringshjælp" },
    { id: "main_cleaning", label: "Hovedrengøring" },
    { id: "move_out_cleaning", label: "Flytterengøring" },
    { id: "estate_cleaning", label: "Rengøring af dødsbo" },
    { id: "window_cleaning", label: "Vinduespudsning" },
    { id: "other_cleaning", label: "Anden rengøring" },
  ],
  company: [
    { id: "regular_cleaning", label: "Fast erhvervsrengøring" },
    { id: "construction_cleaning", label: "Byggerengøring" },
    { id: "move_out_cleaning", label: "Flytterengøring (Erhverv)" },
    { id: "facade_cleaning", label: "Facaderengøring" },
    { id: "other_cleaning", label: "Anden rengøring" },
  ],
  community: [
    { id: "stairs_cleaning", label: "Trapperengøring" },
    { id: "elevator_cleaning", label: "Elevatorrengøring" },
    { id: "facade_cleaning", label: "Facaderengøring (Ejendom)" },
    { id: "balcony_cleaning", label: "Altanrengøring" },
    { id: "window_cleaning", label: "Vinduespudsning (Ejendom)" },
    { id: "other_cleaning", label: "Anden rengøring" },
  ],
  outdoor: [
    { id: "tile_cleaning", label: "Fliserens" },
    { id: "algae_cleaning", label: "Algerens" },
    { id: "tile_and_algae", label: "Fliserens og Algerens" },
    { id: "gutter_cleaning", label: "Tagrenderens" },
    { id: "roof_cleaning", label: "Tagrens" },
  ],
};

export const CUSTOMER_TABS: ReadonlyArray<{
  id: CustomerType;
  label: string;
  iconPath: string;
}> = [
  { id: "private", label: "Privat", iconPath: "/tab_icon_private.png" },
  { id: "company", label: "Erhverv", iconPath: "/tab_icon_company.png" },
  { id: "community", label: "Ejendom", iconPath: "/tab_icon_community.png" },
  { id: "outdoor", label: "Udeareal", iconPath: "/tab_icon_outdoor.png" },
];
