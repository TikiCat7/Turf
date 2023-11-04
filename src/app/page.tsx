import { OrganizationSwitcher, currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function Home() {
  const user = await currentUser()

  if (!user) {
    return redirect('/sign-in')
  }

  return (
    <div className="max-w-5xl w-full items-center text-sm flex h-full flex-col">
      <p className="pl-4 font-bold text-2xl">Main page</p>
      <div>
        <OrganizationSwitcher />
      </div>
    </div>
  )
}
