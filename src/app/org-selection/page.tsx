import { OrganizationList } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

export default function OrgSelection() {
  return (
    <>
      <OrganizationList
        appearance={{ baseTheme: dark }}
        afterSelectOrganizationUrl={'/'}
        afterSelectPersonalUrl={'/'}
      />
    </>
  )
}
