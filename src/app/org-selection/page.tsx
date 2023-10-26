import { OrganizationList, OrganizationSwitcher } from "@clerk/nextjs";

export default function OrgSelection() {
  return (
    <OrganizationList
      afterSelectOrganizationUrl={"/"}
      afterSelectPersonalUrl={"/"}
    />
  );
}
