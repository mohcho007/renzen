import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  BedDoubleIcon,
  BrickWallIcon,
  CleaningBucketIcon,
  DeliveryTruck01Icon,
  GreenHouseIcon,
  Home01Icon,
  OfficeIcon,
  OfficeChairIcon,
  RealEstate02Icon,
  SoilMoistureFieldIcon,
  Stairs01Icon,
  WindowsNewIcon,
} from "@hugeicons/core-free-icons";

const serviceIcons = {
  privateCleaning: Home01Icon,
  commercialCleaning: OfficeIcon,
  movingCleaning: DeliveryTruck01Icon,
  deepCleaning: CleaningBucketIcon,
  airbnbCleaning: BedDoubleIcon,
  officeCleaning: OfficeChairIcon,
  stairCleaning: Stairs01Icon,
  windowCleaning: WindowsNewIcon,
  estateCleaning: RealEstate02Icon,
  tileCleaning: SoilMoistureFieldIcon,
  gutterCleaning: GreenHouseIcon,
  constructionCleaning: BrickWallIcon,
} satisfies Record<string, IconSvgElement>;

export type ServiceNavIconName = keyof typeof serviceIcons;

type ServiceNavIconProps = {
  name: ServiceNavIconName;
};

export function ServiceNavIcon({ name }: ServiceNavIconProps) {
  return (
    <HugeiconsIcon
      icon={serviceIcons[name]}
      size={17}
      color="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    />
  );
}
