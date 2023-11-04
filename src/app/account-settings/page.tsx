import { UserProfile } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

// render a react server component that renders clerk <UserProfile />
export default function AccountSettings() {
  return <UserProfile appearance={{ baseTheme: dark }} />
}
